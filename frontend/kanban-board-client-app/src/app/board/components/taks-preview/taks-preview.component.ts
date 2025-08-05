import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../../core/models/classes/Task';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-taks-preview',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './taks-preview.component.html',
  styleUrl: './taks-preview.component.scss',
})
export class TaksPreviewComponent {
  taks = input.required<Task>();
  name = input.required<string>();
  editTask = output<string>();
  deleteTask = output<string>();
}
