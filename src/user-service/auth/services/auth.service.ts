import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthTypesEnum } from '../enums/auth-types.enum';
import { UpdateUserDto } from '../../user/dtos/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAByEmail(email: string): Promise<UpdateUserDto>  {
        const users = await this.userModel.find({ email }).populate('role').populate('token').populate('socials').exec();
        return users[0];
    }

    async checkBlockTime(blockTime: Date): Promise<boolean> {
        const currentTime = new Date().getTime();
        return !(currentTime > blockTime.getTime());
    };

    async setWrong(user: UpdateUserDto): Promise<User> {
        user.wrong = user.wrong + 1;
        if (user.wrong === 5) {
            await this.blockUser(user);
            throw new Error('User was blocked on 5 min');
        }
        user.updated = new Date();
        return this.userModel.findByIdAndUpdate(user._id, user);
    }

    async blockUser(user: UpdateUserDto): Promise<void> {
        const blockAccountTime = 5;
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

    async checkAdminAccess(type: string, role: string): Promise<void> {
        if (type === AuthTypesEnum.ADMIN && role !== AuthTypesEnum.ADMIN) {
            throw new Error('User does not have permission level!');
        }
    };
}
