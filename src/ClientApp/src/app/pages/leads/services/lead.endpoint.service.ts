import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';

@Injectable({ providedIn: 'root' })
export class LeadEndpointService {
    readonly leads = apiUrl('/leads');
    readonly leadSources = apiUrl('/leads/lookups/sources');
    readonly leadCategories = apiUrl('/leads/lookups/categories');
    readonly products = apiUrl('/leads/lookups/products');
    readonly partners = apiUrl('/leads/lookups/partners');
    readonly countries = apiUrl('/leads/lookups/countries');
    readonly leadIndustries = apiUrl('/leads/lookups/industries');
}
