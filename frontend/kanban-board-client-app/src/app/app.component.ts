import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
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
import { User } from './core/models/classes/User';
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
      console.log('AppComponent: Testing translation...');
      console.log(
        'AppComponent: Current language:',
        this.translateService.currentLang
      );
      console.log(
        'AppComponent: Default language:',
        this.translateService.getDefaultLang()
      );
      console.log(
        'AppComponent: Test translation:',
        this.translateService.instant('header.brandTitle')
      );
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
