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
import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-taks-preview',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './taks-preview.component.html',
  styleUrl: './taks-preview.component.scss',
})
export class TaksPreviewComponent {
  taks = input.required<TaskInstance>();
  name = input.required<string>();
  editTask = output<string>();
  deleteTask = output<string>();
}
