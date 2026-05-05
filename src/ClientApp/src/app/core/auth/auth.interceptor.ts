import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isApiUrl } from '@/core/http/api-url';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();
    const isApiRequest = isApiUrl(request.url);
    const isAuthRequest = request.url.includes('/auth/login');

    if (isApiRequest && !isAuthRequest && authService.isTokenExpired()) {
        authService.clearSession();
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Authentication session expired.'));
    }

    const securedRequest =
        token && isApiRequest && !isAuthRequest
            ? request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
              })
            : request;

    return next(securedRequest).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && isApiRequest) {
                if (error.status === 401) {
                    authService.clearSession();
                    router.navigate(['/auth/login']);
                } else if (error.status === 403) {
                    router.navigate(['/auth/access']);
                }
            }

            return throwError(() => error);
        })
    );
};
