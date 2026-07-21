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
