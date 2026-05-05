import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { apiUrl } from '@/core/http/api-url';
import { AuthUser, LoginRequest, LoginResponse } from './auth.models';

const tokenStorageKey = 'crm.auth.token';
const userStorageKey = 'crm.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly currentUserSignal = signal<AuthUser | null>(this.readUser());

    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isAuthenticated = computed(() => {
        const user = this.currentUserSignal();
        return !!user && new Date(user.expiration).getTime() > Date.now();
    });

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {}

    login(request: LoginRequest) {
        return this.http.post<LoginResponse>(apiUrl('/auth/login'), request).pipe(
            tap((response) => {
                const user: AuthUser = {
                    userId: response.userId,
                    fullName: response.fullName,
                    roles: response.roles,
                    permissions: response.permissions ?? [],
                    expiration: response.expiration
                };

                this.storage?.setItem(tokenStorageKey, response.token);
                this.storage?.setItem(userStorageKey, JSON.stringify(user));
                this.currentUserSignal.set(user);
            })
        );
    }

    logout(): void {
        this.clearSession();
        this.router.navigate(['/auth/login']);
    }

    clearSession(): void {
        this.storage?.removeItem(tokenStorageKey);
        this.storage?.removeItem(userStorageKey);
        this.currentUserSignal.set(null);
    }

    getToken(): string | null {
        return this.storage?.getItem(tokenStorageKey) ?? null;
    }

    hasAnyRole(roles: string[]): boolean {
        const user = this.currentUserSignal();
        return !!user && roles.some((role) => user.roles.includes(role));
    }

    hasPermission(permission: string): boolean {
        const user = this.currentUserSignal();
        return !!user && (this.hasAnyRole(['Admin', 'SuperAdmin']) || user.permissions.includes(permission));
    }

    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some((permission) => this.hasPermission(permission));
    }

    isTokenExpired(): boolean {
        const user = this.currentUserSignal();
        return !user || new Date(user.expiration).getTime() <= Date.now();
    }

    private readUser(): AuthUser | null {
        const raw = this.storage?.getItem(userStorageKey);
        if (!raw) {
            return null;
        }

        try {
            const user = JSON.parse(raw) as AuthUser;
            user.permissions ??= [];
            return new Date(user.expiration).getTime() > Date.now() ? user : null;
        } catch {
            this.storage?.removeItem(userStorageKey);
            this.storage?.removeItem(tokenStorageKey);
            return null;
        }
    }

    private get storage(): Storage | null {
        return typeof localStorage === 'undefined' ? null : localStorage;
    }
}
