import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConversationsServiceService } from '../conversations/service/conversations-service.service';
import { WebSocketService } from '../../app/chat/service/wbsocket.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
  providers: [ConversationsServiceService],
})
export class ConversationsComponent implements OnInit {
  conversations: any[] = [];
  userId!: number;

  @Output() conversationSelected = new EventEmitter<any>();

  constructor(
    private conversationsServiceService: ConversationsServiceService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.userId = JSON.parse(user)['id'];

      if (!this.webSocketService.isConnected()) {
        this.webSocketService.connect(() => {
          this.subscribeToWebSocket();
        });
      } else {
        this.subscribeToWebSocket();
      }
    }

    this.getConversations();
  }

  private subscribeToWebSocket(): void {
    const destination = `/topic/chat/${this.userId}`;
    this.webSocketService.subscribe(destination, () => { });
    this.webSocketService.incomingMessage$.subscribe((msg) => {
      this.handleIncomingMessage(msg);
    });
  }

  selectConversation(conversation: any): void {
    conversation.unreadCount = 0;
    this.conversationSelected.emit(conversation);
  }

  getConversations(): void {
    this.conversationsServiceService.getConversations().subscribe(
      (data: any) => {
        this.conversations = data;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des conversations:', error);
      }
    );
  }

  handleIncomingMessage(message: any): void {
    const existingConversation = this.conversations.find(
      (conv) => conv.id === message.conversationId
    );

    if (existingConversation) {
      if (!existingConversation.content) existingConversation.content = [];
      existingConversation.content.push(message);
      existingConversation.conversationId = message.conversationId;
      existingConversation.unreadCount = (existingConversation.unreadCount || 0) + 1;
    } else {
      const newConversation = {
        id: message.conversationId || null,
        contactId: message.senderId,
        from: { id: message.senderId, username: message.senderUsername },
        messages: [message],
        conversationId: message.conversationId,
        conversationType: 'SINGLE',
        unreadCount: 1,
      };
      this.conversations.unshift(newConversation);
    }
  }
}
