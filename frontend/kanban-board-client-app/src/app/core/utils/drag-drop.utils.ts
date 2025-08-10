import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardInstance } from '../models/classes/BoardInstance';
import { TaskPreviewInstance } from '../models/classes/TaskPreviewInstance';

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
 * @returns The updated board instance and drag drop event data
 */
export function handleDragDrop(
  event: CdkDragDrop<TaskPreviewInstance[]>,
  currentBoard: BoardInstance
): { updatedBoard: BoardInstance; dragEvent: DragDropEvent } {
  const { previousContainer, container, previousIndex, currentIndex } = event;
  
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
  
  // Perform the drag and drop operation on the copied data
  if (previousContainer === container) {
    moveItemInArray(currentColumn.tasks, previousIndex, currentIndex);
  } else {
    transferArrayItem(previousColumn.tasks, currentColumn.tasks, previousIndex, currentIndex);
  }
  
  // Create the drag drop event data
  const movedTask = currentColumn.tasks[currentIndex];
  if (!movedTask?.id || !previousColumn.id || !currentColumn.id || !updatedBoard.id) {
    throw new Error('Required data not found');
  }
  
  const dragEvent: DragDropEvent = {
    taskId: movedTask.id,
    previousColumnId: previousColumn.id,
    currentColumnId: currentColumn.id,
    previousIndex,
    currentIndex,
    boardId: updatedBoard.id
  };
  
  return { updatedBoard, dragEvent };
}

/**
 * Validates if a drag and drop operation is valid
 * @param event - The CDK drag drop event
 * @returns True if the operation is valid
 */
export function isValidDragDrop(event: CdkDragDrop<TaskPreviewInstance[]>): boolean {
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