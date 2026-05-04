import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const RoleColumns: DynamicColumn[] = [
    { field: 'name', header: 'Role', type: 'text', width: '200px', sortable: true },
    { field: 'code', header: 'Code', type: 'text', width: '140px', sortable: true },
    { field: 'description', header: 'Description', type: 'text', width: '320px', sortable: false },
    { field: 'userCount', header: 'Users', type: 'number', width: '110px', sortable: true },
    { field: 'isSystemRole', header: 'System', type: 'checkbox', width: '110px', sortable: true },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: true }
];
