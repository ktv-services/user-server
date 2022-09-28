import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ChangeUserPasswordDto } from '../dtos/change-user-password.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly passwordService: PasswordService
    ) {}

    async findAll(): Promise<User[]>  {
        const users: User[] = await this.userModel.find().populate('role').populate('token').populate('socials').exec();
        if (!users || users.length == 0) {
            throw new NotFoundException('Users data not found!');
        }
        return users;
    }

    async findOne(id: string): Promise<User>  {
        try {
            const user: User = await this.userModel.findById(id).populate('role').populate('token').populate('socials').exec();
            if (!user) {
                throw new NotFoundException(`User id:${id} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User>  {
        try {
            const createdUser: any = new this.userModel(createUserDto);
            const user: CreateUserDto = await createdUser.save();
            return await this.userModel.findById(user._id).populate('role').populate('token').populate('socials').exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User>  {
        const user: User = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).populate('role').populate('token').populate('socials').exec();
    }

    async changeUserPassword(id: string, changeUserPasswordDto: ChangeUserPasswordDto): Promise<User> {
        const user: User = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        user.password = await this.passwordService.hashPassword(changeUserPasswordDto.password);
        return this.userModel.findByIdAndUpdate(id, user).populate('role').populate('token').populate('socials').exec();
    }

    async delete(id: string): Promise<User> {
        const user: User = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndDelete(id).populate('role').populate('token').populate('socials');
    }

}
