export interface CreateProductRequest {
    code: string;
    name: string;
    productTypeId: string;
    deploymentTypeId: string;
    ownershipTypeId: string;
    ownerPartnerId?: string | null;
    description?: string | null;
    isSubscriptionBased: boolean;
    isLicenseBased: boolean;
    isActive: boolean;
}
