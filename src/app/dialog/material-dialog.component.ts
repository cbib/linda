import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileService, GlobalService, AlertService } from '../services';

interface DialogData {
  material_data:[];
}

@Component({
  selector: 'app-material-dialog',
  templateUrl: './material-dialog.component.html',
  styleUrls: ['./material-dialog.component.css']
})
export class MaterialDialogComponent implements OnInit {
  private material_data:[];
  file_format;
  is_expandable_node
  constructor(private alertService: AlertService,
    public dialogRef: MatDialogRef<MaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

      this.material_data=this.data.material_data
    }

  ngOnInit() {
    
  }
  onNoClick(): void {
    this.dialogRef.close({event:"Cancelled"});
    this.alertService.clear();
}

onOkClick(): void {

    this.dialogRef.close({event:"Confirmed",data:this.data});
    this.alertService.clear();

}

}
