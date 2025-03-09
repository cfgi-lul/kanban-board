import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../../../core/api/comment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { TaskEditorComponent } from './task-editor.component';
import { TaskService } from '../../../core/api/task.service';
import { provideMarkdown } from 'ngx-markdown';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('TaskEditorComponent', () => {
  let component: TaskEditorComponent;
  let fixture: ComponentFixture<TaskEditorComponent>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TaskEditorComponent>>;

  beforeEach(async () => {
    mockCommentService = jasmine.createSpyObj('CommentService', [
      'getComments',
      'createComment',
    ]);
    mockTaskService = jasmine.createSpyObj('TaskService', ['updateTask']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    // Ensure mocked methods return observables
    mockCommentService.getComments.and.returnValue(of([]));
    mockTaskService.updateTask.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        TaskEditorComponent,
      ],
      providers: [
        provideMarkdown(),
        provideAnimationsAsync(),
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { task: { id: 1, title: 'Test', description: '' } },
        },
        { provide: CommentService, useValue: mockCommentService },
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with task data', () => {
    expect(component.taskForm.value).toEqual({
      title: 'Test',
      description: '',
      newComment: '',
    });
  });

  it('should add comment', () => {
    const testComment = { content: 'Test comment', taskId: 1 };
    mockCommentService.createComment.and.returnValue(of({}));

    component.taskForm.get('newComment')?.setValue('Test comment');
    component.addComment();

    expect(mockCommentService.createComment).toHaveBeenCalledWith(testComment);
    expect(component.taskForm.get('newComment')?.value).toBe('');
  });
});
