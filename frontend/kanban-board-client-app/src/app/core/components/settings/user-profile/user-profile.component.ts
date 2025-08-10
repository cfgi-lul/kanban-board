import {
  Component,
  OnInit,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { UserService, UserUpdateRequest } from '../../../api/user.service';
import { AvatarService } from '../../../api/avatar.service';
import { UserInstance } from '../../../models/classes/UserInstance';
import { AuthStateService } from '../../../services/auth-state.service';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AvatarPickerComponent } from './avatar-picker/avatar-picker.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'kn-user-profile',
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
    MatChipsModule,
    MatTooltipModule,
    TranslateModule,
    AccountInfoComponent,
    MatDividerModule,
    AvatarPickerComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private avatarService = inject(AvatarService);
  private snackBar = inject(MatSnackBar);
  private authStateService = inject(AuthStateService);

  profileForm: FormGroup;
  currentUser: UserInstance | null = null;
  isLoading = false;
  isSaving = false;
  isUploadingAvatar = false;

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // Use existing user data from auth state instead of making a new API call
    const currentUser = this.authStateService.user();
    if (currentUser) {
      this.currentUser = currentUser;
      this.profileForm.patchValue({
        displayName: currentUser.displayName || currentUser.name || '',
        email: currentUser.email || '',
      });
    } else {
      // Fallback to API call only if user data is not available in auth state
      this.isLoading = true;
      this.userService.getCurrentUser().subscribe({
        next: user => {
          this.currentUser = user;
          this.profileForm.patchValue({
            displayName: user.displayName || user.name || '',
            email: user.email || '',
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
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      const updateRequest: UserUpdateRequest = {
        displayName: this.profileForm.get('displayName')?.value,
        email: this.profileForm.get('email')?.value,
      };

      this.userService.updateCurrentUser(updateRequest).subscribe({
        next: updatedUser => {
          this.currentUser = updatedUser;
          // Update the auth state service to reflect changes throughout the app
          this.authStateService.updateUser(updatedUser);
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

  onFileSelected(file: File): void {
    // Validate file
    const validation = this.avatarService.validateFile(file);
    if (!validation.isValid) {
      this.showMessage(validation.error || 'Invalid file', 'error');
      return;
    }

    this.isUploadingAvatar = true;
    this.avatarService.uploadAvatar(file).subscribe({
      next: updatedUser => {
        this.currentUser = updatedUser;
        // Update the auth state service to reflect changes throughout the app
        this.authStateService.updateUser(updatedUser);
        this.isUploadingAvatar = false;
        this.showMessage('settings.avatarUploadSuccess', 'success');
      },
      error: error => {
        console.error('Error uploading avatar:', error);
        this.isUploadingAvatar = false;
        this.showMessage('settings.avatarUploadError', 'error');
      },
    });
  }

  removeAvatar(): void {
    this.isUploadingAvatar = true;
    this.avatarService.removeAvatar().subscribe({
      next: updatedUser => {
        this.currentUser = updatedUser;
        // Update the auth state service to reflect changes throughout the app
        this.authStateService.updateUser(updatedUser);
        this.isUploadingAvatar = false;
        this.showMessage('settings.avatarRemovedSuccess', 'success');
      },
      error: error => {
        console.error('Error removing avatar:', error);
        this.isUploadingAvatar = false;
        this.showMessage('settings.avatarRemovedError', 'error');
      },
    });
  }

  getAvatarUrl(): string {
    return this.avatarService.getAvatarUrl(this.currentUser?.avatar || null);
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
    if (control?.hasError('email')) {
      return 'settings.invalidEmail';
    }
    return '';
  }
}
