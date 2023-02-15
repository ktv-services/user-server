import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @Type(() => Date)
    created: Date;

    @Type(() => Date)
    updated: Date;
}
