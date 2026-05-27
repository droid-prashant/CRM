export interface PartnerListItemViewModel {
    id: string;
    code: string;
    name: string;
    partnerTypeId: string;
    partnerTypeName: string;
    countryId: string;
    countryName: string;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    remarks?: string;
    productIds: string[];
    isActive: boolean;
    createdAt: string;
}
