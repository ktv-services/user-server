import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { SocialUser, SocialUserDocument } from '../schemas/social-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthTypesEnum } from '../enums/auth-types.enum';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateSocialUserDto } from '../dtos/create-social-user.dto';
import { UserService } from './user.service';
import { UserTypesEnum } from '../enums/user-types.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(SocialUser.name) private socialUserModel: Model<SocialUserDocument>,
        private readonly userService: UserService,
        private configService: ConfigService
    ) {}

    async findAByEmail(email: string): Promise<UpdateUserDto>  {
        const users: User[] = await this.userModel.find({ email }).populate('role').populate('token').populate('socials').exec();
        return users[0];
    }

    async findSocialById(id: string): Promise<SocialUser>  {
        const socialUsers: SocialUser[] = await this.socialUserModel.find({ id }).exec();
        return socialUsers[0];
    }

    async createSocialUser(createSocialUserDto: CreateSocialUserDto): Promise<SocialUser> {
        try {
            const createdSocialUser: any = new this.socialUserModel(createSocialUserDto);
            const socialUser: CreateSocialUserDto = await createdSocialUser.save();
            return await this.findSocialById(socialUser.id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async checkBlockTime(blockTime: Date): Promise<boolean> {
        const currentTime: number = new Date().getTime();
        return !(currentTime > blockTime.getTime());
    };

    async setWrong(user: UpdateUserDto): Promise<User> {
        user.wrong = user.wrong + 1;
        if (user.wrong === this.configService.get<number>('BLOCK_WRONG')) {
            await this.blockUser(user);
            throw new Error('User was blocked on 5 min');
        }
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async blockUser(user: UpdateUserDto): Promise<void> {
        const blockAccountTime: number = this.configService.get<number>('BLOCK_TIME');
        user.blockTime = await this.addMinutesToDate(new Date(), blockAccountTime);
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async addMinutesToDate(date, minutes): Promise<Date> {
        return new Date(date.getTime() + minutes * 60000);
    }

    async unBlock(user: UpdateUserDto): Promise<void> {
        user.wrong = 0;
        user.blockTime = null;
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async unbindSocial(id: string, socialId: string): Promise<User> {
        const user = await this.userService.findOne(id);
        await this.deleteSocial(String(socialId));
        const socialCount: number = this.configService.get<number>('SOCIAL_COUNT');
        if (user.type === UserTypesEnum.SOCIAL && user.socials.length < socialCount) {
            return await this.userService.delete(id);
        }
        return await this.userModel.findById(id).exec();
    }

    async deleteSocial(id: string): Promise<SocialUser> {
        const social: SocialUser = await this.socialUserModel.findById(id);
        if (!social) {
            throw new NotFoundException(`Social id:${id} not found`);
        }
        return this.socialUserModel.findByIdAndDelete(id).exec();
    }

    async checkAdminAccess(type: string, role: string): Promise<void> {
        if (type === AuthTypesEnum.ADMIN && role !== AuthTypesEnum.ADMIN) {
            throw new Error('User does not have permission level!');
        }
    };
}
