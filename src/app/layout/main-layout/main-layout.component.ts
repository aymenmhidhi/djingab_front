import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ConversationsComponent } from '../../conversations/ConversationsComponent';
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
  selectConversation(conversation: any): void {
    this.selectedConversation = null;
    setTimeout(() => {
      this.selectedConversation = conversation;
    });
  }
  logout(): void {
    localStorage.removeItem('user');
    location.reload(); // ou navigate vers /login
  }

  openPopup(): void {
    const dialogRef = this.dialog.open(ContactPopupComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedContacts: any) => {
      if (selectedContacts) {
        console.log('Contacts sélectionnés :', selectedContacts);
        if (selectedContacts.legnth() == 1) {
          this.selectConversation({
            contact: selectedContacts[0],
            messages: [],
            conversationType :'SINGLE'
          })
        }
        else {
          this.selectConversation({
            contacts: selectedContacts,
            messages: [],
            conversationType: 'GROUP'
          })
        }
      }
    });
  }
  onConversationSelected(conversation: any) {
    this.selectedConversation = conversation;
  }
}
