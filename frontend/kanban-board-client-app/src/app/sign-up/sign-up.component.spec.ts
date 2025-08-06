import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../core/api/auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
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
        SignUpComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoading).toBe(false);
      expect(component.isSignUpLoading).toBe(false);
      expect(component.returnUrl).toBe('/boards-list');
      expect(component.signUpForm).toBeDefined();
    });

    it('should initialize form with correct structure', () => {
      const form = component.signUpForm;
      expect(form.get('userName')).toBeDefined();
      expect(form.get('name')).toBeDefined();
      expect(form.get('password')).toBeDefined();
      expect(form.get('confirmPassword')).toBeDefined();
    });

    it('should have required validators on form controls', () => {
      const userNameControl = component.signUpForm.get('userName');
      const nameControl = component.signUpForm.get('name');
      const passwordControl = component.signUpForm.get('password');
      const confirmPasswordControl =
        component.signUpForm.get('confirmPassword');

      expect(userNameControl?.errors?.['required']).toBeDefined();
      expect(nameControl?.errors?.['required']).toBeDefined();
      expect(passwordControl?.errors?.['required']).toBeDefined();
      expect(confirmPasswordControl?.errors?.['required']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should use default returnUrl when no query params', () => {
      component.ngOnInit();
      expect(component.returnUrl).toBe('/boards-list');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.signUpForm.valid).toBe(false);
    });

    it('should be valid with correct data', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signUpForm.valid).toBe(true);
    });

    it('should be invalid with short username', () => {
      component.signUpForm.patchValue({
        userName: 'ab',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signUpForm.valid).toBe(false);
    });

    it('should be invalid with short name', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'A',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signUpForm.valid).toBe(false);
    });

    it('should be invalid with short password', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: '123',
        confirmPassword: '123',
      });

      expect(component.signUpForm.valid).toBe(false);
    });

    it('should be invalid with missing required fields', () => {
      component.signUpForm.patchValue({
        userName: '',
        name: '',
        password: '',
        confirmPassword: '',
      });

      expect(component.signUpForm.valid).toBe(false);
    });
  });

  describe('Password Match Validation', () => {
    it('should be valid when passwords match', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signUpForm.valid).toBe(true);
      expect(component.signUpForm.errors).toBeNull();
    });

    it('should be invalid when passwords do not match', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'differentpassword',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(component.signUpForm.errors?.['passwordMismatch']).toBe(true);
    });

    it('should be valid when passwords match after initial mismatch', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'differentpassword',
      });

      expect(component.signUpForm.errors?.['passwordMismatch']).toBe(true);

      component.signUpForm.patchValue({
        confirmPassword: 'password123',
      });

      expect(component.signUpForm.errors).toBeNull();
    });
  });

  describe('onSignUp', () => {
    beforeEach(() => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    it('should call authService.register with correct user data', () => {
      authService.register.mockReturnValue(of({}));

      component.onSignUp();

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
      });
    });

    it('should not call authService.register when form is invalid', () => {
      component.signUpForm.patchValue({
        userName: '',
        name: '',
        password: '',
        confirmPassword: '',
      });

      component.onSignUp();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should not call authService.register when passwords do not match', () => {
      component.signUpForm.patchValue({
        userName: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'differentpassword',
      });

      component.onSignUp();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should mark form as touched when form is invalid', () => {
      component.signUpForm.patchValue({
        userName: '',
        name: '',
        password: '',
        confirmPassword: '',
      });

      const markAsTouchedSpy = jest.spyOn(
        component.signUpForm.get('userName')!,
        'markAsTouched'
      );

      component.onSignUp();

      expect(markAsTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should return required error message', () => {
      const control = component.signUpForm.get('userName');
      control?.setErrors({ required: true });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signUpForm
      );

      expect(errorMessage).toBe('userName is required');
    });

    it('should return minlength error message', () => {
      const control = component.signUpForm.get('userName');
      control?.setErrors({ minlength: { requiredLength: 3 } });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signUpForm
      );

      expect(errorMessage).toBe('userName must be at least 3 characters');
    });

    it('should return password mismatch error message', () => {
      const control = component.signUpForm.get('confirmPassword');
      control?.setErrors({ passwordMismatch: true });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'confirmPassword',
        component.signUpForm
      );

      expect(errorMessage).toBe('Passwords do not match');
    });

    it('should return empty string when no errors', () => {
      const control = component.signUpForm.get('userName');
      control?.setErrors(null);
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signUpForm
      );

      expect(errorMessage).toBe('');
    });

    it('should return empty string when control not touched', () => {
      const control = component.signUpForm.get('userName');
      control?.setErrors({ required: true });
      control?.markAsUntouched();

      const errorMessage = component.getErrorMessage(
        'userName',
        component.signUpForm
      );

      expect(errorMessage).toBe('');
    });
  });

  describe('passwordMatchValidator', () => {
    it('should return null when passwords match', () => {
      const formGroup = component.signUpForm;
      formGroup.patchValue({
        password: 'password123',
        confirmPassword: 'password123',
      });

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return passwordMismatch error when passwords do not match', () => {
      const formGroup = component.signUpForm;
      formGroup.patchValue({
        password: 'password123',
        confirmPassword: 'differentpassword',
      });

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toEqual({ passwordMismatch: true });
    });

    it('should return null when password control is null', () => {
      const formGroup = component.signUpForm;
      formGroup.removeControl('password');

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when confirmPassword control is null', () => {
      const formGroup = component.signUpForm;
      formGroup.removeControl('confirmPassword');

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle password validator with empty values', () => {
      const formGroup = component.signUpForm;
      formGroup.patchValue({
        password: '',
        confirmPassword: '',
      });

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should handle password validator with undefined values', () => {
      const formGroup = component.signUpForm;
      formGroup.patchValue({
        password: undefined,
        confirmPassword: undefined,
      });

      const result = component.passwordMatchValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should handle empty form gracefully', () => {
      const emptyForm = new FormBuilder().group({});
      component.signUpForm = emptyForm;

      expect(component.signUpForm).toBeDefined();
    });
  });
});
