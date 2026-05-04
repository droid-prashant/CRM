import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export function buildUserFields(roles: SelectOption[]): DynamicField[] {
    return [
        { key: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6, section: 'Profile', placeholder: 'First name' },
        { key: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6, section: 'Profile', placeholder: 'Last name' },
        { key: 'email', label: 'Email', type: 'email', required: true, colSpan: 6, section: 'Account', placeholder: 'name@company.com' },
        { key: 'username', label: 'Username', type: 'text', required: true, colSpan: 6, section: 'Account', placeholder: 'Username' },
        { key: 'password', label: 'Temporary Password', type: 'text', required: true, colSpan: 12, section: 'Account', placeholder: 'Temporary password' },
        { key: 'roleIds', label: 'Roles', type: 'multiSelect', required: true, options: roles, colSpan: 12, section: 'Access', placeholder: 'Select roles' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text', colSpan: 4, section: 'Organization', placeholder: 'Phone number' },
        { key: 'departmentId', label: 'Department Id', type: 'text', colSpan: 4, section: 'Organization', placeholder: 'Optional department id' },
        { key: 'managerId', label: 'Manager Id', type: 'text', colSpan: 4, section: 'Organization', placeholder: 'Optional manager user id' },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true }
    ];
}
