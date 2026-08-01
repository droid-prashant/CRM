export interface OpportunityListItemViewModel {
    id: string;
    opportunityNumber: string;
    title: string;
    clientId: string;
    clientName: string;
    productId: string;
    productName: string;
    contactId: string;
    contactName: string;
    leadId?: string;
    leadNumber?: string;
    stageId: string;
    stageName: string;
    stageSequence: number;
    isFinalStage: boolean;
    estimatedValue: number;
    currencyId: string;
    currencyCode: string;
    ownerUserId: string;
    ownerUserName?: string;
    expectedCloseDate?: string;
    status: string;
    finalAmount?: number;
    closedDate?: string;
    closingNote?: string;
    lostReason?: string;
    hasProposalDocument: boolean;
    proposalDocumentId?: string;
    proposalDocumentFileName?: string;
    proposalDocumentUploadedOn?: string;
    proposalVersionNumber?: number;
    proposalIsLastCommunicated?: boolean;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface ClientLookupViewModel {
    id: string;
    name: string;
    country: string;
}

export interface ContactLookupViewModel {
    id: string;
    clientId: string;
    fullName: string;
    email?: string;
}

export interface LookupViewModel {
    id: string;
    name: string;
    code: string;
    sequence?: number;
    isFinal?: boolean;
    isWonStage?: boolean;
    isLostStage?: boolean;
}

export interface ProductLookupViewModel {
    id: string;
    name: string;
    isLicenseBased: boolean;
    isSubscriptionBased: boolean;
}

export interface LeadLookupViewModel {
    id: string;
    leadNumber: string;
    companyName: string;
    contactPersonName: string;
    status: string;
}

export interface OpportunityUserLookupViewModel {
    id: string;
    fullName: string;
    isActive?: boolean;
}

export interface CurrencyLookupViewModel {
    id: string;
    code: string;
    name: string;
}

export interface OpportunityLookupBundle {
    clients: ClientLookupViewModel[];
    contacts: ContactLookupViewModel[];
    products: ProductLookupViewModel[];
    leads: LeadLookupViewModel[];
    ownerUsers: OpportunityUserLookupViewModel[];
    currencies: CurrencyLookupViewModel[];
    stages: LookupViewModel[];
    statuses: LookupViewModel[];
}

export interface OpportunityPipelineStageViewModel {
    stageId: string;
    stageName: string;
    sequence: number;
    isFinal: boolean;
    isWonStage: boolean;
    isLostStage: boolean;
    opportunities: OpportunityListItemViewModel[];
}

export interface OpportunityStageHistoryViewModel {
    id: string;
    opportunityId: string;
    fromStageName?: string;
    toStageName: string;
    remarks?: string;
    changedByUserName?: string;
    changedAt: string;
}

export interface OpportunityActivityViewModel {
    id: string;
    opportunityId: string;
    activityType: string;
    subject?: string;
    notes: string;
    activityDate: string;
    followUpDate?: string;
    createdByUserName?: string;
}

export interface ProposalVersionViewModel {
    documentId: string;
    versionNumber: number;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedByUserId: string;
    uploadedByUserName?: string;
    uploadedOn: string;
    description?: string;
    isLastCommunicated: boolean;
}

export interface OpportunityDocumentViewModel {
    id: string;
    opportunityId: string;
    documentType: string;
    fileName: string;
    storedFileName: string;
    filePath: string;
    contentType: string;
    fileSize: number;
    uploadedByUserId: string;
    uploadedByUserName?: string;
    uploadedOn: string;
    versionNumber: number;
    description?: string;
    isLastCommunicated: boolean;
}

export interface OpportunityCommercialDocumentViewModel {
    id: string;
    opportunityId: string;
    documentType: 'Agreement' | 'PurchaseOrder' | string;
    fileName: string;
    storedFileName: string;
    filePath: string;
    contentType: string;
    fileSize: number;
    remarks?: string;
    uploadedByUserId: string;
    uploadedByUserName?: string;
    uploadedOn: string;
}

export interface OpportunityCommercialBreakdownViewModel {
    id: string;
    opportunityId: string;
    currencyId: string;
    currencyCode: string;
    finalPayableAmount: number;
    agreementDocumentId?: string;
    agreementDocumentFileName?: string;
    agreementDate?: string;
    agreementExpiryDate?: string;
    purchaseOrderDocumentId?: string;
    purchaseOrderDocumentFileName?: string;
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
    updatedByUserId: string;
    updatedByUserName?: string;
    updatedOn: string;
}
