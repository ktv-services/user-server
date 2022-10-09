import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Token } from '../../schemas/token.schema';
import { SocialUser } from "../../schemas/social-user.schema";
import { RoleDto } from '../../../role/dtos/role.dto';

export class UserDto {
    _id?: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    wrong: number;

    blockTime: Date;

    role: RoleDto;

    token: Token;

    socials: SocialUser[];

    type: string;

    @IsDate()
    @Type(() => Date)
    created: Date = new Date();

    @IsDate()
    @Type(() => Date)
    updated: Date = new Date();
}
