import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../../conversations/service/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-popup',
  imports: [CommonModule],
  templateUrl: './contact-popup.component.html',
  styleUrls: ['./contact-popup.component.css'],
})
export class ContactPopupComponent {
  contacts: { id: number; name: string }[] = [];
  selectedContacts: Set<number> = new Set();

  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<ContactPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe((contacts:any) => {
      this.contacts = contacts;
    });
  }

  toggleSelection(contactId: number): void {
    if (this.selectedContacts.has(contactId)) {
      this.selectedContacts.delete(contactId);
    } else {
      this.selectedContacts.add(contactId);
    }
  }

  validate(): void {
    const selected = this.contacts.filter((c) =>
      this.selectedContacts.has(c.id)
    );
    this.dialogRef.close(selected);
  }

  close(): void {
    this.dialogRef.close();
  }
}
