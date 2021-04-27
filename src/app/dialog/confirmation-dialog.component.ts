import { Component, OnInit, Inject } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


interface DialogData {
  validated: boolean;
  only_childs: boolean;

}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
    private validated:boolean;
    private only_childs:boolean =false
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
        this.dialogRef.close({event:"Confirmed",validated:this.validated, only_childs:this.only_childs});
    }
    set_check_only_childs(completed: boolean) {
      this.only_childs=completed
    }
}
