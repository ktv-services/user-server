import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    async findAll(@Res() response): Promise<Permission[]> {
        try {
            const permissions: Permission[] = await this.permissionService.findAll();
            return response.status(HttpStatus.OK).json({permissions: permissions});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<Permission> {
        try {
            const permission: Permission = await this.permissionService.findOne(id);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Post()
    async create(@Res() response, @Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
        try {
            const permission: Permission = await this.permissionService.create(createPermissionDto);
            return response.status(HttpStatus.CREATED).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        try {
            const permission: Permission = await this.permissionService.update(id, updatePermissionDto);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string): Promise<Permission> {
        try {
            const permission: Permission = await this.permissionService.delete(id);
            return response.status(HttpStatus.OK).json({permission: permission});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}
