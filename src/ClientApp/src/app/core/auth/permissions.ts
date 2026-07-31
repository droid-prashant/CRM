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
    clients: {
        view: 'clients:view',
        create: 'clients:create',
        edit: 'clients:edit',
        delete: 'clients:delete',
        approve: 'clients:approve',
        export: 'clients:export'
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
    notifications: {
        view: 'notifications:view',
        create: 'notifications:create',
        edit: 'notifications:edit',
        delete: 'notifications:delete',
        approve: 'notifications:approve',
        export: 'notifications:export'
    },
    partners: {
        view: 'partners:view',
        create: 'partners:create',
        edit: 'partners:edit',
        delete: 'partners:delete',
        approve: 'partners:approve',
        export: 'partners:export'
    },
    products: {
        view: 'products:view',
        create: 'products:create',
        edit: 'products:edit',
        delete: 'products:delete',
        approve: 'products:approve',
        export: 'products:export'
    }
} as const;
