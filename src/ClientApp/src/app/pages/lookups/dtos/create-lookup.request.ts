export interface CreateLookupRequest {
    lookupId: number;
    name: string;
    description?: string | null;
    order?: number | null;
    dialingCode?: string | null;
    defaultCurrencyId?: string | null;
}
