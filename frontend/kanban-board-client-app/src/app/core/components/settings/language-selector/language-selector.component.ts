import { Component, inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'kn-language-selector',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  i18nService = inject(I18nService);

  onLanguageChange(languageCode: string): void {
    this.i18nService.setLanguage(languageCode);
  }
}
