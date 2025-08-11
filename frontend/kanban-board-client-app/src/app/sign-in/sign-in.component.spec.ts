import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { SignInComponent } from './sign-in.component';
import {
  AuthService,
  AuthResponse,
  LoginRequest,
} from '../core/api/auth.service';
import { UserInstance } from '../core/models/classes/UserInstance';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: jest.Mocked<AuthService>;
  let snackBar: jest.Mocked<MatSnackBar>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  const mockActivatedRoute = {
    queryParams: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        SignInComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isSignInLoading).toBe(false);
      expect(component.returnUrl).toBe('/dashboard/boards-list');
      expect(component.signInForm).toBeDefined();
    });

    it('should initialize form with correct structure', () => {
      const form = component.signInForm;
      expect(form.get('userName')).toBeDefined();
      expect(form.get('password')).toBeDefined();
    });

    it('should have required validators on form controls', () => {
      const userNameControl = component.signInForm.get('userName');
      const passwordControl = component.signInForm.get('password');

      expect(userNameControl?.errors?.['required']).toBeDefined();
      expect(passwordControl?.errors?.['required']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should use default returnUrl when no query params', () => {
      component.ngOnInit();
      expect(component.returnUrl).toBe('/dashboard/boards-list');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.signInForm.valid).toBe(false);
    });

    it('should be valid with correct data', () => {
      component.signInForm.patchValue({
        userName: 'testuser',
        password: 'password123',
      });

      expect(component.signInForm.valid).toBe(true);
    });

    it('should be invalid with short username', () => {
      component.signInForm.patchValue({
        userName: 'ab',
        password: 'password123',
      });

      expect(component.signInForm.valid).toBe(false);
    });

    it('should be invalid with short password', () => {
      component.signInForm.patchValue({
        userName: 'testuser',
        password: '123',
      });

      expect(component.signInForm.valid).toBe(false);
    });
  });

  describe('onSignIn', () => {
    beforeEach(() => {
      component.signInForm.patchValue({
        userName: 'testuser',
        password: 'password123',
      });
    });

    it('should call authService.login with correct credentials', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        email: 'test@example.com',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        enabled: true,
      } as UserInstance;

      const mockAuthResponse: AuthResponse = {
        token: 'test-token',
        user: mockUser,
      };

      authService.login.mockReturnValue(of(mockAuthResponse));

      component.onSignIn();

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      } as LoginRequest);
    });

    it('should not call authService.login when form is invalid', () => {
      component.signInForm.patchValue({
        userName: '',
        password: '',
      });

      component.onSignIn();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should mark form as touched when form is invalid', () => {
      component.signInForm.patchValue({
        userName: '',
        password: '',
      });

      const markAsTouchedSpy = jest.spyOn(
        component.signInForm.get('userName')!,
        'markAsTouched'
      );

      component.onSignIn();

      expect(markAsTouchedSpy).toHaveBeenCalled();
    });

    it('should set loading state during login', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        email: 'test@example.com',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        enabled: true,
      } as UserInstance;

      const mockAuthResponse: AuthResponse = {
        token: 'test-token',
        user: mockUser,
      };

      authService.login.mockReturnValue(of(mockAuthResponse));

      component.onSignIn();

      // The loading state should be reset after the request completes
      expect(component.isSignInLoading).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return required error message', () => {
      const control = component.signInForm.get('userName');
      control?.setErrors({ required: true });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signInForm
      );

      expect(errorMessage).toBe('userName is required');
    });

    it('should return minlength error message', () => {
      const control = component.signInForm.get('userName');
      control?.setErrors({ minlength: { requiredLength: 3 } });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signInForm
      );

      expect(errorMessage).toBe('userName must be at least 3 characters');
    });

    it('should return empty string when no errors', () => {
      const control = component.signInForm.get('userName');
      control?.setErrors(null);
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signInForm
      );

      expect(errorMessage).toBe('');
    });

    it('should return empty string when control not touched', () => {
      const control = component.signInForm.get('userName');
      control?.setErrors({ required: true });
      control?.markAsUntouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signInForm
      );

      expect(errorMessage).toBe('');
    });
  });
});
