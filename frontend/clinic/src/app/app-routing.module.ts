import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DoctorComponent } from './doctor/doctor.component';

const routes: Routes = [
  {path: '', component: UserRegisterComponent},
  {path: 'signin',component:UserLoginComponent},
  {path: 'signup',component:UserRegisterComponent},
  {path:'dr',component:DoctorComponent},
  {path: '**', redirectTo: ''}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
