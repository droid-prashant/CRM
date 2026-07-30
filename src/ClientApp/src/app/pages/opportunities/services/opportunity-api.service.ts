import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '@/core/http/api-url';
import { ChangeOpportunityStageRequest, CloseOpportunityRequest, CreateOpportunityActivityRequest, CreateOpportunityRequest, OpportunityListQuery, UpdateOpportunityRequest, UploadProposalVersionRequest } from '../dtos/opportunity.dto';
import { OpportunityActivityViewModel, OpportunityDocumentViewModel, OpportunityListItemViewModel, OpportunityLookupBundle, OpportunityPipelineStageViewModel, OpportunityStageHistoryViewModel, PagedResult, ProposalVersionViewModel } from '../view-models/opportunity.view-model';

@Injectable({ providedIn: 'root' })
export class OpportunityApiService {
    private readonly opportunitiesUrl = apiUrl('/opportunities');

    constructor(private readonly http: HttpClient) {}

    getOpportunities(query: OpportunityListQuery): Observable<PagedResult<OpportunityListItemViewModel>> {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<PagedResult<OpportunityListItemViewModel>>(this.opportunitiesUrl, { params });
    }

    getPipeline(query: OpportunityListQuery): Observable<OpportunityPipelineStageViewModel[]> {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<OpportunityPipelineStageViewModel[]>(`${this.opportunitiesUrl}/pipeline`, { params });
    }

    createOpportunity(request: CreateOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.post<OpportunityListItemViewModel>(this.opportunitiesUrl, request);
    }

    updateOpportunity(id: string, request: UpdateOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.put<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}`, request);
    }

    changeStage(id: string, request: ChangeOpportunityStageRequest): Observable<OpportunityListItemViewModel> {
        const formData = new FormData();
        formData.append('stageId', request.stageId);
        formData.append('remarks', request.remarks ?? '');

        if (request.proposalDocument) {
            formData.append('proposalDocument', request.proposalDocument);
        }

        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/stage`, formData);
    }

    closeAsWon(id: string, request: CloseOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/won`, request);
    }

    closeAsLost(id: string, request: CloseOpportunityRequest): Observable<OpportunityListItemViewModel> {
        return this.http.patch<OpportunityListItemViewModel>(`${this.opportunitiesUrl}/${id}/lost`, request);
    }

    getStageHistory(id: string): Observable<OpportunityStageHistoryViewModel[]> {
        return this.http.get<OpportunityStageHistoryViewModel[]>(`${this.opportunitiesUrl}/${id}/stage-history`);
    }

    getActivities(id: string): Observable<OpportunityActivityViewModel[]> {
        return this.http.get<OpportunityActivityViewModel[]>(`${this.opportunitiesUrl}/${id}/activities`);
    }

    createActivity(id: string, request: CreateOpportunityActivityRequest): Observable<OpportunityActivityViewModel> {
        return this.http.post<OpportunityActivityViewModel>(`${this.opportunitiesUrl}/${id}/activities`, request);
    }

    downloadProposalDocument(id: string): Observable<Blob> {
        return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-document`, { responseType: 'blob' });
    }

    getProposalHistory(id: string): Observable<ProposalVersionViewModel[]> {
        return this.http.get<ProposalVersionViewModel[]>(`${this.opportunitiesUrl}/${id}/proposal-versions`);
    }

    uploadProposalVersion(id: string, request: UploadProposalVersionRequest): Observable<OpportunityDocumentViewModel> {
        const formData = new FormData();
        formData.append('proposalDocument', request.proposalDocument);

        if (request.description) {
            formData.append('description', request.description);
        }

        return this.http.post<OpportunityDocumentViewModel>(`${this.opportunitiesUrl}/${id}/proposal-versions`, formData);
    }

    downloadProposalVersion(id: string, documentId: string): Observable<Blob> {
        return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-versions/${documentId}/download`, { responseType: 'blob' });
    }

    previewProposalVersion(id: string, documentId: string): Observable<Blob> {
        return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-versions/${documentId}/preview`, { responseType: 'blob' });
    }

    getLookupBundle(): Observable<OpportunityLookupBundle> {
        return this.http.get<OpportunityLookupBundle>(`${this.opportunitiesUrl}/lookups`);
    }
}
