import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from '../../permission/dtos/permission.dto';

export class UpdateRoleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    permissions: PermissionDto[];

    @Type(() => Date)
    updated: Date;
}
