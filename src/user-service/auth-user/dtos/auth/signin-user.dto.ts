import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    type: string;
}
