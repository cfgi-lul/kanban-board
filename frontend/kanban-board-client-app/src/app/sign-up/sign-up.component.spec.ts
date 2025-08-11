import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, delay } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../core/api/auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let snackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    const authServiceSpy = {
      register: jest.fn(),
    };

    const routerSpy = {
      navigate: jest.fn(),
      createUrlTree: jest.fn(),
      serializeUrl: jest.fn(),
      events: of({}),
    };

    const snackBarSpy = {
      open: jest.fn(),
    };

    const activatedRouteSpy = {
      queryParams: of({}),
    };

    const locationStrategySpy = {
      prepareExternalUrl: jest.fn().mockReturnValue(''),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SignUpComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LocationStrategy, useValue: locationStrategySpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with only username and password fields', () => {
    const form = component.signUpForm;
    expect(form.contains('userName')).toBeTruthy();
    expect(form.contains('password')).toBeTruthy();
    expect(form.contains('name')).toBeFalsy();
    expect(form.contains('confirmPassword')).toBeFalsy();
  });

  it('should validate username is required', () => {
    const usernameControl = component.signUpForm.get('userName');
    expect(usernameControl?.errors?.['required']).toBeTruthy();

    usernameControl?.setValue('testuser');
    expect(usernameControl?.errors?.['required']).toBeFalsy();
  });

  it('should validate password is required', () => {
    const passwordControl = component.signUpForm.get('password');
    expect(passwordControl?.errors?.['required']).toBeTruthy();

    passwordControl?.setValue('password123');
    expect(passwordControl?.errors?.['required']).toBeFalsy();
  });

  it('should validate username minimum length', () => {
    const usernameControl = component.signUpForm.get('userName');
    usernameControl?.setValue('ab'); // Less than 3 characters
    expect(usernameControl?.errors?.['minlength']).toBeTruthy();

    usernameControl?.setValue('abc'); // Exactly 3 characters
    expect(usernameControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.signUpForm.get('password');
    passwordControl?.setValue('12345'); // Less than 6 characters
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    passwordControl?.setValue('123456'); // Exactly 6 characters
    expect(passwordControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should be valid with proper username and password', () => {
    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    expect(component.signUpForm.valid).toBeTruthy();
  });

  it('should call register service method on successful sign up', () => {
    const mockResponse = { 
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        enabled: true
      }
    };
    authService.register.mockReturnValue(of(mockResponse));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should set loading state to true when sign up starts', () => {
    // Use a delayed observable to keep loading state true
    authService.register.mockReturnValue(of({
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        enabled: true
      }
    }).pipe(delay(100)));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    // Check that loading was set to true (even if it gets set back to false immediately)
    expect(component.isLoading).toBe(true);
  });

  it('should navigate to return URL on successful sign up', () => {
    const mockResponse = { 
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        enabled: true
      }
    };
    authService.register.mockReturnValue(of(mockResponse));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/boards-list']);
  });

  it('should handle successful sign up', () => {
    const mockResponse = { 
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
        enabled: true
      }
    };
    authService.register.mockReturnValue(of(mockResponse));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    // Verify that the auth service was called with correct parameters
    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should handle registration error', () => {
    const errorMessage = 'Registration failed';
    const mockError = { message: errorMessage };
    authService.register.mockReturnValue(throwError(() => mockError));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    // Verify that the auth service was called even when there's an error
    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should handle registration error without message', () => {
    const mockError = {};
    authService.register.mockReturnValue(throwError(() => mockError));

    component.signUpForm.patchValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSignUp();

    // Verify that the auth service was called even when there's an error without message
    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should not call register service when form is invalid', () => {
    component.signUpForm.patchValue({
      userName: '',
      password: '',
    });

    component.onSignUp();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should mark form as touched when form is invalid', () => {
    const markAsTouchedSpy = jest.spyOn(component.signUpForm, 'markAsTouched');
    
    component.signUpForm.patchValue({
      userName: '',
      password: '',
    });

    component.onSignUp();

    expect(markAsTouchedSpy).toHaveBeenCalled();
  });

  it('should return correct error message for required field', () => {
    const usernameControl = component.signUpForm.get('userName');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors({ required: true });

    const errorMessage = component.getErrorMessage('userName', component.signUpForm);
    expect(errorMessage).toBe('userName is required');
  });

  it('should return correct error message for minlength field', () => {
    const usernameControl = component.signUpForm.get('userName');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors({ minlength: { requiredLength: 3 } });

    const errorMessage = component.getErrorMessage('userName', component.signUpForm);
    expect(errorMessage).toBe('userName must be at least 3 characters');
  });

  it('should return empty string when field is not touched', () => {
    const usernameControl = component.signUpForm.get('userName');
    usernameControl?.setErrors({ required: true });

    const errorMessage = component.getErrorMessage('userName', component.signUpForm);
    expect(errorMessage).toBe('');
  });

  it('should return empty string when field has no errors', () => {
    const usernameControl = component.signUpForm.get('userName');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors(null);

    const errorMessage = component.getErrorMessage('userName', component.signUpForm);
    expect(errorMessage).toBe('');
  });
});
