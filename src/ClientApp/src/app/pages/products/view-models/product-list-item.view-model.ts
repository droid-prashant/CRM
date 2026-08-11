export interface ProductListItemViewModel {
    id: string;
    code: string;
    name: string;
    productTypeId: string;
    productTypeName: string;
    deploymentTypeId: string;
    deploymentTypeName: string;
    ownershipTypeId: string;
    ownershipTypeName: string;
    ownerPartnerId?: string | null;
    ownerPartnerName?: string | null;
    description?: string | null;
    isSubscriptionBased: boolean;
    isLicenseBased: boolean;
    isActive: boolean;
    createdAt: string;
}
