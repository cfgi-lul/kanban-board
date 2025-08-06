import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { AuthService } from './../../api/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../../models/classes/User';
import { SettingsComponent } from '../settings/settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-badge',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.scss',
})
export class UserBadgeComponent {
  user = input.required<User>();
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);

  getUserDisplayName(): string {
    const user = this.user();
    if (!user) return '';

    // Use displayName if available, fallback to name, then to username
    return user.displayName || user.name || user.username || '';
  }

  getUserInitials(): string {
    const user = this.user();
    if (!user) return '?';

    // Use displayName for initials if available, fallback to name
    const displayName = user.displayName || user.name;
    if (!displayName) return '?';

    const names = displayName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }

  onLogin(): void {
    this.router.navigate(['/sign-in']);
  }

  onSettings(): void {
    this.dialog.open(SettingsComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'settings-dialog-container',
      data: {},
    });
  }
}
