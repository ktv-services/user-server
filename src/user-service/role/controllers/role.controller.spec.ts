import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePermissionDto } from '../../permission/dtos/create-permission.dto';
import { RoleController } from './role.controller';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleService } from '../services/role.service';
import { Role } from '../schemas/role.schema';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleDto } from '../dtos/role.dto';
import { getFirstRole, getRoles } from '../data/role.data';
import { getFirstPermission } from '../../permission/data/permissions.data';


describe('RoleController', () => {
    let appController: RoleController;
    const date = new Date();
    const permission: CreatePermissionDto = getFirstPermission();
    const roles: CreateRoleDto[] = getRoles(permission);

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [RoleService, { provide: getModelToken(Role.name), useValue: jest.fn()}],
        }).compile();

        appController = app.get<RoleController>(RoleController);
    });

    it('should return roles', async () => {
        const data = {
            roles: roles,
        };
        const query = {active: true};
        const responseObj = getResponse(data);

        const response: any = await appController.findAll(responseObj, query);
        expect(response.roles.length).toBe(3);
        expect(response.roles[0].name).toBe('Role 1');
        expect(response.roles[2].status).toBe('new');
    });

    it('should return role', async () => {
        const data = {
            role: getFirstRole(permission),
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.findOne(responseObj, param);
        expect(response.role.name).toBe('Role 1');
        expect(response.role.status).toBe('active');
    });

    it('should create role', async () => {
        const roleCreate: CreateRoleDto = {
            name: 'Role new', permissions: [permission], status: 'new', created: date, updated: date
        };
        const data = {
            status: 'ok',
            role: roleCreate,
        };

        const responseObj = getResponse(data);

        const response: any = await appController.create(responseObj, roleCreate);
        expect(response.status).toBe('ok');
        expect(response.role.name).toBe('Role new');
        expect(response.role.status).toBe('new');
    });

    it('should update role', async () => {
        const roleUpdate: UpdateRoleDto = {
            name: 'Role update', permissions: [permission], status: 'active', updated: date
        };
        const data = {
            status: 'ok',
            role: roleUpdate,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.update(responseObj, param, roleUpdate);
        expect(response.status).toBe('ok');
        expect(response.role.name).toBe('Role update');
        expect(response.role.status).toBe('active');
    });

    it('should remove role', async () => {
        const roleRemove: RoleDto = {
            name: 'Role remove', status: 'active', created: date, updated: date
        };
        const data = {
            status: 'ok',
            role: roleRemove,
        };
        const param = '11111';
        const responseObj = getResponse(data);

        const response: any = await appController.remove(responseObj, param);
        expect(response.status).toBe('ok');
        expect(response.role.name).toBe('Role remove');
        expect(response.role.status).toBe('active');
    });

    const getResponse = (data) => {
        const jsonFunction = {
            json: jest.fn().mockImplementation().mockReturnValue(data),
        };

        return {status: () => jsonFunction};
    }
});
