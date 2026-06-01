import { ClientListItemViewModel } from './client-list-item.view-model';

export interface ClientTimelineEntryViewModel {
    id: string;
    eventType: string;
    description: string;
    createdAt: string;
}

export interface ClientContactSummaryViewModel {
    id: string;
    fullName: string;
    designation?: string | null;
    department?: string | null;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    isPrimary: boolean;
    status: string;
}

export interface ClientProductSummaryViewModel {
    id: string;
    productId: string;
    productCode: string;
    productName: string;
    relationshipStatus: string;
    ownerUserName?: string | null;
}

export interface ClientRelatedOpportunityViewModel {
    id: string;
    opportunityNumber: string;
    title: string;
    productName?: string | null;
    stageName: string;
    estimatedValue: number;
    status: string;
}

export interface ClientRelatedRfpViewModel {
    id: string;
    rfpNumber: string;
    title: string;
    productName?: string | null;
    status: string;
    submissionDeadline?: string | null;
}

export interface ClientDocumentSummaryViewModel {
    id: string;
    fileName: string;
    documentType?: string | null;
    uploadedByUserName?: string | null;
    uploadedAt: string;
}

export interface ClientDetailViewModel extends ClientListItemViewModel {
    createdBy: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
    timelineEntries: ClientTimelineEntryViewModel[];
    timeline: ClientTimelineEntryViewModel[];
    contacts: ClientContactSummaryViewModel[];
    products: ClientProductSummaryViewModel[];
    opportunities: ClientRelatedOpportunityViewModel[];
    rfps: ClientRelatedRfpViewModel[];
    documents: ClientDocumentSummaryViewModel[];
}
