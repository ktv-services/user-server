import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { PermissionModule } from '../../../src/user-service/permission/permission.module';
import { Permission } from '../../../src/user-service/permission/schemas/permission.schema';
import { PermissionController } from '../../../src/user-service/permission/controllers/permission.controller';
import {PermissionService} from "../../../src/user-service/permission/services/permission.service";

describe('PermissionController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PermissionModule],
            providers: [{ provide: getModelToken(Permission.name), useValue: jest.fn() }],
        })
            .overrideProvider(PermissionController)
            .useValue(PermissionController)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/permissions')
            .expect(200)
            .expect('Hello World!');
    });
});
