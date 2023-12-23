import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import{API_URL} from '../env';


Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {
  constructor(private http: HttpClient) { }

  show(){
    let msgs;
    this.http.get(`${API_URL}/consumeEvents`).subscribe(
      response => {
        console.log(response); msgs=response;
      })
    document.getElementsByClassName("text")[0].textContent=msgs;
    document.getElementById("msgs").style.display = "block";
  
    return "shown";
}
   closing(){ 
    document.getElementById("msgs").style.display = "none";  
    document.getElementsByClassName("badge")[0].textContent='0'; 
    return "closed";
}
}
