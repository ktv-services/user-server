import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from "../schemas/role.schema";
import { CreateRoleDto } from "../dtos/create-role.dto";
import { UpdateRoleDto } from "../dtos/update-role.dto";
import { RoleDto } from '../dtos/role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    ) {}

    async findAll(): Promise<RoleDto[]>  {
        const roles: RoleDto[] = await this.roleModel.find().populate('permissions').exec();
        if (!roles || roles.length == 0) {
            throw new NotFoundException('Roles data not found!');
        }
        return roles;
    }

    async findOne(id: string): Promise<RoleDto>  {
        try {
            const role: RoleDto = await this.roleModel.findById(id).populate('permissions').exec();
            if (!role) {
                throw new NotFoundException(`Role id:${id} not found`);
            }
            return role;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findRoleByName(name: string): Promise<RoleDto>  {
        try {
            const role: RoleDto = (await this.roleModel.find({ name }).populate('permissions').limit(1))[0];
            if (!role) {
                throw new NotFoundException(`Role name:${name} not found`);
            }
            return role;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleDto>  {
        const createdRole: any = new this.roleModel(createRoleDto);
        const role: RoleDto = await createdRole.save();
        return await this.roleModel.findById(role._id).populate('permissions').exec();
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDto>  {
        const role: RoleDto = await this.roleModel.findById(id).exec();
        if (!role) {
            throw new NotFoundException(`Role id:${id} not found`);
        }
        return this.roleModel.findByIdAndUpdate(id, updateRoleDto, {new: true}).populate('permissions');
    }

    async delete(id: string): Promise<RoleDto> {
        const role: RoleDto = await this.roleModel.findById(id).exec();
        if (!role) {
            throw new NotFoundException(`Role id:${id} not found`);
        }
        return this.roleModel.findByIdAndDelete(id).populate('permissions');
    }
}

