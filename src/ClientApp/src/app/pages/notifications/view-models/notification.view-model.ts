export interface NotificationConfigurationViewModel {
    id: string;
    eventType: string;
    displayName: string;
    isEnabled: boolean;
    initialLeadTimeDays: number;
    overdueIntervalDays: number;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    subjectTemplate: string;
    bodyTemplate: string;
    reminderIntervals: number[];
}

export interface NotificationEventTypeViewModel {
    eventType: string;
    displayName: string;
    description: string;
    mergeFields: string[];
}

export interface NotificationProcessorStatusViewModel {
    processorEnabled: boolean;
    processorIntervalMinutes: number;
    isRunning: boolean;
    currentTrigger?: string | null;
    lastStartedOn?: string | null;
    lastCompletedOn?: string | null;
    lastTrigger?: string | null;
    lastSucceeded?: boolean | null;
    lastMessage?: string | null;
}

export interface InAppNotificationViewModel {
    id: string;
    title: string;
    message: string;
    eventType: string;
    sourceRecordType: string;
    sourceRecordId: string;
    sourceDueDate: string;
    relatedUrl?: string | null;
    isRead: boolean;
    createdOn: string;
}
