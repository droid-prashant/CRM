import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadEndpointService {
    readonly leads = `${environment.apiUrl}/leads`;
    readonly leadSources = `${environment.apiUrl}/leads/lookups/sources`;
    readonly leadCategories = `${environment.apiUrl}/leads/lookups/categories`;
    readonly products = `${environment.apiUrl}/leads/lookups/products`;
    readonly partners = `${environment.apiUrl}/leads/lookups/partners`;
    readonly countries = `${environment.apiUrl}/leads/lookups/countries`;
    readonly leadIndustries = `${environment.apiUrl}/leads/lookups/industries`;
}
