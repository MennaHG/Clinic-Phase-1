import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import{API_URL} from './env';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {

  constructor(private http: HttpClient) { }
  
  addUser(data: { email: string; password: string, patient:boolean}){
    console.log(data)
    return this.http.post(`${API_URL}/SignUp`, data);

  }
}
