import { DynamicColumn } from "@/shared/dynamic-form/models/dynamicFields/column.model";
import { DynamicField } from "@/shared/dynamic-form/models/dynamicFields/field.model";

export const ProductColumnTypeMap: Record<string, Partial<DynamicColumn & DynamicField>> = {
  name: { type: 'text', colSpan: 4, width: '200px', sortable: true, label: 'Name' },
  category: { type: 'text', colSpan: 4, width: '200px', sortable: true, label: 'Category' },
  sku: { type: 'number', colSpan: 4, sortable:true, label: 'SKU' },
  unitPrice: { type: 'decimalNumber', colSpan: 4, width: '200px', sortable: true, label: 'Unit Price' },
  quantityInStock: { type: 'number', colSpan: 4, width: '180px', sortable: true, label: 'Quantity In Stock' },
  isActive: { type: 'text', colSpan: 4, sortable:true, label: 'Is Active' },
};
