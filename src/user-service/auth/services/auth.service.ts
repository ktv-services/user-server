import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthTypesEnum } from '../enums/auth-types.enum';
import { UpdateUserDto } from "../../user/dtos/update-user.dto";

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

    async blockUser(user: User): Promise<void> {
        const blockAccountTime = 5;
        user.wrong = user.wrong + 1;
        user.blockTime = await this.addMinutesToDate(new Date(), blockAccountTime);
        user.updated = new Date();
        this.userModel.updateOne(user);
    }

    async addMinutesToDate(date, minutes): Promise<Date> {
        return new Date(date.getTime() + minutes * 60000);
    }

    async unBlock(user: User): Promise<void> {
        user.wrong = 0;
        user.blockTime = null;
        user.updated = new Date();
        await this.userModel.updateOne(user);
    }

    async checkAdminAccess(type: string, role: string): Promise<void> {
        if (type === AuthTypesEnum.ADMIN && role !== AuthTypesEnum.ADMIN) {
            throw new Error('User does not have permission level!');
        }
    };

    async encreaseAttemp(user: User): Promise<void> {
        if (user.wrong === 5) {
            user.wrong = 1;
            user.blockTime = null;
        } else {
            user.wrong = user.wrong + 1;
        }
        user.updated = new Date();
        await this.userModel.updateOne(user);
    }


}
