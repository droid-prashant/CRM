export interface LeadDetailViewModel {
    id: string;
    leadNumber: string;
    sourceId: string;
    sourceName: string;
    categoryId: string;
    categoryName: string;
    partnerId?: string;
    partnerName?: string;
    campaignName?: string;
    sourceStartDate?: string;
    sourceEndDate?: string;
    clientId?: string;
    clientContactId?: string;
    clientCode?: string;
    clientName?: string;
    clientContactName?: string;
    clientContactEmail?: string;
    clientContactPhone?: string;
    companyName: string;
    website?: string;
    contactPersonName: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    countryId: string;
    countryName: string;
    address?: string;
    industryId?: string;
    industryName?: string;
    notes?: string;
    leadScore?: number;
    status: string;
    assignedToUserId?: string;
    assignedToUserName?: string;
    assignedAt?: string;
    qualificationDate?: string;
    disqualificationReason?: string;
    convertedOpportunityId?: string;
    productInterests: LeadProductInterestViewModel[];
    timelineEntries: LeadTimelineEntryViewModel[];
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
    hasDuplicateWarning: boolean;
    duplicateWarning?: string;
}

export interface LeadProductInterestViewModel {
    productId: string;
    productCode: string;
    productName: string;
    productCategoryName?: string;
}

export interface LeadTimelineEntryViewModel {
    id: string;
    eventType: string;
    description: string;
    createdAt: string;
}
