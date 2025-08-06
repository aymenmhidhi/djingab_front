import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
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
  providers: [MessageService, ConversationsServiceService],
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversation: any;

  messages: NewType[] = [];
  newMessage: string = '';
  userId: number = 0;

  constructor(
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private conversationsServiceService: ConversationsServiceService
  ) { }

  ngOnInit(): void {
    this.loadMessages();

    const user = localStorage.getItem('user');
    if (user != null) {
      const userJson = JSON.parse(user);
      this.userId = userJson['id'];

      if (!this.webSocketService.isConnected()) {
        this.webSocketService.connect(() => {
          this.subscribeToWebSocket();
        });
      } else {
        this.subscribeToWebSocket();
      }
    }
  }

  private subscribeToWebSocket(): void {
    const destination = `/topic/chat/${this.userId}`;
    this.webSocketService.subscribe(destination, () => { });
    this.webSocketService.incomingMessage$.subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && !changes['conversation'].firstChange) {
      this.loadMessages();
    }
  }

  ngOnDestroy(): void {
    const destination = `/topic/chat/${this.userId}`;
    this.webSocketService.unsubscribe(destination);
  }

  loadMessages(): void {
    if (this.conversation) {
      this.messages = this.conversation.content || [];

      this.messages.forEach((message: any) => {
        if (!message.hasOwnProperty('senderId') && message.sender?.id != null) {
          message.senderId = message.sender.id;
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message: any = {
      conversationId: this.conversation.id,
      senderId: this.userId,
      content: this.newMessage,
      timestamp: new Date().toISOString(),
    };

    let receiverList: number[] = [];
    if (this.conversation.contacts && this.conversation.contacts.length > 0) {
      receiverList = this.conversation.contacts.map((contact: any) => contact.id);
    }

    if (this.conversation?.conversationType === 'SINGLE') {
      if (this.conversation.newConversation) {
        message['receiverId'] = this.conversation.contactId;
      } else {
        message['receiverId'] =
          this.conversation.to.id === this.userId
            ? this.conversation.from.id
            : this.conversation.to.id;
      }
    } else if (receiverList.length > 0) {
      message['receiverList'] = receiverList;
    }

    if (this.conversation.newConversation) {
      const conversation = {
        senderId: this.userId,
        receiverList: receiverList,
        conversationType: this.conversation.conversationType,
        receiverId: 0,
      };
      if (this.conversation.conversationType === 'SINGLE') {
        conversation['receiverId'] = this.conversation.contact.id;
      }

      this.conversationsServiceService.saveConversation(conversation).subscribe(
        (res) => {
          message['conversationId'] = res.conversationId;
          this.conversation.newConversation = false;
          this.conversation.conversationId = res.conversationId;
          this.webSocketService.sendMessage('/app/send-message', message);
        },
        (err) => {
          console.error('Erreur lors de l\'enregistrement de la conversation', err);
        }
      );
    } else {
      this.webSocketService.sendMessage('/app/send-message', message);
    }

    this.messages.push(message);
    this.newMessage = '';
  }
}
