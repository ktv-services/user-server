import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from '../../permission/dtos/permission.dto';

export class RoleDto {
    _id?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    permissions?: PermissionDto[];

    @IsDate()
    @Type(() => Date)
    created: Date;

    @IsDate()
    @Type(() => Date)
    updated: Date;
}