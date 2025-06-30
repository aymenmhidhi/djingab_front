import { Component, OnInit } from '@angular/core';
import { ConversationsServiceService } from '../conversations/service/conversations-service.service';
import { WebSocketService } from '../../app/chat/service/wbsocket.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';



@Component({
    selector: 'app-conversations',
    imports: [CommonModule, HttpClientModule],
    standalone: true,
    templateUrl: './conversations.component.html',
    styleUrl: './conversations.component.css',
    providers: [ConversationsServiceService]
})
export class ConversationsComponent implements OnInit {
    conversations: any[] = [];
    userId!: number;
    @Output() conversationSelected = new EventEmitter<any>();
    constructor(
        private conversationsServiceService: ConversationsServiceService,
        private webSocketService: WebSocketService // ?? injecte le WebSocket service
    ) { }

    ngOnInit(): void {
        const user = localStorage.getItem('user');
        if (user != null) {
          this.userId = JSON.parse(user)['id'];
          // Connexion WebSocket
          this.webSocketService.connect(() => {
            // S'abonner au bon topic : /topic/chat/{userId}
            const destination = `/topic/chat/${this.userId}`;
            this.webSocketService.subscribe(destination, (msg) => {
              this.handleIncomingMessage(msg);
            });
          });
        }

      this.getConversations();
  }
  selectConversation(conversation: any): void {
    // Réinitialise la bulle de notification si présente
    conversation.unreadCount = 0;

    // Émet la conversation sélectionnée vers le parent (MainLayoutComponent)
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

    // ? Ajoute la conversation en haut si elle n’existe pas encore
  handleIncomingMessage(message: any): void {
    // Cherche la conversation existante avec le sender (message.senderId)
    const existingConversation = this.conversations.find(conv => {
      // Pour SingleConversation, tu peux matcher avec conv.from.id == senderId ou conv.contactId == senderId selon ta structure
      // Ici j'imagine que tu as une propriété 'contactId' dans ta conversation comme dans l'exemple précédent
      return conv.contactId === message.senderId;
    });

    if (existingConversation) {
      // Conversation existe : ajoute le message à content (ou messages) et indique la notification
      if (!existingConversation.content) existingConversation.content = [];
      existingConversation.content.push(message);
      existingConversation.conversationId = message.conversationId;
      // Ajouter un flag ou compteur pour notification, par ex :
      existingConversation.unreadCount = (existingConversation.unreadCount || 0) + 1;

    } else {
      // Nouvelle conversation : crée et insère en tête
      const newConversation = {
        id: message.conversationId || null, // si tu peux récupérer un id
        contactId: message.senderId,
        from: { id: message.senderId, username: message.senderUsername }, // adapte selon ton modèle
        messages: [message],
        conversationId: message.conversationId,
        conversationType:'SINGLE',
        unreadCount: 1
      };
      this.conversations.unshift(newConversation);
    }
  }

}
