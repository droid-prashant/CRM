export interface ProductListItemViewModel {
    id: string;
    code: string;
    name: string;
    productType: number;
    deploymentType: number;
    ownershipType: number;
    ownershipTypeName: string;
    ownerPartnerId?: string | null;
    ownerPartnerName?: string | null;
    description?: string | null;
    isSubscriptionBased: boolean;
    isLicenseBased: boolean;
    isActive: boolean;
    createdAt: string;
}
