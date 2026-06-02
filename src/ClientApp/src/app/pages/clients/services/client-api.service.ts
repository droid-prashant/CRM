import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { CreateClientRequest } from '../dtos/create-client.request';
import { CreateClientContactRequest } from '../dtos/create-client-contact.request';
import { CreateClientProductRequest } from '../dtos/create-client-product.request';
import { UpdateClientRequest } from '../dtos/update-client.request';
import { UpdateClientContactRequest } from '../dtos/update-client-contact.request';
import { UpdateClientContactStatusRequest } from '../dtos/update-client-contact-status.request';
import { UpdateClientProductRequest } from '../dtos/update-client-product.request';
import { ClientContactViewModel } from '../view-models/client-contact.view-model';
import { ClientDetailViewModel } from '../view-models/client-detail.view-model';
import { ClientEditViewModel } from '../view-models/client-edit.view-model';
import { ClientFilterLookupViewModel } from '../view-models/client-filter-lookup.view-model';
import { ClientListResponseViewModel } from '../view-models/client-list-response.view-model';
import { ClientLookupBundleViewModel } from '../view-models/client-lookup-bundle.view-model';
import { ClientProductLookupBundleViewModel } from '../view-models/client-product-lookup-bundle.view-model';
import { ClientProductViewModel } from '../view-models/client-product.view-model';
import { ClientRelatedRecordsSummaryViewModel } from '../view-models/client-related-records-summary.view-model';
import { ClientTimelineResponseViewModel } from '../view-models/client-timeline.view-model';
import { ClientUpdatedViewModel } from '../view-models/client-updated.view-model';
import { PrimaryContactViewModel } from '../view-models/primary-contact.view-model';

export interface ClientListQuery {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    countryId?: string;
    industryId?: string;
    status?: number;
    accountOwnerUserId?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface ClientTimelineQuery {
    activityType?: string | null;
    pageNumber?: number;
    pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ClientApiService {
    private readonly clientsUrl = apiUrl('/clients');
    private readonly clientContactsUrl = apiUrl('/client-contacts');
    private readonly clientProductsUrl = apiUrl('/client-products');

    constructor(private readonly http: HttpClient) {}

    getClients(query: ClientListQuery) {
        const params = Object.entries(query).reduce<Record<string, string>>((accumulator, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                accumulator[key] = String(value);
            }

            return accumulator;
        }, {});

        return this.http.get<ClientListResponseViewModel>(this.clientsUrl, { params });
    }

    getClient(id: string) {
        return this.http.get<ClientDetailViewModel>(`${this.clientsUrl}/${id}`);
    }

    getClientForEdit(id: string) {
        return this.http.get<ClientEditViewModel>(`${this.clientsUrl}/${id}/edit`);
    }

    getClientContacts(clientId: string) {
        return this.http.get<ClientContactViewModel[]>(`${this.clientsUrl}/${clientId}/contacts`);
    }

    getClientTimeline(clientId: string, query: ClientTimelineQuery = {}) {
        const params = Object.entries(query).reduce<Record<string, string>>((accumulator, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                accumulator[key] = String(value);
            }

            return accumulator;
        }, {});

        return this.http.get<ClientTimelineResponseViewModel>(`${this.clientsUrl}/${clientId}/timeline`, { params });
    }

    getClientRelatedSummary(clientId: string) {
        return this.http.get<ClientRelatedRecordsSummaryViewModel>(`${this.clientsUrl}/${clientId}/related-summary`);
    }

    getClientProducts(clientId: string) {
        return this.http.get<ClientProductViewModel[]>(`${this.clientsUrl}/${clientId}/products`);
    }

    getClientProductLookups(clientId: string) {
        return this.http.get<ClientProductLookupBundleViewModel>(`${this.clientsUrl}/${clientId}/products/lookups`);
    }

    getLookups() {
        return this.http.get<ClientLookupBundleViewModel>(`${this.clientsUrl}/lookups`);
    }

    getFilters() {
        return this.http.get<ClientFilterLookupViewModel>(`${this.clientsUrl}/filters`);
    }

    createClient(request: CreateClientRequest) {
        return this.http.post<ClientDetailViewModel>(this.clientsUrl, request);
    }

    updateClient(id: string, request: UpdateClientRequest) {
        return this.http.put<ClientUpdatedViewModel>(`${this.clientsUrl}/${id}`, request);
    }

    createClientContact(request: CreateClientContactRequest) {
        return this.http.post<ClientContactViewModel>(this.clientContactsUrl, request);
    }

    updateClientContact(id: string, request: UpdateClientContactRequest) {
        return this.http.put<ClientContactViewModel>(`${this.clientContactsUrl}/${id}`, request);
    }

    updateClientContactStatus(id: string, request: UpdateClientContactStatusRequest) {
        return this.http.patch<ClientContactViewModel>(`${this.clientContactsUrl}/${id}/status`, request);
    }

    setPrimaryContact(id: string) {
        return this.http.patch<PrimaryContactViewModel>(`${this.clientContactsUrl}/${id}/set-primary`, {});
    }

    createClientProduct(request: CreateClientProductRequest) {
        return this.http.post<ClientProductViewModel>(this.clientProductsUrl, request);
    }

    updateClientProduct(id: string, request: UpdateClientProductRequest) {
        return this.http.put<ClientProductViewModel>(`${this.clientProductsUrl}/${id}`, request);
    }

    activateClient(id: string) {
        return this.http.patch<void>(`${this.clientsUrl}/${id}/activate`, {});
    }

    deactivateClient(id: string) {
        return this.http.patch<void>(`${this.clientsUrl}/${id}/deactivate`, {});
    }
}
