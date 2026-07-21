export type FieldType = 'text' | 'number' | 'decimalNumber' | 'textarea' | 'checkbox' | 'select' | 'multiSelect' | 'image' | 'currency' | 'radio' | 'email' | 'date';

export interface SelectOption {
    label: string;
    value: any;
    code?: string;
    partnerTypeCode?: string;
    productIds?: string[];
    ownershipType?: number;
    ownerPartnerId?: string | null;
    clientId?: string;
    canOwnProducts?: boolean;
    canSellInHouseProducts?: boolean;
    dialingCode?: string;
}

export type DynamicFieldRule = (formValue: Record<string, unknown>, mode: 'create' | 'update') => boolean;
export type DynamicFieldOptionFilter = (option: SelectOption, formValue: Record<string, unknown>, mode: 'create' | 'update') => boolean;
export type DynamicFieldTextResolver = (formValue: Record<string, unknown>, mode: 'create' | 'update') => string;

export interface DynamicField {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: SelectOption[];
    colSpan?: number;
    section?: string;
    placeholder?: string;
    inputPrefix?: string | DynamicFieldTextResolver;
    defaultValue?: unknown;
    visibleOn?: 'create' | 'update' | 'both';
    visibleWhen?: DynamicFieldRule;
    requiredWhen?: DynamicFieldRule;
    optionFilter?: DynamicFieldOptionFilter;
    clearWhenHidden?: boolean;
}
