import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AuthService,
  LoginRequest,
  RegisterRequest,
} from './../core/api/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { take, finalize } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sign-in',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isLoading = false;
  isSignInLoading = false;
  isSignUpLoading = false;
  returnUrl: string = '/boards-list';
  matcher = new ErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.signInForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signUpForm = this.fb.group(
      {
        userName: ['', [Validators.required, Validators.minLength(3)]],
        name: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/boards-list'
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/boards-list';
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSignIn(): void {
    if (this.signInForm.valid) {
      this.isSignInLoading = true;
      const credentials: LoginRequest = {
        username: this.signInForm.value.userName,
        password: this.signInForm.value.password,
      };

      this.authService
        .login(credentials)
        .pipe(
          take(1),
          finalize(() => {
            this.isSignInLoading = false;
          })
        )
        .subscribe({
          next: () => {
            this.showSuccessMessage('Successfully signed in!');
            this.router.navigate([this.returnUrl]);
          },
          error: error => {
            this.showErrorMessage(
              error.message || 'Sign in failed. Please try again.'
            );
          },
        });
    } else {
      this.markFormGroupTouched(this.signInForm);
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.isSignUpLoading = true;
      const userData: RegisterRequest = {
        username: this.signUpForm.value.userName,
        name: this.signUpForm.value.name,
        password: this.signUpForm.value.password,
      };

      this.authService
        .register(userData)
        .pipe(
          take(1),
          finalize(() => {
            this.isSignUpLoading = false;
          })
        )
        .subscribe({
          next: () => {
            this.showSuccessMessage('Account created successfully! Welcome!');
            this.router.navigate([this.returnUrl]);
          },
          error: error => {
            this.showErrorMessage(
              error.message || 'Registration failed. Please try again.'
            );
          },
        });
    } else {
      this.markFormGroupTouched(this.signUpForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  getErrorMessage(controlName: string, form: FormGroup): string {
    const control = form.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}
