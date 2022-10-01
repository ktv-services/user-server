import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangeUserPasswordDto {
    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsDate()
    @Type(() => Date)
    updated: Date = new Date();
}
