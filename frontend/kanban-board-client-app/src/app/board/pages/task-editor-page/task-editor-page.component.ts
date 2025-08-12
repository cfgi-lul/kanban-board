import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe, JsonPipe, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Observable,
  of,
  take,
  firstValueFrom,
  tap,
  switchMap,
  catchError,
  map,
  Subscription,
} from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';

import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';

import { TaskService } from '../../../core/api/task.service';
import { UserService } from '../../../core/api/user.service';
// import { LabelService } from '../../../core/api/label.service';
import { AttachmentService } from '../../../core/api/attachment.service';

import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import { UserInstance } from '../../../core/models/classes/UserInstance';
import { LabelInstance } from '../../../core/models/classes/LabelInstance';
import { AttachmentInstance } from '../../../core/models/classes/AttachmentInstance';
import { FileSizePipe } from '../../../core/pipes/file-size.pipe';
import { TaskCommentsComponent } from '../../components/task-comments/task-comments.component';
import { TaskDescriptionComponent } from '../../components/task-description/task-description.component';
import { NotFoundComponent } from '../../../not-found/not-found.component';
import { ErrorDisplayComponent } from '../../../core/components/error-display/error-display.component';
import { AttachmentPickerComponent } from '../../../core/components/attachment-picker/attachment-picker.component';

@Component({
  selector: 'kn-task-editor-page',
  standalone: true,
  imports: [
    // Angular
    AsyncPipe,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    // Material
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    JsonPipe,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    // Other
    MarkdownComponent,
    MarkdownModule,
    TextFieldModule,
    TranslateModule,
    FileSizePipe,
    TaskCommentsComponent,
    TaskDescriptionComponent,
    NotFoundComponent,
    MatProgressBarModule,
    ErrorDisplayComponent,
    AttachmentPickerComponent,
  ],
  templateUrl: './task-editor-page.component.html',
  styleUrl: './task-editor-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditorPageComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  // Columns are now loaded via taskService.getColumnsForTask
  // private labelService = inject(LabelService);
  private attachmentService = inject(AttachmentService);

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['MEDIUM'],
    dueDate: [null],
    assignee: [null],
    labels: [[]],
  });
  isEditDescription = false;
  isLoading = signal<boolean>(true);
  loadError = signal<string | null>(null);
  private currentTaskId: string | null = null;
  task$!: Observable<TaskInstance | null>;
  private taskSub?: Subscription;

  users$!: Observable<UserInstance[]>;
  labels$: Observable<LabelInstance[]> = of([]);
  attachments$: Observable<AttachmentInstance[]> = of([]);
  columns$: Observable<{ id: number; name: string }[]> = of([]);
  private currentColumnId?: number;

  task!: TaskInstance;
  // boardId?: number; // Board context was optional; removed as not provided via URL
  notFound = false;

  priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredLabels: LabelInstance[] = [];

  ngOnInit(): void {
    this.task$ = this.route.paramMap.pipe(
      tap(() => {
        this.isLoading.set(true);
        this.loadError.set(null);
        this.notFound = false;
      }),
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.notFound = true;
          this.isLoading.set(false);
          return of(null);
        }
        this.currentTaskId = id;
        return this.taskService.getTasksByID(id);
      }),
      map(task => {
        this.isLoading.set(false);
        if (!task) {
          this.notFound = true;
          return null;
        }
        // success side-effects and pass through
        this.task = task;
        this.buildForm(task);
        this.users$ = this.userService.getAllUsers();
        if (this.task.id !== undefined && this.task.id !== null) {
          this.attachments$ = this.attachmentService.getAttachmentsByTask(
            this.task.id
          );
        }
        return task;
      }),
      catchError(() => {
        this.isLoading.set(false);
        this.loadError.set('Failed to load task');
        return of(null);
      })
    );

    // ensure execution
    this.taskSub = this.task$.subscribe();
  }

  // loadTask no longer needed; logic moved to task$ stream

  reload(): void {
    // Re-subscribe by re-running ngOnInit stream setup
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.taskSub?.unsubscribe();
  }

  private buildForm(task: TaskInstance): void {
    this.taskForm = new FormGroup({
      title: new FormControl(task.title || '', Validators.required),
      description: new FormControl(task.description),
      priority: new FormControl(task.priority || 'MEDIUM'),
      dueDate: new FormControl(task.dueDate ? new Date(task.dueDate) : null),
      assignee: new FormControl(task.assignee?.id || null),
      labels: new FormControl(task.labels || []),
      status: new FormControl(null),
    });

    this.columns$ = this.taskService.getColumnsForTask(task.id as number).pipe(
      map(e => {
        this.taskForm.get('status')?.setValue(task.columnId);
        return e.map(el => ({ id: el.id as number, name: el.name }));
      })
    );
  }

  onClearTitle(): void {
    this.taskForm.get('title')?.setValue('');
  }

  toggleEditDescription(): void {
    this.isEditDescription = !this.isEditDescription;
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

  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const existingLabel = this.filteredLabels.find(
        label => label.name.toLowerCase() === value.toLowerCase()
      );

      if (existingLabel) {
        const currentLabels = this.taskForm.get('labels')?.value || [];
        const exists = currentLabels.find(
          (l: LabelInstance) => l.id === existingLabel.id
        );
        if (!exists) {
          this.taskForm
            .get('labels')
            ?.setValue([...currentLabels, existingLabel]);
        }
      }
    }
    event.chipInput?.clear();
  }

  async onSave(): Promise<void> {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const updatedTask: TaskInstance = {
        ...this.task,
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        dueDate: formValue.dueDate,
        assignee: formValue.assignee
          ? ({ id: formValue.assignee } as UserInstance)
          : undefined,
        labels: formValue.labels,
      };
      // Send column change via update
      const selectedColumnId: number | null = formValue.status ?? null;
      const payload: TaskInstance = {
        ...updatedTask,
        columnId: selectedColumnId ?? undefined,
        position: updatedTask.position,
      } as any;

      await firstValueFrom(this.taskService.updateTask(payload).pipe(take(1)));
      this.currentColumnId = selectedColumnId ?? this.currentColumnId;
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/main']);
  }
}
