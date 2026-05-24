import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { CreatePartnerRequest } from '../dtos/create-partner.request';
import { UpdatePartnerRequest } from '../dtos/update-partner.request';
import { PartnerDetailViewModel } from '../view-models/partner-detail.view-model';
import { PartnerListItemViewModel } from '../view-models/partner-list-item.view-model';
import { PartnerLookupBundleViewModel } from '../view-models/partner-lookup-bundle.view-model';

@Injectable({ providedIn: 'root' })
export class PartnerApiService {
    private readonly partnersUrl = apiUrl('/partners');

    constructor(private readonly http: HttpClient) {}

    getPartners() {
        return this.http.get<PartnerListItemViewModel[]>(this.partnersUrl);
    }

    getPartner(id: string) {
        return this.http.get<PartnerDetailViewModel>(`${this.partnersUrl}/${id}`);
    }

    getLookups() {
        return this.http.get<PartnerLookupBundleViewModel>(`${this.partnersUrl}/lookups`);
    }

    createPartner(request: CreatePartnerRequest) {
        return this.http.post<PartnerDetailViewModel>(this.partnersUrl, request);
    }

    updatePartner(id: string, request: UpdatePartnerRequest) {
        return this.http.put<PartnerDetailViewModel>(`${this.partnersUrl}/${id}`, request);
    }

    activatePartner(id: string) {
        return this.http.patch<void>(`${this.partnersUrl}/${id}/activate`, {});
    }

    deactivatePartner(id: string) {
        return this.http.patch<void>(`${this.partnersUrl}/${id}/deactivate`, {});
    }
}
