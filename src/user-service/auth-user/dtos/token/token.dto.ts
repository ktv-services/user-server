import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TokenDto {
    _id: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsDate()
    @Type(() => Date)
    expired: Date = new Date();
}
