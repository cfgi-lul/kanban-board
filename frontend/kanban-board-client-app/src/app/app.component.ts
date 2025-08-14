import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SettingsModalService } from './core/services/settings-modal.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './core/components/header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidenavService } from './core/services/sidenav.service';

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
export class AppComponent {
  title = 'kanban-board-client-app';
  sidenav = inject(SidenavService);
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  themeService = inject(ThemeService);
  i18nService = inject(I18nService);
  translateService = inject(TranslateService);
  settingsModalService = inject(SettingsModalService);

  constructor() {}

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
