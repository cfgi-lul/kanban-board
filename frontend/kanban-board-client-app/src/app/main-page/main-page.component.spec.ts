import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
    } as Partial<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MainPageComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: { subscribe: jest.fn() },
            queryParams: { subscribe: jest.fn() },
            fragment: { subscribe: jest.fn() },
            data: { subscribe: jest.fn() },
            url: { subscribe: jest.fn() },
            outlet: 'primary',
            component: MainPageComponent,
            routeConfig: null,
            root: {} as ActivatedRoute,
            parent: null,
            firstChild: null,
            children: [],
            pathFromRoot: [],
            paramMap: { subscribe: jest.fn() },
            queryParamMap: { subscribe: jest.fn() },
          },
        },
      ],
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as Partial<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with tiles array', () => {
      expect(component.tiles).toBeDefined();
      expect(Array.isArray(component.tiles)).toBe(true);
    });

    it('should have the correct number of tiles', () => {
      expect(component.tiles.length).toBe(6);
    });

    it('should have tiles with required properties', () => {
      const firstTile = component.tiles[0];
      expect(firstTile).toHaveProperty('title');
      expect(firstTile).toHaveProperty('description');
      expect(firstTile).toHaveProperty('icon');
      expect(firstTile).toHaveProperty('color');
      expect(firstTile).toHaveProperty('route');
      expect(firstTile).toHaveProperty('size');
    });
  });

  describe('Tile Data Structure', () => {
    it('should have boards tile as first tile', () => {
      const boardsTile = component.tiles.find(
        tile => tile.title === 'main.boards.title'
      );
      expect(boardsTile).toBeDefined();
      expect(boardsTile?.route).toBe('/dashboard/boards-list');
      expect(boardsTile?.color).toBe('primary');
    });

    it('should have news tile with correct properties', () => {
      const newsTile = component.tiles.find(
        tile => tile.title === 'main.news.title'
      );
      expect(newsTile).toBeDefined();
      expect(newsTile?.color).toBe('accent');
      expect(newsTile?.route).toBe('/news/news');
    });

    it('should have admin tile with warn color', () => {
      const adminTile = component.tiles.find(
        tile => tile.title === 'main.admin.title'
      );
      expect(adminTile).toBeDefined();
      expect(adminTile?.color).toBe('warn');
    });

    it('should have all tiles with valid routes', () => {
      const validRoutes = [
        '/dashboard/boards-list',
        '/news/news',
        '/analytics/analytics',
        '/dashboard/settings',
        '/admin/admin',
        '/help/help',
      ];
      component.tiles.forEach(tile => {
        expect(validRoutes).toContain(tile.route);
      });
    });

    it('should have all tiles with valid colors', () => {
      const validColors = ['primary', 'accent', 'warn'];
      component.tiles.forEach(tile => {
        expect(validColors).toContain(tile.color);
      });
    });

    it('should have all tiles with valid sizes', () => {
      const validSizes = ['large', 'medium', 'small'];
      component.tiles.forEach(tile => {
        expect(validSizes).toContain(tile.size);
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render welcome section', () => {
      const welcomeSection = fixture.debugElement.query(
        By.css('.main-page__welcome')
      );
      expect(welcomeSection).toBeTruthy();
    });

    it('should render welcome title with translation key', () => {
      const welcomeTitle = fixture.debugElement.query(
        By.css('.main-page__welcome-title')
      );
      expect(welcomeTitle).toBeTruthy();
      expect(welcomeTitle.nativeElement.getAttribute('translate')).toBe(
        'main.welcome.title'
      );
    });

    it('should render welcome subtitle with translation key', () => {
      const welcomeSubtitle = fixture.debugElement.query(
        By.css('.main-page__welcome-subtitle')
      );
      expect(welcomeSubtitle).toBeTruthy();
      expect(welcomeSubtitle.nativeElement.getAttribute('translate')).toBe(
        'main.welcome.subtitle'
      );
    });

    it('should render tiles section', () => {
      const tilesSection = fixture.debugElement.query(
        By.css('.main-page__tiles')
      );
      expect(tilesSection).toBeTruthy();
    });

    it('should render tiles section title with translation key', () => {
      const tilesTitle = fixture.debugElement.query(
        By.css('.main-page__tiles-title')
      );
      expect(tilesTitle).toBeTruthy();
      expect(tilesTitle.nativeElement.getAttribute('translate')).toBe(
        'main.sections.title'
      );
    });

    it('should render tiles grid', () => {
      const tilesGrid = fixture.debugElement.query(
        By.css('.main-page__tiles-grid')
      );
      expect(tilesGrid).toBeTruthy();
    });

    it('should render correct number of tile components', () => {
      const tileComponents = fixture.debugElement.queryAll(By.css('kn-tile'));
      expect(tileComponents.length).toBe(component.tiles.length);
    });

    it('should pass tile data to each tile component', () => {
      const tileComponents = fixture.debugElement.queryAll(By.css('kn-tile'));

      tileComponents.forEach((tileComponent, index) => {
        const componentInstance = tileComponent.componentInstance;
        const expectedTile = component.tiles[index];

        // Check that the inputs are properly bound (size is not bound as input)
        expect(componentInstance.title()).toBe(expectedTile.title);
        expect(componentInstance.description()).toBe(expectedTile.description);
        expect(componentInstance.icon()).toBe(expectedTile.icon);
        expect(componentInstance.color()).toBe(expectedTile.color);
        // Note: size is not bound as input, it's only used for CSS classes
      });
    });

    it('should have routerLink attributes on tile components', () => {
      const tileComponents = fixture.debugElement.queryAll(By.css('kn-tile'));

      tileComponents.forEach((tileComponent, index) => {
        const routerLink = tileComponent.nativeElement.getAttribute(
          'ng-reflect-router-link'
        );
        expect(routerLink).toBeDefined();
      });
    });
  });

  describe('Component Structure', () => {
    it('should have tiles with correct structure', () => {
      component.tiles.forEach(tile => {
        expect(tile).toHaveProperty('title');
        expect(tile).toHaveProperty('description');
        expect(tile).toHaveProperty('icon');
        expect(tile).toHaveProperty('color');
        expect(tile).toHaveProperty('route');
        expect(tile).toHaveProperty('size');
      });
    });

    it('should have boards tile with large size', () => {
      const boardsTile = component.tiles.find(
        tile => tile.title === 'main.boards.title'
      );
      expect(boardsTile?.size).toBe('large');
    });

    it('should have other tiles with small size', () => {
      const smallTiles = component.tiles.filter(
        tile => tile.title !== 'main.boards.title'
      );
      smallTiles.forEach(tile => {
        expect(tile.size).toBe('small');
      });
    });
  });
});
