import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';

export const ProductColumns: DynamicColumn[] = [
    { field: 'code', header: 'Code', type: 'text', width: '150px', sortable: true },
    { field: 'name', header: 'Product', type: 'text', width: '240px', sortable: true },
    { field: 'productTypeName', header: 'Type', type: 'text', width: '160px', sortable: true },
    { field: 'deploymentTypeName', header: 'Deployment', type: 'text', width: '170px', sortable: true },
    { field: 'ownershipTypeName', header: 'Ownership', type: 'text', width: '150px', sortable: true },
    { field: 'ownerPartnerName', header: 'Partner', type: 'text', width: '220px', sortable: true },
    { field: 'isSubscriptionBased', header: 'Subscription', type: 'checkbox', width: '130px', sortable: true },
    { field: 'isLicenseBased', header: 'License', type: 'checkbox', width: '110px', sortable: true },
    { field: 'description', header: 'Description', type: 'text', width: '320px', sortable: false },
    { field: 'isActive', header: 'Active', type: 'checkbox', width: '110px', sortable: true }
];
