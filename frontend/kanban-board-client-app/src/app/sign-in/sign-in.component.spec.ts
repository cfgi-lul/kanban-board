import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SignInComponent } from './sign-in.component';
import { AuthService } from '../core/api/auth.service';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    login: jest.fn(),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
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

    it('should be invalid with missing username', () => {
      component.signInForm.patchValue({
        userName: '',
        password: 'password123',
      });

      expect(component.signInForm.valid).toBe(false);
    });

    it('should be invalid with missing password', () => {
      component.signInForm.patchValue({
        userName: 'testuser',
        password: '',
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
      authService.login.mockReturnValue(
        of({ token: 'test-token', user: {} as unknown })
      );

      component.onSignIn();

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
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

  describe('Private Methods', () => {
    it('should handle form with no controls', () => {
      const emptyForm = new FormBuilder().group({});

      expect(() => {
        // Test that the component can handle edge cases
        component.signInForm = emptyForm;
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty form gracefully', () => {
      const emptyForm = new FormBuilder().group({});
      component.signInForm = emptyForm;

      expect(component.signInForm).toBeDefined();
    });
  });
});
