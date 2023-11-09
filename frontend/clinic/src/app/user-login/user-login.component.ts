import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { UserLoginService } from '../user-login.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: 'user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent{
  data ={
    email:'',
    password:'',
    patient:true    //1 for patient 2 for doctor
  }

  //   constructor( private renderer2:Renderer2, @Inject (DOCUMENT) private document:Document) { 

  constructor(private userService: UserLoginService,private renderer2:Renderer2,@Inject (DOCUMENT) private document: Document) { }
  loginUser(){
// !!verify correct creds then navigate to assigned user homepage if correct creds

  const data = {
    email: this.data.email,
    password: this.data.password,
    patient : this.data.patient
  };

  return this.userService.loginUser(data);

  //console.log("user data in login comp",data)

  //   const data = {
  //     email: this.data.email,
  //     password: this.data.password,
  //     patient : this.data.patient
  //   };

  //   this.userService.loginUser(data)
  //   .subscribe(
  //       response => {
  //         console.log(response);
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // console.log("user data",data)
  }

}
