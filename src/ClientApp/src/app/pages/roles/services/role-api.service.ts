import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateRoleRequest } from '../dtos/create-role.request';
import { UpdateRolePermissionsRequest } from '../dtos/update-role-permissions.request';
import { UpdateRoleRequest } from '../dtos/update-role.request';
import { RoleDetailViewModel } from '../view-models/role-detail.view-model';
import { RoleListItemViewModel } from '../view-models/role-list-item.view-model';
import { RolePermissionViewModel } from '../view-models/role-permission.view-model';
import { RoleUserListItemViewModel } from '../view-models/role-user-list-item.view-model';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
    private readonly rolesUrl = `${environment.apiUrl}/roles`;

    constructor(private readonly http: HttpClient) {}

    getRoles() {
        return this.http.get<RoleListItemViewModel[]>(this.rolesUrl);
    }

    getRole(id: string) {
        return this.http.get<RoleDetailViewModel>(`${this.rolesUrl}/${id}`);
    }

    createRole(request: CreateRoleRequest) {
        return this.http.post<RoleDetailViewModel>(this.rolesUrl, request);
    }

    updateRole(id: string, request: UpdateRoleRequest) {
        return this.http.put<RoleDetailViewModel>(`${this.rolesUrl}/${id}`, request);
    }

    activateRole(id: string) {
        return this.http.patch<void>(`${this.rolesUrl}/${id}/activate`, {});
    }

    deactivateRole(id: string) {
        return this.http.patch<void>(`${this.rolesUrl}/${id}/deactivate`, {});
    }

    getRoleUsers(id: string) {
        return this.http.get<RoleUserListItemViewModel[]>(`${this.rolesUrl}/${id}/users`);
    }

    getRolePermissions(id: string) {
        return this.http.get<RolePermissionViewModel>(`${this.rolesUrl}/${id}/permissions`);
    }

    updateRolePermissions(id: string, request: UpdateRolePermissionsRequest) {
        return this.http.put<RolePermissionViewModel>(`${this.rolesUrl}/${id}/permissions`, request);
    }
}
