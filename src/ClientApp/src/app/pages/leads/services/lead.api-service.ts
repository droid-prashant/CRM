import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CreateLeadRequest } from '../dtos/create-lead.request';
import { LeadDetailViewModel } from '../view-models/lead-detail.view-model';
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

@Injectable({ providedIn: 'root' })
export class LeadApiService {
    constructor(
        private readonly http: HttpClient,
        private readonly endpoints: LeadEndpointService
    ) {}

    getLeads(): Observable<LeadListItemViewModel[]> {
        return this.http.get<LeadListItemViewModel[]>(this.endpoints.leads);
    }

    createLead(request: CreateLeadRequest): Observable<LeadDetailViewModel> {
        return this.http.post<LeadDetailViewModel>(this.endpoints.leads, request);
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
