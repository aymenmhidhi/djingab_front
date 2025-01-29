import { Component } from '@angular/core';
import {AuthService} from '../login/service/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  imports: [FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent {
  l:String='';
  password:String='';
  constructor(private authService:AuthService,private httpClient: HttpClient) { }

  ngOnInit() {
  }
login(){
  this.authService.login(this.l,this.password);
}
}
