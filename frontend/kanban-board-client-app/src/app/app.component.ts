import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from './core/components/header/header.component';
import { AsyncPipe } from '@angular/common';
import { User } from './core/models/classes/User';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatGridListModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatDividerModule,
    RouterModule,
    HeaderComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kanban-board-client-app';
  isSidenavOpen = false;
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  themeService = inject(ThemeService);

  constructor() {
    // Theme is now initialized automatically by the ThemeService
    // No need to manually initialize here
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    const currentScheme = this.themeService.getCurrentColorScheme();
    return currentScheme === 'light' ? 'dark_mode' : 'light_mode';
  }

  onThemeChange(_e: Event): void {
    // Theme changed
  }

  getUserInitials(user: User): string {
    if (!user?.name) return '?';

    const names = user.name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }
}
