import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { API_URL } from './env';
@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http:HttpClient) { }
  getDrs(){
    return this.http.get(API_URL);
  }
  getSlots(name:string){
    return this.http.get(API_URL+'/'+name);
  }
 

}
