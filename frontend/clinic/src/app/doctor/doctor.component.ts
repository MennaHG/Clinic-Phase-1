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
export class DoctorComponent {

  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  dataSource: any=[];
  email:any;
  columnsSchema: any = COLUMNS_SCHEMA;
  
  constructor(private drservice:DoctorService,@Inject(DOCUMENT) private document:Document){
    // How to return email??
    //this.dataSource = service.getSlots(this.email);
  //  this.email = this.cookieservice.get("email");
    //console.log(this.email)

    this.parse(this.drservice.getSlots(this.email));

  }

  ngOnInit(){  
    this.email = sessionStorage.getItem("email"); console.log("DR"+this.email);
  }

  parse(res){
    for(let i=0;i<res.length;i++){
      this.dataSource.push({"date":res[i].date,"hour":res[i].hour});
    }
    console.log('dataSource(Slots)',this.dataSource);
  }
  async add(){
    let dateInput = this.document.getElementById("date") as HTMLInputElement;
    let hourInput = this.document.getElementById("time") as HTMLInputElement;
    let dateval = dateInput.value;
    let hourval = hourInput.value;
    let curDate= new Date();
    let mins = (curDate.getMinutes()).toString();
    let hrs = (curDate.getHours()).toString();

    if(hourval == "")
      if(curDate.getMinutes() < 10)
        mins = ("0"+ mins);
      if(curDate.getHours()<10)
        hrs = "0"+hrs
      hourval=hrs+':'+mins;
    if(dateval == "")
      dateval=curDate.getFullYear()+'-'+curDate.getMonth()+'-'+curDate.getDay();
    
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
      this.dataSource = this.dataSource.filter((u: { id: number; }) => u.id !== id);
    }
}
