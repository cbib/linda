import { Component, OnInit, Inject } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService} from '../services';

interface DialogData {
  validated: boolean;
  only_childs: boolean;
  mode:string;
  user_key: string, 
  model_type: string;
  values: {};
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
    private mode_text={'remove':{'title': "Confirm remove", 'content': " Are you sure to delete ? "}, 'extract_env_var': {'title': "Confirm extraction", 'content':" Are you sure to extract data? "}}
    private validated:boolean;
    private all_childs:boolean =false
    private use_template:boolean =false
    private only_observed_variable:boolean =false
    private mode:string = ""
    private user_key:string=""
    private model_type:string=""
    private values:{}={}
    private model_id:string=""
    private result=[]
    constructor(private globalService : GlobalService, public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        
        this.validated=this.data.validated
        this.mode = this.data.mode
        this.user_key= this.data.user_key
        this.model_type = this.data.model_type
        this.values=this.data.values
        this.model_id=""

    }

    ngOnInit() {

    }
    onSelect(values:string){
        
      this.model_id=values
      this.result.forEach(
          attr => {
              if (attr["_id"]===values){
                  this.data.values=attr
              }   
          }   
      );
  }
  get_result(){
    return this.result
  }
    get_template(){
      this.globalService.get_templates(this.user_key,this.model_type).toPromise().then(
        data => {
            this.result=data;
        }
    );
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        console.log(this.data)
        console.log(this.all_childs)
        console.log(this.only_observed_variable)
        this.dialogRef.close({event:"Confirmed",validated:this.validated, all_childs:this.all_childs, only_observed_variable:this.only_observed_variable });
    }
    set_check_only_childs(all_childs: boolean) {
      this.all_childs=all_childs
      this.only_observed_variable=false
    }
    set_check_only_observed_variable(only_observed_variable: boolean){
      this.only_observed_variable=only_observed_variable
      this.all_childs=false
    }
    set_check_template(template: boolean){
      this.use_template=template

    }
}
