import { HttpClient } from '@angular/common/http';
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
    stageName: string;
    estimatedValue: number;
    currencyId: string;
    currencyCode: string;
    ownerUserId: string;
    ownerUserName?: string;
    expectedCloseDate?: string;
    status: string;
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
    isActive: boolean;
}

export interface CurrencyLookupViewModel {
    id: string;
    code: string;
    name: string;
}

export interface OpportunityLookupBundle {
    clients: ClientLookupViewModel[];
    contacts: ContactLookupViewModel[];
    products: LookupViewModel[];
    leads: LeadLookupViewModel[];
    ownerUsers: OpportunityUserLookupViewModel[];
    currencies: CurrencyLookupViewModel[];
}

@Injectable({ providedIn: 'root' })
export class OpportunityApiService {
    private readonly opportunitiesUrl = apiUrl('/opportunities');

    constructor(private readonly http: HttpClient) {}

    getOpportunities(): Observable<OpportunityListItemViewModel[]> {
        return this.http.get<OpportunityListItemViewModel[]>(this.opportunitiesUrl);
    }

    createOpportunity(request: CreateOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.post<OpportunityListItemViewModel>(this.opportunitiesUrl, request);
    }

    getLookupBundle(): Observable<OpportunityLookupBundle> {
        return this.http.get<OpportunityLookupBundle>(`${this.opportunitiesUrl}/lookups`);
    }
}
