import { Injectable } from '@angular/core';
import{API_URL} from './env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }
  getSlots(email:string){
    let res;
    this.http.get(`${API_URL}/Patient/viewSlots/${email}`).subscribe(
      response => res=response,
      error => console.log(error)
    )
      return res;
    //return [{"id":1,"date": new Date().getMonth()+'/'+new Date().getDay()+'/'+new Date().getFullYear(), "hour": new Date().getHours()+':'+new Date().getMinutes()}];
    //return this.http.get(`${API_URL}/${email}`);

  } 

  insertSlot(slot:{"id":number,"date":string,"hour":string}){
    let email = sessionStorage.getItem("email");
    return this.http.post(`${API_URL}/Doctor/insert/${email}`,slot)
    .subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }
}
