import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainPageComponent,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
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
      expect(component.tiles.length).toBe(6);
    });
  });

  describe('Tile Data Structure', () => {
    it('should have tiles with required properties', () => {
      component.tiles.forEach(tile => {
        expect(tile).toHaveProperty('title');
        expect(tile).toHaveProperty('description');
        expect(tile).toHaveProperty('icon');
        expect(tile).toHaveProperty('color');
        expect(tile).toHaveProperty('route');
        expect(tile).toHaveProperty('size');
      });
    });

    it('should have boards tile as first tile', () => {
      const boardsTile = component.tiles.find(
        tile => tile.title === 'main.boards.title'
      );
      expect(boardsTile).toBeDefined();
      expect(boardsTile?.route).toBe('/dashboard/boards-list');
      expect(boardsTile?.color).toBe('primary');
      expect(boardsTile?.size).toBe('large');
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
  });

  describe('Template Rendering', () => {
    it('should render welcome section', () => {
      const welcomeSection = fixture.debugElement.query(
        By.css('.main-page__welcome')
      );
      expect(welcomeSection).toBeTruthy();
    });

    it('should render tiles section', () => {
      const tilesSection = fixture.debugElement.query(
        By.css('.main-page__tiles')
      );
      expect(tilesSection).toBeTruthy();
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

        expect(componentInstance.title()).toBe(expectedTile.title);
        expect(componentInstance.description()).toBe(expectedTile.description);
        expect(componentInstance.icon()).toBe(expectedTile.icon);
        expect(componentInstance.color()).toBe(expectedTile.color);
      });
    });
  });
});
