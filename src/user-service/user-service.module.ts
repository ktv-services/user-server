import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthUserModule } from './auth-user/auth-user.module';

@Module({
    imports: [
        AuthUserModule,
        RoleModule,
        PermissionModule
    ],
    controllers: [],
    providers: [],
})
export class UserServiceModule {}
