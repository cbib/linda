import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../services';
interface DialogData {
  help_page: string;

}
@Component({
  selector: 'app-help-loader-dialog',
  templateUrl: './help-loader-dialog.component.html',
  styleUrls: ['./help-loader-dialog.component.css']
})
export class HelpLoaderDialogComponent implements OnInit {
  help_page:string=""
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<HelpLoaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.help_page=this.data.help_page
     }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close({event:"Cancelled"});
  }

  onOkClick(): void {
  this.dialogRef.close({event:"Confirmed"});

}

}
