import {Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus, Query} from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleService } from '../services/role.service';
import { RoleDto } from '../dtos/role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async findAll(@Res() response, @Query() query: { active: boolean }): Promise<RoleDto[]> {
        try {
            const roles: RoleDto[] = await this.roleService.findAll(query.active);
            return response.status(HttpStatus.OK).json({roles: roles});
        } catch (err) {
            return response.status(err.status).json({error: err.response?.message});
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.findOne(id);
            return response.status(HttpStatus.OK).json({role: role});
        } catch (err) {
            return response.status(err.status).json({error: err.response?.message});
        }
    }

    @Post()
    async create(@Res() response, @Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.create(createRoleDto);
            return response.status(HttpStatus.CREATED).json({role: role, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response?.message});
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.update(id, updateRoleDto);
            return response.status(HttpStatus.OK).json({role: role, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response?.message});
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.delete(id);
            return response.status(HttpStatus.OK).json({role: role, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response?.message});
        }
    }
}
