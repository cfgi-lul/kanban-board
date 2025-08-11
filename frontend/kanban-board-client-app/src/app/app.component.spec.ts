import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SettingsModalService } from './core/services/settings-modal.service';
import { UserInstance } from './core/models/classes/UserInstance';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: Partial<AuthService>;
  let themeService: Partial<ThemeService>;
  let i18nService: Partial<I18nService>;
  let translateService: Partial<TranslateService>;
  let settingsModalService: Partial<SettingsModalService>;
  let matDialog: Partial<MatDialog>;

  const mockUser: UserInstance = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    displayName: 'Test User',
    password: 'password',
    roles: [],
    avatar: undefined,
  };

  // Store original window properties
  const originalInnerWidth = window.innerWidth;

  beforeEach(async () => {
    const authServiceSpy = {
      isAdmin: jest.fn().mockReturnValue(false),
      currentUser: new BehaviorSubject<UserInstance | null>(mockUser),
    } as Partial<AuthService>;

    const themeServiceSpy = {
      toggleTheme: jest.fn(),
      getCurrentColorScheme: jest.fn().mockReturnValue('light'),
    } as Partial<ThemeService>;

    const i18nServiceSpy = {
      getCurrentLanguage: jest.fn().mockReturnValue('en'),
      setLanguage: jest.fn(),
    } as Partial<I18nService>;

    const translateServiceSpy = {
      currentLang: 'en',
      getDefaultLang: jest.fn().mockReturnValue('en'),
      instant: jest.fn().mockReturnValue('Test Translation'),
      get: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue('Test Translation'),
      }),
    } as Partial<TranslateService>;

    const settingsModalServiceSpy = {
      openSettingsModal: jest.fn(),
    } as Partial<SettingsModalService>;

    const matDialogSpy = {
      open: jest.fn(),
      openDialogs: [],
    } as Partial<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: I18nService, useValue: i18nServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: SettingsModalService, useValue: settingsModalServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as Partial<AuthService>;
    themeService = TestBed.inject(ThemeService) as Partial<ThemeService>;
    i18nService = TestBed.inject(I18nService) as Partial<I18nService>;
    translateService = TestBed.inject(
      TranslateService
    ) as Partial<TranslateService>;
    settingsModalService = TestBed.inject(
      SettingsModalService
    ) as Partial<SettingsModalService>;
    matDialog = TestBed.inject(MatDialog) as Partial<MatDialog>;
  });

  afterEach(() => {
    // Restore original window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct initial properties', () => {
      expect(component.title).toBe('kanban-board-client-app');
      expect(component.isSidenavOpen).toBe(false);
      expect(component.sidenavMode).toBe('side');
      expect(component.isLargeScreen).toBe(false);
    });

    it('should initialize with correct large screen breakpoint', () => {
      expect(component['LARGE_SCREEN_BREAKPOINT']).toBe(1280);
    });
  });

  describe('Screen Size Detection', () => {
    it('should detect large screen correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1400,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(true);
    });

    it('should detect small screen correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(false);
    });

    it('should update sidenav behavior when screen size changes', () => {
      // Set initial state to large screen
      component.isLargeScreen = true;
      component.sidenavMode = 'side';
      component.isSidenavOpen = true;

      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(false);
      expect(component.sidenavMode).toBe('over');
      expect(component.isSidenavOpen).toBe(false);

      // Change to large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1400,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(true);
      expect(component.sidenavMode).toBe('side');
      expect(component.isSidenavOpen).toBe(true);
    });

    it('should not update sidenav behavior when screen size does not change', () => {
      component.isLargeScreen = false;
      component.sidenavMode = 'over';
      component.isSidenavOpen = false;

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      const initialMode = component.sidenavMode;
      const initialOpen = component.isSidenavOpen;

      component['checkScreenSize']();

      expect(component.sidenavMode).toBe(initialMode);
      expect(component.isSidenavOpen).toBe(initialOpen);
    });
  });

  describe('Sidenav Management', () => {
    it('should toggle sidenav only on small screens', () => {
      component.isLargeScreen = false;
      component.isSidenavOpen = false;

      component.toggleSidenav();
      expect(component.isSidenavOpen).toBe(true);

      component.toggleSidenav();
      expect(component.isSidenavOpen).toBe(false);
    });

    it('should not toggle sidenav on large screens', () => {
      component.isLargeScreen = true;
      component.isSidenavOpen = true;

      component.toggleSidenav();
      expect(component.isSidenavOpen).toBe(true);
    });

    it('should set correct sidenav mode for large screens', () => {
      component.isLargeScreen = true;
      component['updateSidenavBehavior']();

      expect(component.sidenavMode).toBe('side');
      expect(component.isSidenavOpen).toBe(true);
    });

    it('should set correct sidenav mode for small screens', () => {
      component.isLargeScreen = false;
      component['updateSidenavBehavior']();

      expect(component.sidenavMode).toBe('over');
      expect(component.isSidenavOpen).toBe(false);
    });
  });

  describe('Theme Management', () => {
    it('should call theme service toggle method', () => {
      component.toggleTheme();
      expect(themeService.toggleTheme).toHaveBeenCalled();
    });

    it('should handle theme service errors gracefully', () => {
      (themeService.toggleTheme as jest.Mock).mockImplementation(() => {
        throw new Error('Theme service error');
      });

      expect(() => component.toggleTheme()).toThrow('Theme service error');
    });
  });

  describe('User Management', () => {
    it('should check admin status', () => {
      expect(component.isAdmin).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
    });

    it('should update admin status when service changes', () => {
      (authService.isAdmin as jest.Mock).mockReturnValue(true);

      const newComponent =
        TestBed.createComponent(AppComponent).componentInstance;
      expect(newComponent.isAdmin).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    it('should call checkScreenSize on initialization', () => {
      const checkScreenSizeSpy = jest.spyOn(
        component as any,
        'checkScreenSize'
      );
      component.ngOnInit();
      expect(checkScreenSizeSpy).toHaveBeenCalled();
    });
  });

  describe('Window Resize Handling', () => {
    it('should handle window resize events', () => {
      const checkScreenSizeSpy = jest.spyOn(
        component as any,
        'checkScreenSize'
      );

      component.onResize();
      expect(checkScreenSizeSpy).toHaveBeenCalled();
    });

    it('should update screen size on resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1400,
      });

      component.onResize();
      expect(component.isLargeScreen).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle exact breakpoint width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(true);
    });

    it('should handle width just below breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1279,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(false);
    });

    it('should handle negative window width gracefully', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: -100,
      });

      component['checkScreenSize']();
      expect(component.isLargeScreen).toBe(false);
    });
  });
});
