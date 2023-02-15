import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../services/user/user.service';
import { PasswordService } from '../../services/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../../role/services/role.service';
import { SignInUserDto } from '../../dtos/auth/signin-user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { SocialUser } from '../../schemas/social-user.schema';
import { ConfigService } from '@nestjs/config';
import { Token } from '../../schemas/token.schema';
import { Role } from '../../../role/schemas/role.schema';
import { CreateSocialUserDto } from '../../dtos/social-user/create-social-user.dto';


describe('AuthController', () => {
    let appController: AuthController;
    const date = new Date();
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                { provide: getModelToken(User.name), useValue: jest.fn()},
                { provide: getModelToken(SocialUser.name), useValue: jest.fn()},
                ConfigService,
                PasswordService,
                JwtService,
                TokenService,
                { provide: getModelToken(Token.name), useValue: jest.fn()},
                UserService,
                RoleService,
                { provide: getModelToken(Role.name), useValue: jest.fn()},
            ],
        }).compile();

        appController = app.get<AuthController>(AuthController);
    });

    it('should login user', async () => {
        const signInUserDto: SignInUserDto = {email: 'qdmin@gmail.com', password: '123', type: 'admin'};
        const tokenValue = '123token456';
        const data = {
            token: tokenValue,
        };
        const responseObj = getResponse(data);

        const response: any = await appController.signIn(responseObj, signInUserDto);
        expect(response.token).toBe(tokenValue);
    });

    it('should login user via social networks', async () => {
        const createSocialUserDto: CreateSocialUserDto = {
            id: '11111', email: 'qdmin@gmail.com', firstName: 'UserName',
            lastName: 'UserLastName', photoUrl: 'url', provider: 'facebook',
            created: date, updated: date, status: 'active'
        };
        const tokenValue = '123token456';
        const data = {
            token: tokenValue,
        };
        const responseObj = getResponse(data);

        const response: any = await appController.social(responseObj, createSocialUserDto);
        expect(response.token).toBe(tokenValue);
    });



    const getResponse = (data) => {
        const jsonFunction = {
            json: jest.fn().mockImplementation().mockReturnValue(data),
        };

        return {status: () => jsonFunction};
    }
});
