import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '@/core/http/api-url';

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
}

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

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
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
    licenseFee?: number;
    amcFee?: number;
    implementationFee?: number;
    subscriptionFee?: number;
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

export interface ProductLookupViewModel {
    id: string;
    name: string;
    isLicenseBased: boolean;
    isSubscriptionBased: boolean;
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

@Injectable({ providedIn: 'root' })
export class OpportunityApiService {
    private readonly opportunitiesUrl = apiUrl('/opportunities');

    constructor(private readonly http: HttpClient) {}

    getOpportunities(query: OpportunityListQuery): Observable<PagedResult<OpportunityListItemViewModel>> {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<PagedResult<OpportunityListItemViewModel>>(this.opportunitiesUrl, { params });
    }

    getPipeline(query: OpportunityListQuery): Observable<OpportunityPipelineStageViewModel[]> {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<OpportunityPipelineStageViewModel[]>(`${this.opportunitiesUrl}/pipeline`, { params });
    }

    createOpportunity(request: CreateOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.post<OpportunityListItemViewModel>(this.opportunitiesUrl, request);
    }

    updateOpportunity(id: string, request: UpdateOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.put<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}`, request);
    }

    changeStage(id: string, request: ChangeOpportunityStageRequest): Observable<OpportunityListItemViewModel> {
        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/stage`, request);
    }

    closeAsWon(id: string, request: CloseOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/won`, request);
    }

    closeAsLost(id: string, request: CloseOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/lost`, request);
    }

    getStageHistory(id: string): Observable<OpportunityStageHistoryViewModel[]> {
        return this.http.get<OpportunityStageHistoryViewModel[]>(`${this.opportunitiesUrl}/${id}/stage-history`);
    }

    getActivities(id: string): Observable<OpportunityActivityViewModel[]> {
        return this.http.get<OpportunityActivityViewModel[]>(`${this.opportunitiesUrl}/${id}/activities`);
    }

    createActivity(id: string, request: CreateOpportunityActivityRequest): Observable<OpportunityActivityViewModel> {
        return this.http.post<OpportunityActivityViewModel>(`${this.opportunitiesUrl}/${id}/activities`, request);
    }

    getLookupBundle(): Observable<OpportunityLookupBundle> {
        return this.http.get<OpportunityLookupBundle>(`${this.opportunitiesUrl}/lookups`);
    }
}
