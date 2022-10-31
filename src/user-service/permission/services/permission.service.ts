import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { PermissionDto } from '../dtos/permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) {}

    async findAll(active: boolean = false): Promise<PermissionDto[]>  {
        const permissions: PermissionDto[] = await this.permissionModel.find().exec();
        if (!permissions || permissions.length == 0) {
            throw new NotFoundException('Permissions data not found!');
        }
        return active ? permissions.filter((item: PermissionDto) => item.status === 'active') : permissions;
    }

    async findOne(id: string): Promise<PermissionDto>  {
        try {
            const permission: PermissionDto = await this.permissionModel.findById(id).exec();
            if (!permission) {
                throw new NotFoundException(`Permission id:${id} not found`);
            }
            return permission;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<PermissionDto>  {
        createPermissionDto.created = new Date();
        createPermissionDto.updated = new Date();
        const createdPermission: any = new this.permissionModel(createPermissionDto);
        return createdPermission.save();
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDto>  {
        const permission: PermissionDto = await this.permissionModel.findById(id).exec();
        if (!permission) {
            throw new NotFoundException(`Permission id:${id} not found`);
        }
        updatePermissionDto.updated = new Date();
        return this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, {new: true});
    }

    async delete(id: string): Promise<PermissionDto> {
        const permission: PermissionDto = await this.permissionModel.findById(id).exec();
        if (!permission) {
            throw new NotFoundException(`Permission id:${id} not found`);
        }
        return this.permissionModel.findByIdAndDelete(id);
    }
}
