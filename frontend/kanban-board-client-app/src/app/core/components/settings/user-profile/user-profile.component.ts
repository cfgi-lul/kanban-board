import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    MatChipsModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;
  currentUser: UserInstance | null = null;
  isLoading = false;
  isSaving = false;
  isUploadingAvatar = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private avatarService: AvatarService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
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

  onAvatarClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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
          this.isUploadingAvatar = false;
          this.showMessage('settings.avatarUploadSuccess', 'success');
          // Clear the file input
          this.fileInput.nativeElement.value = '';
        },
        error: error => {
          console.error('Error uploading avatar:', error);
          this.isUploadingAvatar = false;
          this.showMessage('settings.avatarUploadError', 'error');
          // Clear the file input
          this.fileInput.nativeElement.value = '';
        },
      });
    }
  }

  removeAvatar(): void {
    if (confirm('Are you sure you want to remove your avatar?')) {
      this.isUploadingAvatar = true;
      this.avatarService.removeAvatar().subscribe({
        next: updatedUser => {
          this.currentUser = updatedUser;
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
  }

  getAvatarUrl(): string {
    return this.avatarService.getAvatarUrl(this.currentUser?.avatar);
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
