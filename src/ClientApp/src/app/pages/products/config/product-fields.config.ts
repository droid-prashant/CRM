import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export interface ProductFieldOptions {
    productTypes: SelectOption[];
    deploymentTypes: SelectOption[];
    ownershipTypes: SelectOption[];
    ownerPartners: SelectOption[];
}

export function buildProductFields(options: ProductFieldOptions): DynamicField[] {
    const isPartnerOwned = (formValue: Record<string, unknown>): boolean => Number(formValue['ownershipType']) === 2;

    return [
        { key: 'code', label: 'Product Code', type: 'text', required: true, colSpan: 4, section: 'Product', placeholder: 'CRM-CORE' },
        { key: 'name', label: 'Product Name', type: 'text', required: true, colSpan: 4, section: 'Product', placeholder: 'Product or service name' },
        { key: 'productType', label: 'Product Type', type: 'select', required: true, options: options.productTypes, colSpan: 4, section: 'Product', placeholder: 'Select type' },
        { key: 'deploymentType', label: 'Deployment Type', type: 'select', required: true, options: options.deploymentTypes, colSpan: 4, section: 'Delivery', placeholder: 'Select deployment' },
        { key: 'ownershipType', label: 'Ownership', type: 'select', required: true, options: options.ownershipTypes, colSpan: 4, section: 'Ownership', placeholder: 'Select ownership', defaultValue: 1 },
        { key: 'ownerPartnerId', label: 'Owner Partner', type: 'select', options: options.ownerPartners, colSpan: 4, section: 'Ownership', placeholder: 'Select owner partner', visibleWhen: isPartnerOwned, requiredWhen: isPartnerOwned },
        { key: 'description', label: 'Description', type: 'textarea', colSpan: 8, section: 'Delivery', placeholder: 'Short product description' },
        {
            key: 'businessModel',
            label: 'Business Model',
            type: 'radio',
            required: true,
            colSpan: 12,
            section: 'Business Model',
            options: [
                { label: 'Subscription-based', value: 'subscription' },
                { label: 'License-based', value: 'license' }
            ]
        },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true, visibleOn: 'update' }
    ];
}
