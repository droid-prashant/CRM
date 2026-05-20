import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CreateLeadRequest } from '../dtos/create-lead.request';
import { UpdateLeadRequest } from '../dtos/update-lead.request';
import { LeadDetailViewModel } from '../view-models/lead-detail.view-model';
import { LeadEditViewModel } from '../view-models/lead-edit.view-model';
import { LeadListItemViewModel } from '../view-models/lead-list-item.view-model';
import { LookupViewModel } from '../view-models/lookup.view-model';
import { LeadEndpointService } from './lead.endpoint.service';

export interface LeadLookupBundle {
    sources: LookupViewModel[];
    categories: LookupViewModel[];
    partners: LookupViewModel[];
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    products: LookupViewModel[];
}

export interface QualifyLeadRequest {
    qualificationRemarks?: string;
}

export interface DisqualifyLeadRequest {
    disqualificationReason: string;
    disqualificationRemarks?: string;
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
    productInterests: { productId: string; productCode: string; productName: string; productCategoryName?: string }[];
    existingClients: ClientLookupViewModel[];
    existingContacts: ContactLookupViewModel[];
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    currencies: CurrencyLookupViewModel[];
    ownerUsers: LeadUserLookupViewModel[];
    defaultOwnerUserId?: string;
    defaultOwnerUserName?: string;
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

export interface AssignLeadRequest {
    assignedToUserId: string;
    remarks?: string;
}

export interface LeadAssignmentResultViewModel {
    leadId: string;
    leadNumber: string;
    status: string;
    assignedToUserId: string;
    assignedToUserName?: string;
    assignedAt: string;
}

export interface CreateLeadInteractionRequest {
    leadId: string;
    interactionType: string;
    subject?: string;
    notes: string;
    interactionDate?: string;
    nextFollowUpDate?: string;
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

@Injectable({ providedIn: 'root' })
export class LeadApiService {
    constructor(
        private readonly http: HttpClient,
        private readonly endpoints: LeadEndpointService
    ) {}

    getLeads(): Observable<LeadListItemViewModel[]> {
        return this.http.get<LeadListItemViewModel[]>(this.endpoints.leads);
    }

    getLead(id: string): Observable<LeadDetailViewModel> {
        return this.http.get<LeadDetailViewModel>(`${this.endpoints.leads}/${id}`);
    }

    getLeadForEdit(id: string): Observable<LeadEditViewModel> {
        return this.http.get<LeadEditViewModel>(`${this.endpoints.leads}/${id}/edit`);
    }

    createLead(request: CreateLeadRequest): Observable<LeadDetailViewModel> {
        return this.http.post<LeadDetailViewModel>(this.endpoints.leads, request);
    }

    updateLead(id: string, request: UpdateLeadRequest): Observable<LeadDetailViewModel> {
        return this.http.put<LeadDetailViewModel>(`${this.endpoints.leads}/${id}`, request);
    }

    qualifyLead(id: string, request: QualifyLeadRequest): Observable<LeadQualificationResultViewModel> {
        return this.http.patch<LeadQualificationResultViewModel>(`${this.endpoints.leads}/${id}/qualify`, request);
    }

    disqualifyLead(id: string, request: DisqualifyLeadRequest): Observable<LeadQualificationResultViewModel> {
        return this.http.patch<LeadQualificationResultViewModel>(`${this.endpoints.leads}/${id}/disqualify`, request);
    }

    getLeadConversion(id: string): Observable<LeadConversionViewModel> {
        return this.http.get<LeadConversionViewModel>(`${this.endpoints.leads}/${id}/conversion`);
    }

    convertLead(id: string, request: ConvertLeadRequest): Observable<OpportunityCreatedViewModel> {
        return this.http.post<OpportunityCreatedViewModel>(`${this.endpoints.leads}/${id}/convert`, request);
    }

    assignLead(id: string, request: AssignLeadRequest): Observable<LeadAssignmentResultViewModel> {
        return this.http.patch<LeadAssignmentResultViewModel>(`${this.endpoints.leads}/${id}/assign`, request);
    }

    getLeadInteractions(id: string): Observable<LeadInteractionViewModel[]> {
        return this.http.get<LeadInteractionViewModel[]>(`${this.endpoints.leads}/${id}/interactions`);
    }

    createLeadInteraction(id: string, request: CreateLeadInteractionRequest): Observable<LeadInteractionViewModel> {
        return this.http.post<LeadInteractionViewModel>(`${this.endpoints.leads}/${id}/interactions`, request);
    }

    deleteLead(id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoints.leads}/${id}`);
    }

    deleteLeads(ids: string[]): Observable<void[]> {
        return forkJoin(ids.map((id) => this.deleteLead(id)));
    }

    getLookupBundle(): Observable<LeadLookupBundle> {
        return forkJoin({
            sources: this.http.get<LookupViewModel[]>(this.endpoints.leadSources),
            categories: this.http.get<LookupViewModel[]>(this.endpoints.leadCategories),
            partners: this.http.get<LookupViewModel[]>(this.endpoints.partners),
            countries: this.http.get<LookupViewModel[]>(this.endpoints.countries),
            industries: this.http.get<LookupViewModel[]>(this.endpoints.leadIndustries),
            products: this.http.get<LookupViewModel[]>(this.endpoints.products)
        });
    }
}
