import { Permission } from '../../permission/schemas/permission.schema';
import { Role } from '../schemas/role.schema';


export function getRoles(permission: Permission): Role[] {
    const date = new Date();
    return [
        {name: 'Role 1', permissions: [permission], status: 'active', created: date, updated: date},
        {name: 'Role 2', permissions: [permission], status: 'active', created: date, updated: date},
        {name: 'Role 3', permissions: [permission], status: 'new', created: date, updated: date},
    ];
}

export function getFirstRole(permission): Role {
    const date = new Date();
    return {name: 'Role 1', permissions: [permission], status: 'active', created: date, updated: date};
}