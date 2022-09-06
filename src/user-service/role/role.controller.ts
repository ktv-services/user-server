import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async findAll(@Res() response): Promise<Role[]> {
        try {
            const permissions = await this.roleService.findAll();
            return response.status(HttpStatus.OK).json({permissions: permissions});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<Role> {
        try {
            const permission = await this.roleService.findOne(id);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Post()
    async create(@Res() response, @Body() createRoleDto: CreateRoleDto) {
        try {
            const permission = await this.roleService.create(createRoleDto);
            return response.status(HttpStatus.CREATED).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        try {
            const permission = await this.roleService.update(id, updateRoleDto);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string) {
        try {
            const permission = await this.roleService.delete(id);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}
