export interface LookupViewModel {
    id: string;
    name: string;
    code?: string;
    partnerTypeCode?: string;
    productIds?: string[];
    ownershipTypeCode?: string;
    ownerPartnerId?: string | null;
    canOwnProducts?: boolean;
    canSellInHouseProducts?: boolean;
}
