import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { NotificationConfigurationRequest, ResolveNotificationEventRequest } from '../dtos/notification.dto';
import { InAppNotificationViewModel, NotificationConfigurationViewModel, NotificationEventTypeViewModel, NotificationProcessorStatusViewModel } from '../view-models/notification.view-model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
    private readonly notificationsUrl = apiUrl('/notifications');

    constructor(private readonly http: HttpClient) {}

    getConfigurations() {
        return this.http.get<NotificationConfigurationViewModel[]>(`${this.notificationsUrl}/configurations`);
    }

    getEventTypes() {
        return this.http.get<NotificationEventTypeViewModel[]>(`${this.notificationsUrl}/event-types`);
    }

    getProcessorStatus() {
        return this.http.get<NotificationProcessorStatusViewModel>(`${this.notificationsUrl}/processor-status`);
    }

    updateConfiguration(eventType: string, request: NotificationConfigurationRequest) {
        return this.http.put<NotificationConfigurationViewModel>(`${this.notificationsUrl}/configurations/${eventType}`, request);
    }

    getMyNotifications() {
        return this.http.get<InAppNotificationViewModel[]>(`${this.notificationsUrl}/my`);
    }

    markAsRead(notificationId: string) {
        return this.http.patch<void>(`${this.notificationsUrl}/${notificationId}/read`, {});
    }

    markAllAsRead() {
        return this.http.patch<void>(`${this.notificationsUrl}/read-all`, {});
    }

    resolveEvent(request: ResolveNotificationEventRequest) {
        return this.http.post<void>(`${this.notificationsUrl}/resolve`, request);
    }

    processDueNotifications() {
        return this.http.post<void>(`${this.notificationsUrl}/process`, {});
    }
}
