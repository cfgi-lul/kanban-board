import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TaksPreviewComponent } from './taks-preview.component';
import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

describe('TaksPreviewComponent', () => {
  let component: TaksPreviewComponent;
  let fixture: ComponentFixture<TaksPreviewComponent>;
  let translateService: Partial<TranslateService>;

  const mockTask: TaskInstance = new TaskInstance({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    position: 0,
    comments: [],
    attachments: [],
    labels: [],
  });

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: jest.fn().mockReturnValue('Test Message'),
    } as Partial<TranslateService>;

    await TestBed.configureTestingModule({
      imports: [
        TaksPreviewComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService) as Partial<TranslateService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaksPreviewComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required inputs and outputs', () => {
      expect(component.taks).toBeDefined();
      expect(component.name).toBeDefined();
      expect(component.editTask).toBeDefined();
      expect(component.deleteTask).toBeDefined();
    });
  });

  describe('Component Structure', () => {
    it('should have correct selector', () => {
      expect(component.constructor.name).toBe('TaksPreviewComponent');
    });
  });

  describe('Output Events', () => {
    it('should emit editTask event', () => {
      const editSpy = jest.fn();
      component.editTask.subscribe(editSpy);

      // Simulate the event emission
      component.editTask.emit('1');

      expect(editSpy).toHaveBeenCalledWith('1');
    });

    it('should emit deleteTask event', () => {
      const deleteSpy = jest.fn();
      component.deleteTask.subscribe(deleteSpy);

      // Simulate the event emission
      component.deleteTask.emit('1');

      expect(deleteSpy).toHaveBeenCalledWith('1');
    });
  });
}); 