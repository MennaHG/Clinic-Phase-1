import { Component, Inject, Renderer2 } from '@angular/core';
import { UserRegisterService } from '../user-register.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  data ={
    email:'',
    password:'',
    patient:true    //1 for patient 2 for doctor
  }
  constructor(private userService: UserRegisterService, public router:Router,private renderer2:Renderer2,@Inject (DOCUMENT) private document: Document) { }

  addUser(){
    const data = {
      email: this.data.email,
      password: this.data.password,
      patient : this.data.patient
    };

    this.userService.addUser(data);
    
  console.log("user data",data)
    
  if(data.patient){
    this.router.navigate(['']);}
  else{
    this.router.navigate(["dr"]);}

  }

}
