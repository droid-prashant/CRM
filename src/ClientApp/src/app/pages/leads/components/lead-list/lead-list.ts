import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { buildLeadFields } from '../../config/lead-fields.config';
import { LeadColumns } from '../../config/lead-columns.config';
import { CreateLeadRequest } from '../../dtos/create-lead.request';
import { UpdateLeadRequest } from '../../dtos/update-lead.request';
import { LeadApiService, LeadLookupBundle } from '../../services/lead.api-service';
import { LeadListItemViewModel } from '../../view-models/lead-list-item.view-model';
import { LookupViewModel } from '../../view-models/lookup.view-model';

@Component({
    selector: 'app-lead-list',
    standalone: true,
    imports: [Crud, ToastModule],
    templateUrl: './lead-list.html',
    providers: [MessageService]
})
export class LeadList implements OnInit {
    title = 'Lead';
    columns = LeadColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No leads found.';
    canCreate = false;
    canEdit = false;
    canDelete = false;
    canExport = false;
    canEditLeadRow = (row: Record<string, unknown>): boolean => !['assigned', 'converted'].includes(String(row['status'] ?? '').toLowerCase());

    constructor(
        private readonly leadApiService: LeadApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.leads.create);
        this.canEdit = this.authService.hasPermission(Permissions.leads.edit);
        this.canDelete = this.authService.hasPermission(Permissions.leads.delete);
        this.canExport = this.authService.hasPermission(Permissions.leads.export);
        this.loadPage();
    }

    saveLead(event: CrudSaveEvent): void {
        if (event.mode === 'create') {
            this.createLead(event.value as Record<string, unknown>);
            return;
        }

        this.updateLead(event);
    }

    private createLead(value: Record<string, unknown>): void {
        this.leadApiService.createLead(this.toLeadRequest(value)).subscribe({
            next: (lead) => {
                this.messageService.add({
                    severity: lead.hasDuplicateWarning ? 'warn' : 'success',
                    summary: lead.hasDuplicateWarning ? 'Lead created with warning' : 'Lead created',
                    detail: lead.duplicateWarning ?? `${lead.leadNumber} was created successfully.`,
                    life: 5000
                });
                this.loadLeads();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Failed to create lead.';
                this.messageService.add({ severity: 'error', summary: 'Validation failed', detail, life: 6000 });
            }
        });
    }

    private updateLead(event: CrudSaveEvent): void {
        const id = event.original ? this.getRowId(event.original) : null;

        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Lead id is missing.', life: 4000 });
            return;
        }

        this.leadApiService.updateLead(id, this.toLeadRequest(event.value as Record<string, unknown>)).subscribe({
            next: (lead) => {
                this.messageService.add({ severity: 'success', summary: 'Lead updated', detail: `${lead.leadNumber} was updated successfully.`, life: 4000 });
                this.loadLeads();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Failed to update lead.';
                this.messageService.add({ severity: 'error', summary: 'Validation failed', detail, life: 6000 });
            }
        });
    }

    deleteLead(row: Record<string, unknown>): void {
        const id = this.getRowId(row);

        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: 'Lead id is missing.', life: 4000 });
            return;
        }

        this.leadApiService.deleteLead(id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Lead deleted', detail: 'The lead was removed from the active list.', life: 3000 });
                this.loadLeads();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: 'Unable to delete the selected lead.', life: 5000 });
            }
        });
    }

    deleteLeads(rows: Record<string, unknown>[]): void {
        const ids = rows.map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!ids.length) {
            this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: 'No valid lead ids were selected.', life: 4000 });
            return;
        }

        this.leadApiService.deleteLeads(ids).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Leads deleted', detail: `${ids.length} lead(s) were removed from the active list.`, life: 3000 });
                this.loadLeads();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: 'Unable to delete the selected leads.', life: 5000 });
            }
        });
    }

    viewLead(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Detail failed', detail: 'Lead id is missing.', life: 4000 });
            return;
        }

        this.router.navigate(['/pages/leads', id]);
    }

    private loadPage(): void {
        this.isLoading = true;

        this.leadApiService.getLookupBundle().subscribe({
            next: (lookups) => {
                this.fields = buildLeadFields(this.toFieldOptions(lookups));
                this.loadLeads();
            },
            error: () => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load lead lookups.';
            }
        });
    }

    private loadLeads(): void {
        this.leadApiService.getLeads().subscribe({
            next: (leads) => {
                this.data = leads.map((lead) => ({ ...lead }));
                this.dataNotFound = leads.length === 0;
                this.isLoading = false;
            },
            error: () => {
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load leads.';
                this.isLoading = false;
            }
        });
    }

    private toLeadRequest(value: Record<string, unknown>): CreateLeadRequest | UpdateLeadRequest {
        return {
            sourceId: String(value['sourceId']),
            categoryId: String(value['categoryId']),
            partnerId: this.optionalString(value['partnerId']),
            campaignName: this.optionalString(value['campaignName']),
            sourceStartDate: this.optionalString(value['sourceStartDate']),
            sourceEndDate: this.optionalString(value['sourceEndDate']),
            companyName: String(value['companyName'] ?? ''),
            website: this.optionalString(value['website']),
            contactPersonName: String(value['contactPersonName'] ?? ''),
            jobTitle: this.optionalString(value['jobTitle']),
            email: this.optionalString(value['email']),
            phone: this.optionalString(value['phone']),
            alternatePhone: this.optionalString(value['alternatePhone']),
            countryId: String(value['countryId']),
            address: this.optionalString(value['address']),
            industryId: this.optionalString(value['industryId']),
            notes: null,
            leadScore: typeof value['leadScore'] === 'number' ? value['leadScore'] : null,
            productIds: Array.isArray(value['productIds']) ? value['productIds'].map(String) : []
        };
    }

    private toFieldOptions(lookups: LeadLookupBundle) {
        return {
            sources: this.toOptions(lookups.sources),
            categories: this.toOptions(lookups.categories),
            partners: this.toOptions(lookups.partners),
            countries: this.toOptions(lookups.countries),
            industries: this.toOptions(lookups.industries),
            products: this.toOptions(lookups.products)
        };
    }

    private toOptions(values: LookupViewModel[]): SelectOption[] {
        return values.map((value) => ({
            label: value.name,
            value: value.id,
            code: value.code,
            partnerTypeCode: value.partnerTypeCode,
            productIds: value.productIds,
            ownershipType: value.ownershipType,
            ownerPartnerId: value.ownerPartnerId
        }));
    }

    private optionalString(value: unknown): string | null {
        if (typeof value !== 'string') {
            return null;
        }

        return value.trim() ? value : null;
    }

    private getRowId(row: Record<string, unknown>): string | null {
        return typeof row['id'] === 'string' && row['id'].trim() ? row['id'] : null;
    }
}
