import { NgModule } from '@angular/core';
import { PreloadAllModules,Routes,RouterModule } from '@angular/router';
import {LoginComponent } from './login/login.component';
import { ConversationsComponent } from './conversations/ConversationsComponent';
import { AuthGuard } from './auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent, // ✅ Layout avec menu
  /*  children: [
      {
        path: 'conversations',
        loadComponent: () =>
          import('./conversations/conversations.component').then(m => m.ConversationsComponent)
      }
    ],*/
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

