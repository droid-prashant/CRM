import { DynamicField } from "@/shared/dynamic-form/models/dynamicFields/field.model";

export const ProductFields: DynamicField[] = [
    { key: 'name', label: 'Name', type: 'text', required: true, colSpan: 4 },
    { key: 'Category', label: 'Category', type: 'text', colSpan: 4 },
    { key: 'sku', label: 'SKU', type: 'number', required: true, colSpan: 4 },
    { key: 'unitPrice', label: 'Unit Price', type: 'decimalNumber', colSpan: 4 },
    { key: 'quantityInStock', label: 'Quantity In Stock', type: 'number', required: true, colSpan: 4 },
    { key: 'isActive', label: 'Is Active', type: 'text', required: true, colSpan: 4 },
];