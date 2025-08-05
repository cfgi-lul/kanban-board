import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './../core/api/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { take } from 'rxjs';

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
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signInForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      userName: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignIn(): void {
    if (this.signInForm.valid) {
      console.log('onSignIn', this.signInForm.valid);
      this.authService
        .login({
          username: this.signInForm.value.userName,
          password: this.signInForm.value.password,
        })
        .pipe(take(1))
        .subscribe();
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.authService
        .register({
          username: this.signUpForm.value.userName,
          name: this.signUpForm.value.name,
          password: this.signUpForm.value.password,
        })
        .pipe(take(1))
        .subscribe();
    }
  }
}
