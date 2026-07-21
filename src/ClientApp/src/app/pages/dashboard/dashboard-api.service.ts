import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { DashboardQuery } from './dtos/dashboard-query.dto';
import { DashboardFilterOptionsViewModel, DashboardViewModel } from './view-models/dashboard.view-model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
    private readonly dashboardUrl = apiUrl('/dashboard');

    constructor(private readonly http: HttpClient) {}

    getDashboard(query: DashboardQuery = {}) {
        const params = Object.entries(query).reduce<Record<string, string>>((accumulator, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                accumulator[key] = String(value);
            }

            return accumulator;
        }, {});

        return this.http.get<DashboardViewModel>(this.dashboardUrl, { params });
    }

    getFilterOptions() {
        return this.http.get<DashboardFilterOptionsViewModel>(`${this.dashboardUrl}/filters`);
    }
}
