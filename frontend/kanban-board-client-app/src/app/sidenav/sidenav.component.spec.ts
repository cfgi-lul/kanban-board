import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SidenavComponent } from './sidenav.component';
import { AuthService } from '../core/api/auth.service';
import { AvatarService } from '../core/api/avatar.service';
import { UserDisplayComponent } from '../core/components/user-display/user-display.component';
import { UserInstance } from '../core/models/classes/UserInstance';

// Mock translate loader
class MockTranslateLoader {
  getTranslation() {
    return of({
      'board.boardsList': 'Boards List',
      'auth.signIn': 'Sign In',
      'admin.panel': 'Admin Panel'
    });
  }
}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let authService: jest.Mocked<AuthService>;

  const mockUser: UserInstance = {
    id: 1,
    username: 'testuser',
    password: 'password',
    displayName: 'Test User',
    name: 'Test User',
    roles: [],
  };

  beforeEach(async () => {
    const authServiceMock = {
      currentUser: of(mockUser),
      isAdmin: jest.fn().mockReturnValue(false),
    };

    const avatarServiceMock = {
      getAvatarUrl: jest.fn().mockReturnValue('mock-avatar-url'),
    };

    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader }
        })
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AvatarService, useValue: avatarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentUser observable', () => {
    expect(component.currentUser).toBeDefined();
    component.currentUser.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should call isAdmin method from AuthService', () => {
    component.isAdmin;
    expect(authService.isAdmin).toHaveBeenCalled();
  });

  it('should render navigation menu items', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('a[mat-list-item]');
    
    expect(menuItems.length).toBe(2); // Boards list and Sign in by default
  });

  it('should show admin menu item when user is admin', () => {
    // Reset the mock and set it to return true before creating component
    authService.isAdmin.mockReset();
    authService.isAdmin.mockReturnValue(true);
    
    // Recreate the component with the new mock value
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('a[mat-list-item]');
    
    expect(menuItems.length).toBe(3); // Boards list, Sign in, and Admin panel
  });

  it('should not show admin menu item when user is not admin', () => {
    authService.isAdmin.mockReturnValue(false);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('a[mat-list-item]');
    
    expect(menuItems.length).toBe(2); // Only Boards list and Sign in
  });

  it('should render user display component in footer', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const userDisplay = compiled.querySelector('kn-user-display');
    
    expect(userDisplay).toBeTruthy();
  });

  it('should have correct router links', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const boardsLink = compiled.querySelector('a[routerLink="/dashboard/boards-list"]');
    const signInLink = compiled.querySelector('a[routerLink="/auth/sign-in"]');
    
    expect(boardsLink).toBeTruthy();
    expect(signInLink).toBeTruthy();
  });

  it('should have admin router link when user is admin', () => {
    // Reset the mock and set it to return true before creating component
    authService.isAdmin.mockReset();
    authService.isAdmin.mockReturnValue(true);
    
    // Recreate the component with the new mock value
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const adminLink = compiled.querySelector('a[routerLink="/admin/admin"]');
    
    expect(adminLink).toBeTruthy();
  });
}); 