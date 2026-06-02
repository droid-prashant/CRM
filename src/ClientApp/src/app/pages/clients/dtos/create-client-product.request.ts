export interface CreateClientProductRequest {
    clientId: string;
    productId: string;
    relationshipStatus: string;
    opportunityId?: string | null;
    ownerUserId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    notes?: string | null;
}
