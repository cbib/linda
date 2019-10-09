import { Component, OnInit, Inject } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


interface DialogData {
  date_format: string;

}

@Component({
  selector: 'app-dateformat',
  templateUrl: './dateformat.component.html',
  styleUrls: ['./dateformat.component.css']
})
export class DateformatComponent implements OnInit {
  private date_format:string;
  constructor(public dialogRef: MatDialogRef<DateformatComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        
        this.date_format=this.data.date_format
        }

  ngOnInit() {
  }
  onChange(event){
      console.log(event.target.value)
      if (event.target.value!==""){
        this.data.date_format=event.target.value
      }
  }
  onNoClick(): void {
        console.log("closed")
        this.dialogRef.close();
    }

}
