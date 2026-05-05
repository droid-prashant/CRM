export const Permissions = {
    users: {
        view: 'users:view',
        create: 'users:create',
        edit: 'users:edit',
        delete: 'users:delete',
        export: 'users:export'
    },
    roles: {
        view: 'roles:view',
        create: 'roles:create',
        edit: 'roles:edit',
        delete: 'roles:delete',
        export: 'roles:export'
    },
    permissions: {
        view: 'permissions:view',
        edit: 'permissions:edit'
    },
    leads: {
        view: 'leads:view',
        create: 'leads:create',
        edit: 'leads:edit',
        delete: 'leads:delete',
        approve: 'leads:approve',
        export: 'leads:export'
    }
} as const;
