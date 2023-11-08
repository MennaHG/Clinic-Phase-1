import { Injectable } from '@angular/core';
import{API_URL} from './env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }
  getSlots(email:string){
    return [{"id":1,"date": new Date().getMonth()+'/'+new Date().getDay()+'/'+new Date().getFullYear(), "hour": new Date().getHours()+':'+new Date().getMinutes()}];
    //return this.http.get(`${API_URL}/${email}`);

  } 
}
