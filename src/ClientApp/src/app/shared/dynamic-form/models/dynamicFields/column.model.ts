export interface DynamicColumn {
    field: string;
    header: string;
    type?: 'text' | 'number' | 'decimalNumber' | 'textarea' | 'checkbox' | 'select' | 'image' | 'currency' | 'radio' | 'email';
    format?: string;
    width?: string;
    sortable: boolean;
}
