export interface QualifyLeadRequest {
    qualificationRemarks?: string;
}

export interface DisqualifyLeadRequest {
    disqualificationReason: string;
    disqualificationRemarks?: string;
}

export interface ConvertLeadRequest {
    productId: string;
    clientId?: string;
    newClient?: {
        name: string;
        countryId: string;
        industryId?: string;
    };
    contactId?: string;
    newContact?: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
    };
    opportunityTitle: string;
    estimatedValue: number;
    currencyId: string;
    expectedCloseDate?: string;
    ownerUserId: string;
}

export interface AssignLeadRequest {
    assignedToUserId: string;
    remarks?: string;
}

export interface CreateLeadInteractionRequest {
    leadId: string;
    interactionType: string;
    subject?: string;
    notes: string;
    interactionDate?: string;
    nextFollowUpDate?: string;
}
