import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map, shareReplay } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

type StompCommand =
  | 'CONNECT'
  | 'CONNECTED'
  | 'SUBSCRIBE'
  | 'MESSAGE'
  | 'SEND'
  | 'ERROR'
  | 'DISCONNECT'
  | string;

interface SubscriptionEntry {
  destination: string;
  id: string;
  subject: Subject<string>;
}

@Injectable({ providedIn: 'root' })
export class StompService {
  private socket$: WebSocketSubject<string> | null = null;
  private connected = false;
  private subscriptionsByDest = new Map<string, SubscriptionEntry>();
  private subscriptionsById = new Map<string, SubscriptionEntry>();
  private nextSubId = 0;

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host; // includes hostname:port
    return `ws://localhost:8080/ws/websocket`;
  }

  private ensureConnection(): void {
    if (this.socket$) return;

    this.socket$ = webSocket<string>({
      url: this.getWebSocketUrl(),
      serializer: msg => msg,
      deserializer: e => e.data as string,
    });

    // CONNECT
    const headers = this.objectToStompHeaders({
      'accept-version': '1.2',
      host: window.location.hostname,
    });
    this.socket$.next(`CONNECT\n${headers}\n\n\0`);

    // Handle frames
    this.socket$
      .pipe(filter(frame => typeof frame === 'string'))
      .subscribe(frame => this.handleFrame(frame as string));
  }

  private handleFrame(rawFrame: string): void {
    const [command, headers, body] = this.parseStompFrame(rawFrame);
    if (command === 'CONNECTED') {
      this.connected = true;
      // Resubscribe all
      this.subscriptionsByDest.forEach(entry => {
        this.sendSubscribe(entry);
      });
      return;
    }

    if (command === 'MESSAGE') {
      const subId = headers['subscription'];
      const entry = subId ? this.subscriptionsById.get(subId) : undefined;
      if (entry) {
        entry.subject.next(body);
      }
      return;
    }
  }

  private sendSubscribe(entry: SubscriptionEntry): void {
    const frame = `SUBSCRIBE\nid:${entry.id}\ndestination:${entry.destination}\n\n\0`;
    this.socket$?.next(frame);
  }

  watch<T = unknown>(destination: string): Observable<T> {
    this.ensureConnection();

    let entry = this.subscriptionsByDest.get(destination);
    if (!entry) {
      entry = {
        destination,
        id: `sub-${++this.nextSubId}`,
        subject: new Subject<string>(),
      };
      this.subscriptionsByDest.set(destination, entry);
      this.subscriptionsById.set(entry.id, entry);

      if (this.connected) {
        this.sendSubscribe(entry);
      }
    }

    return entry.subject.asObservable().pipe(
      map(body => JSON.parse(body) as T),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  // Utilities
  private parseStompFrame(
    rawFrame: string
  ): [StompCommand, Record<string, string>, string] {
    const divider = rawFrame.indexOf('\n\n');
    const headerSection =
      divider >= 0 ? rawFrame.substring(0, divider) : rawFrame;
    const body =
      divider >= 0 ? rawFrame.substring(divider + 2).replace(/\0$/, '') : '';

    const headers = headerSection.split('\n');
    const command = headers.shift() as StompCommand;
    const headerObj = headers.reduce(
      (acc, line) => {
        const idx = line.indexOf(':');
        if (idx > -1) {
          const key = line.substring(0, idx).trim();
          const value = line.substring(idx + 1).trim();
          acc[key] = value;
        }
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
