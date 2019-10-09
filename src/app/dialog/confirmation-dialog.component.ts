import { Component, OnInit, Inject } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


interface DialogData {
  validated: boolean;

}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
    private validated:boolean;
    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        
        this.validated=this.data.validated
        console.log(this.data)
    }

    ngOnInit() {}

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        console.log(this.data)
        this.validated=true
        this.data.validated=true
        console.log(this.data)
        this.dialogRef.close(true);
    }

}
