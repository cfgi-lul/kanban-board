import { provideNgDocApp, provideSearchEngine, NgDocDefaultSearchEngine, providePageSkeleton, NG_DOC_DEFAULT_PAGE_SKELETON, provideMainPageProcessor, NG_DOC_DEFAULT_PAGE_PROCESSORS } from "@ng-doc/app";
import { NG_DOC_ROUTING, provideNgDocContext } from "@ng-doc/generated";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMarkdown } from 'ngx-markdown';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('access_token');
          },
          allowedDomains: ['example.com'],
          disallowedRoutes: ['http://example.com/examplebadroute/'],
        },
      }),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideMarkdown(),
        provideAnimations(),
        provideRouter(NG_DOC_ROUTING, withInMemoryScrolling({scrollPositionRestoration: "enabled", anchorScrolling: "enabled"})),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideNgDocContext(),
        provideNgDocApp(),
        provideSearchEngine(NgDocDefaultSearchEngine),
        providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
        provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS)
    ],
};
