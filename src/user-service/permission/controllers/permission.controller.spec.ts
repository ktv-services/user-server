import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from '../services/permission.service';

describe('AuthController', () => {
    let appController: PermissionController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [PermissionController],
            providers: [PermissionService],
        }).compile();

        appController = app.get<PermissionController>(PermissionController);
    });
});
