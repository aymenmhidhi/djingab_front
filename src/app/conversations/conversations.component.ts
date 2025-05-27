import { Component } from '@angular/core';
import {ConversationsServiceService} from '../conversations/service/conversations-service.service'
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-conversations',
  imports: [CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
  providers: [ConversationsServiceService]
})
export class ConversationsComponent {
conversations:any=[];
constructor(private conversationsServiceService:ConversationsServiceService) { }
ngOnInit(): void {
  this.getConversations();
}
getConversations(): void {
  this.conversationsServiceService.getConversations().subscribe(
    (data:any) => {
      this.conversations = data; // Assigne les données à la liste
      console.log('Conversations:', this.conversations);
    },
    (error:any) => {
      console.error('Erreur lors de la récupération des conversations:', error);
    }
  );
}

}
