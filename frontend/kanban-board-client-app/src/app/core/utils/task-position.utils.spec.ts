import {
  sortTasksByPosition,
  ensureTaskPositions,
  assignSequentialPositions,
  getNextPosition,
  normalizeTaskPositions,
} from './task-position.utils';
import { TaskInstance } from '../models/classes/TaskInstance';
import { BoardInstance } from '../models/classes/BoardInstance';

describe('Task Position Utils', () => {
  const mockTasks: TaskInstance[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: 20,
      createdBy: null,
      assignee: null,
      comments: [],
      attachments: [],
      labels: [],
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
      position: 0,
      createdBy: null,
      assignee: null,
      comments: [],
      attachments: [],
      labels: [],
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
      position: 10,
      createdBy: null,
      assignee: null,
      comments: [],
      attachments: [],
      labels: [],
    },
  ];

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
      roles: [{ id: 1, name: 'USER' }],
    },
    columns: [
      {
        id: 1,
        name: 'To Do',
        orderIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [...mockTasks],
      },
      {
        id: 2,
        name: 'In Progress',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [],
      },
    ],
    labels: [],
  };

  describe('sortTasksByPosition', () => {
    it('should sort tasks by position in ascending order', () => {
      const result = sortTasksByPosition(mockTasks);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(10);
      expect(result[2].position).toBe(20);
    });

    it('should handle tasks with undefined positions', () => {
      const tasksWithUndefined = [
        { ...mockTasks[0], position: undefined },
        { ...mockTasks[1], position: 5 },
        { ...mockTasks[2], position: undefined },
      ];

      const result = sortTasksByPosition(tasksWithUndefined);

      // Undefined positions are treated as 0, so they come first
      expect(result[0].position).toBeUndefined();
      expect(result[1].position).toBeUndefined();
      expect(result[2].position).toBe(5);
    });

    it('should handle empty array', () => {
      const result = sortTasksByPosition([]);
      expect(result).toEqual([]);
    });

    it('should handle null array', () => {
      const result = sortTasksByPosition(null as any);
      expect(result).toBeNull();
    });

    it('should handle tasks with null positions', () => {
      const tasksWithNull = [
        { ...mockTasks[0], position: null },
        { ...mockTasks[1], position: 5 },
        { ...mockTasks[2], position: null },
      ];

      const result = sortTasksByPosition(tasksWithNull);

      // Null positions are treated as 0, so they come first
      expect(result[0].position).toBeNull();
      expect(result[1].position).toBeNull();
      expect(result[2].position).toBe(5);
    });
  });

  describe('ensureTaskPositions', () => {
    it('should assign positions to tasks without positions', () => {
      const tasksWithoutPositions = mockTasks.map(task => ({
        ...task,
        position: undefined,
      }));
      const boardWithoutPositions = {
        ...mockBoard,
        columns: [
          { ...mockBoard.columns![0], tasks: tasksWithoutPositions },
          mockBoard.columns![1],
        ],
      };

      const result = ensureTaskPositions(boardWithoutPositions);

      expect(result.columns![0].tasks[0].position).toBe(0);
      expect(result.columns![0].tasks[1].position).toBe(10);
      expect(result.columns![0].tasks[2].position).toBe(20);
    });

    it('should preserve existing positions', () => {
      const result = ensureTaskPositions(mockBoard);

      // Tasks are sorted by position, so the order changes
      expect(result.columns![0].tasks[0].position).toBe(0);
      expect(result.columns![0].tasks[1].position).toBe(10);
      expect(result.columns![0].tasks[2].position).toBe(20);
    });

    it('should sort tasks by position after assignment', () => {
      const result = ensureTaskPositions(mockBoard);
      const sortedTasks = result.columns![0].tasks;

      expect(sortedTasks[0].position).toBe(0);
      expect(sortedTasks[1].position).toBe(10);
      expect(sortedTasks[2].position).toBe(20);
    });

    it('should handle board without columns', () => {
      const boardWithoutColumns = { ...mockBoard, columns: undefined };
      const result = ensureTaskPositions(boardWithoutColumns);

      expect(result).toEqual(boardWithoutColumns);
    });

    it('should handle empty columns', () => {
      const boardWithEmptyColumns = {
        ...mockBoard,
        columns: [
          { ...mockBoard.columns![0], tasks: [] },
          mockBoard.columns![1],
        ],
      };

      const result = ensureTaskPositions(boardWithEmptyColumns);

      expect(result.columns![0].tasks).toEqual([]);
      expect(result.columns![1].tasks).toEqual([]);
    });

    it('should handle columns with null tasks', () => {
      const boardWithNullTasks = {
        ...mockBoard,
        columns: [
          { ...mockBoard.columns![0], tasks: null as any },
          mockBoard.columns![1],
        ],
      };

      const result = ensureTaskPositions(boardWithNullTasks);

      expect(result.columns![0].tasks).toBeNull();
      expect(result.columns![1].tasks).toEqual([]);
    });
  });

  describe('assignSequentialPositions', () => {
    it('should assign sequential positions starting from 0', () => {
      const result = assignSequentialPositions(mockTasks);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(1);
      expect(result[2].position).toBe(2);
    });

    it('should handle empty array', () => {
      const result = assignSequentialPositions([]);
      expect(result).toEqual([]);
    });

    it('should preserve other task properties', () => {
      const result = assignSequentialPositions(mockTasks);

      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Task 1');
      expect(result[1].id).toBe(2);
      expect(result[1].title).toBe('Task 2');
      expect(result[2].id).toBe(3);
      expect(result[2].title).toBe('Task 3');
    });
  });

  describe('getNextPosition', () => {
    it('should return 0 for empty array', () => {
      const result = getNextPosition([]);
      expect(result).toBe(0);
    });

    it('should return max position + 10 for non-empty array', () => {
      const result = getNextPosition(mockTasks);
      expect(result).toBe(30); // max position (20) + 10
    });

    it('should handle tasks with undefined positions', () => {
      const tasksWithUndefined = [
        { ...mockTasks[0], position: undefined },
        { ...mockTasks[1], position: 5 },
        { ...mockTasks[2], position: undefined },
      ];

      const result = getNextPosition(tasksWithUndefined);
      expect(result).toBe(15); // max position (5) + 10
    });

    it('should handle tasks with null positions', () => {
      const tasksWithNull = [
        { ...mockTasks[0], position: null },
        { ...mockTasks[1], position: 5 },
        { ...mockTasks[2], position: null },
      ];

      const result = getNextPosition(tasksWithNull);
      expect(result).toBe(15); // max position (5) + 10
    });

    it('should handle mixed undefined and null positions', () => {
      const mixedTasks = [
        { ...mockTasks[0], position: undefined },
        { ...mockTasks[1], position: null },
        { ...mockTasks[2], position: 15 },
      ];

      const result = getNextPosition(mixedTasks);
      expect(result).toBe(25); // max position (15) + 10
    });
  });

  describe('normalizeTaskPositions', () => {
    it('should normalize positions to multiples of 10', () => {
      const tasksWithIrregularPositions = [
        { ...mockTasks[0], position: 5 },
        { ...mockTasks[1], position: 15 },
        { ...mockTasks[2], position: 25 },
      ];

      const result = normalizeTaskPositions(tasksWithIrregularPositions);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(10);
      expect(result[2].position).toBe(20);
    });

    it('should sort tasks before normalizing', () => {
      const unsortedTasks = [
        { ...mockTasks[0], position: 20 },
        { ...mockTasks[1], position: 0 },
        { ...mockTasks[2], position: 10 },
      ];

      const result = normalizeTaskPositions(unsortedTasks);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(10);
      expect(result[2].position).toBe(20);
    });

    it('should handle empty array', () => {
      const result = normalizeTaskPositions([]);
      expect(result).toEqual([]);
    });

    it('should handle null array', () => {
      const result = normalizeTaskPositions(null as any);
      expect(result).toBeNull();
    });

    it('should handle tasks with undefined positions', () => {
      const tasksWithUndefined = [
        { ...mockTasks[0], position: undefined },
        { ...mockTasks[1], position: 5 },
        { ...mockTasks[2], position: undefined },
      ];

      const result = normalizeTaskPositions(tasksWithUndefined);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(10);
      expect(result[2].position).toBe(20);
    });

    it('should preserve task order when positions are equal', () => {
      const tasksWithEqualPositions = [
        { ...mockTasks[0], position: 10 },
        { ...mockTasks[1], position: 10 },
        { ...mockTasks[2], position: 10 },
      ];

      const result = normalizeTaskPositions(tasksWithEqualPositions);

      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(10);
      expect(result[2].position).toBe(20);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large position values', () => {
      const tasksWithLargePositions = [
        { ...mockTasks[0], position: 1000000 },
        { ...mockTasks[1], position: 500000 },
        { ...mockTasks[2], position: 750000 },
      ];

      const result = sortTasksByPosition(tasksWithLargePositions);

      expect(result[0].position).toBe(500000);
      expect(result[1].position).toBe(750000);
      expect(result[2].position).toBe(1000000);
    });

    it('should handle negative position values', () => {
      const tasksWithNegativePositions = [
        { ...mockTasks[0], position: -10 },
        { ...mockTasks[1], position: 0 },
        { ...mockTasks[2], position: -5 },
      ];

      const result = sortTasksByPosition(tasksWithNegativePositions);

      expect(result[0].position).toBe(-10);
      expect(result[1].position).toBe(-5);
      expect(result[2].position).toBe(0);
    });

    it('should handle decimal position values', () => {
      const tasksWithDecimalPositions = [
        { ...mockTasks[0], position: 5.5 },
        { ...mockTasks[1], position: 2.3 },
        { ...mockTasks[2], position: 8.7 },
      ];

      const result = sortTasksByPosition(tasksWithDecimalPositions);

      expect(result[0].position).toBe(2.3);
      expect(result[1].position).toBe(5.5);
      expect(result[2].position).toBe(8.7);
    });
  });
});
