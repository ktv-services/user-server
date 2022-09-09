import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<User[]>  {
        const users = await this.userModel.find().populate('role').populate('token').populate('socials').exec();
        if (!users || users.length == 0) {
            throw new NotFoundException('Users data not found!');
        }
        return users;
    }

    async findOne(id: string): Promise<User>  {
        try {
            const user = await this.userModel.findById(id).populate('role').populate('token').populate('socials').exec();
            if (!user) {
                throw new NotFoundException(`User id:${id} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User>  {
        const createdUser = new this.userModel(createUserDto);
        const user = await createdUser.save();
        return await this.userModel.findById(user._id).populate('role').populate('token').populate('socials').exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User>  {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).populate('role').populate('token').populate('socials');
    }

    async delete(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User id:${id} not found`);
        }
        return this.userModel.findByIdAndDelete(id).populate('role').populate('token').populate('socials');
    }
}
