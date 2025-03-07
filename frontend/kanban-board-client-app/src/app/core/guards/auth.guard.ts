import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/sign-in']);
  return false;
};
