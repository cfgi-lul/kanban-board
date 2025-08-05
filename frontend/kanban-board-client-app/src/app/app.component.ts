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
import { tap } from 'rxjs';

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
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kanban-board-client-app';
  isSidenavOpen = false;
  currentUser = inject(AuthService)
    .current()
    .pipe(tap((e) => console.log(123)));
  isAdmin = inject(AuthService).isAdmin();
  themeService = inject(ThemeService);

  constructor() {
    // Initialize theme on app startup
    const savedTheme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark' | 'system';
    this.themeService.toggleTheme(savedTheme);
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  toggleTheme(): void {
    const currentTheme = this.themeService.currentTheme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.toggleTheme(newTheme);
  }

  getThemeIcon(): string {
    return this.themeService.currentTheme === 'light' ? 'dark_mode' : 'light_mode';
  }
}
