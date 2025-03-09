// admin.guard.spec.ts
import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { adminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'isAdmin',
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should allow access for admin users', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.isAdmin.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any),
    );
    expect(result).toBeTrue();
  });

  it('should redirect non-admin users', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any),
    );
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
