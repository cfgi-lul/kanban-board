import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemeService } from '../../services/theme.service';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

export interface SettingsData {
  // Add any data you want to pass to the settings dialog
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    ThemeSelectorComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  selectedTab = 0;

  settingsTabs = [
    {
      id: 0,
      label: 'General',
      icon: 'settings',
      component: 'general'
    },
    {
      id: 1,
      label: 'Account',
      icon: 'account_circle',
      component: 'account'
    },
    {
      id: 2,
      label: 'Notifications',
      icon: 'notifications',
      component: 'notifications'
    },
    {
      id: 3,
      label: 'Privacy',
      icon: 'security',
      component: 'privacy'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData,
    public themeService: ThemeService
  ) {}

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getCurrentTab(): any {
    return this.settingsTabs.find(tab => tab.id === this.selectedTab);
  }
}
