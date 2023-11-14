import { Component,Renderer2,Inject, OnInit, ElementRef,DefaultIterableDiffer } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { ColumnConfig } from 'material-dynamic-table';
import { DoctorService } from '../doctor.service';
import { CookieService } from 'ngx-cookie-service';

let USER_DATA = [
 // {"id":1,"date": new Date().getMonth()+'/'+new Date().getDay()+'/'+new Date().getFullYear(), "hour": new Date().getHours()+':'+new Date().getMinutes()}

];

const COLUMNS_SCHEMA = [
  {
      key: "date",
      type: "date",
      label: "Date"
  },
  {
      key: "hour",
      type: "time",
      label: "Hour"
  },
  {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit{

  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
 // dataSource = this.drservice.getSlots(sessionStorage.getItem("email"));
  email:any; oldDate;newDate; oldTime;newTime;
  columnsSchema: any = COLUMNS_SCHEMA;
  dataSource: any[];
  
  constructor(public drservice:DoctorService,@Inject(DOCUMENT) private document:Document){
    this.email = sessionStorage.getItem("email");

//    this.dataSource = this.drservice.getSlots(this.email); I COMMENTED HERE
    //this.email = this.cookieservice.get("email");
    //console.log(this.email)
    //this.dataSource= this.drservice.getSlots(this.email);

  }

  ngOnInit(){  
    this.email = sessionStorage.getItem("email"); console.log("DR"+this.email);
    this.dataSource= this.drservice.getSlots(this.email);
  }


  async add(){
    let dateInput = this.document.getElementById("date") as HTMLInputElement;
    let hourInput = this.document.getElementById("time") as HTMLInputElement;
    let dateval = dateInput.value;
    let hourval = hourInput.value;
    let curDate= new Date();
    let mins = (curDate.getMinutes()).toString();
    let hrs = (curDate.getHours()).toString();

    // if(hourval == "")
    //   if(curDate.getMinutes() < 10)
    //     mins = ("0"+ mins);
    //   if(curDate.getHours()<10)
    //     hrs = "0"+hrs
    //   hourval=hrs+':'+mins;
    // if(dateval == "")
    //   dateval=curDate.getFullYear()+'-'+curDate.getMonth()+'-'+curDate.getDay();
    
    // minus 2 bc tr for last table not included
    let rowlen = this.document.getElementsByTagName("tr").length -2;
    console.log(rowlen)
    const newRow = {"id": rowlen  ,"date": dateval, "hour": hourval,isEdit: false}
    this.dataSource = [...this.dataSource, newRow];
  //  let newArray =[];
   // newArray= this.dataSource.map(({ id, ...rest }) => rest);
    await this.drservice.insertSlot(newRow);
    }
    
    removeRow(id: number) {
      let element = this.dataSource[id-1];
      const data={
        oldDate: element.date,
        oldTime:element.hour
      };
      this.dataSource = this.dataSource.filter((u: { id: number; }) => u.id !== id);
      return this.drservice.cancelSlot(data);

    }

    edit(id:number){
      let element =this.dataSource[id-1];
      element.isEdit = !element.isEdit;
       this.oldDate= element.date; this.oldTime = element.hour;
    }

    done(id:number){
      let element =this.dataSource[id-1];
      element.isEdit = !element.isEdit;
      this.newDate= element.date; this.newTime = element.hour;
      console.log(this.oldDate,this.newDate,this.oldTime,this.newTime);
      const data={
        newDate:this.newDate,
        oldDate:this.oldDate,
        newTime: this.newTime,
        oldTime:this.oldTime
      };
      return this.drservice.editSlot(data);

    }
}
