import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';


interface DialogData {
  model_type: string;
  formData:{};
  mode:string;
  model_key:string;
  parent_id:string
}

@Component({
  selector: 'app-form-generic',
  templateUrl: './form-generic.component.html',
  styleUrls: ['./form-generic.component.css']
})
export class FormGenericComponent implements OnInit {
  private model_type:string=""
  private mode:string=""
  private model_key:string=""
  private parent_id:string=""
  private loaded:boolean=false
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<FormGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.model_type=this.data.model_type
      this.mode=this.data.mode
      this.model_key=this.data.model_key
      this.parent_id=this.data.parent_id
   }
  ngOnInit() {
    console.log("Init form dialog")
    console.warn("this.model_key in FormGenericComponent", this.model_key)
    console.warn("this.parent_id in FormGenericComponent", this.parent_id)
    console.warn("this.mode in FormGenericComponent", this.mode)
    this.loaded=true

  }
  get data_loaded(){
    return this.loaded
  }
  get get_model_type(){
    return this.model_type
  }
  get get_mode(){
    return this.mode
  }
  get get_model_key(){
    return this.model_key
  }
  get get_parent_id(){
    return this.parent_id
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
