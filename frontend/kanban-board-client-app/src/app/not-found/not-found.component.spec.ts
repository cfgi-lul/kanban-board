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
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getCurrentColorScheme']);

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

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
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
    expect(compiled.textContent).toContain('404');
  });

  it('should have goBack method that calls location.back()', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should have goHome method that navigates to root', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should have getCurrentTheme method that calls themeService', () => {
    themeService.getCurrentColorScheme.and.returnValue('light');
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
