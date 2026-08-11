import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

const COUNTRY_LOOKUP_ID = 2;

export function buildLookupFields(lookupTypes: SelectOption[], defaultLookupId?: number | null): DynamicField[] {
    return [
        { key: 'lookupId', label: 'Lookup Type', type: 'select', required: true, options: lookupTypes, colSpan: 12, section: 'Lookup', placeholder: 'Select lookup type', visibleOn: 'create', defaultValue: defaultLookupId ?? undefined },
        { key: 'name', label: 'Name', type: 'text', required: true, colSpan: 6, section: 'Lookup', placeholder: 'Enter name' },
        { key: 'order', label: 'Order', type: 'number', colSpan: 6, section: 'Lookup', placeholder: '0' },
        { key: 'dialingCode', label: 'Dialing Code', type: 'text', colSpan: 6, section: 'Lookup', placeholder: '+977', maxLength: 10, visibleWhen: (formValue) => Number(formValue['lookupId']) === COUNTRY_LOOKUP_ID },
        { key: 'description', label: 'Description', type: 'textarea', colSpan: 12, section: 'Lookup', placeholder: 'Optional description' },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true, visibleOn: 'update' }
    ];
}
