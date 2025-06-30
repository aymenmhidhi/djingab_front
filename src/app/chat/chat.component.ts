import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../app/chat/service/wbsocket.service';
import { MessageService } from './service/message.service';
import { ConversationsServiceService } from '../../app/conversations/service/conversations-service.service';

type NewType = {
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [WebSocketService, MessageService, ConversationsServiceService]
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;

  messages: NewType[] = [];
  newMessage: string = '';
  userId: number = 0;

  constructor(
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private conversationsServiceService:ConversationsServiceService
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

    const message: any = {
      conversationId: this.conversation.conversationId,
      senderId: this.userId,
      content: this.newMessage,
      /*receiverId: this.conversation.contactId,*/
      timestamp: new Date().toISOString()
    };

    let receiverList: number[] = [];
    if (this.conversation.contacts && this.conversation.contacts.length > 0) {
      receiverList = this.conversation.contacts.map((contact: any) => contact.id);
    }

    if (this.conversation?.conversationType === 'SINGLE') {
      message['receiverId'] = this.conversation.contactId;
    } else if (Array.isArray(receiverList) && receiverList.length > 0) {
      message['receiverList'] = receiverList;
    }
    if (this.conversation.newConversation) {
      const conversation = {
        senderId: this.userId,
        receiverList: receiverList,
        conversationType: this.conversation.conversationType,
        receiverId: 0
      };
      if (this.conversation?.conversationType === 'SINGLE') {
        conversation['receiverId'] = this.conversation.contact.id;
      }
      this.conversationsServiceService.saveConversation(conversation).subscribe(
        res => {
          console.log('Conversation enregistrée :', res);
          message['conversationId'] = res.conversationId;
          this.conversation.newConversation = false;
          this.conversation.conversationId = res.conversationId;
          this.webSocketService.sendMessage('/app/send-message', message);
        },
        err => {
          console.error('Erreur lors de l\'enregistrement de la conversation', err);
        }
      );
    }
    else {
      this.webSocketService.sendMessage('/app/send-message', message);
    }
    this.messages.push(message);
    this.newMessage = '';
  }
}
