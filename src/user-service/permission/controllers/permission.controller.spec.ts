import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from '../services/permission.service';
import { getModelToken } from '@nestjs/mongoose';
import { Permission } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { PermissionDto } from '../dtos/permission.dto';
import { getFirstPermission, getPermissions } from '../data/permissions.data';


describe('PermissionController', () => {
    let appController: PermissionController;
    const date = new Date();
    const permissions: CreatePermissionDto[] = getPermissions();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [PermissionController],
            providers: [PermissionService, { provide: getModelToken(Permission.name), useValue: jest.fn()}],
        }).compile();

        appController = app.get<PermissionController>(PermissionController);
    });

    it('should return permissions', async () => {
        const data = {
            permissions: permissions,
        };
        const query = {active: true};
        const responseObj = getResponse(data);

        const response: any = await appController.findAll(responseObj, query);
        expect(response.permissions.length).toBe(3);
        expect(response.permissions[0].name).toBe('Permission 1');
        expect(response.permissions[2].status).toBe('new');
    });

    it('should return permission', async () => {
        const data = {
            permission: getFirstPermission(),
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.findOne(responseObj, param);
        expect(response.permission.name).toBe('Permission 1');
        expect(response.permission.status).toBe('active');
    });

    it('should create permission', async () => {
        const permissionCreate: CreatePermissionDto = {
            name: 'Permission new', status: 'new', created: date, updated: date
        };
        const data = {
            status: 'ok',
            permission: permissionCreate,
        };

        const responseObj = getResponse(data);

        const response: any = await appController.create(responseObj, permissionCreate);
        expect(response.status).toBe('ok');
        expect(response.permission.name).toBe('Permission new');
        expect(response.permission.status).toBe('new');
    });

    it('should update permission', async () => {
        const permissionUpdate: UpdatePermissionDto = {
            name: 'Permission update', status: 'active', updated: date
        };
        const data = {
            status: 'ok',
            permission: permissionUpdate,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.update(responseObj, param, permissionUpdate);
        expect(response.status).toBe('ok');
        expect(response.permission.name).toBe('Permission update');
        expect(response.permission.status).toBe('active');
    });

    it('should remove permission', async () => {
        const permissionRemove: PermissionDto = {
            name: 'Permission remove', status: 'active', created: date, updated: date
        };
        const data = {
            status: 'ok',
            permission: permissionRemove,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.remove(responseObj, param);
        expect(response.status).toBe('ok');
        expect(response.permission.name).toBe('Permission remove');
        expect(response.permission.status).toBe('active');
    });

    const getResponse = (data) => {
        const jsonFunction = {
            json: jest.fn().mockImplementation().mockReturnValue(data),
        };

        return {status: () => jsonFunction};
    }
});
