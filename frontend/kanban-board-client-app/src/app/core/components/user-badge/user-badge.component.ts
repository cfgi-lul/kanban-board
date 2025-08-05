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
import { Router } from '@angular/router';
import { User } from '../../models/classes/User';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.scss',
})
export class UserBadgeComponent {
  user = input.required<User>();
  authService = inject(AuthService);
  router = inject(Router);

  getUserInitials(): string {
    const user = this.user();
    if (!user?.name) return '?';

    const names = user.name.split(' ');
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
}
