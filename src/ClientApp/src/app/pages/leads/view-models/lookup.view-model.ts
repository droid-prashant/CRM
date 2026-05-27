export interface LookupViewModel {
    id: string;
    name: string;
    code?: string;
    partnerTypeCode?: string;
    productIds?: string[];
    ownershipType?: number;
    ownerPartnerId?: string | null;
    canOwnProducts?: boolean;
    canSellInHouseProducts?: boolean;
}
