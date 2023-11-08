import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import{API_URL} from './env';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  constructor(private http: HttpClient) { }
  
  loginUser(data: { email: string; password: string, patient:boolean}){
    console.log(data)
    return this.http.get(`${API_URL}/${data.email}`);

  }
}
