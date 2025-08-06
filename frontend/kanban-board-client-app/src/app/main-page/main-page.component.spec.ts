import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
    } as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [MainPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tiles', () => {
    expect(component.tiles.length).toBeGreaterThan(0);
  });

  it('should navigate when tile is clicked', () => {
    const tile = component.tiles[0];
    component.onTileClick(tile);
    expect(mockRouter.navigate).toHaveBeenCalledWith([tile.route]);
  });

  it('should not navigate when tile is disabled', () => {
    const tile = { ...component.tiles[0], disabled: true };
    component.onTileClick(tile);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return correct tile class', () => {
    const tile = component.tiles[0];
    const className = component.getTileClass(tile);
    expect(className).toContain('tile-');
  });
});
