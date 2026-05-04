import { DynamicField } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export const RoleFields: DynamicField[] = [
    { key: 'name', label: 'Role Name', type: 'text', required: true, colSpan: 6, section: 'Role', placeholder: 'Sales Manager' },
    { key: 'code', label: 'Code', type: 'text', colSpan: 6, section: 'Role', placeholder: 'SALES_MANAGER' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 12, section: 'Role', placeholder: 'Describe the role responsibility' },
    { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true, visibleOn: 'update' }
];
