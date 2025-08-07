import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { ThemeService } from "../../../services/theme.service";

@Component({
  selector: "kn-theme-selector",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./theme-selector.component.html",
  styleUrls: ["./theme-selector.component.scss"],
})
export class ThemeSelectorComponent {
  colorSchemeControl = new FormControl("system");
  availableColorSchemes: Array<{
    value: "light" | "dark" | "system";
    label: string;
    description: string;
  }> = [];

  constructor(public themeService: ThemeService) {
    // Initialize available color schemes
    this.availableColorSchemes = this.themeService.getAvailableColorSchemes();

    // Initialize with current color scheme
    this.colorSchemeControl.setValue(this.themeService.getCurrentColorScheme());

    // Listen for changes
    this.colorSchemeControl.valueChanges.subscribe((scheme) => {
      if (scheme) {
        this.themeService.setColorScheme(scheme as "light" | "dark" | "system");
      }
    });
  }

  getThemeIcon(scheme: string): string {
    switch (scheme) {
      case "light":
        return "light_mode";
      case "dark":
        return "dark_mode";
      case "system":
        return "desktop_windows";
      default:
        return "palette";
    }
  }

  getThemeDescription(scheme: string): string {
    switch (scheme) {
      case "light":
        return "Light theme with bright colors and high contrast";
      case "dark":
        return "Dark theme with WebStorm Darcula colors";
      case "system":
        return "Follows your system preference";
      default:
        return "Unknown theme";
    }
  }
}
