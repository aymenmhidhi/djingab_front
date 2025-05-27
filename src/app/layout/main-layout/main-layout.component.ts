import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ConversationsComponent } from '../../conversations/conversations.component'
import { ChatComponent } from '../../chat/chat.component'; 
import { MatDialog } from '@angular/material/dialog';
import { ContactPopupComponent } from '../../popup/contact-popup/contact-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule,RouterOutlet, RouterModule, ConversationsComponent, ChatComponent,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  selectedConversation: any = null;
  constructor(private dialog: MatDialog) { }
  openPopup(): void {
    const dialogRef = this.dialog.open(ContactPopupComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedContacts: any) => {
      if (selectedContacts) {
        console.log('Contacts sélectionnés :', selectedContacts);
        this.selectedConversation = {
          contactId: selectedContacts[0].id,
          contactName: selectedContacts[0].username,
          messages: [] // ou à remplir plus tard via service
        };
      }
    });
  }
  onConversationSelected(conversation: any) {
    this.selectedConversation = conversation;
  }
}
