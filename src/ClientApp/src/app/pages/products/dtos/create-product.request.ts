export interface CreateProductRequest {
    code: string;
    name: string;
    productType: number;
    deploymentType: number;
    ownershipType: number;
    ownerPartnerId?: string | null;
    description?: string | null;
    isSubscriptionBased: boolean;
    isLicenseBased: boolean;
    isActive: boolean;
}
