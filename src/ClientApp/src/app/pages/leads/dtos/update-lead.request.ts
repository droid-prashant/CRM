export interface UpdateLeadRequest {
    sourceId: string;
    categoryId: string;
    partnerId?: string | null;
    campaignName?: string | null;
    companyName: string;
    website?: string | null;
    contactPersonName: string;
    jobTitle?: string | null;
    email?: string | null;
    phone?: string | null;
    alternatePhone?: string | null;
    countryId: string;
    address?: string | null;
    industryId?: string | null;
    notes?: string | null;
    leadScore?: number | null;
    productIds: string[];
}
