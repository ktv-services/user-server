import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { ChangeUserPasswordDto } from '../../dtos/user/change-user-password.dto';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../dtos/user/user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    async findAll(@Res() response): Promise<UserDto[]> {
        try {
            const users: UserDto[] = await this.userService.findAll();
            return response.status(HttpStatus.OK).json({users: users});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Get(':id')
    async findOne(@Res() response, @Param('id') id: string): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.findOne(id);
            return response.status(HttpStatus.OK).json({user: user});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Post()
    async create(@Res() response, @Body() createUserDto: CreateUserDto): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.create(createUserDto);
            return response.status(HttpStatus.CREATED).json({user: user, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Put(':id')
    async update(@Res() response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.update(id, updateUserDto);
            return response.status(HttpStatus.OK).json({user: user, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Put(':id/change-password')
    async changePassword(@Res() response, @Param('id') id: string, @Body() changeUserPasswordDto: ChangeUserPasswordDto): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.changeUserPassword(id, changeUserPasswordDto);
            return response.status(HttpStatus.OK).json({user: user, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Get(':id/unbind-social/:social')
    async unbindSocial(@Res() response, @Param('id') id: string, @Param('social') socialId: string): Promise<UserDto> {
        try {
            const user: UserDto = await this.authService.unbindSocial(id, socialId);
            return response.status(HttpStatus.OK).json({user: user, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }

    @Delete(':id')
    async remove(@Res() response, @Param('id') id: string): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.delete(id);
            return response.status(HttpStatus.OK).json({user: user, status: 'ok'});
        } catch (err) {
            return response.status(err.status).json({error: err.response.message});
        }
    }
}
