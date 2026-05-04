import { CanActivateFn, Router } from '@angular/router';
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
