import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ChangeUserPasswordDto } from '../dtos/user/change-user-password.dto';
import { PasswordService } from './password.service';
import { UserTypesEnum } from '../enums/user-types.enum';
import { UserDto } from '../dtos/user/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly passwordService: PasswordService
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
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).populate('role').populate('token').populate('socials').exec();
    }

    async changeUserPassword(id: string, changeUserPasswordDto: ChangeUserPasswordDto): Promise<UserDto> {
        const user: UserDto = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        user.password = await this.passwordService.hashPassword(changeUserPasswordDto.password);
        user.type = UserTypesEnum.STANDARD;
        return this.userModel.findByIdAndUpdate(id, user).populate('role').populate('token').populate('socials').exec();
    }

    async delete(id: string): Promise<UserDto> {
        const user: UserDto = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndDelete(id).populate('role').populate('token').populate('socials');
    }

}
