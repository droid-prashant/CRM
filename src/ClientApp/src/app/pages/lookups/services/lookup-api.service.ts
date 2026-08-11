import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { CreateLookupRequest } from '../dtos/create-lookup.request';
import { UpdateLookupRequest } from '../dtos/update-lookup.request';
import { LookupListItemViewModel } from '../view-models/lookup-list-item.view-model';
import { LookupTypeOptionViewModel } from '../view-models/lookup-type-option.view-model';

@Injectable({ providedIn: 'root' })
export class LookupApiService {
    private readonly lookupsUrl = apiUrl('/lookups');

    constructor(private readonly http: HttpClient) {}

    getLookupTypes() {
        return this.http.get<LookupTypeOptionViewModel[]>(`${this.lookupsUrl}/types`);
    }

    getLookups(lookupId: number) {
        return this.http.get<LookupListItemViewModel[]>(this.lookupsUrl, { params: { lookupId, includeInactive: true } });
    }

    getLookup(id: string) {
        return this.http.get<LookupListItemViewModel>(`${this.lookupsUrl}/${id}`);
    }

    createLookup(request: CreateLookupRequest) {
        return this.http.post<LookupListItemViewModel>(this.lookupsUrl, request);
    }

    updateLookup(id: string, request: UpdateLookupRequest) {
        return this.http.put<LookupListItemViewModel>(`${this.lookupsUrl}/${id}`, request);
    }

    activateLookup(id: string) {
        return this.http.patch<void>(`${this.lookupsUrl}/${id}/activate`, {});
    }

    deactivateLookup(id: string) {
        return this.http.patch<void>(`${this.lookupsUrl}/${id}/deactivate`, {});
    }
}
