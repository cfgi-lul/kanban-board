import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ThemeService } from "../core/services/theme.service";
import { Router } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "kn-not-found",
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent {
  private location = inject(Location);
  private router = inject(Router);
  themeService = inject(ThemeService);

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(["/"]);
  }

  getCurrentTheme(): string {
    return this.themeService.getCurrentColorScheme();
  }
}
