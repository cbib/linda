import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';


interface DialogData {
  model_type: string;
  formData:{};
}

@Component({
  selector: 'app-form-generic',
  templateUrl: './form-generic.component.html',
  styleUrls: ['./form-generic.component.css']
})
export class FormGenericComponent implements OnInit {
  private model_type:string=""
  private mode:string=""
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<FormGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.model_type=this.data.model_type
      this.mode="preprocess"
   }
  ngOnInit() {
    console.log("Init form dialog")
  }
  get get_model_type(){
    return this.model_type
  }
  get get_mode(){
    return this.mode
  }

  get_output_from_child(val:any){
    if (val === 'cancel the form'){
      this.dialogRef.close({event:"Cancelled"});
    }
    else{
      this.dialogRef.close({event:"Confirmed", model_type:this.model_type, formData:val});
    }
  }
}
