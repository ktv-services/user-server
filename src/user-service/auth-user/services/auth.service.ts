import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { SocialUser, SocialUserDocument } from '../schemas/social-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthTypesEnum } from '../enums/auth-types.enum';
import { CreateSocialUserDto } from '../dtos/social-user/create-social-user.dto';
import { UserService } from './user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../dtos/user/user.dto';
import { SocialUserDto } from '../dtos/social-user/social-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(SocialUser.name) private socialUserModel: Model<SocialUserDocument>,
        private readonly userService: UserService,
        private configService: ConfigService
    ) {}

    async findAByEmail(email: string): Promise<UserDto>  {
        const users: UserDto[] = await this.userModel.find({ email }).populate('role').populate('token').populate('socials').exec();
        return users[0];
    }

    async findSocialById(id: string): Promise<SocialUserDto>  {
        const socialUsers: SocialUserDto[] = await this.socialUserModel.find({ id }).exec();
        return socialUsers[0];
    }

    async createSocialUser(createSocialUserDto: CreateSocialUserDto): Promise<SocialUserDto> {
        try {
            const createdSocialUser: any = new this.socialUserModel(createSocialUserDto);
            const socialUser: SocialUserDto = await createdSocialUser.save();
            return await this.findSocialById(socialUser.id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async checkBlockTime(blockTime: Date): Promise<boolean> {
        const currentTime: number = new Date().getTime();
        return !(currentTime > blockTime.getTime());
    };

    async setWrong(user: UserDto): Promise<UserDto> {
        user.wrong = user.wrong + 1;
        if (user.wrong === this.configService.get<number>('BLOCK_WRONG')) {
            await this.blockUser(user);
            throw new Error('User was blocked on 5 min');
        }
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async blockUser(user: UserDto): Promise<void> {
        const blockAccountTime: number = this.configService.get<number>('BLOCK_TIME');
        user.blockTime = await this.addMinutesToDate(new Date(), blockAccountTime);
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async addMinutesToDate(date, minutes): Promise<Date> {
        return new Date(date.getTime() + minutes * 60000);
    }

    async unBlock(user: UserDto): Promise<void> {
        user.wrong = 0;
        user.blockTime = null;
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async checkAdminAccess(type: string, role: string): Promise<void> {
        if (type === AuthTypesEnum.ADMIN && role !== AuthTypesEnum.ADMIN) {
            throw new Error('User does not have permission level!');
        }
    };
}
