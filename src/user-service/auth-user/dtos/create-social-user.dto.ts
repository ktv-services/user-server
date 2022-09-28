import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSocialUserDto {
    _id?: string;
    id?: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    lastName: string;

    @IsString()
    photoUrl: string;

    @IsString()
    provider: string;

    status?: string;

    @IsDate()
    @Type(() => Date)
    created: Date = new Date();

    @IsDate()
    @Type(() => Date)
    updated: Date = new Date();
}
