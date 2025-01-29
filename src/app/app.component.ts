import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
import {ConversationsComponent} from './conversations/conversations.component'
import { MatDialog } from '@angular/material/dialog';
import { ContactPopupComponent } from '../app/popup/contact-popup/contact-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-root',
  imports: [RouterModule,RouterOutlet,FormsModule,HttpClientModule,ConversationsComponent,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'djingab';
  constructor(private dialog: MatDialog) {}
  openPopup(): void {
    const dialogRef = this.dialog.open(ContactPopupComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedContacts:any) => {
      if (selectedContacts) {
        console.log('Contacts sélectionnés :', selectedContacts);
      }
    });
  }

}
