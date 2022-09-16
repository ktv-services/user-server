import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
    let appController: AuthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        appController = app.get<AuthController>(AuthController);
    });
});
