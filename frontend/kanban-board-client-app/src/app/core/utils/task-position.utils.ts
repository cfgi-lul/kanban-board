import { TaskInstance } from '../models/classes/TaskInstance';
import { ColumnInstance } from '../models/classes/ColumnInstance';
import { BoardInstance } from '../models/classes/BoardInstance';

/**
 * Sorts tasks in a column by their position
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
export function sortTasksByPosition(tasks: TaskInstance[]): TaskInstance[] {
  if (!tasks || tasks.length === 0) {
    return tasks;
  }
  
  const sorted = [...tasks].sort((a, b) => {
    const posA = a?.position ?? 0;
    const posB = b?.position ?? 0;
    return posA - posB;
  });
  
  return sorted;
}

/**
 * Ensures all tasks in a board have proper position values
 * @param board - Board instance to process
 * @returns Updated board with properly positioned tasks
 */
export function ensureTaskPositions(board: BoardInstance): BoardInstance {
  if (!board.columns) {
    return board;
  }

  const updatedBoard = { ...board };
  updatedBoard.columns = board.columns.map(column => {
    if (!column.tasks || column.tasks.length === 0) {
      return column;
    }

    const updatedColumn = { ...column };
    
    // First, assign positions to tasks that don't have them
    updatedColumn.tasks = column.tasks.map((task, index) => {
      if (task.position === undefined || task.position === null) {
        return { ...task, position: index * 10 }; // Use multiples of 10 for better spacing
      }
      return task;
    });

    // Sort tasks by position to ensure correct order
    updatedColumn.tasks = sortTasksByPosition(updatedColumn.tasks);
    
    return updatedColumn;
  });

  return updatedBoard;
}

/**
 * Assigns sequential positions to tasks in a column
 * @param tasks - Array of tasks to reorder
 * @returns Array of tasks with sequential positions
 */
export function assignSequentialPositions(tasks: TaskInstance[]): TaskInstance[] {
  return tasks.map((task, index) => ({
    ...task,
    position: index
  }));
}

/**
 * Gets the next available position in a column
 * @param tasks - Array of tasks in the column
 * @returns Next available position
 */
export function getNextPosition(tasks: TaskInstance[]): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  
  const maxPosition = Math.max(...tasks.map(task => task.position ?? 0));
  return maxPosition + 10; // Use increments of 10 for better spacing
}

/**
 * Normalizes task positions to prevent them from getting too large
 * @param tasks - Array of tasks to normalize
 * @returns Array of tasks with normalized positions
 */
export function normalizeTaskPositions(tasks: TaskInstance[]): TaskInstance[] {
  if (!tasks || tasks.length === 0) {
    return tasks;
  }
  
  const sortedTasks = sortTasksByPosition(tasks);
  return sortedTasks.map((task, index) => ({
    ...task,
    position: index * 10
  }));
} 