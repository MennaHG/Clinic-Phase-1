import { Injectable } from '@angular/core';
import{API_URL} from './env';
import { HttpClient } from '@angular/common/http';
import { InboxComponent } from './inbox/inbox.component';
interface TimeSlot {
   
      
      date: string;
      hour: string;
  
}
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  
  constructor(private http: HttpClient) { }
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
                    const { date, hour } = slot; data.push({"id": i,"date":date,"hour":hour})
                    i++;
                    //console.log(`Slot ${key}: Date - ${date}, Hour - ${hour}`);
                    console.log(slot.date,slot.hour);
                //}
            //}
        });
    })
    console.log(data);
    return data;
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

  editSlot(data:{"oldDate":string,"newDate":string,"oldTime":string,"newTime":string}){
    let email = sessionStorage.getItem("email");

    return this.http.post(`${API_URL}/Doctor/edit/${email}`,data).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  cancelSlot(data:{"oldDate":string,"oldTime":string}){
    let email = sessionStorage.getItem("email");

    return this.http.post(`${API_URL}/Doctor/cancel/${email}`,data).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }
  show() {
    let inbox = new InboxComponent(this.http);
    return inbox.show();
}
closing() {
  let inbox = new InboxComponent(this.http);
  return inbox.closing();
}

}
