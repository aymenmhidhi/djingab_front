import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' });
  }

  confirmToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/confirm`, {
      params: { token },
      responseType: 'text'
    });
  }
}
