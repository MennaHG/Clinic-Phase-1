import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorComponent } from './doctor/doctor.component';
import{API_URL} from './env';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  constructor(private http: HttpClient,public router:Router) { }
  
  loginUser(data: { email: string; password: string}){
    console.log(data)
    
    return this.http.post(`${API_URL}/Signin`,data,{withCredentials:true}).subscribe(
             response => {
               console.log(response);
               let msg:Boolean = response['message'];
               if (msg == true)
                  if (response['patient'] == true)
                      this.router.navigate(["patient"]);
                  else
                      this.router.navigate(["dr"]);
 

               //let patient = response;

             },
             error => {
               console.log(error);
             });
    
  }
}
