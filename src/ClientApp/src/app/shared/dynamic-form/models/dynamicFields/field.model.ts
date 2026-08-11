import { ValidatorFn } from '@angular/forms';

export type FieldType = 'text' | 'number' | 'decimalNumber' | 'textarea' | 'checkbox' | 'select' | 'multiSelect' | 'image' | 'currency' | 'radio' | 'email' | 'date';

export interface SelectOption {
    label: string;
    value: any;
    code?: string;
    partnerTypeCode?: string;
    productIds?: string[];
    ownershipTypeCode?: string;
    ownerPartnerId?: string | null;
    clientId?: string;
    canOwnProducts?: boolean;
    canSellInHouseProducts?: boolean;
}

export type DynamicFieldRule = (formValue: Record<string, unknown>, mode: 'create' | 'update') => boolean;
export type DynamicFieldOptionFilter = (option: SelectOption, formValue: Record<string, unknown>, mode: 'create' | 'update') => boolean;

export interface DynamicField {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    pattern?: string | RegExp;
    patternMessage?: string;
    digitsOnly?: boolean;
    maxLength?: number;
    inputMode?: string;
    options?: SelectOption[];
    colSpan?: number;
    section?: string;
    placeholder?: string;
    defaultValue?: unknown;
    visibleOn?: 'create' | 'update' | 'both';
    visibleWhen?: DynamicFieldRule;
    requiredWhen?: DynamicFieldRule;
    optionFilter?: DynamicFieldOptionFilter;
    clearWhenHidden?: boolean;
    validators?: ValidatorFn[];
    validationMessages?: Record<string, string>;
}
