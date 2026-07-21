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
