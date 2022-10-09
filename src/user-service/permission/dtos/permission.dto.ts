import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionDto {
    _id?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsDate()
    @Type(() => Date)
    created: Date;

    @IsDate()
    @Type(() => Date)
    updated: Date;
}
