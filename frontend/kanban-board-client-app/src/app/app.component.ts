import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  HostListener,
} from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/api/auth.service";
import { ThemeService } from "./core/services/theme.service";
import { I18nService } from "./core/services/i18n.service";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule, MatDrawerMode } from "@angular/material/sidenav";
import { HeaderComponent } from "./core/components/header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { AsyncPipe } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "kn-root",
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    RouterModule,
    HeaderComponent,
    SidenavComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "kanban-board-client-app";
  isSidenavOpen = false;
  sidenavMode: MatDrawerMode = "side";
  isLargeScreen = false;
  currentUser = inject(AuthService).currentUser;
  isAdmin = inject(AuthService).isAdmin();
  themeService = inject(ThemeService);
  i18nService = inject(I18nService);
  translateService = inject(TranslateService);

  private readonly LARGE_SCREEN_BREAKPOINT = 1280;

  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasLargeScreen = this.isLargeScreen;
    this.isLargeScreen = window.innerWidth >= this.LARGE_SCREEN_BREAKPOINT;

    if (this.isLargeScreen !== wasLargeScreen) {
      this.updateSidenavBehavior();
    }
  }

  private updateSidenavBehavior(): void {
    if (this.isLargeScreen) {
      this.sidenavMode = "side";
      this.isSidenavOpen = true;
    } else {
      this.sidenavMode = "over";
      this.isSidenavOpen = false;
    }
  }

  toggleSidenav(): void {
    if (!this.isLargeScreen) {
      this.isSidenavOpen = !this.isSidenavOpen;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
