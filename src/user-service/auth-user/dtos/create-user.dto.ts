import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../role/schemas/role.schema';
import { Token } from '../schemas/token.schema';
import { SocialUser } from "../schemas/social-user.schema";

export class CreateUserDto {
    _id?: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    email: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    role?: Role;

    token?: Token;

    socials?: SocialUser[];

    type?: string;

    @IsDate()
    @Type(() => Date)
    created: Date = new Date();

    @IsDate()
    @Type(() => Date)
    updated: Date = new Date();
}
