import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateUserRequest } from '../dtos/create-user.request';
import { UpdateUserRequest } from '../dtos/update-user.request';
import { RoleListItemViewModel } from '../view-models/role-list-item.view-model';
import { UserListItemViewModel } from '../view-models/user-list-item.view-model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
    private readonly usersUrl = `${environment.apiUrl}/users`;
    private readonly rolesUrl = `${environment.apiUrl}/roles`;

    constructor(private readonly http: HttpClient) {}

    getUsers() {
        return this.http.get<UserListItemViewModel[]>(this.usersUrl);
    }

    createUser(request: CreateUserRequest) {
        return this.http.post<UserListItemViewModel>(this.usersUrl, request);
    }

    updateUser(id: string, request: UpdateUserRequest) {
        return this.http.put<UserListItemViewModel>(`${this.usersUrl}/${id}`, request);
    }

    activateUser(id: string) {
        return this.http.patch<void>(`${this.usersUrl}/${id}/activate`, {});
    }

    deactivateUser(id: string) {
        return this.http.patch<void>(`${this.usersUrl}/${id}/deactivate`, {});
    }

    getRoles() {
        return this.http.get<RoleListItemViewModel[]>(this.rolesUrl);
    }
}
