import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kn-general-settings',
  imports: [
    MatDividerModule,
    ThemeSelectorComponent,
    LanguageSelectorComponent,
    TranslateModule,
  ],
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent {
} 