import { Permission } from '../schemas/permission.schema';


export function getPermissions(): Permission[] {
    const date = new Date();
    return [
        {name: 'Permission 1', status: 'active', created: date, updated: date},
        {name: 'Permission 2', status: 'active', created: date, updated: date},
        {name: 'Permission 3', status: 'new', created: date, updated: date},
    ];
}

export function getFirstPermission(): Permission {
    const date = new Date();
    return {name: 'Permission 1', status: 'active', created: date, updated: date};
}