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
    let res;
    this.http.get(`${API_URL}/Patient/getDoctors`).subscribe(
      response => res=response,
      error => console.log(error)
    )
    return res;
  }
  getSlots(name:string){
    let res;
    this.http.get(`${API_URL}/Patient/viewSlots/${name}`).subscribe(
      response => res=response,
      error => console.log(error)
    )
    return res;
  }
 

}
