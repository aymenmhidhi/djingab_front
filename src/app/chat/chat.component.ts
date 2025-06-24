import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../app/chat/service/wbsocket.service';
import { MessageService } from './service/message.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [WebSocketService, MessageService]
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;

  messages: { senderId: number; receiverId: number; content: string; timestamp: string }[] = [];
  newMessage: string = '';
  userId: number = 0;

  constructor(
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.conversation) {
      this.messages = this.conversation.messages || [];
    }

    const user = localStorage.getItem('user');
    if (user != null) {
      const userJson = JSON.parse(user);
      this.userId = userJson['id'];

      // Connexion WebSocket
      this.webSocketService.connect(() => {
        // S'abonner au bon topic : /topic/chat/{userId}
        const destination = `/topic/chat/${this.userId}`;
        this.webSocketService.subscribe(destination, (msg) => {
          this.messages.push(msg);
        });
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      senderId: this.userId,
      content: this.newMessage,
      receiverId: this.conversation.contactId,
      timestamp: new Date().toISOString()
    };

    // Envoie via REST API ou via WebSocket STOMP
    this.messageService.sendMessage(message); // REST (optionnel)

    // WebSocket STOMP (recommandé si temps réel)
    this.webSocketService.sendMessage('/app/send-message', message);

    this.messages.push(message);
    this.newMessage = '';
  }
}
