import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService} from '../services';



interface DialogData {
  template_id: string;
  user_key:string;
  model_type:string;
  values:{};
}

@Component({
  selector: 'app-template-selection-dialog',
  templateUrl: './template-selection-dialog.component.html',
  styleUrls: ['./template-selection-dialog.component.css']
})
export class TemplateSelectionDialogComponent implements OnInit {
    private template_id: string;
    private user_key: string;
    private result:[]
    private model_type: string;

    constructor(private globalService : GlobalService,public dialogRef: MatDialogRef<TemplateSelectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    { 
        this.template_id=this.data.template_id
        this.user_key=this.data.user_key
        this.model_type=this.data.model_type
        this.result=[]
        
        console.log(this.data)
    }

    ngOnInit() {
        
        this.globalService.get_templates(this.user_key,this.model_type).toPromise().then(
                data => {
                    
//                    this.result=res
                    
//                    if (data instanceof Array){
//                        console.log("data is array")
//                    }
//                    if (this.result instanceof Array){
//                        console.log("result is array")
//                    }
                    
                    this.result=data;
                    console.log(this.result);
                }
            );
        
    }
    onSelect(values:string){
        
        this.data.template_id=values
        this.result.forEach(
            attr => {
                if (attr["_id"]===values){
                    this.data.values=attr
                }   
            }   
        );
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        //this.data.template_id=this.template_id
        this.dialogRef.close(this.data);
    }
    get_result(){
        console.log(this.result);
        return this.result;
    }

}
