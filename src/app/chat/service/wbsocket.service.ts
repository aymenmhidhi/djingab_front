// src/app/chat/service/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-message'),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });
  }

  connect(onConnected: () => void = () => { }): void {
    this.client.onConnect = () => {
      console.log('✅ WebSocket connecté via STOMP');
      onConnected();
    };

    this.client.onStompError = (frame) => {
      console.error('❌ STOMP erreur:', frame);
    };

    this.client.activate();
  }

  sendMessage(destination: string, message: any): void {
    if (this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket non connecté.');
    }
  }

  subscribe(destination: string, callback: (msg: any) => void): void {
    if (this.subscriptions.has(destination)) return;

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      const body = JSON.parse(message.body);
      callback(body);
    });

    this.subscriptions.set(destination, subscription);
  }

  unsubscribe(destination: string): void {
    const sub = this.subscriptions.get(destination);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  disconnect(): void {
    this.client.deactivate();
    this.subscriptions.clear();
  }
}
