export interface ClientProductViewModel {
    id: string;
    clientId: string;
    productId: string;
    productCode: string;
    productName: string;
    relationshipStatus: string;
    opportunityId?: string | null;
    opportunityNumber?: string | null;
    opportunityTitle?: string | null;
    ownerUserId?: string | null;
    ownerUserName?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    notes?: string | null;
}
