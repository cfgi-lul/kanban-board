import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/api/auth.service';
import { AvatarService } from '../core/api/avatar.service';
import { UserInstance } from '../core/models/classes/UserInstance';
import { getUserDisplayName, getUserInitials } from '../core/utils/user.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-sidenav',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  avatarService = inject(AvatarService);

  getUserDisplayName = getUserDisplayName;
  getUserInitials = getUserInitials;

  getAvatarUrl(user: UserInstance): string {
    return this.avatarService.getAvatarUrl(user?.avatar);
  }
}
