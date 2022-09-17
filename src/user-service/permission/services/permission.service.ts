import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) {}

    async findAll(): Promise<Permission[]>  {
        const permissions: Permission[] = await this.permissionModel.find().exec();
        if (!permissions || permissions.length == 0) {
            throw new NotFoundException('Permissions data not found!');
        }
        return permissions;
    }

    async findOne(id: string): Promise<Permission>  {
        try {
            const permission: Permission = await this.permissionModel.findById(id).exec();
            if (!permission) {
                throw new NotFoundException(`Permission id:${id} not found`);
            }
            return permission;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission>  {
        const createdPermission: any = new this.permissionModel(createPermissionDto);
        return createdPermission.save();
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission>  {
        const permission: Permission = await this.permissionModel.findById(id).exec();
        if (!permission) {
            throw new NotFoundException(`Permission id:${id} not found`);
        }
        return this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, {new: true});
    }

    async delete(id: string): Promise<Permission> {
        const permission: Permission = await this.permissionModel.findById(id).exec();
        if (!permission) {
            throw new NotFoundException(`Permission id:${id} not found`);
        }
        return this.permissionModel.findByIdAndDelete(id);
    }
}
