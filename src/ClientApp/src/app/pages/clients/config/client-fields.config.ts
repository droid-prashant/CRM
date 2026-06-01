import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export interface ClientFieldOptions {
    clientTypes: SelectOption[];
    countries: SelectOption[];
    industries: SelectOption[];
    accountOwners: SelectOption[];
    statuses: SelectOption[];
}

export function buildClientFields(options: ClientFieldOptions): DynamicField[] {
    return [
        { key: 'name', label: 'Client Name', type: 'text', required: true, colSpan: 4, section: 'Client', placeholder: 'Organization name' },
        { key: 'shortName', label: 'Short Name', type: 'text', colSpan: 4, section: 'Client', placeholder: 'Optional display name' },
        { key: 'clientTypeId', label: 'Client Type', type: 'select', options: options.clientTypes, colSpan: 4, section: 'Client', placeholder: 'Select client type' },
        { key: 'countryId', label: 'Country', type: 'select', required: true, options: options.countries, colSpan: 4, section: 'Classification', placeholder: 'Select country' },
        { key: 'industryId', label: 'Industry', type: 'select', options: options.industries, colSpan: 4, section: 'Classification', placeholder: 'Select industry' },
        { key: 'accountOwnerUserId', label: 'Account Owner', type: 'select', options: options.accountOwners, colSpan: 4, section: 'Ownership', placeholder: 'Select account owner' },
        { key: 'website', label: 'Website', type: 'text', colSpan: 4, section: 'Organization Details', placeholder: 'https://example.com' },
        { key: 'taxNumber', label: 'Tax Number', type: 'text', colSpan: 4, section: 'Organization Details' },
        { key: 'registrationNumber', label: 'Registration Number', type: 'text', colSpan: 4, section: 'Organization Details' },
        { key: 'address', label: 'Address', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'notes', label: 'Notes', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'status', label: 'Status', type: 'select', options: options.statuses, colSpan: 6, section: 'Status', defaultValue: 1, visibleOn: 'update' },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 6, section: 'Status', defaultValue: true, visibleOn: 'update' }
    ];
}
