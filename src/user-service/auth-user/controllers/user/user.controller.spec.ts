import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePermissionDto } from '../../../permission/dtos/create-permission.dto';
import { CreateRoleDto } from '../../../role/dtos/create-role.dto';
import { UserController } from './user.controller';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { UserDto } from '../../dtos/user/user.dto';
import { User } from '../../schemas/user.schema';
import { PasswordService } from '../../services/password.service';
import { SocialUser } from '../../schemas/social-user.schema';
import { ConfigService } from '@nestjs/config';
import { ChangeUserPasswordDto } from '../../dtos/user/change-user-password.dto';


describe('UserController', () => {
    let appController: UserController;
    const date = new Date();
    const permission: CreatePermissionDto = {name: 'Permission 1', status: 'active', created: date, updated: date};
    const role: CreateRoleDto = {name: 'Role 1', permissions: [permission], status: 'active', created: date, updated: date};
    const users: CreateUserDto[] = [
        {email: 'user1@gmail.com', password: '123', role: role, type: 'admin', status: 'active', created: date, updated: date},
        {email: 'user2@gmail.com', password: '345', role: role, type: 'admin', status: 'active', created: date, updated: date},
        {email: 'user3@gmail.com', password: '567', role: role, type: 'user', status: 'new', created: date, updated: date},
        {email: 'user4@gmail.com', password: '890', role: role, type: 'admin', status: 'new', created: date, updated: date},
    ];

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                { provide: getModelToken(User.name), useValue: jest.fn()},
                { provide: getModelToken(SocialUser.name), useValue: jest.fn()},
                PasswordService,
                ConfigService
            ],
        }).compile();

        appController = app.get<UserController>(UserController);
    });

    it('should return users', async () => {
        const data = {
            users: users,
        };
        const responseObj = getResponse(data);

        const response: any = await appController.findAll(responseObj);
        expect(response.users.length).toBe(4);
        expect(response.users[0].email).toBe('user1@gmail.com');
        expect(response.users[1].password).toBe('345');
        expect(response.users[2].status).toBe('new');
    });

    it('should return user', async () => {
        const data = {
            user: users[0],
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.findOne(responseObj, param);
        expect(response.user.email).toBe('user1@gmail.com');
        expect(response.user.status).toBe('active');
    });

    it('should create user', async () => {
        const userCreate: CreateUserDto = {
            email: 'user-new@gmail.com', password: '123', role: role, type: 'admin', status: 'new', created: date, updated: date
        };
        const data = {
            status: 'ok',
            user: userCreate,
        };
        const responseObj = getResponse(data);

        const response: any = await appController.create(responseObj, userCreate);
        expect(response.status).toBe('ok');
        expect(response.user.email).toBe('user-new@gmail.com');
        expect(response.user.status).toBe('new');
    });

    it('should update user', async () => {
        const userUpdate: UpdateUserDto = {
            email: 'user-edit@gmail.com', role: role, status: 'active', updated: date, wrong: 0, blockTime: null, token: null, socials: []
        };
        const data = {
            status: 'ok',
            user: userUpdate,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.update(responseObj, param, userUpdate);
        expect(response.status).toBe('ok');
        expect(response.user.email).toBe('user-edit@gmail.com');
        expect(response.user.status).toBe('active');
    });

    it('should remove user', async () => {
        const userRemove: UserDto = {
            email: 'user-remove@gmail.com', password: '123', role: role, type: 'admin', status: 'active', created: date, updated: date, wrong: 0, blockTime: null, token: null, socials: []
        };
        const data = {
            status: 'ok',
            user: userRemove,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.remove(responseObj, param);
        expect(response.status).toBe('ok');
        expect(response.user.email).toBe('user-remove@gmail.com');
        expect(response.user.status).toBe('active');
    });

    it('should change password user', async () => {
        const userChangePassword: ChangeUserPasswordDto = {
            password: '123',
        };
        const data = {
            status: 'ok',
            user: userChangePassword,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.changePassword(responseObj, param, userChangePassword);
        expect(response.status).toBe('ok');
        expect(response.user.password).toBe('123');
    });

    it('should unbind social user', async () => {
        const userUnbindSocial: UserDto = {
            email: 'user-unbind-social@gmail.com', password: '123', role: role, type: 'admin', status: 'active', created: date, updated: date, wrong: 0, blockTime: null, token: null, socials: []
        };
        const data = {
            status: 'ok',
            user: userUnbindSocial,
        };
        const paramId = '11111';
        const paramSocialId = '22222';
        const responseObj = getResponse(data);

        const response: any = await appController.unbindSocial(responseObj, paramId, paramSocialId);
        expect(response.status).toBe('ok');
        expect(response.user.email).toBe('user-unbind-social@gmail.com');
        expect(response.user.status).toBe('active');
    });

    const getResponse = (data) => {
        const jsonFunction = {
            json: jest.fn().mockImplementation().mockReturnValue(data),
        };

        return {status: () => jsonFunction};
    }
});
