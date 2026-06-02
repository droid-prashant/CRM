export interface ClientTimelineViewModel {
    entityType: string;
    entityId: string;
    activityType: string;
    title: string;
    description?: string | null;
    activityDate: string;
    createdByUserName?: string | null;
    isSystemGenerated: boolean;
    referenceEntity?: string | null;
}

export interface ClientTimelineResponseViewModel {
    items: ClientTimelineViewModel[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    activityTypes: string[];
}
