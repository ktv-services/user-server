import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { TokenService } from '../user/services/token.service';
import { CreateTokenDto } from '../user/dtos/create-token.dto';
import { Status } from './enums/statuses.enum';
import { UserService } from '../user/services/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private passwordService: PasswordService,
        private jwtService: JwtService,
        private tokenService: TokenService,
        private userService: UserService,
    ) {}

    @Post('/signin')
    async signIn(@Res() response, @Body() signInUserDto: SignInUserDto) {
        try {
            const user = await this.authService.findAByEmail(signInUserDto.email);
            if (typeof user === 'undefined') {
                throw new Error('Wrong email or password');
            }
           if (user && await this.passwordService.comparePassword(signInUserDto.password, user.password)) {
                await this.authService.checkAdminAccess(signInUserDto.type, user.role.name);
                const tokenHash = await this.jwtService.createToken(user);
                if (typeof user.token !== 'undefined') {
                    await this.tokenService.removeTokenEntry(user.token.hash);
                }
                const token: CreateTokenDto = {hash: tokenHash, status: Status.ACTIVE};
                user.token = await this.tokenService.create(token);
                await this.userService.update(user._id, user);
                return response.status(HttpStatus.OK).json({token: user.token.hash});
            } else {
               throw new Error('Wrong email or password');
            }
        } catch (err) {
            return response.status(HttpStatus.BAD_REQUEST).json({error: err.message});
        }
    }

    @Post('/social')
    async social(@Res() response, @Body() signInUserDto: SignInUserDto) {

    }
}
