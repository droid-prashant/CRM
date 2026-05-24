import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { LookupViewModel } from '../../../leads/view-models/lookup.view-model';
import { PartnerColumns } from '../../config/partner-columns.config';
import { buildPartnerFields } from '../../config/partner-fields.config';
import { CreatePartnerRequest } from '../../dtos/create-partner.request';
import { UpdatePartnerRequest } from '../../dtos/update-partner.request';
import { PartnerApiService } from '../../services/partner-api.service';
import { PartnerListItemViewModel } from '../../view-models/partner-list-item.view-model';

@Component({
    selector: 'app-partner-list',
    standalone: true,
    imports: [Crud, ToastModule],
    templateUrl: './partner-list.html',
    providers: [MessageService]
})
export class PartnerList implements OnInit {
    title = 'Partner';
    columns = PartnerColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No partners found.';
    canCreate = false;
    canEdit = false;
    canDelete = false;
    canExport = false;
    bulkActionLabel = 'Deactivate';
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');

    constructor(
        private readonly partnerApiService: PartnerApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.partners.create);
        this.canEdit = this.authService.hasPermission(Permissions.partners.edit);
        this.canDelete = this.authService.hasPermission(Permissions.partners.delete);
        this.canExport = this.authService.hasPermission(Permissions.partners.export);
        this.loadPage();
    }

    savePartner(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.partnerApiService.createPartner(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Partner created', detail: 'The partner was created successfully.', life: 3000 });
                    this.loadPartners();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Partner id is missing.', life: 4000 });
            return;
        }

        this.partnerApiService.updatePartner(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Partner updated', detail: 'The partner was updated successfully.', life: 3000 });
                this.loadPartners();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    togglePartnerStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'Partner id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.partnerApiService.deactivatePartner(id) : this.partnerApiService.activatePartner(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Partner ${action}`, detail: `The partner was ${action} successfully.`, life: 3000 });
                this.loadPartners();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivatePartners(rows: Record<string, unknown>[]): void {
        const activeIds = rows.filter((row) => row['isActive'] === true).map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active partners', detail: 'The selected partners are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.partnerApiService.deactivatePartner(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Partners deactivated', detail: `${activeIds.length} partner(s) were deactivated.`, life: 3000 });
                this.loadPartners();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    private loadPage(): void {
        this.isLoading = true;
        this.partnerApiService.getLookups().subscribe({
            next: (lookups) => {
                this.fields = buildPartnerFields({
                    partnerTypes: this.toOptions(lookups.partnerTypes),
                    countries: this.toOptions(lookups.countries)
                });
                this.loadPartners();
            },
            error: () => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load partner lookups.';
            }
        });
    }

    private loadPartners(): void {
        this.partnerApiService.getPartners().subscribe({
            next: (partners) => {
                this.data = partners.map((partner) => this.toGridRow(partner));
                this.dataNotFound = partners.length === 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage partners.' : 'Unable to load partners.';
            }
        });
    }

    private toGridRow(partner: PartnerListItemViewModel): Record<string, unknown> {
        return {
            ...partner,
            isActive: partner.isActive === true
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreatePartnerRequest {
        return {
            name: String(value['name'] ?? ''),
            partnerTypeId: String(value['partnerTypeId'] ?? ''),
            countryId: String(value['countryId'] ?? ''),
            contactPerson: this.optionalString(value['contactPerson']),
            phoneNumber: this.optionalString(value['phoneNumber']),
            email: this.optionalString(value['email']),
            address: this.optionalString(value['address']),
            remarks: this.optionalString(value['remarks']),
            isActive: true
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdatePartnerRequest {
        return {
            name: String(value['name'] ?? ''),
            partnerTypeId: String(value['partnerTypeId'] ?? ''),
            countryId: String(value['countryId'] ?? ''),
            contactPerson: this.optionalString(value['contactPerson']),
            phoneNumber: this.optionalString(value['phoneNumber']),
            email: this.optionalString(value['email']),
            address: this.optionalString(value['address']),
            remarks: this.optionalString(value['remarks']),
            isActive: value['isActive'] === true
        };
    }

    private toOptions(values: LookupViewModel[]): SelectOption[] {
        return values.map((value) => ({ label: value.name, value: value.id }));
    }

    private getRowId(row?: Record<string, unknown>): string | null {
        return typeof row?.['id'] === 'string' && row['id'].trim() ? row['id'] : null;
    }

    private optionalString(value: unknown): string | null {
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }

    private showError(error: { error?: { detail?: string; title?: string; errors?: string[] } }, summary: string): void {
        const detail = error.error?.errors?.join?.(' ') ?? error.error?.detail ?? error.error?.title ?? 'The operation could not be completed.';
        this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
    }
}
