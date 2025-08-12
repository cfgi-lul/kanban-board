import { Component, inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { firstValueFrom, Observable, repeat, take, of } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AsyncPipe, DatePipe } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import { TaskService } from '../../../core/api/task.service';
import { UserService } from '../../../core/api/user.service';
import { LabelService } from '../../../core/api/label.service';
import { AttachmentService } from '../../../core/api/attachment.service';
import { UserInstance } from '../../../core/models/classes/UserInstance';
import { LabelInstance } from '../../../core/models/classes/LabelInstance';
import { AttachmentInstance } from '../../../core/models/classes/AttachmentInstance';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '../../../core/pipes/file-size.pipe';
import { TaskCommentsComponent } from '../task-comments/task-comments.component';
import { TaskDescriptionComponent } from '../task-description/task-description.component';

@Component({
  selector: 'kn-task-editor',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    AsyncPipe,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    MarkdownComponent,
    MarkdownModule,
    TextFieldModule,
    TranslateModule,
    FileSizePipe,
    TaskCommentsComponent,
    TaskDescriptionComponent,
  ],
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss',
})
export class TaskEditorComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private labelService = inject(LabelService);
  private attachmentService = inject(AttachmentService);

  dialogRef = inject<MatDialogRef<TaskEditorComponent>>(MatDialogRef);
  data = inject<{
    task: TaskInstance;
    boardId?: number;
  }>(MAT_DIALOG_DATA);

  taskForm: FormGroup;
  isEditDescription = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  users$: Observable<UserInstance[]>;
  labels$: Observable<LabelInstance[]> = of([]);
  attachments$: Observable<AttachmentInstance[]> = of([]);

  // Priority options
  priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  // Status options
  statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'DONE', label: 'Done' },
  ];

  // Filtered labels for autocomplete
  filteredLabels: LabelInstance[] = [];

  constructor() {
    const data = this.data;

    this.taskForm = this.fb.group({
      title: [data.task.title, Validators.required],
      description: [data.task.description],
      priority: [data.task.priority || 'MEDIUM'],
      status: [data.task.status || 'TODO'],
      dueDate: [data.task.dueDate ? new Date(data.task.dueDate) : null],
      assignee: [data.task.assignee?.id || null],
      labels: [data.task.labels || []],
    });

    this.users$ = this.userService.getAllUsers();

    if (this.data.boardId !== undefined && this.data.boardId !== null) {
      this.labels$ = this.labelService.getLabelsByBoard(this.data.boardId);
    }

    if (this.data.task.id !== undefined && this.data.task.id !== null) {
      this.attachments$ = this.attachmentService.getAttachmentsByTask(
        this.data.task.id
      );
    }

    // Initialize filtered labels
    this.labels$?.subscribe(labels => {
      this.filteredLabels = labels;
    });
  }

  onClearTitle(): void {
    this.taskForm.get('title')?.setValue('');
  }

  toggleEditDescription(): void {
    this.isEditDescription = !this.isEditDescription;
  }

  // Label handling
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      // Find existing label or create new one
      const existingLabel = this.filteredLabels.find(
        label => label.name.toLowerCase() === value.toLowerCase()
      );

      if (existingLabel) {
        const currentLabels = this.taskForm.get('labels')?.value || [];
        if (
          !currentLabels.find((l: LabelInstance) => l.id === existingLabel.id)
        ) {
          this.taskForm
            .get('labels')
            ?.setValue([...currentLabels, existingLabel]);
        }
      }
    }
    event.chipInput!.clear();
  }

  removeLabel(label: LabelInstance): void {
    const currentLabels = this.taskForm.get('labels')?.value || [];
    const index = currentLabels.findIndex(
      (l: LabelInstance) => l.id === label.id
    );
    if (index >= 0) {
      currentLabels.splice(index, 1);
      this.taskForm.get('labels')?.setValue([...currentLabels]);
    }
  }

  // Attachment handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const taskId = this.data.task.id;
    if (!file || taskId === undefined || taskId === null) {
      return;
    }
    this.attachmentService
      .uploadAttachment(taskId, file)
      .pipe(take(1))
      .subscribe(() => {
        // Refresh attachments list
        this.attachments$ = this.attachmentService.getAttachmentsByTask(taskId);
      });
  }

  deleteAttachment(attachment: AttachmentInstance): void {
    const taskId = this.data.task.id;
    if (
      taskId === undefined ||
      taskId === null ||
      attachment.id === undefined ||
      attachment.id === null
    ) {
      return;
    }
    this.attachmentService
      .deleteAttachment(attachment.id)
      .pipe(take(1))
      .subscribe(() => {
        // Refresh attachments list
        this.attachments$ = this.attachmentService.getAttachmentsByTask(taskId);
      });
  }

  downloadAttachment(attachment: AttachmentInstance): void {
    if (attachment.id === undefined || attachment.id === null) {
      return;
    }
    this.attachmentService
      .downloadAttachment(attachment.id)
      .pipe(take(1))
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.originalFilename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  async onSave(): Promise<void> {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const updatedTask: TaskInstance = {
        ...this.data.task,
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        status: formValue.status,
        dueDate: formValue.dueDate,
        assignee: formValue.assignee
          ? ({ id: formValue.assignee } as UserInstance)
          : undefined,
        labels: formValue.labels,
      };
      await firstValueFrom(this.taskService.updateTask(updatedTask));
      this.dialogRef.close(updatedTask);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
