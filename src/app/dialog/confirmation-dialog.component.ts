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
  parent_key:string;
  model_filename:string;
  values: {};
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  private mode_text = { 'remove': { 'title': "Confirm remove", 'content': " Are you sure to delete ? " }, 'extract_env_var': { 'title': "Confirm extraction", 'content': " Are you sure to extract data? " } }
  private validated: boolean;
  private all_childs: boolean = false
  private use_template: boolean = false
  private use_existing: boolean = false
  private only: string = ""
  private mode: string = ""
  private user_key: string = ""
  private parent_key: string = ""
  private model_type: string = ""
  private values: {} = {}
  private model_id: string = ""
  private model_filename: string = ""
  private template_result = []
  private existing_result = []
  private unique_file_name = []
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.validated = this.data.validated
    this.mode = this.data.mode
    this.user_key = this.data.user_key
    this.model_type = this.data.model_type
    this.parent_key=this.data.parent_key
    this.values = this.data.values
    this.model_id = ""
    this.model_filename=this.data.model_filename
    console.log(this.model_type)

  }

  ngOnInit() {
    if (this.mode == "extract_env_var") {
      this.globalService.get_templates(this.user_key, this.model_type).toPromise().then(
        data => {
          this.template_result = data;

        }
      );
      this.globalService.get_data_filename(this.parent_key, this.model_type).toPromise().then(
        data => {
          this.existing_result = [];
          this.unique_file_name = [];
          
          data.forEach(element=>{
              this.existing_result.push({"filename":element.filename, "associated_headers": element.associated_headers, "study_id":element.efrom })
              if (this.unique_file_name.filter(prop => prop.filename == element.filename).length === 0){
                if (element.filename !== this.model_filename){                
                  this.unique_file_name.push({"filename":element.filename })
                }
              }
          })
          console.log(this.existing_result)

        }
      );



    }

  }
  onTemplateSelect(values: string) {

    this.model_id = values
    this.template_result.forEach(
      attr => {
        if (attr["_id"] === values) {
          this.data.values = attr
        }
      }
    );
  }
  get_template_result(){
    return this.template_result
  }
  onExistingSelect(values: string) {

    this.model_id = values
    this.unique_file_name.forEach(
      attr => {
        if (attr["filename"] === values) {
          this.data.values = attr
          console.log(this.data.values)
          console.log(this.existing_result.filter(prop => prop.filename === values))
        }
      }
    );
  }
  get_existing_result(){
    return this.unique_file_name
  }
  

  get_template(){
      this.globalService.get_templates(this.user_key,this.model_type).toPromise().then(
        data => {
            this.template_result=data;
        }
    );
  }

  onNoClick(): void {
        this.dialogRef.close();
  }
    
  onOkClick(): void {
    this.dialogRef.close({event:"Confirmed",validated:this.validated, all_childs:this.all_childs, only:this.only, template_data:this.data.values, use_template:this.use_template, use_existing:this.use_existing});
  }

  set_check_all_childs(all_childs: boolean) {
    this.all_childs = all_childs
    this.only = ""
  }
  set_check_only(event: boolean, model_type: string) {
    this.only = model_type
    this.all_childs = false
  }
  set_check_template(template: boolean) {
    this.use_template = template
  }
  set_check_existing(existing: boolean) {
    this.use_existing = existing
  }
}
