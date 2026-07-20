import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { LookupViewModel } from '../../../leads/view-models/lookup.view-model';
import { ClientColumns } from '../../config/client-columns.config';
import { buildClientFields } from '../../config/client-fields.config';
import { ClientListQuery } from '../../dtos/client-query.dto';
import { CreateClientRequest } from '../../dtos/create-client.request';
import { UpdateClientRequest } from '../../dtos/update-client.request';
import { ClientApiService } from '../../services/client-api.service';
import { ClientListItemViewModel } from '../../view-models/client-list-item.view-model';
import { ClientUserLookupViewModel } from '../../view-models/client-user-lookup.view-model';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [ButtonModule, Crud, InputTextModule, ReactiveFormsModule, SelectModule, ToastModule],
    templateUrl: './client-list.html',
    providers: [MessageService]
})
export class ClientList implements OnInit {
    title = 'Client';
    columns = ClientColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No clients found.';
    canCreate = false;
    canEdit = false;
    canDelete = false;
    canExport = false;
    bulkActionLabel = 'Deactivate';
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');
    filterCountries: SelectOption[] = [];
    filterIndustries: SelectOption[] = [];
    filterOwners: SelectOption[] = [];
    filterStatuses: SelectOption[] = [
        { label: 'Active', value: 1, code: 'ACTIVE' },
        { label: 'Inactive', value: 2, code: 'INACTIVE' }
    ];
    totalRecords = 0;
    first = 0;
    pageNumber = 1;
    pageSize = 10;
    sortField = 'createdAt';
    sortDirection: 'asc' | 'desc' = 'desc';

    private readonly fb = inject(FormBuilder);

    filterForm = this.fb.group({
        searchTerm: [''],
        countryId: [''],
        industryId: [''],
        status: [null as number | null],
        accountOwnerUserId: ['']
    });

    constructor(
        private readonly clientApiService: ClientApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.clients.create);
        this.canEdit = this.authService.hasPermission(Permissions.clients.edit);
        this.canDelete = this.authService.hasPermission(Permissions.clients.delete);
        this.canExport = this.authService.hasPermission(Permissions.clients.export);
        this.loadPage();
    }

    saveClient(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.clientApiService.createClient(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Client created', detail: 'The client was created successfully.', life: 3000 });
                    this.loadClients();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Client id is missing.', life: 4000 });
            return;
        }

        this.clientApiService.updateClient(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Client updated', detail: 'The client was updated successfully.', life: 3000 });
                this.loadClients();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    toggleClientStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'Client id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.clientApiService.deactivateClient(id) : this.clientApiService.activateClient(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Client ${action}`, detail: `The client was ${action} successfully.`, life: 3000 });
                this.loadClients();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivateClients(rows: Record<string, unknown>[]): void {
        const activeIds = rows.filter((row) => row['isActive'] === true).map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active clients', detail: 'The selected clients are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.clientApiService.deactivateClient(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Clients deactivated', detail: `${activeIds.length} client(s) were deactivated.`, life: 3000 });
                this.loadClients();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    viewClient(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (id) {
            this.router.navigate(['/pages/clients', id]);
        }
    }

    private loadPage(): void {
        this.isLoading = true;
        forkJoin({
            lookups: this.clientApiService.getLookups(),
            filters: this.clientApiService.getFilters()
        }).subscribe({
            next: ({ lookups, filters }) => {
                this.filterCountries = this.toOptions(filters.countries);
                this.filterIndustries = this.toOptions(filters.industries);
                this.filterOwners = this.toUserOptions(filters.accountOwners);
                this.filterStatuses = [
                    { label: 'Active', value: 1, code: 'ACTIVE' },
                    { label: 'Inactive', value: 2, code: 'INACTIVE' }
                ];
                this.fields = buildClientFields({
                    clientTypes: this.toOptions(lookups.clientTypes),
                    countries: this.toOptions(lookups.countries),
                    industries: this.toOptions(lookups.industries),
                    accountOwners: this.toUserOptions(lookups.accountOwners),
                    statuses: [
                        { label: 'Active', value: 1, code: 'ACTIVE' },
                        { label: 'Inactive', value: 2, code: 'INACTIVE' }
                    ]
                });
                this.loadClients();
            },
            error: () => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load client lookups.';
            }
        });
    }

    private loadClients(): void {
        this.clientApiService.getClients(this.buildListQuery()).subscribe({
            next: (response) => {
                this.data = response.items.map((client) => this.toGridRow(client));
                this.totalRecords = response.totalCount;
                this.pageNumber = response.pageNumber;
                this.pageSize = response.pageSize;
                this.dataNotFound = response.totalCount === 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage clients.' : 'Unable to load clients.';
            }
        });
    }

    applyFilters(): void {
        this.first = 0;
        this.pageNumber = 1;
        this.loadClients();
    }

    clearFilters(): void {
        this.filterForm.reset({
            searchTerm: '',
            countryId: '',
            industryId: '',
            status: null,
            accountOwnerUserId: ''
        });
        this.applyFilters();
    }

    onLazyLoad(event: { first?: number | null; rows?: number | null; sortField?: string | string[] | null; sortOrder?: number | null }): void {
        this.first = event.first ?? 0;
        this.pageSize = event.rows ?? this.pageSize;
        this.pageNumber = Math.floor(this.first / this.pageSize) + 1;
        const sortField = Array.isArray(event.sortField) ? (event.sortField[0] ?? '') : (event.sortField ?? '');
        this.sortField = this.toApiSortField(sortField);
        this.sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
        this.loadClients();
    }

    private toGridRow(client: ClientListItemViewModel): Record<string, unknown> {
        return {
            ...client,
            status: client.status || 1,
            statusName: client.statusName || (client.isActive ? 'Active' : 'Inactive'),
            industryName: client.industryName ?? '',
            clientTypeName: client.clientTypeName ?? '',
            accountOwnerUserName: client.accountOwnerUserName ?? '',
            website: client.website ?? '',
            contactCount: client.contactCount ?? 0,
            productCount: client.productCount ?? 0,
            createdAtDisplay: this.formatDate(client.createdAt),
            isActive: client.isActive === true
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreateClientRequest {
        return {
            name: String(value['name'] ?? ''),
            shortName: this.optionalString(value['shortName']),
            clientTypeId: this.optionalString(value['clientTypeId']),
            industryId: this.optionalString(value['industryId']),
            countryId: String(value['countryId'] ?? ''),
            address: this.optionalString(value['address']),
            website: this.optionalString(value['website']),
            taxNumber: this.optionalString(value['taxNumber']),
            registrationNumber: this.optionalString(value['registrationNumber']),
            accountOwnerUserId: this.optionalString(value['accountOwnerUserId']),
            notes: this.optionalString(value['notes'])
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdateClientRequest {
        return {
            ...this.toCreateRequest(value),
            status: this.toNumber(value['status']) || (value['isActive'] === true ? 1 : 2),
            isActive: value['isActive'] === true
        };
    }

    private toOptions(values: LookupViewModel[]): SelectOption[] {
        return values.map((value) => ({ label: value.name, value: value.id, code: value.code }));
    }

    private toUserOptions(values: ClientUserLookupViewModel[]): SelectOption[] {
        return values.map((value) => ({ label: value.fullName, value: value.id, code: value.email ?? undefined }));
    }

    private getRowId(row?: Record<string, unknown>): string | null {
        return typeof row?.['id'] === 'string' && row['id'].trim() ? row['id'] : null;
    }

    private optionalString(value: unknown): string | null {
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }

    private toNumber(value: unknown): number {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    private buildListQuery(): ClientListQuery {
        const filters = this.filterForm.getRawValue();
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            searchTerm: filters.searchTerm?.trim() || undefined,
            countryId: filters.countryId || undefined,
            industryId: filters.industryId || undefined,
            status: filters.status ?? undefined,
            accountOwnerUserId: filters.accountOwnerUserId || undefined,
            sortBy: this.sortField || 'createdAt',
            sortDirection: this.sortDirection
        };
    }

    private toApiSortField(field: string): string {
        const sortMap: Record<string, string> = {
            clientCode: 'clientCode',
            name: 'name',
            countryName: 'countryName',
            industryName: 'industryName',
            statusName: 'status',
            accountOwnerUserName: 'accountOwnerUserName',
            createdAtDisplay: 'createdAt'
        };

        return sortMap[field] ?? 'createdAt';
    }

    private formatDate(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : '';
    }

    private showError(error: { error?: { detail?: string; title?: string; errors?: string[] } }, summary: string): void {
        const detail = error.error?.errors?.join?.(' ') ?? error.error?.detail ?? error.error?.title ?? 'The operation could not be completed.';
        this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
    }
}
