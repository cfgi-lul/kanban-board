import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private translateService = inject(TranslateService);

  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  public readonly languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  ];

  constructor() {
    // console.log('I18nService: Initializing...');
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // console.log('I18nService: Setting default language to en');
    // Set default language
    this.translateService.setDefaultLang('en');

    // Get saved language or browser language
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = this.translateService.getBrowserLang();
    const languageToUse =
      savedLanguage ||
      (browserLanguage &&
      this.languages.some(lang => lang.code === browserLanguage)
        ? browserLanguage
        : 'en');

    // console.log('I18nService: Saved language:', savedLanguage);
    // console.log('I18nService: Browser language:', browserLanguage);
    // console.log('I18nService: Language to use:', languageToUse);

    // Use the language and ensure it's loaded
    this.translateService.use(languageToUse).subscribe({
      next: () => {
        // console.log(
        //   'I18nService: Language loaded successfully:',
        //   languageToUse
        // );
        this.currentLanguageSubject.next(languageToUse);
        localStorage.setItem('language', languageToUse);
      },
      error: _error => {
        // console.error('I18nService: Failed to load language:', _error);
        // Fallback to English
        this.translateService.use('en').subscribe(() => {
          // console.log('I18nService: Fallback to English');
          this.currentLanguageSubject.next('en');
          localStorage.setItem('language', 'en');
        });
      },
    });
  }

  public setLanguage(languageCode: string): void {
    // console.log('I18nService: Setting language to:', languageCode);
    if (this.languages.some(lang => lang.code === languageCode)) {
      this.translateService.use(languageCode).subscribe({
        next: () => {
          // console.log(
          //   'I18nService: Language changed successfully:',
          //   languageCode
          // );
          this.currentLanguageSubject.next(languageCode);
          localStorage.setItem('language', languageCode);
        },
        error: _error => {
          // console.error('I18nService: Failed to change language:', _error);
        },
      });
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getLanguages(): Language[] {
    return this.languages;
  }

  public getLanguageName(code: string): string {
    const language = this.languages.find(lang => lang.code === code);
    return language ? language.nativeName : code;
  }

  public translate(
    key: string,
    params?: Record<string, unknown>
  ): Observable<string> {
    return this.translateService.get(key, params);
  }

  public translateInstant(
    key: string,
    params?: Record<string, unknown>
  ): string {
    return this.translateService.instant(key, params);
  }
}
