import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePermissionDto } from '../../permission/dtos/create-permission.dto';
import { getFirstPermission } from '../../permission/data/permissions.data';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { getFirstRole, getRoles } from '../data/role.data';
import { RoleService } from './role.service';
import { Role } from '../schemas/role.schema';
import { UpdateRoleDto } from '../dtos/update-role.dto';

const permission: CreatePermissionDto = getFirstPermission();
const roles: CreateRoleDto[] = getRoles(permission);

const populate = {
    populate: jest.fn().mockImplementation().mockReturnValue(getFirstRole(permission)),
}
const find = {
    populate: jest.fn().mockImplementation().mockReturnValue({exec: jest.fn().mockImplementation().mockReturnValue(roles)}),
}
const findById = {
    exec: jest.fn().mockImplementation().mockReturnValue(getFirstRole(permission)),
    populate: jest.fn().mockImplementation().mockReturnValue({exec: jest.fn().mockImplementation().mockReturnValue(getFirstRole(permission))}),
}
const mockRepository = {
    find: () => find,
    findById: () => findById,
    findByIdAndUpdate: () => populate,
    findByIdAndDelete: () => populate,
    create: () => roles[0],
};

describe('RoleService', () => {
    let service: RoleService;
    const date = new Date();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [RoleService],
            providers: [{ provide: getModelToken(Role.name), useValue: mockRepository}],
        }).compile();

        service = app.get<RoleService>(RoleService);
    });

    it('should return roles', async () => {
        const response: any = await service.findAll(true);
        expect(response.length).toBe(2);
        expect(response[0].name).toBe('Role 1');
        expect(response[1].name).toBe('Role 2');
    });

    it('should return role', async () => {
        const response: any = await service.findOne('11111');
        expect(response.name).toBe('Role 1');
    });

    it('should create role', async () => {
        const createRoleDto: CreateRoleDto = getFirstRole(permission);
        const response: any = await service.create(createRoleDto);
        expect(response.name).toBe('Role 1');
    });

    it('should update role', async () => {
        const updateRoleDto: UpdateRoleDto = getFirstRole(permission);
        const response: any = await service.update('11111', updateRoleDto);
        expect(response.name).toBe('Role 1');
    });

    it('should delete role', async () => {
        const response: any = await service.delete('11111');
        expect(response.name).toBe('Role 1');
    });

});
