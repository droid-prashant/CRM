import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const LookupColumns: DynamicColumn[] = [
    { field: 'lookupName', header: 'Type', type: 'text', width: '180px', sortable: true },
    { field: 'name', header: 'Name', type: 'text', width: '220px', sortable: true },
    { field: 'description', header: 'Description', type: 'text', width: '320px', sortable: false },
    { field: 'order', header: 'Order', type: 'number', width: '110px', sortable: true },
    { field: 'dialingCode', header: 'Dialing Code', type: 'text', width: '130px', sortable: false },
    { field: 'defaultCurrencyName', header: 'Currency', type: 'text', width: '160px', sortable: false },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: true }
];
