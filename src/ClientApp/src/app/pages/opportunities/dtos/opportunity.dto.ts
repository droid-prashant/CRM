export interface OpportunityListQuery {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    clientId?: string;
    stageId?: string;
    ownerUserId?: string;
    status?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateOpportunityRequest {
    clientId: string;
    leadId?: string;
    productId: string;
    contactId: string;
    title: string;
    estimatedValue: number;
    currencyId: string;
    ownerUserId: string;
    expectedCloseDate?: string;
}

export interface UpdateOpportunityRequest {
    id: string;
    title: string;
    estimatedValue: number;
    ownerUserId: string;
}

export interface ChangeOpportunityStageRequest {
    stageId: string;
    remarks?: string;
    proposalDocument?: File;
}

export interface CloseOpportunityRequest {
    finalAmount?: number;
    lostReason?: string;
    closedDate: string;
    note?: string;
}

export interface CreateOpportunityActivityRequest {
    activityType: string;
    subject?: string;
    notes: string;
    activityDate?: string;
    followUpDate?: string;
}

export interface UploadProposalVersionRequest {
    description?: string;
    proposalDocument: File;
}

export interface UploadOpportunityCommercialDocumentRequest {
    documentType: 'Agreement' | 'PurchaseOrder';
    remarks?: string;
    commercialDocument: File;
}

export interface SaveOpportunityCommercialBreakdownRequest {
    currencyId: string;
    finalPayableAmount: number;
    agreementDocumentId?: string;
    agreementDate?: string;
    agreementExpiryDate?: string;
    purchaseOrderDocumentId?: string;
    purchaseOrderDate?: string;
    licenseApplicable: boolean;
    licenseAmount?: number;
    amcAmount?: number;
    amcStartDate?: string;
    amcRenewalDate?: string;
    amcExpiryDate?: string;
    subscriptionApplicable: boolean;
    subscriptionAmount?: number;
    subscriptionBillingFrequency?: string;
    subscriptionStartDate?: string;
    nextSubscriptionBillingDate?: string;
    isFinal: boolean;
    remarks?: string;
}
