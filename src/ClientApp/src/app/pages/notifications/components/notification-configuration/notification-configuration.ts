import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { NotificationConfigurationRequest } from '../../dtos/notification.dto';
import { NotificationApiService } from '../../services/notification-api.service';
import { NotificationConfigurationViewModel, NotificationEventTypeViewModel, NotificationProcessorStatusViewModel } from '../../view-models/notification.view-model';

@Component({
    selector: 'app-notification-configuration',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, InputNumberModule, InputTextModule, ReactiveFormsModule, TextareaModule, ToastModule],
    templateUrl: './notification-configuration.html',
    styleUrls: ['./notification-configuration.scss'],
    providers: [MessageService]
})
export class NotificationConfiguration implements OnInit {
    private readonly fb = inject(FormBuilder);

    configurations: NotificationConfigurationViewModel[] = [];
    eventTypes: NotificationEventTypeViewModel[] = [];
    processorStatus?: NotificationProcessorStatusViewModel;
    selectedEventType = '';
    loading = false;
    saving = false;
    processing = false;
    intervalToAdd: number | null = null;

    readonly form = this.fb.group({
        isEnabled: [false],
        initialLeadTimeDays: [90, [Validators.required, Validators.min(0)]],
        overdueIntervalDays: [7, [Validators.required, Validators.min(0)]],
        inAppEnabled: [true],
        emailEnabled: [false],
        subjectTemplate: ['', [Validators.required, Validators.maxLength(500)]],
        bodyTemplate: ['', [Validators.required]],
        reminderIntervals: this.fb.array<FormControl<number>>([])
    });

    constructor(
        private readonly notificationApiService: NotificationApiService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.load();
    }

    get selectedConfiguration(): NotificationConfigurationViewModel | undefined {
        return this.configurations.find((configuration) => configuration.eventType === this.selectedEventType);
    }

    get selectedEventMetadata(): NotificationEventTypeViewModel | undefined {
        return this.eventTypes.find((eventType) => eventType.eventType === this.selectedEventType);
    }

    get reminderIntervals(): FormArray<FormControl<number>> {
        return this.form.controls.reminderIntervals;
    }

    load(): void {
        this.loading = true;
        forkJoin({
            configurations: this.notificationApiService.getConfigurations(),
            eventTypes: this.notificationApiService.getEventTypes(),
            processorStatus: this.notificationApiService.getProcessorStatus()
        }).subscribe({
            next: ({ configurations, eventTypes, processorStatus }) => {
                this.configurations = configurations;
                this.eventTypes = eventTypes;
                this.processorStatus = processorStatus;
                this.selectConfiguration(configurations[0]?.eventType ?? '');
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Notifications', detail: 'Unable to load notification settings.' });
            }
        });
    }

    selectConfiguration(eventType: string): void {
        this.selectedEventType = eventType;
        const configuration = this.selectedConfiguration;
        if (!configuration) {
            return;
        }

        this.reminderIntervals.clear();
        for (const interval of configuration.reminderIntervals) {
            this.reminderIntervals.push(new FormControl(interval, { nonNullable: true }));
        }

        this.form.patchValue({
            isEnabled: configuration.isEnabled,
            initialLeadTimeDays: configuration.initialLeadTimeDays,
            overdueIntervalDays: configuration.overdueIntervalDays,
            inAppEnabled: configuration.inAppEnabled,
            emailEnabled: configuration.emailEnabled,
            subjectTemplate: configuration.subjectTemplate,
            bodyTemplate: configuration.bodyTemplate
        });
    }

    addInterval(): void {
        const value = Number(this.intervalToAdd);
        const leadTime = Number(this.form.controls.initialLeadTimeDays.value ?? 0);
        if (!Number.isInteger(value) || value < 0 || value > leadTime) {
            this.messageService.add({ severity: 'warn', summary: 'Reminder interval', detail: 'Enter a whole number within the lead time.' });
            return;
        }

        if (this.reminderIntervals.controls.some((control) => control.value === value)) {
            this.intervalToAdd = null;
            return;
        }

        this.reminderIntervals.push(new FormControl(value, { nonNullable: true }));
        this.sortIntervals();
        this.intervalToAdd = null;
    }

    removeInterval(index: number): void {
        this.reminderIntervals.removeAt(index);
    }

    save(): void {
        if (this.form.invalid || !this.selectedEventType) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'warn', summary: 'Notifications', detail: 'Please complete the required fields.' });
            return;
        }

        const values = this.form.getRawValue();
        if (!values.inAppEnabled && !values.emailEnabled) {
            this.messageService.add({ severity: 'warn', summary: 'Delivery channel', detail: 'Select at least one delivery channel.' });
            return;
        }

        if (!values.reminderIntervals.length) {
            this.messageService.add({ severity: 'warn', summary: 'Reminder interval', detail: 'Add at least one reminder interval.' });
            return;
        }

        const request: NotificationConfigurationRequest = {
            isEnabled: values.isEnabled ?? false,
            initialLeadTimeDays: Number(values.initialLeadTimeDays ?? 0),
            overdueIntervalDays: Number(values.overdueIntervalDays ?? 0),
            inAppEnabled: values.inAppEnabled ?? false,
            emailEnabled: values.emailEnabled ?? false,
            subjectTemplate: values.subjectTemplate ?? '',
            bodyTemplate: values.bodyTemplate ?? '',
            reminderIntervals: [...values.reminderIntervals].sort((a, b) => b - a)
        };

        this.saving = true;
        this.notificationApiService.updateConfiguration(this.selectedEventType, request).subscribe({
            next: (updated) => {
                this.configurations = this.configurations.map((configuration) => (configuration.eventType === updated.eventType ? updated : configuration));
                this.selectConfiguration(updated.eventType);
                this.saving = false;
                this.messageService.add({ severity: 'success', summary: 'Notifications', detail: 'Notification settings saved.' });
            },
            error: () => {
                this.saving = false;
                this.messageService.add({ severity: 'error', summary: 'Notifications', detail: 'Unable to save notification settings.' });
            }
        });
    }

    processNow(): void {
        this.processing = true;
        this.notificationApiService.processDueNotifications().subscribe({
            next: () => {
                this.processing = false;
                this.refreshProcessorStatus();
                this.messageService.add({ severity: 'success', summary: 'Notifications', detail: 'Due notification processing completed.' });
            },
            error: () => {
                this.processing = false;
                this.refreshProcessorStatus();
                this.messageService.add({ severity: 'error', summary: 'Notifications', detail: 'Unable to process notifications.' });
            }
        });
    }

    refreshProcessorStatus(): void {
        this.notificationApiService.getProcessorStatus().subscribe({
            next: (status) => {
                this.processorStatus = status;
            }
        });
    }

    formatTimestamp(value?: string | null): string {
        if (!value) {
            return 'Not yet';
        }

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
    }

    private sortIntervals(): void {
        const sorted = this.reminderIntervals.controls.map((control) => control.value).sort((a, b) => b - a);
        this.reminderIntervals.clear();
        for (const interval of sorted) {
            this.reminderIntervals.push(new FormControl(interval, { nonNullable: true }));
        }
    }
}
