export interface NotificationConfigurationRequest {
    isEnabled: boolean;
    initialLeadTimeDays: number;
    overdueIntervalDays: number;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    subjectTemplate: string;
    bodyTemplate: string;
    reminderIntervals: number[];
}

export interface ResolveNotificationEventRequest {
    eventType: string;
    sourceRecordType: string;
    sourceRecordId: string;
    sourceDueDate: string;
    resolutionRemarks?: string | null;
}
