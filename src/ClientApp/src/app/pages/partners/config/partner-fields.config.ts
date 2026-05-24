import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export interface PartnerFieldOptions {
    partnerTypes: SelectOption[];
    countries: SelectOption[];
}

export function buildPartnerFields(options: PartnerFieldOptions): DynamicField[] {
    return [
        { key: 'name', label: 'Partner Name', type: 'text', required: true, colSpan: 4, section: 'Partner', placeholder: 'Partner organization or individual' },
        { key: 'partnerTypeId', label: 'Partner Type', type: 'select', required: true, options: options.partnerTypes, colSpan: 4, section: 'Partner', placeholder: 'Select partner type' },
        { key: 'countryId', label: 'Country', type: 'select', required: true, options: options.countries, colSpan: 4, section: 'Partner', placeholder: 'Select country' },
        { key: 'contactPerson', label: 'Contact Person', type: 'text', colSpan: 4, section: 'Contact', placeholder: 'Primary contact' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text', colSpan: 4, section: 'Contact', placeholder: 'Phone number' },
        { key: 'email', label: 'Email', type: 'email', colSpan: 4, section: 'Contact', placeholder: 'name@example.com' },
        { key: 'address', label: 'Address', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true, visibleOn: 'update' }
    ];
}
