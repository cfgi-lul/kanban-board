/* eslint-disable @typescript-eslint/no-explicit-any */
import { filter, map, Observable, take } from 'rxjs';
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
        return JSON.parse(body);
      })
    );
  }

  sendUpdate(boardId: string, update: any): void {
    const updateFrame = `SEND\ndestination:/app/board/${boardId}/update\ncontent-type:application/json\n\n${JSON.stringify(update)}\0`;
    this.socket$.next(updateFrame);
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
