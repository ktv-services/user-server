import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { SocialUser, SocialUserSchema } from './schemas/social-user.schema';
import { TokenService } from './services/token.service';
import { AuthController } from './controllers/auth/auth.controller';
import { PasswordService } from './services/password.service';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
            { name: SocialUser.name, schema: SocialUserSchema },
        ]),
    ],
    controllers: [UserController, AuthController],
    providers: [
        UserService,
        TokenService,
        PasswordService,
        AuthService,
        JwtService,
    ],
})
export class AuthUserModule {}