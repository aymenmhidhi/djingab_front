import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from './service/wbsocket.service'
import { MessageService } from './service/message.service'

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule, FormsModule
    // autres modules...
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [WebSocketService, MessageService]
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;

  messages: { sender: string; content: string; timestamp: string }[] = [];
  newMessage: string = '';
  constructor(private webSocketService: WebSocketService, private messageService: MessageService) { }
  ngOnInit(): void {
    if (this.conversation) {
      // Ici tu devrais appeler le chatService pour charger les messages
      this.messages = this.conversation.messages || []; // Exemple
    }
    const user = localStorage.getItem('user');
    if (user != null) {
      const userJson = JSON.parse(user);
      const userId = userJson['id'];
      this.webSocketService.subscribeToMessages(userId);
      this.webSocketService.getMessages().subscribe((msg) => {
        this.messages.push(msg);
      });
    }
     // ton propre système
    
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      sender: 'Moi',
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };

    this.messageService.sendMessage(message);
    this.messages.push(message);
    this.newMessage = '';
  }
}
