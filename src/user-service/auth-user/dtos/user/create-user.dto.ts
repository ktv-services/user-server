import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Token } from '../../schemas/token.schema';
import { SocialUser } from "../../schemas/social-user.schema";
import { RoleDto } from '../../../role/dtos/role.dto';

export class CreateUserDto {
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

    role: RoleDto;

    token?: Token;

    socials?: SocialUser[];

    type: string;

    @Type(() => Date)
    created: Date = new Date();

    @Type(() => Date)
    updated: Date = new Date();
}
