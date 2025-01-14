import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type themeType = 'light' | 'dark' | 'system';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  private _currentTheme: themeType = 'light';

  public get currentTheme(): themeType {
    return this._currentTheme;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this._currentTheme = (localStorage.getItem('theme') ||
      'system') as themeType;
  }

  toggleTheme(val: themeType): void {
    localStorage.setItem('theme', val);
    this.renderer.removeClass(this.document.body, this.currentTheme);
    this._currentTheme = val;
    this.renderer.addClass(this.document.body, this.currentTheme);
  }
}
