import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { SocialUser, SocialUserSchema } from './schemas/social-user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
            { name: SocialUser.name, schema: SocialUserSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}