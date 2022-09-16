import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { TokenService } from '../user/services/token.service';
import { Token, TokenSchema } from '../user/schemas/token.schema';
import { UserService } from '../user/services/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, PasswordService, JwtService, TokenService, UserService],
})
export class AuthModule {}