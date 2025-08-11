export interface WebSocketMessage {
  type: string;
  boardId: number;
  userId: string;
  timestamp: number;
}

export interface TaskMoveMessage extends WebSocketMessage {
  type: 'TASK_MOVE';
  taskId: number;
  previousColumnId: number;
  currentColumnId: number;
  previousIndex: number;
  currentIndex: number;
}

export interface TaskCreateMessage extends WebSocketMessage {
  type: 'TASK_CREATE';
  task: any; // TaskDTO
  columnId: number;
}

export interface TaskUpdateMessage extends WebSocketMessage {
  type: 'TASK_UPDATE';
  task: any; // TaskDTO
}

export interface TaskDeleteMessage extends WebSocketMessage {
  type: 'TASK_DELETE';
  taskId: number;
}

export interface BoardUpdateMessage extends WebSocketMessage {
  type: 'BOARD_UPDATE';
  board: any; // BoardDTO
}

export interface WebSocketResponse {
  type: string;
  status: 'SUCCESS' | 'ERROR';
  message: string;
  board?: any; // BoardDTO
  timestamp: number;
}

export type WebSocketMessageType =
  | TaskMoveMessage
  | TaskCreateMessage
  | TaskUpdateMessage
  | TaskDeleteMessage
  | BoardUpdateMessage;
