import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/api/auth.service';
import { UserDisplayComponent } from '../core/components/user-display/user-display.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-sidenav',
  imports: [
    RouterModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    AsyncPipe,
    TranslateModule,
    UserDisplayComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
}
