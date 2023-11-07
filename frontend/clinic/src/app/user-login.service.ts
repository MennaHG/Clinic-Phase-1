import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const baseUrl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  constructor(private http: HttpClient) { }
  
  loginUser(data: { email: string; password: string, patient:boolean}){
    console.log(data)
    return this.http.get(`${baseUrl}/${data.email}`);

  }
}
