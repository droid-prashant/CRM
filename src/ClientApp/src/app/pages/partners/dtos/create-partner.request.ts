export interface CreatePartnerRequest {
    name: string;
    partnerTypeId: string;
    countryId: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    remarks?: string | null;
    productIds: string[];
    isActive: boolean;
}
