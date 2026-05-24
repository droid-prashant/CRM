export type FieldType = 'text' | 'number' | 'decimalNumber' | 'textarea' | 'checkbox' | 'select' | 'multiSelect' | 'image' | 'currency' | 'radio' | 'email' | 'date';

export interface SelectOption {
    label: string;
    value: any;
    code?: string;
}

export type DynamicFieldRule = (formValue: Record<string, unknown>, mode: 'create' | 'update') => boolean;

export interface DynamicField {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: SelectOption[];
    colSpan?: number;
    section?: string;
    placeholder?: string;
    defaultValue?: unknown;
    visibleOn?: 'create' | 'update' | 'both';
    visibleWhen?: DynamicFieldRule;
    requiredWhen?: DynamicFieldRule;
    clearWhenHidden?: boolean;
}
