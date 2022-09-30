import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { ChangeUserPasswordDto } from '../../dtos/change-user-password.dto';
import { AuthService } from '../../services/auth.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    async findAll(@Res() response): Promise<User[]> {
        try {
            const users: User[] = await this.userService.findAll();
            return response.status(HttpStatus.OK).json({users: users});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<User> {
        try {
            const user: User = await this.userService.findOne(id);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Post()
    async create(@Res() response, @Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            const user: User = await this.userService.create(createUserDto);
            return response.status(HttpStatus.CREATED).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user: User = await this.userService.update(id, updateUserDto);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put(':id/change-password')
    async changePassword(@Res() response, @Param('id') id: string, @Body() changeUserPasswordDto: ChangeUserPasswordDto): Promise<User> {
        try {
            const user: User = await this.userService.changeUserPassword(id, changeUserPasswordDto);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get(':id/unbind-social/:social')
    async unbindSocial(@Res() response, @Param('id') id: string, @Param('social') socialId: string): Promise<User> {
        try {
            const user: User = await this.authService.unbindSocial(id, socialId);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string): Promise<User> {
        try {
            const user: User = await this.userService.delete(id);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}
