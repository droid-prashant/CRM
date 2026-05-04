import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const UserColumns: DynamicColumn[] = [
    { field: 'fullName', header: 'Name', type: 'text', width: '220px', sortable: true },
    { field: 'username', header: 'Username', type: 'text', width: '180px', sortable: true },
    { field: 'email', header: 'Email', type: 'email', width: '240px', sortable: true },
    { field: 'rolesDisplay', header: 'Roles', type: 'text', width: '240px', sortable: false },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: true }
];
