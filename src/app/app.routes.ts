import { NgModule } from '@angular/core';
import { PreloadAllModules,Routes,RouterModule } from '@angular/router';
import {LoginComponent } from './login/login.component';
export const routes: Routes = [
 {
        path: 'login', // child route path
        component: LoginComponent, // child route component that the router renders
      }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

