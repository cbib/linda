import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../services';
import { FormComponent } from '../forms/form.component';




interface DialogData {
  model_type: string;
  formData:{};
}


@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css']
})
export class FormDialogComponent implements OnInit {
  private model_type:string=""
  private mode:string=""
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.model_type=this.data.model_type
      
      this.mode="preprocess"
   }

  ngOnInit() {

  }
  get_model_type(){
    console.log(this.model_type)
    return this.model_type
  }
  get_mode(){
    return this.mode
  }

  get_output_from_child(val:any){
    if (val === 'cancel the form'){
      this.dialogRef.close({event:"Cancelled"});
    }
    else{
      console.log(val)
      this.dialogRef.close({event:"Confirmed", model_type:this.model_type, formData:val});
    }

  }
}
