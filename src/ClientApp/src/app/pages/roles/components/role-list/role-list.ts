import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { RoleColumns } from '../../config/role-columns.config';
import { RoleFields } from '../../config/role-fields.config';
import { CreateRoleRequest } from '../../dtos/create-role.request';
import { UpdateRoleRequest } from '../../dtos/update-role.request';
import { RoleApiService } from '../../services/role-api.service';
import { PermissionMatrixItemViewModel } from '../../view-models/permission-matrix-item.view-model';
import { RoleDetailViewModel } from '../../view-models/role-detail.view-model';
import { RoleListItemViewModel } from '../../view-models/role-list-item.view-model';
import { RolePermissionViewModel } from '../../view-models/role-permission.view-model';

type PermissionFlagKey = 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove' | 'canExport';

@Component({
    selector: 'app-role-list',
    standalone: true,
    imports: [ButtonModule, Crud, DialogModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    templateUrl: './role-list.html'
})
export class RoleList implements OnInit {
    title = 'Role';
    columns = RoleColumns;
    fields: DynamicField[] = RoleFields;
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No roles found.';
    detailDialog = false;
    permissionDialog = false;
    selectedRole?: RoleDetailViewModel;
    selectedPermissionRole?: RolePermissionViewModel;
    canCreate = false;
    canEdit = false;
    canDelete = false;
    canExport = false;
    canManagePermissions = false;
    canViewPermissions = false;
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');

    constructor(
        private readonly roleApiService: RoleApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.roles.create);
        this.canEdit = this.authService.hasPermission(Permissions.roles.edit);
        this.canDelete = this.authService.hasPermission(Permissions.roles.delete);
        this.canExport = this.authService.hasPermission(Permissions.roles.export);
        this.canManagePermissions = this.authService.hasPermission(Permissions.permissions.edit);
        this.canViewPermissions = this.authService.hasPermission(Permissions.permissions.view);
        this.loadRoles();
    }

    saveRole(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.roleApiService.createRole(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Role created', detail: 'The role was created successfully.', life: 3000 });
                    this.loadRoles();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Role id is missing.', life: 4000 });
            return;
        }

        this.roleApiService.updateRole(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Role updated', detail: 'The role was updated successfully.', life: 3000 });
                this.loadRoles();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    toggleRoleStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'Role id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.roleApiService.deactivateRole(id) : this.roleApiService.activateRole(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Role ${action}`, detail: `The role was ${action} successfully.`, life: 3000 });
                this.loadRoles();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivateRoles(rows: Record<string, unknown>[]): void {
        const activeIds = rows.filter((row) => row['isActive'] === true).map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active roles', detail: 'The selected roles are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.roleApiService.deactivateRole(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Roles deactivated', detail: `${activeIds.length} role(s) were deactivated.`, life: 3000 });
                this.loadRoles();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    openRoleDetail(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Detail failed', detail: 'Role id is missing.', life: 4000 });
            return;
        }

        this.roleApiService.getRole(id).subscribe({
            next: (role) => {
                this.selectedRole = role;
                this.detailDialog = true;
            },
            error: (error) => this.showError(error, 'Detail failed')
        });
    }

    openPermissionMatrix(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Permissions failed', detail: 'Role id is missing.', life: 4000 });
            return;
        }

        this.openPermissionMatrixById(id);
    }

    openPermissionMatrixById(id: string): void {
        this.roleApiService.getRolePermissions(id).subscribe({
            next: (permissions) => {
                this.selectedPermissionRole = permissions;
                this.permissionDialog = true;
            },
            error: (error) => this.showError(error, 'Permissions failed')
        });
    }

    savePermissions(): void {
        if (!this.selectedPermissionRole) {
            return;
        }

        this.roleApiService
            .updateRolePermissions(this.selectedPermissionRole.roleId, {
                roleId: this.selectedPermissionRole.roleId,
                permissions: this.selectedPermissionRole.modules
            })
            .subscribe({
                next: (permissions) => {
                    this.selectedPermissionRole = permissions;
                    this.messageService.add({ severity: 'success', summary: 'Permissions saved', detail: 'Role permissions were updated successfully.', life: 3000 });
                    this.permissionDialog = false;
                },
                error: (error) => this.showError(error, 'Save permissions failed')
            });
    }

    togglePermission(item: PermissionMatrixItemViewModel, field: PermissionFlagKey, event: Event): void {
        item[field] = (event.target as HTMLInputElement).checked;
    }

    private loadRoles(): void {
        this.isLoading = true;
        this.roleApiService.getRoles().subscribe({
            next: (roles) => {
                this.data = roles.map((role) => this.toGridRow(role));
                this.dataNotFound = roles.length === 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage roles.' : 'Unable to load roles.';
            }
        });
    }

    private toGridRow(role: RoleListItemViewModel): Record<string, unknown> {
        return {
            ...role,
            isSystemRole: role.isSystemRole === true,
            isActive: role.isActive === true
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreateRoleRequest {
        return {
            name: String(value['name'] ?? ''),
            code: this.optionalString(value['code']),
            description: String(value['description'] ?? ''),
            isSystemRole: false,
            isActive: value['isActive'] === true
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdateRoleRequest {
        return {
            name: String(value['name'] ?? ''),
            code: this.optionalString(value['code']),
            description: String(value['description'] ?? ''),
            isActive: value['isActive'] === true
        };
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
