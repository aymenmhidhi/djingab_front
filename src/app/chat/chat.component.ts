import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;

  messages: { sender: string; content: string; timestamp: string }[] = [];
  newMessage: string = '';

  ngOnInit(): void {
    if (this.conversation) {
      // Ici tu devrais appeler le chatService pour charger les messages
      this.messages = this.conversation.messages || []; // Exemple
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      sender: 'Moi',
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };

    // Envoi au backend à faire ici
    this.messages.push(message);
    this.newMessage = '';
  }
}
