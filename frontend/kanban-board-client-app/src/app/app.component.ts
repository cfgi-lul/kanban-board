import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import { AvatarService } from './core/api/avatar.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from './core/components/header/header.component';
import { AsyncPipe } from '@angular/common';
import { UserInstance } from './core/models/classes/UserInstance';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'kanban-board-client-app';
  isSidenavOpen = false;
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  avatarService = inject(AvatarService);
  themeService = inject(ThemeService);
  i18nService = inject(I18nService);
  translateService = inject(TranslateService);

  constructor() {
    // Theme is now initialized automatically by the ThemeService
    // i18n is now initialized automatically by the I18nService
    // No need to manually initialize here
  }

  ngOnInit(): void {
    // Test translation loading
    window.setTimeout(() => {
      // Translation testing removed for production
      // console.log('AppComponent: Testing translation...');
      // console.log(
      //   'AppComponent: Current language:',
      //   this.translateService.currentLang
      // );
      // console.log(
      //   'AppComponent: Default language:',
      //   this.translateService.getDefaultLang()
      // );
      // console.log(
      //   'AppComponent: Test translation:',
      //   this.translateService.instant('header.brandTitle')
      // );
    }, 1000);
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

  getUserDisplayName(user: UserInstance): string {
    if (!user) return '';

    // Use displayName if available, fallback to name, then to username
    return user.displayName || user.name || user.username || '';
  }

  getUserInitials(user: UserInstance): string {
    if (!user) return '?';

    // Use displayName for initials if available, fallback to name
    const displayName = user.displayName || user.name;
    if (!displayName) return '?';

    const names = displayName
      .trim()
      .split(' ')
      .filter(name => name.length > 0);
    if (names.length === 0) return '?';
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  getAvatarUrl(user: UserInstance): string {
    return this.avatarService.getAvatarUrl(user?.avatar);
  }
}
