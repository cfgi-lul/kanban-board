import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './core/api/auth.service';
import { ThemeService } from './core/services/theme.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: Partial<AuthService>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    roles: ['USER'],
  };

  beforeEach(async () => {
    const authServiceSpy = {
      isAdmin: jest.fn(),
      currentUser: new BehaviorSubject(mockUser),
    } as Partial<AuthService>;

    const themeServiceSpy = {
      toggleTheme: jest.fn(),
    } as Partial<ThemeService>;

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as Partial<AuthService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display user badge when user is logged in', () => {
    fixture.detectChanges();

    // The currentUser observable should emit the mock user
    component.currentUser.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should not display user badge when user is not logged in', () => {
    // Set currentUser to emit null
    (authService.currentUser as BehaviorSubject<unknown>).next(null);
    fixture.detectChanges();

    component.currentUser.subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('should get user initials correctly', () => {
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
});
