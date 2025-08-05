import { Injectable } from '@angular/core';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  public readonly languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  ];

  constructor(
    private translateService: TranslateService,
    private http: HttpClient,
  ) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    this.translateService.setDefaultLang('en');
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = this.translateService.getBrowserLang();
    const languageToUse =
      savedLanguage ||
      (browserLanguage &&
        this.languages.some(lang => lang.code === browserLanguage)
        ? browserLanguage
        : 'en');

    this.loadTranslations(languageToUse);
  }

  private loadTranslations(languageCode: string): void {
    this.http.get(`/assets/i18n/${languageCode}.json`).subscribe({
      next: (translations: TranslationObject) => {
        this.translateService.setTranslation(languageCode, translations, true);
        this.translateService.use(languageCode);
        this.currentLanguageSubject.next(languageCode);
        localStorage.setItem('language', languageCode);
      },
      error: error => {
        console.error(
          `Failed to load translations for ${languageCode}:`,
          error,
        );
        // Fallback to English
        this.loadTranslations('en');
      },
    });
  }

  public setLanguage(languageCode: string): void {
    if (this.languages.some(lang => lang.code === languageCode)) {
      this.loadTranslations(languageCode);
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
    params?: Record<string, unknown>,
  ): Observable<string> {
    return this.translateService.get(key, params);
  }

  public translateInstant(
    key: string,
    params?: Record<string, unknown>,
  ): string {
    return this.translateService.instant(key, params);
  }
}
