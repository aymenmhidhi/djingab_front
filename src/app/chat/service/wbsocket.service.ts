import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client;
  private messageSubject = new Subject<any>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error', frame);
    };

    this.stompClient.activate();
  }

  subscribeToMessages(userId: string) {
    this.stompClient.subscribe(`/topic/chat/${userId}`, (message: IMessage) => {
      this.messageSubject.next(JSON.parse(message.body));
    });
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }
}
