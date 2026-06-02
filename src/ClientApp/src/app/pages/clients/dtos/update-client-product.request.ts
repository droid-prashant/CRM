export interface UpdateClientProductRequest {
    productId: string;
    relationshipStatus: string;
    opportunityId?: string | null;
    ownerUserId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    notes?: string | null;
}
