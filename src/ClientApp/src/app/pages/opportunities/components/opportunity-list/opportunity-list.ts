import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import {
    ClientLookupViewModel,
    ContactLookupViewModel,
    CreateOpportunityRequest,
    CurrencyLookupViewModel,
    LeadLookupViewModel,
    LookupViewModel,
    OpportunityApiService,
    OpportunityListItemViewModel,
    OpportunityLookupBundle,
    OpportunityUserLookupViewModel
} from '../../services/opportunity-api.service';

@Component({
    selector: 'app-opportunity-list',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, InputNumberModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, ToastModule],
    templateUrl: './opportunity-list.html',
    providers: [MessageService]
})
export class OpportunityList implements OnInit {
    opportunities: OpportunityListItemViewModel[] = [];
    clients: ClientLookupViewModel[] = [];
    allContacts: ContactLookupViewModel[] = [];
    contacts: ContactLookupViewModel[] = [];
    products: LookupViewModel[] = [];
    leads: LeadLookupViewModel[] = [];
    users: OpportunityUserLookupViewModel[] = [];
    currencies: CurrencyLookupViewModel[] = [];
    isLoading = true;
    isSaving = false;
    createDialog = false;
    canCreate = false;
    errorMessage = '';

    private readonly fb = inject(FormBuilder);

    opportunityForm = this.fb.group({
        clientId: ['', Validators.required],
        contactId: ['', Validators.required],
        leadId: [''],
        productId: ['', Validators.required],
        title: ['', [Validators.required, Validators.maxLength(250)]],
        estimatedValue: [0, [Validators.required, Validators.min(0)]],
        currencyId: ['', Validators.required],
        expectedCloseDate: [''],
        ownerUserId: ['', Validators.required]
    });

    constructor(
        private readonly opportunityApiService: OpportunityApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.opportunities.create);
        this.loadPage();
    }

    openCreateDialog(): void {
        const defaultCurrencyId = this.currencies[0]?.id ?? '';
        const defaultOwnerUserId = this.users[0]?.id ?? '';
        this.contacts = [];
        this.opportunityForm.reset({
            clientId: '',
            contactId: '',
            leadId: '',
            productId: '',
            title: '',
            estimatedValue: 0,
            currencyId: defaultCurrencyId,
            expectedCloseDate: '',
            ownerUserId: defaultOwnerUserId
        });
        this.createDialog = true;
    }

    onClientChange(clientId: string): void {
        this.opportunityForm.patchValue({ contactId: '' });
        this.contacts = [];

        if (!clientId) {
            return;
        }

        this.contacts = this.allContacts.filter((contact) => contact.clientId === clientId);
    }

    createOpportunity(): void {
        this.opportunityForm.markAllAsTouched();
        if (this.opportunityForm.invalid) {
            return;
        }

        this.isSaving = true;
        this.opportunityApiService.createOpportunity(this.buildCreateRequest()).subscribe({
            next: (opportunity) => {
                this.createDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Opportunity created', detail: `${opportunity.opportunityNumber} was created successfully.`, life: 4000 });
                this.loadOpportunities();
                this.isSaving = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Failed to create opportunity.';
                this.messageService.add({ severity: 'error', summary: 'Validation failed', detail, life: 6000 });
                this.isSaving = false;
            }
        });
    }

    formatCurrency(value: number, currencyCode?: string): string {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currencyCode || 'USD',
            maximumFractionDigits: 2
        }).format(value ?? 0);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    statusSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        return status?.toLowerCase() === 'open' ? 'success' : 'secondary';
    }

    private loadPage(): void {
        this.isLoading = true;
        this.opportunityApiService.getLookupBundle().subscribe({
            next: (lookups) => {
                this.applyLookups(lookups);
                this.loadOpportunities();
            },
            error: () => {
                this.errorMessage = 'Unable to load opportunity lookups.';
                this.isLoading = false;
            }
        });
    }

    private loadOpportunities(): void {
        this.opportunityApiService.getOpportunities().subscribe({
            next: (opportunities) => {
                this.opportunities = opportunities;
                this.errorMessage = '';
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Unable to load opportunities.';
                this.isLoading = false;
            }
        });
    }

    private applyLookups(lookups: OpportunityLookupBundle): void {
        this.clients = lookups.clients;
        this.allContacts = lookups.contacts;
        this.products = lookups.products;
        this.leads = lookups.leads.filter((lead) => lead.status.toLowerCase() !== 'converted');
        this.users = lookups.ownerUsers.filter((user) => user.isActive);
        this.currencies = lookups.currencies;
    }

    private buildCreateRequest(): CreateOpportunityRequest {
        const value = this.opportunityForm.getRawValue();
        return {
            clientId: value.clientId ?? '',
            contactId: value.contactId ?? '',
            leadId: value.leadId || undefined,
            productId: value.productId ?? '',
            title: value.title ?? '',
            estimatedValue: value.estimatedValue ?? 0,
            currencyId: value.currencyId ?? '',
            ownerUserId: value.ownerUserId ?? '',
            expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : undefined
        };
    }
}
