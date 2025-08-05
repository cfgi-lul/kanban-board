import { AuthService } from './../api/auth.service';
import { HttpInterceptorFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip auth header for auth endpoints
  if (req.url.includes('/auth/') || req.url.includes('/register')) {
    return next(req);
  }

  const token = authService.token;
  if (token && !authService.isTokenExpired) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid, try to refresh
        return handleTokenRefresh(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(
  req: any,
  next: any,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  // Try to refresh the token
  return authService.refreshToken().pipe(
    switchMap(() => {
      // Retry the original request with new token
      const newToken = authService.token;
      if (newToken) {
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        return next(newReq);
      } else {
        // Refresh failed, redirect to login
        authService.logout();
        return throwError(() => new Error('Authentication failed'));
      }
    }),
    catchError((refreshError) => {
      // Refresh failed, redirect to login
      authService.logout();
      return throwError(() => refreshError);
    })
  ) as Observable<HttpEvent<unknown>>;
}
