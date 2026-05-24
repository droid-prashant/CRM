import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const PartnerColumns: DynamicColumn[] = [
    { field: 'name', header: 'Partner', type: 'text', width: '220px', sortable: true },
    { field: 'partnerTypeName', header: 'Type', type: 'text', width: '160px', sortable: true },
    { field: 'countryName', header: 'Country', type: 'text', width: '160px', sortable: true },
    { field: 'contactPerson', header: 'Contact', type: 'text', width: '180px', sortable: true },
    { field: 'phoneNumber', header: 'Phone', type: 'text', width: '160px', sortable: false },
    { field: 'email', header: 'Email', type: 'email', width: '220px', sortable: true },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: true }
];
