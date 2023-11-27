import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorService } from './doctor.service';

import { API_URL } from './env';
interface TimeSlot {
   
  doctor:string;
  date: string;
  hour: string;

}
@Injectable({
  providedIn: 'root'
})

export class PatientService {


  constructor(private http:HttpClient) { }
  getDrs(){
    let res:{ name: string; }[] = [];
    this.http.get(`${API_URL}/Patient/getDoctors`).subscribe( 
      (response:string[]) => response.forEach(element => res.push({"name":String(element)})),
      error => console.log(error)
    )
    return res;
  }
  getSlots(email:string){
    let data=[]; let i=1;
    console.log(email)
    fetch(`${API_URL}/Patient/viewSlots/${email}`)
    .then(response => response.json())
    .then((slots: TimeSlot[]) => {
        // Access date and hour values
        slots.forEach(slot => {
            //for (const key in slot) {
                //if (slot.hasOwnProperty(key)) {
                  const { date, hour } = slot; data.push(slot.date+" "+slot.hour);
                    i++;
                    //console.log(`Slot ${key}: Date - ${date}, Hour - ${hour}`);
                    console.log(slot.date,slot.hour);
                //}
            //}
        });
    })
    console.log(data);
    return data;
  }


  getAppts() {
    let data = [];
    let i = 1;
    let email = sessionStorage.getItem("email");
    console.log(email);
  
    const url = `${API_URL}/Patient/viewApp/${email}`;
  
    // Use Angular's HttpClient for making HTTP requests
    return this.http.get(url)
      .toPromise()
      .then((slots: TimeSlot[]) => {
        // Access date and hour values
        slots.forEach(slot => {
          let { date, hour, doctor } = slot;
          data.push({"id": i, "Appointment": String(date + ' ' + hour), "Doctor": doctor});
  
          console.log(slot.date, slot.hour, slot.doctor);
          console.log(`element ${i} in data list`, data[i - 1]);
          i++;
        });
  
        console.log(data);
  
        return data; // Return the data inside the promise chain
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to propagate it to the calling code
      });
  }
  
/*  getAppts(){
    let data=[]; let i=1; let email = sessionStorage.getItem("email");
    console.log(email)
    fetch(`${API_URL}/Patient/viewAppts/${email}`)
    .then(response => response.json())
    .then((slots: TimeSlot[]) => {
  
      // Access date and hour values
        slots.forEach(slot => {
            //for (const key in slot) {
                //if (slot.hasOwnProperty(key)) {
                    let { date, hour,doctor } = slot; 
                    data.push({"id": i,"Appointment":String(date+' '+hour),"Doctor":doctor});
                    
                    //console.log(`Slot ${key}: Date - ${date}, Hour - ${hour}`);
                    console.log(slot.date,slot.hour,slot.doctor);
                    console.log(`element ${i} in data list` ,data[i-1]);
                    i++;
                //}
            //}
        });
    })
    console.log(data);
    return data;
  }
*/
  addAppt(data: { Doctor: string; Appointment: string; }) {
    let email = sessionStorage.getItem("email");

     return this.http.post(`${API_URL}/Patient/choose/${email}`,data).subscribe(
      response => console.log(response),
      error => console.error(error)
     );

  }
  editAppt(data:{"oldDr":string,"newDr":string,"oldTime":string,"newTime":string}){
    let email =( sessionStorage.getItem("email"));
    console.log(data)
      return this.http.post(`${API_URL}/Patient/update/${email}`,data).subscribe(
      response => console.log(response),
      error => console.error(error)
     );
  }

  cancelAppt(data: { "oldDr": string; "oldTime": string; }) {
    let email = sessionStorage.getItem("email");
      return this.http.post(`${API_URL}/Patient/cancel/${email}`,data).subscribe(
      response => console.log(response),
      error => console.error(error)
     );
  }
}
