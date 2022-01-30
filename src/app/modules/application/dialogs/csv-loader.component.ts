import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlertService } from '../../../services';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';

interface DialogData {
  material_data:[];
  delimitor:"";
  cleaned_model:[];
}

@Component({
  selector: 'app-csv-loader',
  templateUrl: './csv-loader.component.html',
  styleUrls: ['./csv-loader.component.css']
})
export class CsvLoaderComponent implements OnInit {
  private cleaned_model:[];
  private material_data:string[]=[];
  private delimitor:string;
  private headers=[]
  private options_fields_by_component:{}[]
  private dataFileComponentFieldForm: FormGroup;
  private extract_fields_options = {}
  private data_to_extract = {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private alertService: AlertService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CsvLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

      this.material_data=this.data.material_data
      this.delimitor=this.data.delimitor
      this.cleaned_model=this.data.cleaned_model
      this.headers = this.material_data[0].split(this.delimitor)
      console.log(this.headers)
      
    }
  ngOnInit() {  
    this.options_fields_by_component=[]
    let tmpAttributesGroups = {}
    this.extract_fields_options['options']=[] 
    this.cleaned_model.forEach(
      component_model => {
          if (component_model['key']!=="Observation unit type"){
              this.extract_fields_options['options'].push({header: "", associated_linda_id: "", name: component_model['key'], value: component_model['key'] })
          }
      }
    );
    this.headers.forEach(element => {
      tmpAttributesGroups[element] = [element]
      this.data_to_extract[element]=""
    });
    this.dataFileComponentFieldForm= this.formBuilder.group(tmpAttributesGroups)
  }
  onExtractField(value: string, key: string){
    console.log(key)
    console.log(value)
    this.data_to_extract[key]=value
    console.log(this.is_extracted_field(key))
  }
  get_headers(){
    return this.headers
  }
  is_extracted_field(key: string){
      return this.data_to_extract[key]!==""
  }
  get get_extracted_field(){
    return this.data_to_extract
  }
  get get_dataFileComponentFieldForm(){
    return this.dataFileComponentFieldForm
  }
  get get_extract_fields_options(){
    return this.extract_fields_options
  } 
}
