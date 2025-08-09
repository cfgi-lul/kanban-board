import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { ThemeService } from '../core/services/theme.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let router: Partial<Router>;
  let location: Partial<Location>;
  let themeService: Partial<ThemeService>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
    } as Partial<Router>;

    const locationSpy = {
      back: jest.fn(),
    } as Partial<Location>;

    const themeServiceSpy = {
      getCurrentColorScheme: jest.fn(),
    } as Partial<ThemeService>;

    await TestBed.configureTestingModule({
      imports: [
        NotFoundComponent,
        TranslateModule.forRoot(),
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        RouterModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as Partial<Router>;
    location = TestBed.inject(Location) as Partial<Location>;
    themeService = TestBed.inject(ThemeService) as Partial<ThemeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error code 404', () => {
    const compiled = fixture.nativeElement;
    // Check for the translation key since translations might not be loaded in tests
    expect(compiled.textContent).toContain('common.notFound.errorCode');
  });

  it('should have goBack method that calls location.back()', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should have goHome method that navigates to root', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/main']);
  });

  it('should have getCurrentTheme method that calls themeService', () => {
    (themeService.getCurrentColorScheme as jest.Mock).mockReturnValue('light');
    const theme = component.getCurrentTheme();
    expect(themeService.getCurrentColorScheme).toHaveBeenCalled();
    expect(theme).toBe('light');
  });

  it('should render action buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have proper Angular Material imports', () => {
    expect(component).toBeTruthy();
    // The component should render without errors, indicating all imports are correct
  });
});
