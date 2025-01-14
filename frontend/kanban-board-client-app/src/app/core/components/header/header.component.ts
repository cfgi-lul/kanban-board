import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { ThemeService, themeType } from '../../services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  themeControl = new FormControl<themeType>('light');

  constructor(private theme: ThemeService) {}

  ngOnInit(): void {
    this.themeControl.valueChanges.subscribe((e) => this.theme.toggleTheme(e));
    this.themeControl.setValue(this.theme.currentTheme);
  }

  themeChange(event: MatButtonToggleChange): void {
    console.log('themeChange');
    this.theme.toggleTheme(event.value);
  }

  openSideNav = output<void>();
}
