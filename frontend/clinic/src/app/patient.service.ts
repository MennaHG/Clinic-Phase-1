import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorService } from './doctor.service';

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
    let drservice: DoctorService;
    let res= drservice.getSlots(name);
    return res;
  }

  addAppt(data: { Doctor: string; Appointment: string; }) {
    let email = sessionStorage.getItem("email");

    // return this.http.post(`${API_URL}/Doctor/edit/${email}`,data).subscribe(
    //   response => console.log(response),
    //   error => console.error(error)
    // );

  }
  editAppt(data:{"oldDr":string,"newDr":string,"oldTime":string,"newTime":string}){
    let email = sessionStorage.getItem("email");

    // return this.http.post(`${API_URL}/Doctor/edit/${email}`,data).subscribe(
    //   response => console.log(response),
    //   error => console.error(error)
    // );
  }

  cancelAppt(data: { "oldDr": string; "oldTime": string; }) {
    let email = sessionStorage.getItem("email");
    //return this.http.
  }
}
