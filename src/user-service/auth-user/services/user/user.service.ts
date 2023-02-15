import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { ChangeUserPasswordDto } from '../../dtos/user/change-user-password.dto';
import { PasswordService } from '../password.service';
import { UserTypesEnum } from '../../enums/user-types.enum';
import { UserDto } from '../../dtos/user/user.dto';
import { SocialUser, SocialUserDocument } from '../../schemas/social-user.schema';
import { SocialUserDto } from '../../dtos/social-user/social-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(SocialUser.name) private socialUserModel: Model<SocialUserDocument>,
        private readonly passwordService: PasswordService,
        private configService: ConfigService
    ) {}

    async findAll(): Promise<UserDto[]>  {
        const users: UserDto[] = await this.userModel.find().populate('role').populate('token').populate('socials').exec();
        if (!users || users.length == 0) {
            throw new NotFoundException('Users data not found!');
        }
        return users;
    }

    async findOne(id: string): Promise<UserDto>  {
        try {
            const user: UserDto = await this.userModel.findById(id).populate('role').populate('token').populate('socials').exec();
            if (!user) {
                throw new NotFoundException(`User id:${id} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto>  {
        try {
            createUserDto.created = new Date();
            createUserDto.updated = new Date();
            const createdUser: any = new this.userModel(createUserDto);
            const user: UserDto = await createdUser.save();
            return await this.userModel.findById(user._id).populate('role').populate('token').populate('socials').exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto | UserDto): Promise<UserDto>  {
        const user: UserDto = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        updateUserDto.updated = new Date();
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).populate('role').populate('token').populate('socials').exec();
    }

    async changeUserPassword(id: string, changeUserPasswordDto: ChangeUserPasswordDto): Promise<UserDto> {
        const user: UserDto = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        user.password = await this.passwordService.hashPassword(changeUserPasswordDto.password);
        user.type = UserTypesEnum.STANDARD;
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(id, user).populate('role').populate('token').populate('socials').exec();
    }

    async delete(id: string): Promise<UserDto> {
        const user: UserDto = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndDelete(id).populate('role').populate('token').populate('socials');
    }

    async unbindSocial(id: string, socialId: string): Promise<UserDto> {
        const user: UserDto = await this.findOne(id);
        await this.deleteSocial(String(socialId));
        const socialCount: number = this.configService.get<number>('SOCIAL_COUNT');
        if (user.type === UserTypesEnum.SOCIAL && user.socials.length < socialCount) {
            return await this.delete(id);
        }
        return await this.userModel.findById(id).exec();
    }

    async deleteSocial(id: string): Promise<SocialUserDto> {
        const social: SocialUserDto = await this.socialUserModel.findById(id);
        if (!social) {
            throw new NotFoundException(`Social id:${id} not found`);
        }
        return this.socialUserModel.findByIdAndDelete(id).exec();
    }

}
