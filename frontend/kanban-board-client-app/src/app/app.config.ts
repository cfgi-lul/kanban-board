import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMarkdown } from 'ngx-markdown';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/intersceptors/auth.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('access_token');
          },
          allowedDomains: ['localhost', '127.0.0.1'],
          disallowedRoutes: ['http://localhost:4200/sign-in'],
        },
      })
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    provideMarkdown(),
    provideAnimations(),
  ],
};
