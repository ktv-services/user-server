import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('AuthController', () => {
    let appController: RoleController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [RoleService],
        }).compile();

        appController = app.get<RoleController>(RoleController);
    });
});
