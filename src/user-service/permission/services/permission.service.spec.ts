import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { getModelToken } from '@nestjs/mongoose';
import { Permission } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { getFirstPermission, getPermissions } from '../data/permissions.data';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

const permissions: CreatePermissionDto[] = getPermissions();
const find = {
    exec: jest.fn().mockImplementation().mockReturnValue(permissions),
}
const findById = {
    exec: jest.fn().mockImplementation().mockReturnValue(getFirstPermission()),
}
const mockRepository = {
    find: () => find,
    findById: () => findById,
    findByIdAndUpdate: () => getFirstPermission(),
    findByIdAndDelete: () => getFirstPermission(),
    create: () => permissions[0],
};

describe('PermissionService', () => {
    let service: PermissionService;
    const date = new Date();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [PermissionService],
            providers: [{ provide: getModelToken(Permission.name), useValue: mockRepository}],
        }).compile();

        service = app.get<PermissionService>(PermissionService);
    });

    it('should return permissions', async () => {
        const response: any = await service.findAll(true);
        expect(response.length).toBe(2);
        expect(response[0].name).toBe('Permission 1');
        expect(response[1].name).toBe('Permission 2');
    });

    it('should return permission', async () => {
        const response: any = await service.findOne('11111');
        expect(response.name).toBe('Permission 1');
    });

    it('should create permission', async () => {
        const createPermissionDto: CreatePermissionDto = getFirstPermission();
        const response: any = await service.create(createPermissionDto);
        expect(response.name).toBe('Permission 1');
    });

    it('should update permission', async () => {
        const updatePermissionDto: UpdatePermissionDto = getFirstPermission();
        const response: any = await service.update('11111', updatePermissionDto);
        expect(response.name).toBe('Permission 1');
    });

    it('should delete permission', async () => {
        const response: any = await service.delete('11111');
        expect(response.name).toBe('Permission 1');
    });

});
