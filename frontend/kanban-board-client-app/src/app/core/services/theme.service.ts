import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ColorScheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentColorSchemeSubject = new BehaviorSubject<ColorScheme>(
    'system'
  );

  public currentColorScheme$ = this.currentColorSchemeSubject.asObservable();

  constructor() {
    this.loadSavedColorScheme();
  }

  /**
   * Set the color scheme (light/dark/system)
   */
  setColorScheme(scheme: ColorScheme): void {
    this.currentColorSchemeSubject.next(scheme);
    this.applyColorScheme(scheme);
    this.saveColorScheme(scheme);
  }

  /**
   * Get the current color scheme
   */
  getCurrentColorScheme(): ColorScheme {
    return this.currentColorSchemeSubject.value;
  }

  /**
   * Apply color scheme to the DOM
   */
  private applyColorScheme(scheme: ColorScheme): void {
    const body = document.body;

    // Remove all color scheme classes
    body.classList.remove('light', 'dark', 'system');

    // Add the new color scheme class
    body.classList.add(scheme);
  }

  /**
   * Load saved color scheme from localStorage
   */
  private loadSavedColorScheme(): void {
    const savedScheme = localStorage.getItem(
      'kanban-color-scheme'
    ) as ColorScheme;
    if (savedScheme && ['light', 'dark', 'system'].includes(savedScheme)) {
      this.setColorScheme(savedScheme);
    }
  }

  /**
   * Save color scheme to localStorage
   */
  private saveColorScheme(scheme: ColorScheme): void {
    localStorage.setItem('kanban-color-scheme', scheme);
  }

  /**
   * Get available color schemes
   */
  getAvailableColorSchemes(): Array<{
    value: ColorScheme;
    label: string;
    description: string;
  }> {
    return [
      {
        value: 'light',
        label: 'Light',
        description: 'Ocean Breeze - Clean and bright',
      },
      {
        value: 'dark',
        label: 'Dark',
        description: 'WebStorm Darcula - Classic IDE dark theme',
      },
      {
        value: 'system',
        label: 'System',
        description: 'Follow system preference',
      },
    ];
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentScheme = this.getCurrentColorScheme();
    const newScheme = currentScheme === 'light' ? 'dark' : 'light';
    this.setColorScheme(newScheme);
  }

  /**
   * Get current theme for backward compatibility
   */
  get currentTheme(): ColorScheme {
    return this.getCurrentColorScheme();
  }

  /**
   * Set theme for backward compatibility
   */
  setTheme(theme: ColorScheme): void {
    this.setColorScheme(theme);
  }
}
