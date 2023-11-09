import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorComponent } from './doctor/doctor.component';
import{API_URL} from './env';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  email:any | undefined;
  constructor(private http: HttpClient) { }
  
  loginUser(data: { email: string; password: string, patient:boolean}){
    console.log(data)
    this.http.post(`${API_URL}/Signin`,data,{withCredentials:true}).subscribe(
             response => {
               console.log(response);
             },
             error => {
               console.log(error);
             });
    
    console.log(this.email)
    return this.email;
  }
}
