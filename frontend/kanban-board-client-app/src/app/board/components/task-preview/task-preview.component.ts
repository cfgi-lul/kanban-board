import { Component, input, output } from '@angular/core';
import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kn-task-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './task-preview.component.html',
  styleUrl: './task-preview.component.scss',
})
export class TaskPreviewComponent {
  task = input.required<TaskInstance>();
  name = input.required<string>();

  editTask = output<string>();
  deleteTask = output<string>();
  openTaskPage = output<string>();
}
