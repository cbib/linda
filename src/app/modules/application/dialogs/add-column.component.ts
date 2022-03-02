import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssociatedHeadersInterface, DataFileInterface } from 'src/app/models/linda/data_files';
import { PersonInterface } from 'src/app/models/linda/person';
import { GlobalService, AlertService } from '../../../services';
import { DateformatComponent } from '../dialogs/dateformat.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { StudyInterface } from 'src/app/models/linda/study';
import { SelectionModel } from '@angular/cdk/collections';
import { first } from 'rxjs/operators';

interface DialogData {
  data_file: DataFileInterface;
  parent_id: string;
  group_key: string;
}


@Component({
  selector: 'app-add-column',
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.css']
})
export class AddColumnComponent implements OnInit {
  private data_file: DataFileInterface;
  private parent_id: string;
  private group_key: string;
  private total_lines:number
  private use_same_total_lines
  private linked_values:any[]
  private ready_to_add:boolean=false
   

  private extract_component_options = {
    'options': [
      { disabled: true, header: "", associated_linda_id: "", name: 'Assign MIAPPE components', value: '', fields: [] },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Study', value: 'study', fields: [
          "Study unique ID",
          "Study Name", "Study title",
          "Cultural practices",
          "Contact institution",
          "Geographic location (longitude)",
          "Geographic location (latitude)",
          "Geographic location (altitude)",
          "Geographic location (country)",
          "Start date of study",
          "End date of study",
          'Description of growth facility',
          'Map of experimental design',
          'Experimental site name',
          'Description of the experimental design',
          'Study description',
          'Observation unit description',
          'Observation unit level hierarchy',
          'Type of experimental design'
        ]
      },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Experimental Factor', value: 'experimental_factor', fields: [
          'Experimental Factor description',
          'Experimental Factor values',
          'Experimental Factor accession number',
          'Experimental Factor type'
        ]
      },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Biological Material', value: 'biological_material', fields: [
          'Genus',
          'Species',
          'Organism',
          'Infraspecific name',
          'Material source ID (Holding institute/stock centre, accession)',
          'Material source description',
          'Material source longitude',
          'Material source altitude',
          'Material source latitude',
          'Material source DOI',
          'Material source coordinates uncertainty',
          'Biological material ID',
          'Biological material preprocessing',
          'Biological material coordinates uncertainty',
          'Biological material longitude',
          'Biological material latitude',
          'Biological material altitude'
        ]
      },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Observation Unit', value: 'observation_unit', fields: [
          'Observation unit ID',
          'Observation unit type',
          'External ID',
          'Spatial distribution',
          'Observation Unit factor value'
        ]
      },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Observed variable', value: 'observed_variable', fields: [
          'Variable ID',
          'Variable name',
          'Variable accession number',
          'Scale',
          'Scale accession number',
          'Time scale',
          'Trait',
          'Trait accession number',
          'Method',
          'Method description',
          'Method accession number',
          'Reference associated to the method'
        ]
      },
      { disabled: false, header: "", associated_linda_id: "", name: 'Timeline', value: 'time', fields: ['time'] }
    ],
    'defaut': { name: 'Assing MIAPPE components', value: '', label: 'test' }
  };
  generalForm: FormGroup = this.formBuilder.group({
      'Header': ['', Validators.required],
      'Value': ['', Validators.required],
      'Total': [0, Validators.required],
      'UseSameNumber': [''],
      'Standard term': [''],
      'Link term': [''],
    }
  );
  private initialSelection = []
  private useSameNumberCheck = new SelectionModel<string>(true, this.initialSelection /* multiple */);
  private extraction_component: string = ""
  private extraction_component_field: string  = ""
  private link_component: string = ""
  private link_component_field: string  = ""
  dtOptions: DataTables.Settings = {};
 
  field_submitted = false;

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddColumnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public timedialog: MatDialog
  ) {
    this.data_file = this.data.data_file
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
  }

  ngOnInit() {
    this.linked_values=[]
  }
  
  itemSelectionToggle(key: string): void {
    this.useSameNumberCheck.toggle(key);
    if (this.useSameNumberCheck.isSelected(key)) {
        console.log(key, 'is selected')
        this.use_same_total_lines=true
        this.generalForm.get('Total').patchValue(this.data_file.Data.length)
    }
    else {
       console.log(key, 'is unselected')
       this.use_same_total_lines=false
       this.generalForm.get('Total').patchValue(0)
    }
  }
  
  onModify(values: string): void  {
    console.log(values)
    this.field_submitted=true
    this.extraction_component_field=values
    if (this.get_component(values) === "study") { 
      this.extraction_component = "study"
    }
  }

  get_component(field: string) {
    return this.extract_component_options.options.filter(prop => prop.fields.includes(field))[0]['value']
  }

  onLink(values: string): void {
    this.link_component_field=values
    this.linked_values= this.data_file.associated_headers.filter(associated_header=>associated_header.header===values)[0].associated_values
    console.log(this.linked_values)
  }

  onAdd(){
    //header does not exist
    if (this.data_file.headers.filter(header=>header===this.generalForm.get('Header').value).length===0){

      if (this.linked_values.length>1){
        let header_to_link=this.generalForm.get('Link term').value
        if (this.linked_values.length !== this.generalForm.get('Value').value.split(",").length){
          this.alertService.error("Same number of values is required for link component and column values")
        }
        else{
          // Update Data 
          this.linked_values.forEach((linked_value, index)=>{
            this.data_file.Data.forEach(line=>{
              if (line[header_to_link]===linked_value){
                line[this.generalForm.get('Header').value]= this.generalForm.get('Value').value.split(",")[index]
              }
            });
          });
          // Update headers
          this.data_file.headers.push(this.generalForm.get('Header').value)
          // Update associated_headers
          var associated_header: AssociatedHeadersInterface = {
            header: this.generalForm.get('Header').value,
            selected: true,
            associated_component: this.get_component(this.generalForm.get('Standard term').value),
            associated_linda_id: [],
            associated_term_id: "",
            associated_values: [],
            associated_component_field:this.extraction_component_field,
            is_numeric_values:false,
            is_time_values:false
          };

          this.data_file.associated_headers.push(associated_header)
          this.alertService.success("data file has been modified ! Press OK to update data")
          this.ready_to_add=true
        }
      }
      else{
          // Update Data 
          this.data_file.Data.forEach(line=>{
            line[this.generalForm.get('Header').value]=this.generalForm.get('Value').value
          })
          // Update headers
          this.data_file.headers.push(this.generalForm.get('Header').value)
          // Update associated_headers
          var associated_header: AssociatedHeadersInterface = {
            header: this.generalForm.get('Header').value,
            selected: true,
            associated_component: this.get_component(this.generalForm.get('Standard term').value),
            associated_linda_id: [],
            associated_term_id: "",
            associated_values: [],
            associated_component_field:this.extraction_component_field,
            is_numeric_values:false,
            is_time_values:false
          };

          this.data_file.associated_headers.push(associated_header)
          this.alertService.success("data file has been modified ! Press OK to update data")
          this.ready_to_add=true
      }
    }
    else{
      this.data_file.Data.forEach(line=>{
        line[this.generalForm.get('Header').value]=this.generalForm.get('Value').value
      })
      /* var associated_header: AssociatedHeadersInterface = {
        header: this.generalForm.get('Header').value,
        selected: true,
        associated_component: this.get_component(this.generalForm.get('Standard term').value),
        associated_linda_id: [],
        associated_term_id: "",
        associated_values: [],
        associated_component_field:this.extraction_component_field,
        is_numeric_values:false,
        is_time_values:false
      }; */
      this.data_file.associated_headers.filter(associated_header=>associated_header.header===this.generalForm.get('Header').value)[0].associated_component=this.extraction_component
      this.data_file.associated_headers.filter(associated_header=>associated_header.header===this.generalForm.get('Header').value)[0].associated_component_field=this.extraction_component_field

      //this.alertService.error("this headers allready exists")
      
    }
   
    console.log(this.data_file)
    //this.globalService.update(this.data_file._key, this.data_file, 'data_file').pipe(first()).toPromise().then(data => { console.log(data); })

    /* this.generalForm.get('Value').value
    this.generalForm.get('Standard term').value
    this.generalForm.get('Link term').value */
  }
  get get_ready_to_add(){
    return this.ready_to_add
  }
 
  get get_linked_values():any[]{
    return this.linked_values
  }
  get get_extraction_component(): string {
    return this.extraction_component
  }
  get get_extraction_component_field(): string {
    return this.extraction_component_field
  }
  get get_link_component(): string {
    return this.link_component
  }
  get get_link_component_field(): string {
    return this.link_component_field
  }
  get get_use_same_total_lines(){
    return this.use_same_total_lines
  }
  get get_useSameNumberCheck() {
    return this.useSameNumberCheck
  }
  get get_generalForm() {
    return this.generalForm
  }
  get get_data_file(){
    return this.data_file
  }
  get get_extract_component_options() {
    return this.extract_component_options
  }
  get get_field_submitted(){
    return this.field_submitted
  }
  onNoClick(): void {
    this.dialogRef.close({event:"Cancelled"});
  }

  onOkClick(): void {
    this.globalService.update(this.data_file._key, this.data_file, 'data_file').pipe(first()).toPromise().then(data => { console.log(data); })
    this.dialogRef.close({event:"Confirmed"});
  }
}