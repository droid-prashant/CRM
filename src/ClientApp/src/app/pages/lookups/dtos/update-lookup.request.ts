export interface UpdateLookupRequest {
    name: string;
    description?: string | null;
    order: number;
    isActive: boolean;
    dialingCode?: string | null;
    defaultCurrencyId?: string | null;
}
