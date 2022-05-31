import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssociatedHeadersInterface, DataFileInterface } from 'src/app/models/linda/data_files';
import { PersonInterface } from 'src/app/models/linda/person';
import { GlobalService, AlertService } from '../../../services';
import { DateformatComponent } from '../dialogs/dateformat.component';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { StudyInterface } from 'src/app/models/linda/study';
import { SelectionModel } from '@angular/cdk/collections';
import { first } from 'rxjs/operators';

import { timeStamp } from 'console';
import { isBuffer } from 'util';
import { OntologyTreeComponent } from './ontology-tree.component';
//import { ConsoleReporter } from 'jasmine';

interface DialogData {
  data_file: DataFileInterface;
  parent_id: string;
  group_key: string;
}

/** A header's name */
export function forbiddenHeaderValidator(_data_file: DataFileInterface): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden=_data_file.associated_headers.filter(associated_header=>associated_header.header===control.value).length>0
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

/** A header's name */
export function forbiddenFieldValidator(_data_file: DataFileInterface): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value===''){
      return null;
    }
    else if(control.value!=="Study unique ID"){
      return null
    }
    else{
      const forbidden=_data_file.associated_headers.filter(associated_header=>associated_header.associated_component_field===control.value).length>0
      return forbidden ? {forbiddenField: {value: control.value}} : null;
    }
  };
}
export function isDateFormat(_date){
  //isDate('2018-08-01T18:30:00.000Z');
  //const _regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
  //isDate('2018-08-01')
  const _regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])?$');
  return _regExp.test(_date);
}

/** A header's name */
// for value
// for link term
export function emptyValuesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value===''){
      return null;
    }
    else{
      const empty= control.value['values'].length===0
      return empty ? {emptyValues: {value: control.value}} : null;
    }
    

   // const empty=linked_values.length===0
    ///return empty ? {emptyValues: {value: control.value}} : null;
  };
}


@Component({
  selector: 'app-add-column',
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.css']
})
export class AddColumnComponent implements OnInit {
  private data_file: DataFileInterface;
  private tmp_data_file: DataFileInterface
  private parent_id: string;
  private group_key: string;
  //private total_lines:number
  //private use_same_total_lines
  private linked_values:any[]
  private ready_to_add:boolean=false
  private linked:boolean= false
  field_submitted = false;
  private ontologies={'study':["CO_715", "OBI"], 'experimental_factor':["CO_715","EFO","PECO","EO"], 'observed_variable':["CO_322 (Maize)","CO_325","CO_331","Solanacae","XEO"], 'event':["CO_715", "XEO"], 'environment':["XEO"]}
  private term_ids:string[]=[]
  private associated_model:string=""
  unique_taxon_groups:{}={}
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
        disabled: false, header: "", associated_linda_id: "", name: 'Environement parameter', value: 'environment', fields: [
          'Environment parameter',
          'Environment parameter value',
          'Environment parameter accession number'
        ]
      },
      {
        disabled: false, header: "", associated_linda_id: "", name: 'Event', value: 'event', fields: [
          'Event type',
          'Event date',
          'Event accession number',
          'Event description'
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
  generalForm: FormGroup ;
  //private initialSelection = []
  //private useSameNumberCheck = new SelectionModel<string>(true, this.initialSelection /* multiple */);
  labelPosition: 'autogenerate ids' | 'paste ids' = 'autogenerate ids';
  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddColumnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public timedialog: MatDialog,
    public ontologydialog: MatDialog
  ) {
    this.data_file = this.data.data_file
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
  }

  ngOnInit() {

    this.generalForm = this.formBuilder.group({
      'header': ['',[ Validators.required, forbiddenHeaderValidator(this.data_file)]],
      //'column_value': ['', Validators.required],
      //'total': [0, Validators.required],
      //'useSameNumber': [''],
      'standardTerm': ['',[ Validators.required,  forbiddenFieldValidator(this.data_file)]],
      'linkTerm': ['',emptyValuesValidator()],
      'aliases': this.formBuilder.array([
        this.formBuilder.control('', Validators.required)
      ])
    });
  }
  get_associated_ontologies(){
    return this.ontologies[this.associated_model]
  }
  async get_germplasm_unique_taxon_groups(){
    this.unique_taxon_groups = await this.globalService.get_germplasm_unique_taxon_groups().toPromise()
  }
  onOntologyTermSelection(ontology_id: string, key: string, multiple: string, value_index:number){
    /* console.log(ontology_id)
    console.log(key)
    console.log(multiple) */
    const dialogRef = this.ontologydialog.open(OntologyTreeComponent, { width: '1000px', autoFocus: false, maxHeight: '90vh', data: { ontology_id: ontology_id, selected_term: null, selected_key:"", selected_set: [], multiple: false, uncheckable: true, observed: true, mode_simplified:true } });
    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            //console.log(result.ontology_id);
            //console.log(result.selected_term);
            //console.log(result.selected_set);
            //console.log(result.selected_key);
            //var term_ids = ""
            this.term_ids.push(result.selected_key)
           /*  for (var i = result.selected_set.length - 1; i >= 0; i--) {
                this.term_ids.push(result.selected_key)
            } */
            this.aliases.controls[value_index].patchValue(result.selected_key)
            //this.term_ids = this.term_ids.slice(0, -1);
          }
        }
      );
  }
  
  /* itemSelectionToggle(key: string): void {
    this.useSameNumberCheck.toggle(key);
    if (this.useSameNumberCheck.isSelected(key)) {
        //console.log(key, 'is selected')
        this.use_same_total_lines=true
        this.total.patchValue(this.data_file.Data.length)
    }
    else {
       //console.log(key, 'is unselected')
       this.use_same_total_lines=false
       this.total.patchValue(0)
    }
  } */
  
  onModify(values: string): void  {
    this.field_submitted=true
/*     console.log(this.standardTerm.value)
    console.log(values) */
    this.associated_model=this.standardTerm.value.model
    console.log(this.associated_model)
    /* console.log(values)
    this.field_submitted=true
    console.log(this.generalForm)*/
    if (['Start date of study', 'End date of study', 'Event date'].includes(values['field'])){
      console.log(("Date detected"))
    }
    //this.ready_to_add=true
  }

  get_component(field: string) {
    return this.extract_component_options.options.filter(prop => prop.fields.includes(field))[0]['value']
  }

  async onLink(values: string) {
    console.log(this.linkTerm.value['field'])
    if (this.linkTerm.value['component']!=='study'){
      this.extract_component_options.options.filter(opt=>opt.value===this.linkTerm.value['component'])[0].fields=this.extract_component_options.options.filter(opt=>opt.value===this.linkTerm.value['component'])[0].fields.filter(field=>field!==this.linkTerm.value['field'])
      this.extract_component_options.options.filter(opt=>opt.value===this.linkTerm.value['component']).forEach(opt_2=>{opt_2.disabled=false})
      this.extract_component_options.options.filter(opt=>opt.value!==this.linkTerm.value['component']).forEach(opt_2=>{opt_2.disabled=true})
    }

/*     console.log(values)
    console.log(this.linkTerm.value.values.length)
    console.log(this.linkTerm.value.ids) */
    /* const valuesDictionary = this.data_file.Data.reduce((prev, curr) => {
      return {
          ...prev,
          //[curr[this.column_original_label]]: curr["Study linda ID"]
          [curr["Study linda ID"]]: curr[this.linkTerm.value.header]
      }
    }, {})
    console.log(valuesDictionary) */
    //this.data_file.associated_headers.filter(associated_header=> associated_header.header===values['he'])
    while (this.aliases.length!==this.linkTerm.value.values.length){
      this.aliases.push(this.formBuilder.control('', Validators.required));
    }
    this.linkTerm.value['parents']=[]
    await Promise.all(this.linkTerm.value.ids.map(async (element, index) => {
      if (element.includes("studies")){
        this.linkTerm.value['parents'].push(element)
        //this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===element).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});
      } 
      else{
        await this.globalService.get_parent(element).toPromise().then(parent_data=>
          {
            this.linkTerm.value['parents'].push(parent_data['_from'])
          })
      
       // this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===parent_data['_from']).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});  
      }
    }));
    console.log(this.linkTerm.value)

    this.linked=true
    /*
    this.linked_values= this.data_file.associated_headers.filter(associated_header=>associated_header.header===values)[0].associated_values
    if (this.linked_values.length===0){
      this.alertService.error("There is no values associated with this column called '" + values + "' - Please select another column to link with ! ")
    }
    console.log(this.linked_values) */
  }
  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    console.log(pastedText)
  }
  
  onInput(content: string) {
    console.log(content)
  }

  async onAdd(){
    //delete this.tmp_data_file
    this.tmp_data_file = { ...this.data_file };
    console.log(this.aliases.controls)
    console.log(this.linkTerm.value)
    //header does not exist
    //if (this.data_file.headers.filter(header=>header===this.header.value).length===0){
    
    if (this.linkTerm.value!== '' && this.linkTerm.value.header!==''){
        let header_to_link=this.linkTerm.value['header']
        if (this.linkTerm.value.values.length !== this.aliases.controls.length){
          this.alertService.error("Same number of values is required for link component and column values")
        }
        else{

          for (let index = 0; index < this.linkTerm.value.parents.length; index++) {
            const element = this.linkTerm.value.parents[index];
            console.log(element)
            this.data_file.Data.filter(line=>line["Study linda ID"]===element).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});
            
          }
          console.log(this.data_file.Data)
          /* await Promise.all(this.linkTerm.value.ids.map(async (element, index) => {
            if (element.includes("studies")){
              this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===element).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});
            } 
            else{
              const parent_data=  await this.globalService.get_parent(element).toPromise()
              this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===parent_data['_from']).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});  
            }
          })); */
          // Update Data 
          /* this.linkTerm.value.ids.forEach(async (element, index) => {
            // get study Parent with component id
            console.log(element)
            if (element.includes("studies")){
              this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===element).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});
            } 
            else{
              const parent_data=  await this.globalService.get_parent(element).toPromise()
              console.log(parent_data)
              this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===parent_data['_from']).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});  
              
            }  
          }); */
          // Update Data 
          /* this.linkTerm.value.values.forEach((linked_value, index)=>{
            this.data_file.Data.forEach(line=>{
              if (line[header_to_link]===linked_value){
                line[this.header.value]= this.aliases.controls[index].value
              }
            });
          });
          */
          // Update headers
          this.data_file.headers.push(this.header.value)
          // Update associated_headers
          if(this.get_component(this.standardTerm.value.field)==='study' && this.standardTerm.value.field==='Study Name'){
            var associated_header: AssociatedHeadersInterface = {
              header: this.header.value,
              selected: true,
              associated_component: this.get_component(this.standardTerm.value.field),
              associated_linda_id: this.linkTerm.value.ids,
              associated_parent_id: [],
              associated_term_id: "",
              associated_values: [],
              associated_component_field:this.standardTerm.value.field,
              is_numeric_values:false,
              is_time_values:false
            };
          }
          else{
            var associated_header: AssociatedHeadersInterface = {
              header: this.header.value,
              selected: true,
              associated_component: this.get_component(this.standardTerm.value.field),
              associated_linda_id: [],
              associated_parent_id: [],
              associated_term_id: "",
              associated_values: [],
              associated_component_field:this.standardTerm.value.field,
              is_numeric_values:false,
              is_time_values:false
            };
          }
          

          this.data_file.associated_headers.push(associated_header)
          this.alertService.success(" this.linkTerm.value.header!=='' case : data file has been modified ! Press OK to update data")
          
        }
    }
    else{
      this.data_file.Data.forEach(line=>{
        line[this.header.value]=this.aliases.controls[0].value
      })

      // Update headers
      this.data_file.headers.push(this.header.value)
      // Update associated_headers
      var associated_header: AssociatedHeadersInterface = {
        header: this.header.value,
        selected: true,
        associated_component: this.get_component(this.standardTerm.value.field),
        associated_linda_id: [],
        associated_parent_id: [],
        associated_term_id: "",
        associated_values: [],
        associated_component_field:this.standardTerm.value.field,
        is_numeric_values:false,
        is_time_values:false
      };

      this.data_file.associated_headers.push(associated_header)
      //await this.globalService.update_document(this.data_file._key,  this.data_file, 'data_file').toPromise()

      this.alertService.success(" else  case : data file has been modified ! Press OK to update data")
      //this.ready_to_add=true
    }
    let data: {} = await this.globalService.update_document(this.data_file._key,  this.data_file, 'data_file').toPromise()
    console.log(data);
            //let data = await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').toPromise()
    if (data) {
      this.ready_to_add=true
      this.dialogRef.close({event:"Confirmed", data_file:  this.data_file});
      }
    
     

    
    
    




/*     else{
      this.data_file.Data.forEach(line=>{
        line[this.header.value]=this.column_value.value
      })
      this.data_file.associated_headers.filter(associated_header=>associated_header.header===this.header.value)[0].associated_component=this.get_component(this.standardTerm.value)
      this.data_file.associated_headers.filter(associated_header=>associated_header.header===this.header.value)[0].associated_component_field=this.standardTerm.value
    } */
   
    //this.globalService.update_document(this.data_file._key, this.data_file, 'data_file').pipe(first()).toPromise().then(data => { console.log(data); })

    /* this.Value.value
    this.generalForm.get('standardTerm').value
    this.generalForm.get('linkTerm').value */
  }
  get isDate(){
    return ['Start date of study','End date of study', 'Event date'].includes(this.generalForm.get('standardTerm').value.field)
  }
  get isOntology(){
    return this.generalForm.get('standardTerm').value.field.includes('accession number')
  }
  get header() { return this.generalForm.get('header'); }
  get column_value() { return this.generalForm.get('column_value'); }
  //get total() { return this.generalForm.get('total'); }
  get standardTerm() { return this.generalForm.get('standardTerm'); }
  get linkTerm() { return this.generalForm.get('linkTerm'); }
  get aliases() { return this.generalForm.get('aliases') as FormArray;}

  addAlias() {
    this.aliases.push(this.formBuilder.control(''));
  }
  get get_term_ids(){
    return this.term_ids
  }
  get filter_associated_headers(){ 
    let accepted_component_field=["Study Name", "Experimental Factor accession number", "Event accession number", "Environment parameter accession number", "Variable accession number"]
    return this.get_data_file.associated_headers.filter(associated_header=>accepted_component_field.includes(associated_header.associated_component_field) && associated_header.associated_linda_id.length>0)
  }
  get get_ontologies(){
    return this.ontologies
  }
  get get_associated_model(){
    return this.associated_model
  }
  get get_linked(){
    return this.linked
  }
  get get_ready_to_add(){
    return this.ready_to_add
  }
  get get_linked_values():any[]{
    return this.linked_values
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
  onClose(): void {
    this.dialogRef.close({event:"Cancelled", data_file: this.data_file});
  }
  async onOkClick() {  
      this.dialogRef.close({event:"Confirmed", data_file:  this.data_file});
  }

}