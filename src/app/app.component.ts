import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConversationsComponent } from './conversations/ConversationsComponent';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule, HttpClientModule,ConversationsComponent,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'djingab';

}
