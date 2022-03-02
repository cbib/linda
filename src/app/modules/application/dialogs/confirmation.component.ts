import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService} from '../../../services';
import { first } from 'rxjs/operators';

interface DialogData {
  validated: boolean;
  only_childs: boolean;
  mode:string;
  user_key: string, 
  model_type: string;
  parent_key:string;
  model_filename:string;
  values: {};
  header:string;
  headers:[];
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  mode_text = { 'remove': { 'title': "Confirm remove", 'content': " Are you sure to delete ? " }, 'extract_env_var': { 'title': "Confirm extraction", 'content': " Are you sure to extract data? " }, 'extract_existing_env_var':{'title': "Confirm new extraction", 'content': " Are you sure to link with this exisitng observed variable ?"}, 'extract_env_var_again': { 'title': "Confirm unlink component", 'content': " Are you sure to unlink this component ? This will unlink corresponding components"}}
  validated: boolean;
  all_childs: boolean = false
  use_template: boolean = false
  use_existing: boolean = false
  only: string = ""
  mode: string = ""
  user_key: string = ""
  parent_key: string = ""
  model_type: string = ""
  values: {} = {}
  model_id: string = ""
  model_filename: string = ""
  template_result = []
  existing_result = []
  unique_file_name = []
  header: string=""
  headers=[]
  selected_header=""
  Checked:boolean=false
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.validated = this.data.validated
    this.mode = this.data.mode
    this.user_key = this.data.user_key
    this.model_type = this.data.model_type
    this.parent_key=this.data.parent_key
    this.values = this.data.values
    this.header = this.data.header
    this.headers = this.data.headers
    this.model_id = ""
    this.model_filename=this.data.model_filename
  }

  ngOnInit() {
    //this.only=this.model_type
    //this.all_childs=false
    if (this.mode.includes("extract_env_var")) {
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
              this.existing_result.push({"datafile_id": element.eto, "filename":element.filename, "associated_headers": element.associated_headers, "study_id":element.efrom })
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
  onTemplateSelect(value: string) {

    this.model_id = value
    this.template_result.forEach(
      attr => {
        if (attr["_id"] === value) {
          this.data.values = attr
        }
      }
    );
  }
  onHeaderSelect(value: string){
    this.selected_header=value
  }
  get_headers_result(){
    return this.headers
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
          // data to copy 
          var my_data=this.existing_result.filter(prop => prop.filename === values)
          // data to update 
          var my_data_to_update=this.existing_result.filter(prop => prop.filename === this.model_filename)
          ///my_data.forEach((element, index)=>{})
          for (let i = 0; i < my_data.length ; i++) {
            var element=my_data[i]
            var my_data2= element.associated_headers.filter(associated_header => associated_header.header === this.header)[0]
            console.log(my_data2.associated_linda_id)
            var element_to_update=my_data_to_update[i]
            this.globalService.update_associated_headers_linda_id(element_to_update.datafile_id, my_data2.associated_linda_id, this.header, 'data_files').pipe(first()).toPromise().then(
              data => {console.log(data)}
            )

          }
          
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
    this.dialogRef.close({event:"Confirmed",validated:this.validated, all_childs:this.all_childs, only:this.only, template_data:this.data.values, use_template:this.use_template, use_existing:this.use_existing, selected_header:this.selected_header});
  }

  set_check_all_childs(all_childs: boolean) {
    this.all_childs = all_childs
    this.only = ""
    this.Checked=all_childs
  }
  set_check_only(event: boolean, model_type: string) {
    this.only = model_type
    this.all_childs = false
    this.Checked=event
  }
  set_check_template(template: boolean) {
    this.use_template = template
    this.use_existing = false
  }
  set_check_existing(existing: boolean) {
    this.use_existing = existing
    this.use_template = false
  }
}
