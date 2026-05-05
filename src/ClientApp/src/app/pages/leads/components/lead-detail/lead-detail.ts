import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { LeadApiService } from '../../services/lead.api-service';
import { LeadDetailViewModel } from '../../view-models/lead-detail.view-model';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [ButtonModule, CommonModule, TableModule, TagModule],
    templateUrl: './lead-detail.html'
})
export class LeadDetail implements OnInit {
    lead?: LeadDetailViewModel;
    isLoading = true;
    errorMessage = '';
    canEditLead = false;
    canApproveLead = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly leadApiService: LeadApiService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canEditLead = this.authService.hasPermission(Permissions.leads.edit);
        this.canApproveLead = this.authService.hasPermission(Permissions.leads.approve);

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

    backToList(): void {
        this.router.navigate(['/pages/leads']);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleString() : 'Not set';
    }

    optional(value?: string | number | null): string {
        return value === undefined || value === null || value === '' ? 'Not set' : String(value);
    }
}
