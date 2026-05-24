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
    },
    opportunities: {
        view: 'opportunities:view',
        create: 'opportunities:create',
        edit: 'opportunities:edit',
        delete: 'opportunities:delete',
        approve: 'opportunities:approve',
        export: 'opportunities:export'
    },
    partners: {
        view: 'partners:view',
        create: 'partners:create',
        edit: 'partners:edit',
        delete: 'partners:delete',
        approve: 'partners:approve',
        export: 'partners:export'
    }
} as const;
