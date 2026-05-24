import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const LeadColumns: DynamicColumn[] = [
    { field: 'leadNumber', header: 'Lead #', type: 'text', width: '150px', sortable: true },
    { field: 'companyName', header: 'Company', type: 'text', width: '220px', sortable: true },
    { field: 'contactPersonName', header: 'Contact', type: 'text', width: '200px', sortable: true },
    { field: 'email', header: 'Email', type: 'email', width: '220px', sortable: true },
    { field: 'phone', header: 'Phone', type: 'text', width: '160px', sortable: false },
    { field: 'sourceName', header: 'Source', type: 'text', width: '150px', sortable: true },
    { field: 'partnerName', header: 'Partner', type: 'text', width: '180px', sortable: true },
    { field: 'categoryName', header: 'Category', type: 'text', width: '150px', sortable: true },
    { field: 'countryName', header: 'Country', type: 'text', width: '160px', sortable: true },
    { field: 'status', header: 'Status', type: 'text', width: '130px', sortable: true },
    { field: 'productNames', header: 'Products', type: 'text', width: '260px', sortable: false }
];
