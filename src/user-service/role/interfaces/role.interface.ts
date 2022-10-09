import { PermissionInterface } from '../../permission/interfaces/permission.interface';

export interface RoleInterface {
    name: string;
    status: string;
    permissions?: PermissionInterface[];
    created: Date;
    updated: Date;
}
