import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated: boolean = false;
  url: string;
  constructor(private router:Router,private httpClient:HttpClient) {
    this.url = "http://localhost:8080/api/auth/login";
   }
  login(login:String,password:String){
    this.httpClient.post(this.url, {"username":login,"password":password}).subscribe((data: any) => {
      localStorage.setItem('user',JSON.stringify(data));
    },(error: any) => console.log('oops', error));
  } 
  logout(){
    localStorage.removeItem('user');
    this.authenticated=false;  
    this.router.navigate(['login']);
} 
isAuthenticated(){

  return this.authenticated;
}
}
