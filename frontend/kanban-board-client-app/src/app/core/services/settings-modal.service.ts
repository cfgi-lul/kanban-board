import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SettingsComponent, SettingsData } from '../components/settings/settings.component';

@Injectable({
  providedIn: 'root',
})
export class SettingsModalService {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  constructor() {
    this.initializeUrlListener();
  }

  private initializeUrlListener(): void {
    // Listen to navigation events to check for settings parameter
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkAndOpenSettingsModal();
      });
  }

  private checkAndOpenSettingsModal(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const settingsParam = urlParams.get('settings');
    
    if (settingsParam === 'true') {
      this.openSettingsModal();
    }
  }

  openSettingsModal(): void {
    // Check if modal is already open
    if (this.dialog.openDialogs.some(dialog => dialog.componentInstance instanceof SettingsComponent)) {
      return;
    }

    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '900px',
      maxWidth: '95vw',
      height: '80vh',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false,
      data: {} as SettingsData,
    });

    // Update URL when modal opens
    this.updateUrl(true);

    // Handle modal close
    dialogRef.afterClosed().subscribe(() => {
      this.updateUrl(false);
    });
  }

  private updateUrl(open: boolean): void {
    const currentUrl = this.router.url;
    const url = new URL(currentUrl, window.location.origin);
    
    if (open) {
      url.searchParams.set('settings', 'true');
    } else {
      url.searchParams.delete('settings');
    }

    // Remove trailing ? if no parameters
    const newUrl = url.searchParams.toString() 
      ? `${url.pathname}?${url.searchParams.toString()}`
      : url.pathname;

    // Update URL without navigation
    this.router.navigateByUrl(newUrl, { replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 