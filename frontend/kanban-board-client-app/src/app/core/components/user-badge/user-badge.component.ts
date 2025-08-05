import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { AuthService } from './../../api/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { User } from '../../models/classes/User';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.scss',
})
export class UserBadgeComponent {
  user = input.required<User>();
  authService = inject(AuthService);
  router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }

  onLogin(): void {
    this.router.navigate(['/sign-in']);
  }
}
