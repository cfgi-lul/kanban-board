import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  HostListener,
  signal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SettingsModalService } from './core/services/settings-modal.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { HeaderComponent } from './core/components/header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    RouterModule,
    HeaderComponent,
    SidenavComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'kanban-board-client-app';
  isSidenavOpen = signal<boolean>(false);
  sidenavMode = signal<MatDrawerMode>('side');
  isLargeScreen = signal<boolean>(false);
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  themeService = inject(ThemeService);
  i18nService = inject(I18nService);
  translateService = inject(TranslateService);
  settingsModalService = inject(SettingsModalService);

  private readonly LARGE_SCREEN_BREAKPOINT = 1280;

  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateSidenavBehavior()
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasLargeScreen = this.isLargeScreen();
    this.isLargeScreen.set(window.innerWidth >= this.LARGE_SCREEN_BREAKPOINT);

    if (this.isLargeScreen() !== wasLargeScreen) {
      this.updateSidenavBehavior();
    }
  }

  private updateSidenavBehavior(): void {
    console.log('updateSidenavBehavior', this.isLargeScreen());
    if (this.isLargeScreen()) {
      this.sidenavMode.set('side');
      this.isSidenavOpen.set(true);
    } else {
      this.sidenavMode.set('over');
      this.isSidenavOpen.set(false);
    }
  }

  toggleSidenav(): void {
    if (!this.isLargeScreen()) {
      this.isSidenavOpen.set(!this.isSidenavOpen());
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
