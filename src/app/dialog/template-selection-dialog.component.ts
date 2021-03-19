import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService} from '../services';



interface DialogData {
  search_type :string
  model_id: string;
  parent_id: string;
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
    private model_id: string;
    private user_key: string;
    private result:[]
    private model_type: string;
    private parent_id: string;
    search_type:string

    constructor(private globalService : GlobalService,public dialogRef: MatDialogRef<TemplateSelectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    { 
        this.search_type= this.data.search_type
        this.model_id=this.data.model_id
        this.user_key=this.data.user_key
        this.model_type=this.data.model_type
        this.parent_id=this.data.parent_id
        this.result=[] 
        console.log(this.search_type)       
    }

    ngOnInit() {
        if (this.search_type=="Template"){
            this.globalService.get_templates(this.user_key,this.model_type).toPromise().then(
                data => {
                    this.result=data;
                }
            );
        }
        if (this.search_type=="biological_material"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]


            var child_type="biological_materials"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );
        }
        if (this.search_type=="observed_variable"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]


            var child_type="observed_variables"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );
        }
        if (this.search_type=="experimental_factor"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]


            var child_type="experimental_factors"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );

        }

    }

    onSelect(values:string){
        
        this.data.model_id=values
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
        return this.result;
    }

}
