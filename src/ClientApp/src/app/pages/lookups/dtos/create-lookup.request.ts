export interface CreateLookupRequest {
    lookupId: number;
    name: string;
    description?: string | null;
    order?: number | null;
}
