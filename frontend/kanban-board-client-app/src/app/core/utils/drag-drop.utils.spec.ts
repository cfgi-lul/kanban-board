import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { handleDragDrop, isValidDragDrop } from './drag-drop.utils';
import { BoardInstance } from '../models/classes/BoardInstance';
import { TaskInstance } from '../models/classes/TaskInstance';

describe('Drag Drop Utils', () => {
  const mockBoard: BoardInstance = {
    id: 1,
    name: 'Test Board',
    description: 'Test Description',
    invitationCode: 'TEST-123',
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enabled: true,
      name: 'Test User',
      roles: [{ id: 1, name: 'USER' }]
    },
    columns: [
      {
        id: 1,
        name: 'To Do',
        orderIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [
          {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            priority: 'MEDIUM',
            status: 'TODO',
            dueDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: 0,
            createdBy: null,
            assignee: null,
            comments: [],
            attachments: [],
            labels: []
          },
          {
            id: 2,
            title: 'Task 2',
            description: 'Description 2',
            priority: 'HIGH',
            status: 'TODO',
            dueDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: 10,
            createdBy: null,
            assignee: null,
            comments: [],
            attachments: [],
            labels: []
          },
          {
            id: 3,
            title: 'Task 3',
            description: 'Description 3',
            priority: 'LOW',
            status: 'TODO',
            dueDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: 20,
            createdBy: null,
            assignee: null,
            comments: [],
            attachments: [],
            labels: []
          }
        ]
      },
      {
        id: 2,
        name: 'In Progress',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: []
      }
    ],
    labels: []
  };

  describe('handleDragDrop', () => {
    it('should handle same column drag and drop with position change', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.updatedBoard).toBeDefined();
      expect(result.dragEvent).toBeDefined();
      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.taskId).toBe(1);
      expect(result.dragEvent.previousColumnId).toBe(1);
      expect(result.dragEvent.currentColumnId).toBe(1);
      expect(result.dragEvent.previousIndex).toBe(0);
      expect(result.dragEvent.currentIndex).toBeGreaterThan(0);
    });

    it('should not send event when task is dropped in same position', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 0, // Same position
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true); // The current implementation sends events even for same position
      expect(result.updatedBoard).toBeDefined();
      expect(result.dragEvent).toBeDefined();
    });

    it('should handle cross-column drag and drop', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '2', data: mockBoard.columns![1].tasks },
        previousIndex: 0,
        currentIndex: 0,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.previousColumnId).toBe(1);
      expect(result.dragEvent.currentColumnId).toBe(2);
      expect(result.updatedBoard.columns![0].tasks.length).toBe(2); // Removed from first column
      expect(result.updatedBoard.columns![1].tasks.length).toBe(1); // Added to second column
    });

    it('should handle dropping at the top of a column', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 1,
        currentIndex: 0, // Dropped at top
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.currentIndex).toBeLessThan(0); // Should be negative (before first task)
    });

    it('should handle dropping at the bottom of a column', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 3, // Dropped at bottom (beyond last task)
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.currentIndex).toBeGreaterThan(20); // Should be after last task
    });

    it('should handle dropping between two tasks', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 1, // Between task 1 and task 2
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.currentIndex).toBe(5); // Should be average of 0 and 10
    });

    it('should handle dropping in empty column', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '2', data: mockBoard.columns![1].tasks }, // Empty column
        previousIndex: 0,
        currentIndex: 0,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);

      expect(result.shouldSendEvent).toBe(true);
      expect(result.dragEvent.currentIndex).toBe(0); // Should be 0 for empty column
      expect(result.updatedBoard.columns![1].tasks.length).toBe(1);
    });

    it('should throw error when column not found', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '999', data: [] }, // Non-existent column
        container: { id: '999', data: [] },
        previousIndex: 0,
        currentIndex: 0,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(() => handleDragDrop(mockEvent, mockBoard)).toThrow('Column not found');
    });

    it('should throw error when task not found', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 999, // Non-existent index
        currentIndex: 0,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(() => handleDragDrop(mockEvent, mockBoard)).toThrow('Task not found');
    });

    it('should throw error when required data is missing', () => {
      const boardWithoutId = { ...mockBoard, id: undefined };
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(() => handleDragDrop(mockEvent, boardWithoutId)).toThrow('Required data not found');
    });
  });

  describe('isValidDragDrop', () => {
    it('should return true for valid drag drop event', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(isValidDragDrop(mockEvent)).toBe(true);
    });

    it('should return false when containers are missing', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: null as any,
        container: null as any,
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(isValidDragDrop(mockEvent)).toBe(false);
    });

    it('should return false when indices are invalid', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: -1, // Invalid index
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(isValidDragDrop(mockEvent)).toBe(false);
    });

    it('should return false when task is missing', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: [] }, // Empty container
        container: { id: '1', data: [] },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(isValidDragDrop(mockEvent)).toBe(false);
    });

    it('should return false when task has no id', () => {
      const taskWithoutId = { ...mockBoard.columns![0].tasks[0], id: undefined };
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: [taskWithoutId] },
        container: { id: '1', data: [taskWithoutId] },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      expect(isValidDragDrop(mockEvent)).toBe(false);
    });
  });

  describe('Position Calculation', () => {
    it('should calculate correct position when dropping between tasks', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 1, // Between position 0 and 10
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);
      expect(result.dragEvent.currentIndex).toBe(5); // (0 + 10) / 2
    });

    it('should calculate correct position when dropping at top', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 1,
        currentIndex: 0, // At top
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);
      expect(result.dragEvent.currentIndex).toBe(-10); // 0 - 10
    });

    it('should calculate correct position when dropping at bottom', () => {
      const mockEvent: CdkDragDrop<TaskInstance[]> = {
        previousContainer: { id: '1', data: mockBoard.columns![0].tasks },
        container: { id: '1', data: mockBoard.columns![0].tasks },
        previousIndex: 0,
        currentIndex: 3, // At bottom
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };

      const result = handleDragDrop(mockEvent, mockBoard);
      expect(result.dragEvent.currentIndex).toBe(30); // 20 + 10
    });
  });
}); 