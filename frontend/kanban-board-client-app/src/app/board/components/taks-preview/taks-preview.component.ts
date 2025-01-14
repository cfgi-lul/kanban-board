import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../../core/models/classes/Task';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-taks-preview',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './taks-preview.component.html',
  styleUrl: './taks-preview.component.scss',
})
export class TaksPreviewComponent {
  taks = input.required<Task>();
  name = input.required<string>();
  editTask = output<string>();
  deleteTask = output<string>();
}
