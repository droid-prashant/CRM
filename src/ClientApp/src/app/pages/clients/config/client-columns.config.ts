import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const ClientColumns: DynamicColumn[] = [
    { field: 'clientCode', header: 'Code', type: 'text', width: '140px', sortable: true },
    { field: 'name', header: 'Client', type: 'text', width: '240px', sortable: true },
    { field: 'countryName', header: 'Country', type: 'text', width: '160px', sortable: true },
    { field: 'industryName', header: 'Industry', type: 'text', width: '180px', sortable: true },
    { field: 'accountOwnerUserName', header: 'Account Owner', type: 'text', width: '190px', sortable: true },
    { field: 'contactCount', header: 'Contacts', type: 'number', width: '110px', sortable: false },
    { field: 'productCount', header: 'Products', type: 'number', width: '110px', sortable: false },
    { field: 'statusName', header: 'Status', type: 'text', width: '120px', sortable: true },
    { field: 'createdAtDisplay', header: 'Created', type: 'text', width: '140px', sortable: true },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: false }
];
