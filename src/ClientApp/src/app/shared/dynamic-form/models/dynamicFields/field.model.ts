export type FieldType = 'text' | 'number' | 'decimalNumber' | 'textarea' | 'checkbox' | 'select' | 'multiSelect' | 'image' | 'currency' | 'radio' | 'email';

export interface SelectOption {
    label: string;
    value: any;
}

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
}
