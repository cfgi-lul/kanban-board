import { Component, inject, HostListener, OnInit } from '@angular/core';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemeService } from '../../services/theme.service';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { TranslateModule } from '@ngx-translate/core';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SettingsData {
  // Add any data you want to pass to the settings dialog
}

interface SettingsTab {
  id: number;
  label: string;
  icon: string;
  component: string;
}

@Component({
  selector: 'kn-settings',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    ThemeSelectorComponent,
    LanguageSelectorComponent,
    UserProfileComponent,
    GeneralSettingsComponent,
    TranslateModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SettingsComponent>>(MatDialogRef);
  data = inject<SettingsData>(MAT_DIALOG_DATA);
  themeService = inject(ThemeService);

  selectedTab = 0;
  isMobileView = false;
  isNavigationOpen = false;

  settingsTabs = [
    {
      id: 0,
      label: 'settings.general',
      icon: 'settings',
      component: 'general',
    },
    {
      id: 1,
      label: 'settings.account',
      icon: 'account_circle',
      component: 'account',
    },
  ];

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkMobileView();
  }

  ngOnInit(): void {
    this.checkMobileView();
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.isNavigationOpen = false;
    }
  }

  toggleNavigation(): void {
    this.isNavigationOpen = !this.isNavigationOpen;
  }

  closeNavigation(): void {
    this.isNavigationOpen = false;
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    if (this.isMobileView) {
      this.closeNavigation();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getCurrentTab(): SettingsTab | undefined {
    return this.settingsTabs.find(tab => tab.id === this.selectedTab);
  }
}
