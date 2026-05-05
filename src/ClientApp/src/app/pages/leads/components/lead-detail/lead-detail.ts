import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { LeadApiService } from '../../services/lead.api-service';
import { LeadDetailViewModel } from '../../view-models/lead-detail.view-model';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, InputTextModule, ReactiveFormsModule, TableModule, TagModule, TextareaModule, ToastModule],
    templateUrl: './lead-detail.html',
    providers: [MessageService]
})
export class LeadDetail implements OnInit {
    lead?: LeadDetailViewModel;
    isLoading = true;
    isSavingStatus = false;
    errorMessage = '';
    canEditLead = false;
    canApproveLead = false;
    qualificationDialog = false;
    disqualificationDialog = false;

    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);

    qualificationForm = this.fb.group({
        qualificationRemarks: ['', [Validators.maxLength(1000)]]
    });

    disqualificationForm = this.fb.group({
        disqualificationReason: ['', [Validators.required, Validators.maxLength(500)]],
        disqualificationRemarks: ['', [Validators.maxLength(1000)]]
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly leadApiService: LeadApiService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canEditLead = this.authService.hasPermission(Permissions.leads.edit);
        this.canApproveLead = this.authService.hasPermission(Permissions.leads.approve);
        this.loadLead();
    }

    loadLead(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage = 'Lead id is missing.';
            this.isLoading = false;
            return;
        }

        this.leadApiService.getLead(id).subscribe({
            next: (lead) => {
                this.lead = lead;
                this.isLoading = false;
                this.errorMessage = '';
            },
            error: (error) => {
                this.errorMessage = error.status === 403 ? 'You are not allowed to view this lead.' : 'Lead was not found.';
                this.isLoading = false;
            }
        });
    }

    get statusSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (this.lead?.status?.toLowerCase()) {
            case 'qualified':
                return 'success';
            case 'disqualified':
                return 'danger';
            case 'assigned':
                return 'info';
            case 'new':
                return 'secondary';
            default:
                return 'warn';
        }
    }

    get canShowConvert(): boolean {
        return this.canApproveLead && this.lead?.status?.toLowerCase() === 'qualified';
    }

    get canShowQualificationActions(): boolean {
        return this.canEditLead && !['qualified', 'disqualified'].includes(this.lead?.status?.toLowerCase() ?? '');
    }

    openQualificationDialog(): void {
        this.qualificationForm.reset({ qualificationRemarks: '' });
        this.qualificationDialog = true;
    }

    openDisqualificationDialog(): void {
        this.disqualificationForm.reset({ disqualificationReason: '', disqualificationRemarks: '' });
        this.disqualificationDialog = true;
    }

    qualifyLead(): void {
        if (!this.lead) {
            return;
        }

        this.qualificationForm.markAllAsTouched();
        if (this.qualificationForm.invalid) {
            return;
        }

        const value = this.qualificationForm.getRawValue();
        this.isSavingStatus = true;
        this.leadApiService.qualifyLead(this.lead.id, { qualificationRemarks: value.qualificationRemarks ?? undefined }).subscribe({
            next: () => {
                this.qualificationDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Lead qualified', detail: 'Conversion is now available for this lead.', life: 4000 });
                this.loadLead();
                this.isSavingStatus = false;
            },
            error: (error) => this.handleStatusError(error)
        });
    }

    disqualifyLead(): void {
        if (!this.lead) {
            return;
        }

        this.disqualificationForm.markAllAsTouched();
        if (this.disqualificationForm.invalid) {
            return;
        }

        const value = this.disqualificationForm.getRawValue();
        this.isSavingStatus = true;
        this.leadApiService
            .disqualifyLead(this.lead.id, {
                disqualificationReason: value.disqualificationReason ?? '',
                disqualificationRemarks: value.disqualificationRemarks ?? undefined
            })
            .subscribe({
                next: () => {
                    this.disqualificationDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Lead disqualified', detail: 'The reason and timeline entry were recorded.', life: 4000 });
                    this.loadLead();
                    this.isSavingStatus = false;
                },
                error: (error) => this.handleStatusError(error)
            });
    }

    backToList(): void {
        this.router.navigate(['/pages/leads']);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleString() : 'Not set';
    }

    optional(value?: string | number | null): string {
        return value === undefined || value === null || value === '' ? 'Not set' : String(value);
    }

    private handleStatusError(error: { error?: { errors?: string[] }; status?: number }): void {
        const detail = error.error?.errors?.join(' ') ?? 'Lead status could not be updated.';
        this.messageService.add({ severity: 'error', summary: 'Status update failed', detail, life: 5000 });
        this.isSavingStatus = false;
    }
}
