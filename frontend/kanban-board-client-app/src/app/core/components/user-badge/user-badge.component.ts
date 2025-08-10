import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { AuthService } from './../../api/auth.service';
import { AvatarService } from './../../api/avatar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserInstance } from '../../models/classes/UserInstance';
import { SettingsModalService } from '../../services/settings-modal.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-user-badge',
  imports: [
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
  user = input.required<UserInstance>();
  authService = inject(AuthService);
  avatarService = inject(AvatarService);
  router = inject(Router);
  settingsModalService = inject(SettingsModalService);

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
    this.router.navigate(['/auth/sign-in']);
  }

  onLogin(): void {
    this.router.navigate(['/auth/sign-in']);
  }

  onSettings(): void {
    this.settingsModalService.openSettingsModal();
  }

  getAvatarUrl(): string {
    return this.avatarService.getAvatarUrl(this.user()?.avatar);
  }
}
