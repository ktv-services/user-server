import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from "./schemas/role.schema";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    ) {}

    async findAll(): Promise<Role[]>  {
        const roles = await this.roleModel.find().populate('permissions').exec();
        if (!roles || roles.length == 0) {
            throw new NotFoundException('Roles data not found!');
        }
        return roles;
    }

    async findOne(id: string): Promise<Role>  {
        try {
            const role = await this.roleModel.findById(id).populate('permissions').exec();
            if (!role) {
                throw new NotFoundException(`Role id:${id} not found`);
            }
            return role;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createRoleDto: CreateRoleDto): Promise<Role>  {
        const createdRole = new this.roleModel(createRoleDto);
        const role = await createdRole.save();
        return await this.roleModel.findById(role._id).populate('permissions').exec();
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>  {
        const role = await this.roleModel.findById(id).exec();
        if (!role) {
            throw new NotFoundException(`Role id:${id} not found`);
        }
        return this.roleModel.findByIdAndUpdate(id, updateRoleDto, {new: true}).populate('permissions');
    }

    async delete(id: string): Promise<Role> {
        const role = await this.roleModel.findById(id).exec();
        if (!role) {
            throw new NotFoundException(`Role id:${id} not found`);
        }
        return this.roleModel.findByIdAndDelete(id).populate('permissions');
    }
}

