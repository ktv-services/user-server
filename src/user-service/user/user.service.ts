import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<User[]>  {
        const users = await this.userModel.find().populate('role').populate('token').exec();
        if (!users || users.length == 0) {
            throw new NotFoundException('Users data not found!');
        }
        return users;
    }

    async findOne(id: string): Promise<User>  {
        try {
            const user = await this.userModel.findById(id).populate('role').populate('token').exec();
            if (!user) {
                throw new NotFoundException(`User id:${id} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
