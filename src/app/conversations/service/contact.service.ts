import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = "http://localhost:8080/api/conversations/contacts";
  }

  // Simule une API retournant une liste de contacts
  getContacts(): Observable<any> {

    const user = localStorage.getItem('user');
    if (user != null) {
      const userJson = JSON.parse(user)
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + userJson.token);
      const params = new HttpParams()
        .set('userId', userJson.id)
      return this.httpClient.get(this.url, { headers, params });
    }
    else return of([]);;
  }
}
