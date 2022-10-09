import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleService } from '../services/role.service';
import { RoleDto } from '../dtos/role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async findAll(@Res() response): Promise<RoleDto[]> {
        try {
            const roles: RoleDto[] = await this.roleService.findAll();
            return response.status(HttpStatus.OK).json({roles: roles});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.findOne(id);
            return response.status(HttpStatus.OK).json({role: role});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Post()
    async create(@Res() response, @Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.create(createRoleDto);
            return response.status(HttpStatus.CREATED).json({role: role});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.update(id, updateRoleDto);
            return response.status(HttpStatus.OK).json({role: role});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string): Promise<RoleDto> {
        try {
            const role: RoleDto = await this.roleService.delete(id);
            return response.status(HttpStatus.OK).json({role: role});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}
