import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsDate()
    @Type(() => Date)
    updated: Date;
}
