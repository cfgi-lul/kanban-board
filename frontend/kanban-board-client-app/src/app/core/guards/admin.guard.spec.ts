// admin.guard.spec.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../api/auth.service';
import { adminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let authService: Partial<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = {
      isAuthenticated: jest.fn(),
      isAdmin: jest.fn(),
    } as Partial<AuthService>;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    });

    authService = TestBed.inject(AuthService) as Partial<AuthService>;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  it('should allow access for admin users', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.isAdmin as jest.Mock).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(true);
  });

  it('should redirect non-admin users', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.isAdmin as jest.Mock).mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });
});
