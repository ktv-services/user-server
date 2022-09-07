import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateRoleDto } from '../role/dtos/create-role.dto';
import { UpdateRoleDto } from '../role/dtos/update-role.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(@Res() response): Promise<User[]> {
        try {
            const users = await this.userService.findAll();
            return response.status(HttpStatus.OK).json({users: users});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<User> {
        try {
            const user = await this.userService.findOne(id);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    /*@Post()
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
    }*/
}
