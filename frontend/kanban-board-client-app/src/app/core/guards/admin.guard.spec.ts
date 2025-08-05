// admin.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { adminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = {
      isAuthenticated: jest.fn(),
      isAdmin: jest.fn(),
    } as unknown as AuthService;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  it('should allow access for admin users', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );
    expect(result).toBe(true);
  });

  it('should redirect non-admin users', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
