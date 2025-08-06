import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { UserService, UserUpdateRequest } from '../../../api/user.service';
import { User } from '../../../models/classes/User';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user;
        this.profileForm.patchValue({
          displayName: user.displayName || user.name || '',
        });
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
        this.showMessage('settings.profileLoadError', 'error');
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      const updateRequest: UserUpdateRequest = {
        displayName: this.profileForm.get('displayName')?.value,
      };

      this.userService.updateCurrentUser(updateRequest).subscribe({
        next: updatedUser => {
          this.currentUser = updatedUser;
          this.isSaving = false;
          this.showMessage('settings.profileUpdateSuccess', 'success');
        },
        error: error => {
          console.error('Error updating profile:', error);
          this.isSaving = false;
          this.showMessage('settings.profileUpdateError', 'error');
        },
      });
    }
  }

  private showMessage(messageKey: string, type: 'success' | 'error'): void {
    this.snackBar.open(messageKey, 'settings.close', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.hasError('required')) {
      return 'settings.fieldRequired';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `settings.minLength${requiredLength}`;
    }
    return '';
  }
}
