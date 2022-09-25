import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { SignInUserDto } from '../../dtos/signin-user.dto';
import { PasswordService } from '../../services/password.service';
import { JwtService } from '../../services/jwt.service';
import { TokenService } from '../../services/token.service';
import { CreateTokenDto } from '../../dtos/create-token.dto';
import { Status } from '../../enums/statuses.enum';
import { UserService } from '../../services/user.service';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { CreateSocialUserDto } from '../../dtos/create-social-user.dto';
import { RoleService } from '../../../role/services/role.service';
import { RolesEnum } from '../../enums/roles.enum';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private passwordService: PasswordService,
        private jwtService: JwtService,
        private tokenService: TokenService,
        private userService: UserService,
        private roleService: RoleService,
    ) {}

    @Post('/signin')
    async signIn(@Res() response, @Body() signInUserDto: SignInUserDto): Promise<any> {
        try {
            const user: UpdateUserDto = await this.authService.findAByEmail(signInUserDto.email);
            if (typeof user === 'undefined') {
                throw new Error('Wrong email or password');
            }
            if (user.blockTime && await this.authService.checkBlockTime(user.blockTime)) {
                throw new Error('User was blocked on 5 min');
            }
           if (user && await this.passwordService.comparePassword(signInUserDto.password, user.password)) {
               if (user.wrong > 0) {
                   await this.authService.unBlock(user);
               }
               await this.authService.checkAdminAccess(signInUserDto.type, user.role.name);
               const tokenHash: string = await this.jwtService.createToken(user);
               if (typeof user.token !== 'undefined') {
                   await this.tokenService.removeTokenEntry(user.token.hash);
               }
               const token: CreateTokenDto = {hash: tokenHash, status: Status.ACTIVE};
               user.token = await this.tokenService.create(token);
               user.updated = new Date();
               await this.userService.update(user._id, user);
               return response.status(HttpStatus.OK).json({token: user.token.hash});
            } else {
               await this.authService.setWrong(user);
               throw new Error('Wrong email or password');
            }
        } catch (err) {
            return response.status(HttpStatus.BAD_REQUEST).json({error: err.message});
        }
    }

    @Post('/social')
    async social(@Res() response, @Body() createSocialUserDto: CreateSocialUserDto) {
        try {
            let user = await this.authService.findAByEmail(createSocialUserDto.email);
            let social = await this.authService.findSocialById(createSocialUserDto.id);
            let newSocial = false;

            if (typeof social === 'undefined') {
                newSocial = true;
                createSocialUserDto.status = Status.ACTIVE;
                social = await this.authService.createSocialUser(createSocialUserDto);
            }

            if (typeof user === 'undefined') {
                const role = await this.roleService.findRoleByName(RolesEnum.USER);
                const createUserDto: CreateUserDto = {
                    email: createSocialUserDto.email,
                    status: Status.ACTIVE,
                    role: role,
                    created: new Date(),
                    updated: new Date(),
                };
                user = await this.userService.create(createUserDto);
            }
            if (newSocial) {
                user.socials = [...user.socials, social];
            }

            // await checkAdminAccess(type, user.role.name);
            const tokenHash = await this.jwtService.createToken(user);
            if (typeof user.token !== 'undefined') {
                await this.tokenService.removeTokenEntry(user.token.hash);
            }
            const token: CreateTokenDto = {hash: tokenHash, status: Status.ACTIVE};
            user.token = await this.tokenService.create(token);
            await this.userService.update(user._id, user);
            return response.status(HttpStatus.OK).json({token: user.token.hash});
        } catch (err) {
            return response.status(HttpStatus.BAD_REQUEST).json({error: err.message});
        }
    }
}
