import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { NotificationApiService } from '@/pages/notifications/services/notification-api.service';
import { InAppNotificationViewModel } from '@/pages/notifications/view-models/notification.view-model';

@Component({
    selector: 'app-notification-bell',
    standalone: true,
    imports: [ButtonModule, CommonModule],
    templateUrl: './notification-bell.html',
    styleUrls: ['./notification-bell.scss']
})
export class NotificationBell implements OnInit, OnDestroy {
    notifications: InAppNotificationViewModel[] = [];
    alertNotification: InAppNotificationViewModel | null = null;
    panelOpen = false;
    loading = false;
    private readonly alertedNotificationIds = new Set<string>();
    private readonly alertSessionKey = 'crm-notification-alerted-ids';
    private readonly subscriptions = new Subscription();

    constructor(
        private readonly notificationApiService: NotificationApiService,
        private readonly router: Router,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {}

    get unreadCount(): number {
        return this.notifications.filter((notification) => !notification.isRead).length;
    }

    get latestNotifications(): InAppNotificationViewModel[] {
        return this.notifications.slice(0, 15);
    }

    ngOnInit(): void {
        this.restoreAlertedNotificationIds();
        this.subscriptions.add(timer(0, 120000).subscribe(() => this.loadNotifications()));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    @HostListener('document:click', ['$event'])
    closeOnOutsideClick(event: MouseEvent): void {
        if (!this.panelOpen || this.elementRef.nativeElement.contains(event.target as Node)) {
            return;
        }

        this.panelOpen = false;
    }

    togglePanel(event: MouseEvent): void {
        event.stopPropagation();
        this.panelOpen = !this.panelOpen;
        if (this.panelOpen) {
            this.alertNotification = null;
            this.loadNotifications();
        }
    }

    markAsRead(notification: InAppNotificationViewModel, event?: MouseEvent): void {
        event?.stopPropagation();
        if (notification.isRead) {
            return;
        }

        this.notificationApiService.markAsRead(notification.id).subscribe({
            next: () => {
                this.notifications = this.notifications.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item));
                if (this.alertNotification?.id === notification.id) {
                    this.alertNotification = null;
                }
            }
        });
    }

    markAllAsRead(event: MouseEvent): void {
        event.stopPropagation();
        if (!this.unreadCount) {
            return;
        }

        this.notificationApiService.markAllAsRead().subscribe({
            next: () => {
                this.notifications = this.notifications.map((notification) => ({ ...notification, isRead: true }));
                this.alertNotification = null;
            }
        });
    }

    openNotification(notification: InAppNotificationViewModel): void {
        const navigate = () => {
            if (notification.relatedUrl) {
                this.router.navigateByUrl(notification.relatedUrl);
                this.panelOpen = false;
            }
        };

        if (notification.isRead) {
            navigate();
            return;
        }

        this.notificationApiService.markAsRead(notification.id).subscribe({
            next: () => {
                this.notifications = this.notifications.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item));
                if (this.alertNotification?.id === notification.id) {
                    this.alertNotification = null;
                }
                navigate();
            },
            error: () => navigate()
        });
    }

    dismissAlert(event: MouseEvent): void {
        event.stopPropagation();
        if (this.alertNotification) {
            this.rememberAlertedNotification(this.alertNotification.id);
        }

        this.alertNotification = null;
    }

    formatTimestamp(value: string): string {
        if (!value) {
            return '';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();
    }

    private loadNotifications(): void {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.notificationApiService.getMyNotifications().subscribe({
            next: (notifications) => {
                this.notifications = notifications;
                this.updateAlertNotification(notifications);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    private updateAlertNotification(notifications: InAppNotificationViewModel[]): void {
        if (this.panelOpen) {
            return;
        }

        const nextAlert = notifications.find((notification) => !notification.isRead && !this.alertedNotificationIds.has(notification.id));
        if (!nextAlert) {
            return;
        }

        this.rememberAlertedNotification(nextAlert.id);
        this.alertNotification = nextAlert;
    }

    private restoreAlertedNotificationIds(): void {
        const storedValue = sessionStorage.getItem(this.alertSessionKey);
        if (!storedValue) {
            return;
        }

        for (const notificationId of storedValue.split(',').filter(Boolean)) {
            this.alertedNotificationIds.add(notificationId);
        }
    }

    private rememberAlertedNotification(notificationId: string): void {
        this.alertedNotificationIds.add(notificationId);
        sessionStorage.setItem(this.alertSessionKey, Array.from(this.alertedNotificationIds).slice(-100).join(','));
    }
}
