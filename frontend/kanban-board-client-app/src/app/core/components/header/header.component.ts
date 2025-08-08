import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  HostListener,
  inject,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from "@angular/material/button-toggle";
import { ThemeService, ColorScheme } from "../../services/theme.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { UserInstance } from "../../models/classes/UserInstance";
import { UserBadgeComponent } from "../user-badge/user-badge.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "kn-header",
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    UserBadgeComponent,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
  private theme = inject(ThemeService);

  themeControl = new FormControl<ColorScheme>("system");
  isLoggedIn = input.required<boolean>();
  user = input.required<UserInstance>();

  isSmallScreen = false;
  private readonly LARGE_SCREEN_BREAKPOINT = 1024;

  ngOnInit(): void {
    this.checkScreenSize();
    this.themeControl.valueChanges.subscribe((e) => {
      if (e) this.theme.setColorScheme(e);
    });
    this.themeControl.setValue(this.theme.getCurrentColorScheme());
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < this.LARGE_SCREEN_BREAKPOINT;
  }

  themeChange(event: MatButtonToggleChange): void {
    this.theme.setColorScheme(event.value as ColorScheme);
  }

  openSideNav = output<void>();
}
