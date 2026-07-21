import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AssignLeadRequest, ConvertLeadRequest, CreateLeadInteractionRequest, DisqualifyLeadRequest, QualifyLeadRequest } from '../dtos/lead-action.dto';
import { CreateLeadRequest } from '../dtos/create-lead.request';
import { UpdateLeadRequest } from '../dtos/update-lead.request';
import { ClientLookupViewModel, ContactLookupViewModel, DeletedLeadLogViewModel, LeadAssignmentResultViewModel, LeadConversionViewModel, LeadInteractionViewModel, LeadLookupBundle, LeadQualificationResultViewModel, OpportunityCreatedViewModel } from '../view-models/lead-action.view-model';
import { LeadDetailViewModel } from '../view-models/lead-detail.view-model';
import { LeadEditViewModel } from '../view-models/lead-edit.view-model';
import { LeadListItemViewModel } from '../view-models/lead-list-item.view-model';
import { LookupViewModel } from '../view-models/lookup.view-model';
import { LeadEndpointService } from './lead.endpoint.service';

@Injectable({ providedIn: 'root' })
export class LeadApiService {
    constructor(
        private readonly http: HttpClient,
        private readonly endpoints: LeadEndpointService
    ) {}

    getLeads(): Observable<LeadListItemViewModel[]> {
        return this.http.get<LeadListItemViewModel[]>(this.endpoints.leads);
    }

    getDeletedLeadLogs(): Observable<DeletedLeadLogViewModel[]> {
        return this.http.get<DeletedLeadLogViewModel[]>(`${this.endpoints.leads}/deleted`);
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
            products: this.http.get<LookupViewModel[]>(this.endpoints.products),
            clients: this.http.get<ClientLookupViewModel[]>(this.endpoints.clientLookups),
            contacts: this.http.get<ContactLookupViewModel[]>(this.endpoints.clientContacts)
        });
    }
}
