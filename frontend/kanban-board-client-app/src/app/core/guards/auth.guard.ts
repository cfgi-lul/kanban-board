import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated first (synchronous check)
  if (!authService.isAuthenticated()) {
    // Store the attempted URL for redirect after login
    const returnUrl = state.url;
    router.navigate(['/sign-in'], { queryParams: { returnUrl } });
    return of(false);
  }

  // If authenticated, validate token and get current user (this will use cached request)
  return authService.current().pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        // User not found, redirect to login
        const returnUrl = state.url;
        router.navigate(['/sign-in'], { queryParams: { returnUrl } });
        return false;
      }
    }),
    catchError(() => {
      // Error occurred, redirect to login
      const returnUrl = state.url;
      router.navigate(['/sign-in'], { queryParams: { returnUrl } });
      return of(false);
    })
  );
};
