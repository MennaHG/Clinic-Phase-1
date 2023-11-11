import { Component, EventEmitter, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { UserLoginService } from '../user-login.service';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: 'user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent{
  //@Output() cookieValue = new EventEmitter<string>();

  data ={
    email:'',
    password:'',
    patient:true    //1 for patient 2 for doctor
  }

  //   constructor( private renderer2:Renderer2, @Inject (DOCUMENT) private document:Document) { 
  
  constructor(private userService: UserLoginService,public router:Router,private renderer2:Renderer2,@Inject (DOCUMENT) private document: Document) { }
  ngOnInit(){sessionStorage.setItem("email",this.data.email); console.log(this.data.email);}
  loginUser(){

// !!verify correct creds then navigate to assigned user homepage if correct creds

  const data = {
    email: this.data.email,
    password: this.data.password,
    patient : this.data.patient
  };
  sessionStorage.setItem("email",this.data.email); console.log(this.data.email);
  // let cookie = this.data.email;
  // this.cookieValue.emit(cookie);
  //this.cookieService.set("email",this.data.email);
  //this.router.navigate(["dr"]);
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
