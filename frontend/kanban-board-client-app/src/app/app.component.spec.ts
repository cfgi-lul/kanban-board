import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: Partial<AuthService>;
  let themeService: Partial<ThemeService>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    roles: ['USER'],
    avatarUrl: null,
  };

  beforeEach(async () => {
    const authServiceSpy = {
      isAdmin: jest.fn().mockReturnValue(false),
      currentUser: new BehaviorSubject(mockUser),
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

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AppComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: I18nService, useValue: i18nServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as Partial<AuthService>;
    themeService = TestBed.inject(ThemeService) as Partial<ThemeService>;
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct initial properties', () => {
      expect(component.title).toBe('kanban-board-client-app');
      expect(component.isSidenavOpen).toBe(false);
    });

    it('should inject required services', () => {
      expect(component.currentUser).toBeDefined();
      expect(component.isAdmin).toBeDefined();
      expect(component.themeService).toBeDefined();
      expect(component.i18nService).toBeDefined();
      expect(component.translateService).toBeDefined();
    });
  });

  describe('User Management', () => {
    it('should have currentUser observable', () => {
      expect(component.currentUser).toBeDefined();
      expect(component.currentUser).toBeInstanceOf(BehaviorSubject);
    });

    it('should check admin status', () => {
      expect(component.isAdmin).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
    });
  });

  describe('getUserInitials Method', () => {
    it('should get user initials correctly for full name', () => {
      const initials = component.getUserInitials(mockUser);
      expect(initials).toBe('TU'); // Test User -> TU
    });

    it('should handle user with single name', () => {
      const singleNameUser = { ...mockUser, name: 'John' };
      const initials = component.getUserInitials(singleNameUser);
      expect(initials).toBe('J');
    });

    it('should handle user without name', () => {
      const noNameUser = { ...mockUser, name: undefined };
      const initials = component.getUserInitials(noNameUser);
      expect(initials).toBe('?');
    });

    it('should handle user with null name', () => {
      const nullNameUser = { ...mockUser, name: null };
      const initials = component.getUserInitials(nullNameUser);
      expect(initials).toBe('?');
    });

    it('should handle user with empty name', () => {
      const emptyNameUser = { ...mockUser, name: '' };
      const initials = component.getUserInitials(emptyNameUser);
      expect(initials).toBe('?');
    });

    it('should handle user with multiple names', () => {
      const multiNameUser = { ...mockUser, name: 'John Doe Smith' };
      const initials = component.getUserInitials(multiNameUser);
      expect(initials).toBe('JS'); // John Smith
    });

    it('should handle user with extra spaces', () => {
      const spacedNameUser = { ...mockUser, name: '  John   Doe  ' };
      const initials = component.getUserInitials(spacedNameUser);
      expect(initials).toBe('JD'); // John Doe - the method should handle spaces
    });

    it('should handle user with only spaces in name', () => {
      const spacedUser = { ...mockUser, name: '   ' };
      const initials = component.getUserInitials(spacedUser);
      expect(initials).toBe('?'); // Should return '?' for empty/whitespace names
    });

    it('should handle user with special characters in name', () => {
      const specialUser = { ...mockUser, name: 'José María' };
      const initials = component.getUserInitials(specialUser);
      expect(initials).toBe('JM'); // José María
    });
  });

  describe('Theme Management', () => {
    it('should toggle theme when toggleTheme is called', () => {
      component.toggleTheme();
      expect(themeService.toggleTheme).toHaveBeenCalled();
    });

    it('should get correct theme icon for light theme', () => {
      (themeService.getCurrentColorScheme as jest.Mock).mockReturnValue(
        'light'
      );
      const icon = component.getThemeIcon();
      expect(icon).toBe('dark_mode');
    });

    it('should get correct theme icon for dark theme', () => {
      (themeService.getCurrentColorScheme as jest.Mock).mockReturnValue('dark');
      const icon = component.getThemeIcon();
      expect(icon).toBe('light_mode');
    });

    it('should get correct theme icon for system theme', () => {
      (themeService.getCurrentColorScheme as jest.Mock).mockReturnValue(
        'system'
      );
      const icon = component.getThemeIcon();
      expect(icon).toBe('light_mode'); // Default fallback
    });
  });

  describe('Sidenav Management', () => {
    it('should toggle sidenav state', () => {
      expect(component.isSidenavOpen).toBe(false);

      component.toggleSidenav();
      expect(component.isSidenavOpen).toBe(true);

      component.toggleSidenav();
      expect(component.isSidenavOpen).toBe(false);
    });
  });

  describe('Event Handlers', () => {
    it('should handle theme change event', () => {
      const mockEvent = new Event('change');
      expect(() => component.onThemeChange(mockEvent)).not.toThrow();
    });

    it('should handle theme change event with null', () => {
      expect(() =>
        component.onThemeChange(null as unknown as Event)
      ).not.toThrow();
    });
  });

  describe('ngOnInit', () => {
    it('should initialize component without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined user in getUserInitials', () => {
      const initials = component.getUserInitials(undefined as unknown);
      expect(initials).toBe('?');
    });

    it('should handle null user in getUserInitials', () => {
      const initials = component.getUserInitials(null as unknown);
      expect(initials).toBe('?');
    });

    it('should handle user with only spaces in name', () => {
      const spacedUser = { ...mockUser, name: '   ' };
      const initials = component.getUserInitials(spacedUser);
      expect(initials).toBe('?');
    });

    it('should handle user with special characters in name', () => {
      const specialUser = { ...mockUser, name: 'José María' };
      const initials = component.getUserInitials(specialUser);
      expect(initials).toBe('JM'); // José María
    });
  });

  describe('Service Integration', () => {
    it('should use theme service correctly', () => {
      component.getThemeIcon();
      expect(themeService.getCurrentColorScheme).toHaveBeenCalled();
    });

    it('should use auth service correctly', () => {
      expect(authService.isAdmin).toHaveBeenCalled();
    });

    it('should have access to translation service', () => {
      expect(component.translateService).toBeDefined();
    });

    it('should have access to i18n service', () => {
      expect(component.i18nService).toBeDefined();
    });
  });
});
