import { LookupViewModel } from './lookup.view-model';

export interface LeadLookupBundle {
    sources: LookupViewModel[];
    categories: LookupViewModel[];
    partners: LookupViewModel[];
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    products: LookupViewModel[];
    clients: ClientLookupViewModel[];
    contacts: ContactLookupViewModel[];
}

export interface LeadQualificationResultViewModel {
    leadId: string;
    leadNumber: string;
    status: string;
    qualificationDate?: string;
    disqualificationReason?: string;
    convertToOpportunityAllowed: boolean;
}

export interface LeadConversionViewModel {
    leadId: string;
    leadNumber: string;
    companyName: string;
    contactPersonName: string;
    email?: string;
    phone?: string;
    selectedClientId?: string;
    selectedContactId?: string;
    productInterests: { productId: string; productCode: string; productName: string; productCategoryName?: string }[];
    existingClients: ClientLookupViewModel[];
    existingContacts: ContactLookupViewModel[];
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    currencies: CurrencyLookupViewModel[];
    ownerUsers: LeadUserLookupViewModel[];
    defaultOwnerUserId?: string;
    defaultOwnerUserName?: string;
    defaultCurrencyId?: string | null;
    canConvert: boolean;
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

export interface CurrencyLookupViewModel {
    id: string;
    code: string;
    name: string;
}

export interface LeadUserLookupViewModel {
    id: string;
    fullName: string;
}

export interface OpportunityCreatedViewModel {
    opportunityId: string;
    opportunityNumber: string;
    title: string;
    clientName: string;
    productName: string;
    estimatedValue: number;
    ownerUserName?: string;
    stage: string;
    createdAt: string;
}

export interface LeadAssignmentResultViewModel {
    leadId: string;
    leadNumber: string;
    status: string;
    assignedToUserId: string;
    assignedToUserName?: string;
    assignedAt: string;
}

export interface LeadInteractionViewModel {
    id: string;
    leadId: string;
    interactionType: string;
    subject?: string;
    notes: string;
    interactionDate: string;
    nextFollowUpDate?: string;
    createdByUserName?: string;
}

export interface DeletedLeadLogViewModel {
    id: string;
    leadNumber: string;
    companyName: string;
    contactPersonName: string;
    email?: string;
    phone?: string;
    sourceName: string;
    categoryName: string;
    countryName: string;
    status: string;
    productNames: string;
    createdAt: string;
    createdBy: string;
    deletedBy?: string;
    deletedByUserName?: string;
    deletedOn?: string;
}
