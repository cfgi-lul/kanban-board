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
  onLogout() {
    console.log('onLogout');
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
  onLogin() {
    console.log('onLogin');
    this.router.navigate(['/sign-in']);
  }
  user = input.required<User>();
  authService = inject(AuthService);
  router = inject(Router);
}
