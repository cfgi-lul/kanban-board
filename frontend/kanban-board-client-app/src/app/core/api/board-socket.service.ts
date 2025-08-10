/* eslint-disable @typescript-eslint/no-explicit-any */
import { filter, map, Observable, take, catchError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardSocketService {
  private authService = inject(AuthService);

  private socket$: WebSocketSubject<any>;
  private readonly stompHeaders = {
    'accept-version': '1.2',
    host: 'localhost',
  };

  connect(boardId: string): void {
    this.socket$ = webSocket({
      url: `ws://localhost:8080/ws/websocket`,
      protocol: 'v12.stomp',
      serializer: msg => msg,
      deserializer: e => e.data,
    });

    // Send CONNECT frame
    this.socket$.next(
      `CONNECT\n${this.objectToStompHeaders(this.stompHeaders)}\n\n\0`
    );

    // Subscribe to board-specific updates
    this.waitForConnection().subscribe(() => {
      const subscribeFrame = `SUBSCRIBE\nid:sub-${boardId}\ndestination:/topic/board/${boardId}\n\n\0`;
      this.socket$.next(subscribeFrame);
    });
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  listenForUpdates(): Observable<any> {
    return this.socket$.pipe(
      filter((message: string) => message.startsWith('MESSAGE')),
      map((message: string) => {
        const [, , body] = this.parseStompFrame(message);
        const parsedMessage = JSON.parse(body);
        
        // Handle new WebSocket response format
        if (parsedMessage.type && parsedMessage.status) {
          // This is a WebSocket response with status
          if (parsedMessage.status === 'SUCCESS' && parsedMessage.board) {
            return parsedMessage.board;
          } else if (parsedMessage.status === 'ERROR') {
            console.error('WebSocket error response:', parsedMessage.message);
            throw new Error(parsedMessage.message || 'WebSocket operation failed');
          }
        }
        
        // Fallback to old format (direct board object)
        return parsedMessage;
      }),
      catchError(error => {
        console.error('WebSocket error in listenForUpdates:', error);
        throw error;
      })
    );
  }

  sendUpdate(boardId: string, update: any): void {
    const updateFrame = `SEND\ndestination:/app/board/${boardId}/update\ncontent-type:application/json\n\n${JSON.stringify(update)}\0`;
    this.socket$.next(updateFrame);
  }

  sendTaskMove(boardId: string, taskMoveData: any): void {
    const taskMoveFrame = `SEND\ndestination:/app/board/${boardId}/task-move\ncontent-type:application/json\n\n${JSON.stringify(taskMoveData)}\0`;
    this.socket$.next(taskMoveFrame);
  }

  sendTaskCreate(boardId: string, taskCreateData: any): void {
    const taskCreateFrame = `SEND\ndestination:/app/board/${boardId}/task-create\ncontent-type:application/json\n\n${JSON.stringify(taskCreateData)}\0`;
    this.socket$.next(taskCreateFrame);
  }

  sendTaskUpdate(boardId: string, taskUpdateData: any): void {
    const taskUpdateFrame = `SEND\ndestination:/app/board/${boardId}/task-update\ncontent-type:application/json\n\n${JSON.stringify(taskUpdateData)}\0`;
    this.socket$.next(taskUpdateFrame);
  }

  sendTaskDelete(boardId: string, taskDeleteData: any): void {
    const taskDeleteFrame = `SEND\ndestination:/app/board/${boardId}/task-delete\ncontent-type:application/json\n\n${JSON.stringify(taskDeleteData)}\0`;
    this.socket$.next(taskDeleteFrame);
  }

  private waitForConnection(): Observable<void> {
    return this.socket$.pipe(
      filter((message: string) => message.startsWith('CONNECTED')),
      take(1),
      map(() => void 0)
    );
  }

  private parseStompFrame(
    rawFrame: string
  ): [string, Record<string, string>, string] {
    const divider = rawFrame.indexOf('\n\n');
    const headerSection = rawFrame.substring(0, divider);
    const body = rawFrame.substring(divider + 2).replace(/\0$/, '');

    const headers = headerSection.split('\n');
    const command = headers.shift() || '';
    const headerObj = headers.reduce(
      (acc, line) => {
        const [key, value] = line.split(':');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      },
      {} as Record<string, string>
    );

    return [command, headerObj, body];
  }

  private objectToStompHeaders(obj: Record<string, string>): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}:${value}`)
      .join('\n');
  }
}
