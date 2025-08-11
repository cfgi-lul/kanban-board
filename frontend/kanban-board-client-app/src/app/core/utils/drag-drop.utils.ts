import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardInstance } from '../models/classes/BoardInstance';
import { TaskInstance } from '../models/classes/TaskInstance';

export interface DragDropEvent {
  taskId: number;
  previousColumnId: number;
  currentColumnId: number;
  previousIndex: number;
  currentIndex: number;
  boardId: number;
}

export interface TaskMoveData {
  type: 'TASK_MOVE';
  boardId: number;
  userId: string;
  taskId: number;
  previousColumnId: number;
  currentColumnId: number;
  previousIndex: number;
  currentIndex: number;
  timestamp: number;
}

/**
 * Handles the drag and drop operation and returns the updated board state
 * @param event - The CDK drag drop event
 * @param currentBoard - The current board instance
 * @returns The updated board instance, drag drop event data, and whether the event should be sent
 */
export function handleDragDrop(
  event: CdkDragDrop<TaskInstance[]>,
  currentBoard: BoardInstance
): { updatedBoard: BoardInstance; dragEvent: DragDropEvent; shouldSendEvent: boolean } {
  const { previousContainer, container, previousIndex, currentIndex } = event;
  
  // Check if the task was dropped in the same position (no actual movement) - do this first!
  const isSameColumn = previousContainer === container;
  const isSamePosition = isSameColumn && previousIndex === currentIndex;
  
  // If it's the same column and same position, don't send the event and return early
  if (isSamePosition) {
    // Find the columns in the original board
    const previousColumn = currentBoard.columns?.find(col => col.id?.toString() === previousContainer.id);
    const currentColumn = currentBoard.columns?.find(col => col.id?.toString() === container.id);
    
    if (!previousColumn || !currentColumn) {
      throw new Error('Column not found');
    }
    
    // Get the task being moved
    const movedTask = previousColumn.tasks?.[previousIndex];
    if (!movedTask) {
      throw new Error('Task not found');
    }
    
    const dragEvent: DragDropEvent = {
      taskId: movedTask.id!,
      previousColumnId: previousColumn.id!,
      currentColumnId: currentColumn.id!,
      previousIndex,
      currentIndex: movedTask.position ?? 0,
      boardId: currentBoard.id!
    };
    
    return { updatedBoard: currentBoard, dragEvent, shouldSendEvent: false };
  }
  
  // Create a deep copy of the board to avoid mutating the original
  const updatedBoard = JSON.parse(JSON.stringify(currentBoard)) as BoardInstance;
  
  // Find the columns in the updated board
  const previousColumn = updatedBoard.columns?.find(col => col.id?.toString() === previousContainer.id);
  const currentColumn = updatedBoard.columns?.find(col => col.id?.toString() === container.id);
  
  if (!previousColumn || !currentColumn) {
    throw new Error('Column not found');
  }
  
  // Ensure tasks arrays exist
  if (!previousColumn.tasks || !currentColumn.tasks) {
    throw new Error('Tasks array not found');
  }
  
  // Get the task being moved
  const movedTask = previousColumn.tasks[previousIndex];
  if (!movedTask) {
    throw new Error('Task not found');
  }
  
  // Calculate the new position based on where the task is dropped
  let newPosition: number;
  
  if (previousContainer === container) {
    // Same column - calculate position based on surrounding tasks
    const sortedTasks = [...currentColumn.tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    
    if (sortedTasks.length === 0) {
      // Empty column
      newPosition = 0;
    } else if (currentIndex === 0) {
      // Dropped at the top
      const firstTask = sortedTasks[0];
      newPosition = (firstTask?.position ?? 0) - 10;
    } else if (currentIndex >= sortedTasks.length) {
      // Dropped at the bottom
      const lastTask = sortedTasks[sortedTasks.length - 1];
      newPosition = (lastTask?.position ?? 0) + 10;
    } else {
      // Dropped between two tasks
      const beforeTask = sortedTasks[currentIndex - 1];
      const afterTask = sortedTasks[currentIndex];
      if (beforeTask && afterTask) {
        newPosition = ((beforeTask.position ?? 0) + (afterTask.position ?? 0)) / 2;
      } else {
        // Fallback if tasks are undefined
        newPosition = currentIndex * 10;
      }
    }
    
    // Remove task from old position and insert at new position
    currentColumn.tasks.splice(previousIndex, 1);
    currentColumn.tasks.splice(currentIndex, 0, movedTask);
  } else {
    // Different column - calculate position in new column
    const sortedTasks = [...currentColumn.tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    
    if (sortedTasks.length === 0) {
      // Empty column
      newPosition = 0;
    } else if (currentIndex === 0) {
      // Dropped at the top
      const firstTask = sortedTasks[0];
      newPosition = (firstTask?.position ?? 0) - 10;
    } else if (currentIndex >= sortedTasks.length) {
      // Dropped at the bottom
      const lastTask = sortedTasks[sortedTasks.length - 1];
      newPosition = (lastTask?.position ?? 0) + 10;
    } else {
      // Dropped between two tasks
      const beforeTask = sortedTasks[currentIndex - 1];
      const afterTask = sortedTasks[currentIndex];
      if (beforeTask && afterTask) {
        newPosition = ((beforeTask.position ?? 0) + (afterTask.position ?? 0)) / 2;
      } else {
        // Fallback if tasks are undefined
        newPosition = currentIndex * 10;
      }
    }
    
    // Remove from old column and add to new column
    previousColumn.tasks.splice(previousIndex, 1);
    currentColumn.tasks.splice(currentIndex, 0, movedTask);
  }
  
  // Update the moved task's position and column
  movedTask.position = newPosition;
  
  // Create the drag drop event data
  if (!movedTask.id || !previousColumn.id || !currentColumn.id || !updatedBoard.id) {
    throw new Error('Required data not found');
  }
  
  // If it's the same column and same position, don't send the event
  const shouldSendEvent = !isSamePosition;
  
  const dragEvent: DragDropEvent = {
    taskId: movedTask.id,
    previousColumnId: previousColumn.id,
    currentColumnId: currentColumn.id,
    previousIndex,
    currentIndex: newPosition, // Use calculated position instead of array index
    boardId: updatedBoard.id
  };
  
  return { updatedBoard, dragEvent, shouldSendEvent };
}

/**
 * Validates if a drag and drop operation is valid
 * @param event - The CDK drag drop event
 * @returns True if the operation is valid
 */
export function isValidDragDrop(event: CdkDragDrop<TaskInstance[]>): boolean {
  const { previousContainer, container, previousIndex, currentIndex } = event;
  
  // Check if containers exist
  if (!previousContainer || !container) {
    return false;
  }
  
  // Check if indices are valid
  if (previousIndex < 0 || currentIndex < 0) {
    return false;
  }
  
  // Check if the task exists
  const task = previousContainer.data[previousIndex];
  if (!task || !task.id) {
    return false;
  }
  
  return true;
} 