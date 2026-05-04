import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { UserColumns } from '../../config/user-columns.config';
import { buildUserFields } from '../../config/user-fields.config';
import { CreateUserRequest } from '../../dtos/create-user.request';
import { UpdateUserRequest } from '../../dtos/update-user.request';
import { UserApiService } from '../../services/user-api.service';
import { RoleListItemViewModel } from '../../view-models/role-list-item.view-model';
import { UserListItemViewModel } from '../../view-models/user-list-item.view-model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [Crud, ToastModule],
    providers: [MessageService],
    templateUrl: './user-list.html'
})
export class UserList implements OnInit {
    title = 'User';
    columns = UserColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No users found.';
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');

    constructor(
        private readonly userApiService: UserApiService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadPage();
    }

    saveUser(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.userApiService.createUser(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'User created', detail: 'The user was created successfully.', life: 3000 });
                    this.loadUsers();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'User id is missing.', life: 4000 });
            return;
        }

        this.userApiService.updateUser(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'User updated', detail: 'The user was updated successfully.', life: 3000 });
                this.loadUsers();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    toggleUserStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'User id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.userApiService.deactivateUser(id) : this.userApiService.activateUser(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `User ${action}`, detail: `The user was ${action} successfully.`, life: 3000 });
                this.loadUsers();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivateUsers(rows: Record<string, unknown>[]): void {
        const activeIds = rows.filter((row) => row['isActive'] === true).map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active users', detail: 'The selected users are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.userApiService.deactivateUser(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Users deactivated', detail: `${activeIds.length} user(s) were deactivated.`, life: 3000 });
                this.loadUsers();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    private loadPage(): void {
        this.isLoading = true;

        forkJoin({
            roles: this.userApiService.getRoles(),
            users: this.userApiService.getUsers()
        }).subscribe({
            next: ({ roles, users }) => {
                this.fields = buildUserFields(this.toRoleOptions(roles));
                this.setUsers(users);
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage users.' : 'Unable to load users.';
            }
        });
    }

    private loadUsers(): void {
        this.userApiService.getUsers().subscribe({
            next: (users) => this.setUsers(users),
            error: () => {
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load users.';
            }
        });
    }

    private setUsers(users: UserListItemViewModel[]): void {
        this.data = users.map((user) => this.toGridRow(user));
        this.dataNotFound = users.length === 0;
    }

    private toGridRow(user: UserListItemViewModel): Record<string, unknown> {
        const { firstName, lastName } = this.splitFullName(user.fullName);

        return {
            ...user,
            firstName,
            lastName,
            roleIds: user.roleIds ?? [],
            rolesDisplay: user.roles?.join(', ') ?? '',
            password: ''
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreateUserRequest {
        return {
            firstName: String(value['firstName'] ?? ''),
            lastName: String(value['lastName'] ?? ''),
            email: String(value['email'] ?? ''),
            username: String(value['username'] ?? ''),
            roleIds: this.toStringArray(value['roleIds']),
            password: String(value['password'] ?? ''),
            generatePassword: false
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdateUserRequest {
        return {
            firstName: String(value['firstName'] ?? ''),
            lastName: String(value['lastName'] ?? ''),
            phoneNumber: this.optionalString(value['phoneNumber']),
            departmentId: this.optionalString(value['departmentId']),
            managerId: this.optionalString(value['managerId']),
            roleIds: this.toStringArray(value['roleIds']),
            isActive: value['isActive'] === true
        };
    }

    private toRoleOptions(roles: RoleListItemViewModel[]): SelectOption[] {
        return roles.filter((role) => role.isActive).map((role) => ({ label: role.name, value: role.id }));
    }

    private splitFullName(fullName: string): { firstName: string; lastName: string } {
        const parts = fullName.trim().split(/\s+/);
        return {
            firstName: parts[0] ?? '',
            lastName: parts.slice(1).join(' ')
        };
    }

    private getRowId(row?: Record<string, unknown>): string | null {
        return typeof row?.['id'] === 'string' && row['id'].trim() ? row['id'] : null;
    }

    private toStringArray(value: unknown): string[] {
        return Array.isArray(value) ? value.map(String) : [];
    }

    private optionalString(value: unknown): string | null {
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }

    private showError(error: { error?: { detail?: string; title?: string; errors?: string[] } }, summary: string): void {
        const detail = error.error?.errors?.join?.(' ') ?? error.error?.detail ?? error.error?.title ?? 'The operation could not be completed.';
        this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
    }
}
