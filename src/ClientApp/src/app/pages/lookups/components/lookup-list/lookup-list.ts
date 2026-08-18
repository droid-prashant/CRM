import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { LookupColumns } from '../../config/lookup-columns.config';
import { buildLookupFields } from '../../config/lookup-fields.config';
import { CreateLookupRequest } from '../../dtos/create-lookup.request';
import { UpdateLookupRequest } from '../../dtos/update-lookup.request';
import { LookupApiService } from '../../services/lookup-api.service';
import { LookupListItemViewModel } from '../../view-models/lookup-list-item.view-model';
import { LookupTypeOptionViewModel } from '../../view-models/lookup-type-option.view-model';

@Component({
    selector: 'app-lookup-list',
    standalone: true,
    imports: [Crud, FormsModule, SelectModule, ToastModule],
    templateUrl: './lookup-list.html',
    providers: [MessageService]
})
export class LookupList implements OnInit {
    title = 'Lookup';
    columns = LookupColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No lookups found.';
    canManage = false;
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');

    lookupTypeOptions: SelectOption[] = [];
    selectedLookupId: number | null = null;

    constructor(
        private readonly lookupApiService: LookupApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canManage = this.authService.hasAnyRole(['Admin', 'SuperAdmin']);
        this.lookupApiService.getLookupTypes().subscribe({
            next: (types) => {
                this.lookupTypeOptions = this.toOptions(types);
                this.selectedLookupId = types[0]?.value ?? null;
                this.rebuildFields();
                this.loadLookups();
            },
            error: () => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load lookup types.';
            }
        });
    }

    onLookupTypeChange(): void {
        this.rebuildFields();
        this.loadLookups();
    }

    saveLookup(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.lookupApiService.createLookup(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Lookup created', detail: 'The lookup was created successfully.', life: 3000 });
                    this.loadLookups();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Lookup id is missing.', life: 4000 });
            return;
        }

        this.lookupApiService.updateLookup(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Lookup updated', detail: 'The lookup was updated successfully.', life: 3000 });
                this.loadLookups();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    toggleLookupStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'Lookup id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.lookupApiService.deactivateLookup(id) : this.lookupApiService.activateLookup(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Lookup ${action}`, detail: `The lookup was ${action} successfully.`, life: 3000 });
                this.loadLookups();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivateLookups(rows: Record<string, unknown>[]): void {
        const activeIds = rows
            .filter((row) => row['isActive'] === true)
            .map((row) => this.getRowId(row))
            .filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active lookups', detail: 'The selected lookups are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.lookupApiService.deactivateLookup(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Lookups deactivated', detail: `${activeIds.length} lookup(s) were deactivated.`, life: 3000 });
                this.loadLookups();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    private rebuildFields(): void {
        this.fields = buildLookupFields(this.lookupTypeOptions, this.selectedLookupId);
    }

    private loadLookups(): void {
        if (this.selectedLookupId == null) {
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        this.lookupApiService.getLookups(this.selectedLookupId).subscribe({
            next: (lookups) => {
                this.data = lookups.map((lookup) => this.toGridRow(lookup));
                this.dataNotFound = lookups.length === 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage lookups.' : 'Unable to load lookups.';
            }
        });
    }

    private toGridRow(lookup: LookupListItemViewModel): Record<string, unknown> {
        return {
            ...lookup,
            isActive: lookup.isActive === true
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreateLookupRequest {
        return {
            lookupId: this.toNumber(value['lookupId']),
            name: String(value['name'] ?? ''),
            description: this.optionalString(value['description']),
            order: value['order'] != null && value['order'] !== '' ? this.toNumber(value['order']) : null,
            dialingCode: this.optionalString(value['dialingCode'])
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdateLookupRequest {
        return {
            name: String(value['name'] ?? ''),
            description: this.optionalString(value['description']),
            order: this.toNumber(value['order']),
            isActive: value['isActive'] === true,
            dialingCode: this.optionalString(value['dialingCode'])
        };
    }

    private toOptions(values: LookupTypeOptionViewModel[]): SelectOption[] {
        return values.map((value) => ({ label: value.name, value: value.value, code: value.code }));
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

    private showError(error: { error?: { detail?: string; title?: string; errors?: string[] } }, summary: string): void {
        const detail = error.error?.errors?.join?.(' ') ?? error.error?.detail ?? error.error?.title ?? 'The operation could not be completed.';
        this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
    }
}
