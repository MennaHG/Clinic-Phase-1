import { PatientService } from '../patient.service';
import { Component,Renderer2,Inject, OnInit, ElementRef,DefaultIterableDiffer, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { ColumnConfig } from 'material-dynamic-table';
import { HttpClient } from '@angular/common/http';
import{API_URL} from '../env';


const COLUMNS_SCHEMA = [
  {
      key: "Appointment",
      type: "text",
      label: "Appointment"
  },
 
  {
      key:"Doctor",
      type:"text",
      label: "Doctor"
  },
  {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

@Injectable({
  providedIn: 'root'
})


export class PatientComponent implements OnInit{
  displayedColumns: string[];
  dataSource:any;
  email:any;
  columnsSchema: any ;
  DoctorName:string;
  DrSlots:string[] =[]; oldDr;newDr; oldTime;newTime;
  public doctors: { name: string; }[]=[];
  
  constructor(private patientservice: PatientService,@Inject(DOCUMENT) private document:Document){
      this.displayedColumns = COLUMNS_SCHEMA.map((col) => col.key);
      this.dataSource = [];   //DATASOURCE = APPTS RESERVATIONS
    //  this.dataSource=this.getAppts();
    
      this.email=sessionStorage.getItem("email");
      this.columnsSchema= COLUMNS_SCHEMA;
      this.getDrs(); 
      this.DrSlots=[]
     //this.getSlots();  
  }
  
  ngOnInit(){  
    this.email = sessionStorage.getItem("email"); console.log("PATIENT"+this.email);
    this.patientservice.getAppts().then(data => {this.dataSource = data})
                .catch(error => console.log(error));
  }  
  getAppts(){
                 
    return this.patientservice.getAppts();  
   //return [{"id":1,"Appointment":"appt","Doctor":"drname"}];
  } 
  
  getSlots(){
    let dr= this.document.getElementById("drs") as HTMLSelectElement;
    let drname = dr.value;    //!!!CHANGE HERE
 
    this.DrSlots = this.patientservice.getSlots(drname);
    /*
    for(let i=0;i<res.length;i++){
      let str = res[i].date+' '+res[i].hour;
      this.DrSlots.push(str.toString());
      console.log(str);
      //this.dataSource.push({"Appointment":str});
      
    }
    */

  }

  
  getDrs(){
   /* let res = this.patientservice.getDrs();
    for(let i=0;i<res.length;i++){
      this.doctors.push({"name":res[i]});
    }
    console.log(this.doctors);
    */
    this.doctors = this.patientservice.getDrs();
    
  }

  onDoctorSelectionChange(drname:string) {
    console.log("Current Dr",drname);
    this.getSlotsMat(drname);
  }
  
  add(){
    let drname= this.document.getElementById("drs") as HTMLInputElement;
    let appt= this.document.getElementById("appts") as HTMLSelectElement;

    let rowlen = this.document.getElementsByTagName("tr").length -2;
    const newRow = {"id": rowlen , "Appointment":appt.value,
                  "Doctor":drname.value,isEdit: false}
    this.dataSource = [...this.dataSource, newRow];
    console.log(this.dataSource);
    this.patientservice.addAppt({"Doctor":drname.value,"Appointment":appt.value});
  }
  
  edit(id:number){
    let element =this.dataSource[id-1];
    element.isEdit = !element.isEdit;
     this.oldDr= element.Doctor; this.oldTime = element.Appointment;
    
  }

  done(id:number){
    let element =this.dataSource[id-1];
    element.isEdit = !element.isEdit;
    this.newDr= element.Doctor; this.newTime = element.Appointment;
    const data={
      newDr:this.newDr,
      oldDr:this.oldDr,
      newTime: this.newTime,
      oldTime:this.oldTime
    };

    return this.patientservice.editAppt(data);
  }

  removeRow(id: number) {
    let element = this.dataSource[id-1];
      const data={
        oldDr:this.oldDr,
        oldTime:this.oldTime
      };

    this.dataSource = this.dataSource.filter((u: { id: number; }) => u.id !== id);
    return this.patientservice.cancelAppt(data);
  }

  getSlotsMat(drname) {
    let res = this.patientservice.getSlots(drname);
    this.DrSlots=[];
    for(let i=0;i<res.length;i++){
      let str = res[i].date+' '+res[i].hour;
      console.log(str);
      //this.dataSource.push({"Appointment":str});
      this.DrSlots.push(str.toString());
    }


  }


}
