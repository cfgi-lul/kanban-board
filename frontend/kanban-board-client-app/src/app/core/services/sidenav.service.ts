import { Injectable, signal } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private readonly LARGE_SCREEN_BREAKPOINT = 1024;

  private isLargeScreen = signal<boolean>(window.innerWidth >= this.LARGE_SCREEN_BREAKPOINT);
  private isOnBoardPage = signal<boolean>(false);

  drawerMode = signal<MatDrawerMode>('side');
  isSidenavOpen = signal<boolean>(false);

  constructor(private router: Router) {
    this.isOnBoardPage.set(this.checkIsOnBoardPage(this.router.url));
    this.updateBehavior();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isOnBoardPage.set(this.checkIsOnBoardPage(event.urlAfterRedirects));
        this.updateBehavior();
      }
    });

    window.addEventListener('resize', () => {
      const wasLarge = this.isLargeScreen();
      this.isLargeScreen.set(window.innerWidth >= this.LARGE_SCREEN_BREAKPOINT);
      if (this.isLargeScreen() !== wasLarge) {
        this.updateBehavior();
      }
    });
  }

  toggle(): void {
    console.log('toggle', this.drawerMode(), this.isLargeScreen());
    if (this.drawerMode() === 'over' || !this.isLargeScreen()) {
      this.isSidenavOpen.set(!this.isSidenavOpen());
    }
  }

  open(): void {
    this.isSidenavOpen.set(true);
  }

  close(): void {
    this.isSidenavOpen.set(false);
  }

  private updateBehavior(): void {
    if (this.isOnBoardPage()) {
      this.drawerMode.set('over');
      this.isSidenavOpen.set(false);
      return;
    }

    if (this.isLargeScreen()) {
      this.drawerMode.set('side');
      this.isSidenavOpen.set(true);
    } else {
      this.drawerMode.set('over');
      this.isSidenavOpen.set(false);
    }
  }

  private checkIsOnBoardPage(url: string): boolean {
    return /^\/dashboard\/board\//.test(url);
  }
}

