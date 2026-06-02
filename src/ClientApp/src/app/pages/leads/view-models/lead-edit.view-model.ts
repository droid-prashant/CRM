export interface LeadEditViewModel {
    id: string;
    sourceId: string;
    categoryId: string;
    partnerId?: string;
    campaignName?: string;
    sourceStartDate?: string;
    sourceEndDate?: string;
    clientId?: string;
    clientContactId?: string;
    clientName?: string;
    clientContactName?: string;
    companyName: string;
    website?: string;
    contactPersonName: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    countryId: string;
    address?: string;
    industryId?: string;
    notes?: string;
    leadScore?: number;
    selectedProductIds: string[];
}
