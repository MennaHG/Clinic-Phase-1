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

export class PatientComponent {
  displayedColumns: string[];
  dataSource: any;
  email:any;
  columnsSchema: any ;
  DrSlots:string[] ;
  public doctors: { name: string; }[];
  
  constructor(private patientservice: PatientService,@Inject(DOCUMENT) private document:Document){
      this.displayedColumns = COLUMNS_SCHEMA.map((col) => col.key);
      this.dataSource = [];
      this.email='';
      this.columnsSchema= COLUMNS_SCHEMA;
      this.doctors = [{name:"DR1"},{name:"DR2"}];
 
     this.DrSlots = ["SLOTS","SLOTS2"];
  }
  parseAppt(){} //parsing dr slots date to date DD/MM/YYYY HH:MM format
  getSlots(){
    let dr= this.document.getElementById("drs") as HTMLSelectElement;
    let drname = dr.value
    //this.DrSlots = this.patientservice.getSlots(drname);
  }

  ngOnInit(){  
    this.email = sessionStorage.getItem("email"); console.log("PATIENT"+this.email);
  }
  getDrs(){
    
    //this.doctors = this.patientservice.getDrs();
  }
  add(){
    let drname= this.document.getElementById("drs") as HTMLInputElement;
    let appt= this.document.getElementById("appts") as HTMLSelectElement;

    let rowlen = this.document.getElementsByTagName("tr").length -2;
    const newRow = {"id": rowlen , "Appointment":appt.value,
                  "Doctor":drname.value,isEdit: false}
    this.dataSource = [...this.dataSource, newRow];
    console.log(this.dataSource);
  }

  removeRow(id: number) {
    this.dataSource = this.dataSource.filter((u: { id: number; }) => u.id !== id);
  }


}
