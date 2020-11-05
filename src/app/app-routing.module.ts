import {AuthGuard} from './account/shared/auth.guard'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { LoginComponent } from './account/login/login.component';
import { AuthenticationComponent } from './layout/authentication/authentication.component';
import { PrincipalPageComponent } from './layout/principal-page/principal-page.component';


const routes: Routes = [
  {
    path:'home',
    component: PrincipalPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'',
    component: AuthenticationComponent,
    children: [
      {path: '', redirectTo:'login', pathMatch:'full'},
      {path: 'login', component: LoginComponent},
      {path: 'create-account', component: CreateAccountComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
