import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};

export const authChildGuard: CanActivateChildFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated() ? router.createUrlTree(['/']) : true;
};

export function roleGuard(roles: string[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/auth/login']);
        }

        return authService.hasAnyRole(roles) ? true : router.createUrlTree(['/auth/access']);
    };
}

export function permissionGuard(permission: string): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/auth/login']);
        }

        return authService.hasPermission(permission) ? true : router.createUrlTree(['/auth/access']);
    };
}

export function anyPermissionGuard(permissions: string[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/auth/login']);
        }

        return authService.hasAnyPermission(permissions) ? true : router.createUrlTree(['/auth/access']);
    };
}
