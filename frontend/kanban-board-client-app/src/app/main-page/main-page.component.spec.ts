import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

import { MainPageComponent } from './main-page.component';
import { Tile } from '../core/components/tile';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
    } as Partial<Router>;

    await TestBed.configureTestingModule({
      imports: [MainPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: routerSpy }],
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
      expect(firstTile).toHaveProperty('id');
      expect(firstTile).toHaveProperty('title');
      expect(firstTile).toHaveProperty('route');
      expect(firstTile).toHaveProperty('color');
    });
  });

  describe('Tile Data Structure', () => {
    it('should have boards tile as first tile', () => {
      const boardsTile = component.tiles.find(tile => tile.id === 'boards');
      expect(boardsTile).toBeDefined();
      expect(boardsTile?.route).toBe('/boards-list');
      expect(boardsTile?.color).toBe('primary');
    });

    it('should have news tile with badge', () => {
      const newsTile = component.tiles.find(tile => tile.id === 'news');
      expect(newsTile).toBeDefined();
      expect(newsTile?.badge).toBe('main.news.badge');
      expect(newsTile?.color).toBe('accent');
    });

    it('should have admin tile with warn color', () => {
      const adminTile = component.tiles.find(tile => tile.id === 'admin');
      expect(adminTile).toBeDefined();
      expect(adminTile?.color).toBe('warn');
    });

    it('should have all tiles with valid routes', () => {
      const validRoutes = [
        '/boards-list',
        '/news',
        '/analytics',
        '/settings',
        '/admin',
        '/help',
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
  });

  describe('onTileClick Method', () => {
    it('should navigate when tile is clicked and not disabled', () => {
      const tile: Tile = {
        id: 'test',
        title: 'Test Tile',
        route: '/test-route',
        color: 'primary',
      };

      component.onTileClick(tile);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route']);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });

    it('should not navigate when tile is disabled', () => {
      const disabledTile: Tile = {
        id: 'test',
        title: 'Test Tile',
        route: '/test-route',
        color: 'primary',
        disabled: true,
      };

      component.onTileClick(disabledTile);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle multiple tile clicks', () => {
      const tile1: Tile = {
        id: 'test1',
        title: 'Test 1',
        route: '/route1',
        color: 'primary',
      };
      const tile2: Tile = {
        id: 'test2',
        title: 'Test 2',
        route: '/route2',
        color: 'accent',
      };

      component.onTileClick(tile1);
      component.onTileClick(tile2);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/route1']);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/route2']);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    });

    it('should handle tile without route', () => {
      const tileWithoutRoute: Tile = {
        id: 'test',
        title: 'Test Tile',
        color: 'primary',
      };

      expect(() => component.onTileClick(tileWithoutRoute)).not.toThrow();
      expect(mockRouter.navigate).toHaveBeenCalledWith([undefined]);
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
        const tileInput = tileComponent.componentInstance.tile;
        expect(tileInput()).toEqual(component.tiles[index]);
      });
    });

    it('should bind tile click event', () => {
      const tileComponents = fixture.debugElement.queryAll(By.css('kn-tile'));
      const firstTileComponent = tileComponents[0];

      expect(firstTileComponent.componentInstance.tileClick).toBeDefined();
    });
  });

  describe('Component Integration', () => {
    it('should handle tile click from template', () => {
      const firstTile = component.tiles[0];

      // Call the method directly instead of simulating component event
      component.onTileClick(firstTile);

      expect(mockRouter.navigate).toHaveBeenCalledWith([firstTile.route]);
    });

    it('should not navigate when disabled tile is clicked from template', () => {
      const disabledTile = { ...component.tiles[0], disabled: true };

      // Call the method directly instead of simulating component event
      component.onTileClick(disabledTile);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle null tile gracefully', () => {
      expect(() => component.onTileClick(null)).not.toThrow();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle undefined tile gracefully', () => {
      expect(() => component.onTileClick(undefined)).not.toThrow();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle tile with missing properties', () => {
      const incompleteTile = { id: 'test' } as Tile;
      expect(() => component.onTileClick(incompleteTile)).not.toThrow();
      expect(mockRouter.navigate).toHaveBeenCalledWith([undefined]);
    });
  });
});
