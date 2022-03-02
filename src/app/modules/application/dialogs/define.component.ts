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
  column_original_label: string;
  data_file: DataFileInterface;
  parent_id: string;
  group_key: string;
}
export function MustNotMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    for (let existing_studies_ids_index = 0; existing_studies_ids_index < control.value.length; existing_studies_ids_index++) {
      const existing_study = control.value[existing_studies_ids_index];
      for (let detected_values_index = 0; detected_values_index < matchingControl.value.length; detected_values_index++) {
        const detected_study = matchingControl.value[detected_values_index];
        // set error on matchingControl if validation fails
        if (detected_study === existing_study) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }

      }
    }
  }
}

@Component({
  selector: 'app-define',
  templateUrl: './define.component.html',
  styleUrls: ['./define.component.css']
})
export class DefineComponent implements OnInit {
  private data_file: DataFileInterface;
  private cells: string[] = []
  private column_original_label: string;
  private headers: string[] = []
  private projectPersons: { 'project_ids': string[], 'persons': PersonInterface[], 'roles': string[], 'groups': string[] };
  private studyPersons: { 'studies': StudyInterface[], 'persons': PersonInterface[], 'roles': string[] };

  //private projectPersons:PersonInterface[]  = []
  //private studyPersons:PersonInterface[]  = []
  private existing_studies_ids: string[] = []
  private existing_studies: StudyInterface[] = []
  private detected_values: string[] = []
  private detected_studies: string[] = []
  private studies_to_create: string[] = []
  private studies_to_remove: string[] = []
  private parent_id: string;
  private group_key: string;
  private extraction_component: string = ""
  private extraction_component_field: string = ""
  private cleaned_study_model = []
  private study_associated_header: AssociatedHeadersInterface
  private associated_header: AssociatedHeadersInterface
  private component_extracted: boolean = false
  private study_original_column_label: string = ""


  definecolumnForm: FormGroup = this.formBuilder.group({
    'Detected studies': [''],
    'test': [''],
    'Study IDs': ['', [Validators.required, Validators.minLength(6)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "user", "Person ID")],
  }, { validator: MustNotMatch('Study IDs', 'Detected studies') }
  );
  generalForm: FormGroup = this.formBuilder.group({
    'Header': [''],
    'Standard term': [''],
  }
  );
  dtOptions: DataTables.Settings = {};
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
  submitted = false;
  private Selection = []
  private removeSelection = []
  private checklistSelection = new SelectionModel<string>(true, this.Selection /* multiple */);
  private removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */);


  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<DefineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public timedialog: MatDialog
  ) {
    this.column_original_label = this.data.column_original_label
    this.data_file = this.data.data_file
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.existing_studies_ids = []
    this.generalForm.get('Header').setValue(this.column_original_label);
    this.studyPersons = { 'studies': [], 'persons': [], 'roles': [] }
    this.projectPersons = { 'project_ids': [], 'persons': [], 'roles': [], 'groups': [] }
    this.cleaned_study_model = this.get_model('study');

    this.globalService.get_studies_and_persons(this.parent_id.split('/')[1]).toPromise().then(
      edges => {
        console.log(edges)
        // get persons and person roles by projects with _to contains "persons" edge to get all persons found in this investigations
        edges.filter(edge => edge['e']['_to'].includes("persons") && edge['e']['_from'].includes("investigations")).forEach(edge => { this.projectPersons.persons.push(edge["v"]); this.projectPersons.roles.push(edge["e"]["role"]); edge["e"]["group_keys"].forEach(element => { this.projectPersons.groups.push(element) }) })
        console.log(this.projectPersons)
        // get studies in this investigation with _to contains "studies"
        edges.filter(edge => edge['e']['_to'].includes("studies")).forEach(edge => { this.existing_studies_ids.push(edge["v"]["Study unique ID"]) })
        edges.filter(edge => edge['e']['_to'].includes("studies")).forEach(edge => { this.existing_studies.push(edge["v"]) })
        // then find all persons roles by studies
        //console.log(this.existing_studies_ids)
        //this.definecolumnForm.get('Detected studies').setValue(this.existing_studies_ids);
        edges.filter(edge => edge['e']['_from'].includes("studies")).forEach(edge => { this.existing_studies_ids.push(edge["e"]['_from']); this.studyPersons.persons.push(edge["v"]); this.studyPersons.roles.push(edge["e"]["role"]) })
        for (let index = 0; index < this.existing_studies_ids.length; index++) {
          const element = this.existing_studies_ids[index];
          edges.filter(edge => edge['e']['_to'].includes("studies") && edge['e']['_to'] === element).forEach(edge => { this.studyPersons.studies.push(edge["v"]) })
        }
        //edges.filter(edge=> edge['e']['_to'].includes("studies")).forEach(edge=>{this.studyPersons.studies.push(edge["v"])})
        console.log(this.studyPersons)


      }
    );

    let total_lines = 0
    this.cells = []
    this.data_file.Data.forEach(data => { this.cells.push(data[this.column_original_label]); total_lines++ })
    this.detected_values = Array.from(new Set(this.cells));
    this.associated_header = this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0]

    if (this.has_study_column) {

      //this.study_original_column_label=this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0]
      this.study_associated_header = this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID')[0]
      this.detected_studies = this.study_associated_header.associated_values
      console.log("study ids were already described ")
      console.log(this.detected_studies)
      if (this.associated_header.selected) {
        this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
        this.extraction_component_field = this.associated_header.associated_component_field
        this.extraction_component = this.associated_header.associated_component
        this.detected_values=this.associated_header.associated_values
      }
      else{
        if (this.detected_values.length<this.detected_studies.length){
          while(this.detected_values.length<this.detected_studies.length){
            this.detected_values.push(this.detected_values[0])
          }
          //this.detected_values=[this.detected_values[0].repeat(this.detected_studies.length)]
        } 
        else if (this.detected_values.length===this.detected_studies.length){

        }
        else{
          this.alertService.error('Number of entry must match total number of studies')
        }
      }
    }
    else {
      if (this.associated_header.selected) {
        this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
        this.extraction_component_field = this.associated_header.associated_component_field
        this.extraction_component = this.associated_header.associated_component
        this.detected_studies = []
      }
      else {
        this.detected_studies = []
      }
    }
  }

  clean_associated_headers() {
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = false; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_term_id = "" });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component = ""; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component_field = ""; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.is_time_values = false; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_linda_id = []; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values = []; });
  }
  update_associated_headers(values: string) {
    console.log(values)
    console.log(this.column_original_label)
    //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = true; });
    if (values === "time") {
      const dialogRef = this.timedialog.open(DateformatComponent, { width: '1000px', data: { date_format: "" } });
      dialogRef.afterClosed().subscribe(result => {
        //this.associated_headers[key]={selected:true, associated_term_id:result.date_format, associated_component:"time", is_time_values:true, is_numeric_values:false}
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = true; });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_term_id = result.date_format; });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component = "time"; });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component_field = ""; });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.is_time_values = true; });
        //this.time_set = true
        //this.checklistSelection.toggle(key);
      });
    }
    else if (values === "" || values === undefined) {
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = false; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_term_id = "" });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component = ""; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component_field = ""; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.is_time_values = false; });
    }
    else {
      // this.data_to_extract[values] = key
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = true; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_term_id = ''; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component = this.get_component(values); });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component_field = values; });
      this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.is_time_values = false; });
    }
  }
  onModify(values: string) {
    console.log(this.associated_header)
    let total_lines = 0
    // column already defined
    if (this.associated_header.selected) {
      // open dialog to confirm
      console.log("you're about to change header assignation - if agree- it will remove all component created using thise column and remove all their childs")
    }
    // column not defined
    else {
      console.log(values)
      this.extraction_component_field = values
      console.log(this.column_original_label)
      console.log(this.data_file.associated_headers)
      if (this.get_component(values) === "study") {

        this.extraction_component = "study"
        if (this.extraction_component_field === "Study unique ID") {
          if (this.has_study_column()) {
            console.log("study column detected")
            console.log(this.study_associated_header.associated_values)
            console.log(this.study_associated_header.associated_linda_id)
          }
          else {
            console.log("study column not detected")
            this.update_associated_headers(values)
            this.study_associated_header = this.associated_header
            //get unique study names

          }
        }
        else if (["Experimental site name", "Start date of study", "Study title"].includes(this.extraction_component_field)) {
          console.log(this.detected_studies)
          console.log(this.detected_values)
          if (this.has_study_column()) {
            console.log("study column detected")
            this.update_associated_headers(values)
            //this.associated_header.associated_values=this.detected_values
            //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values = []; });
          }
          else {
            console.log("study column not detected")
          }
        }
        else {
          if (this.has_study_column()) {
            console.log("study column detected")
            console.log(this.associated_header.associated_values)
            console.log(this.associated_header.associated_linda_id)

          }
          else {
            console.log("study column not detected")
            this.update_associated_headers(values)
            this.study_associated_header = this.associated_header
            //get unique study names

          }
        }
      }
      if (this.get_component(values) === "observed_variable") {
        if (!this.has_study_column()) {
          this.alertService.error("You need to define one study unique ID column before assigning any others components")
        }
        else {
          this.extraction_component = "observed_variable"
        }
      }
      if (this.get_component(values) === "experimental_factor" && this.has_study_column()) {
        this.extraction_component = "experimental_factor"
      }
      if (this.get_component(values) === "observation_unit" && this.has_study_column()) {
        this.extraction_component = "observation_unit"
      }
      if (this.get_component(values) === "event" && this.has_study_column()) {
        this.extraction_component = "event"
      }
      if (this.get_component(values) === "biological_material" && this.has_study_column()) {
        this.extraction_component = "biological_material"
      }

      ///this.definecolumnForm.get('Study IDs').setValue(this.detected_values);
    }



  }
  has_study_column(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component === 'study').length !== 0
  }
  onRemove(component_value: string) {
    if (this.extraction_component === "study") {
      if (this.extraction_component_field === "Study unique ID") {
        let study_id = this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(component_value)]
        this.globalService.remove(study_id).pipe(first()).toPromise().then(
          data => {
            if (data["success"]) {

              //this.studies_to_remove=this.studies_to_remove.filter(study_name=>study_name!==this.associated_header.associated_values[index])
              /* let studyIDs: string[] = []
              let total_lines = 0
              this.data_file.Data.forEach(data => { studyIDs.push(data[this.column_original_label]); total_lines++ })
              console.log(total_lines)
              console.log(studyIDs)
              console.log(new Set(studyIDs))
              this.detected_values = Array.from(new Set(studyIDs));*/
              this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== study_id);
              this.associated_header.associated_values = this.associated_header.associated_values.filter(linda_id => linda_id !== component_value);
              //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
              console.log(this.data_file.associated_headers)
              this.clean_associated_headers()
              var data_model = { ...this.data_file };
              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                data => {
                  console.log(data);
                  this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
                  this.component_extracted = false
                  this.removeSelection = []
                  this.removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */)
                  //this.studies_to_create=[]
                  ///this.ngOnInit()
                }
              );
            }
          }
        );
      }
      else if (["Experimental site name", "Start date of study", "Study title"].includes(this.extraction_component_field) ){
        let study_id = this.study_associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(component_value)]
          // update field Experimental site name with values in column
          console.log(study_id)
          
        this.globalService.update_field("", study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(data => { 
          console.log(data);
          this.clean_associated_headers()
              var data_model = { ...this.data_file };
              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                data => {
                  console.log(data);
                  this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
                  this.component_extracted = false
                  //this.removeSelection = []
                 // this.removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */)
                  //this.studies_to_create=[]
                  ///this.ngOnInit()
                }
              );
        })
      }
    }
  }
  onExtract(component_value, index:number): void {
    console.log(component_value)
    console.log(this.extraction_component)
    console.log(this.extraction_component_field)
    if (this.extraction_component === "study") {
      if (this.extraction_component_field === "Study unique ID") {

        let study_model_dict = {}
        this.cleaned_study_model.forEach(attr => { study_model_dict[attr["key"]] = "" });
        var study_model = { ...study_model_dict };

        // filter lines_dict to keep lines that match unique_study_label
        var study_lines = this.data_file.Data.filter(line => {
          return line[this.column_original_label] === component_value;
        });

        //console.log(data_model)
        study_model['Study unique ID'] = component_value

        //var data_model = { ...this.data_file };
        this.globalService.add(study_model, 'study', this.parent_id, false, this.group_key).pipe(first()).toPromise().then(
          add_study_res => {
            if (add_study_res["success"]) {
              console.log(add_study_res)
              console.log(add_study_res["message"])
              let study_id = add_study_res["_id"]
              this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_linda_id.push(study_id); });
              this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.push(component_value); });

              var data_model = { ...this.data_file };
              //var component = this.studies_to_create.length === 1 ? "study" : "studies";

              this.component_extracted = true


              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                data => {
                  console.log(data);
                  this.Selection = []
                  this.checklistSelection = new SelectionModel<string>(true, this.Selection);
                  this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
                  this.studies_to_remove = []
                }
              );
            }
          }
        );
      }
      else if (["Experimental site name", "Start date of study", "Study title"].includes(this.extraction_component_field) ){

        // update field Experimental site name with values in column using study name
        let study_id= this.study_associated_header.associated_linda_id[index]
        /* this.study_associated_header.associated_linda_id.forEach((study_id,index)=>{
          console.log(study_id) */
          // update field Experimental site name with values in column
          this.globalService.update_field(component_value, study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(
            data => { 
            console.log(data);
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(study_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
            console.log(this.data_file.associated_headers)
            if (index===this.study_associated_header.associated_linda_id.length-1){
              var data_model = { ...this.data_file };
              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                data => {
                  console.log(data);
                  this.Selection = []
                  this.checklistSelection = new SelectionModel<string>(true, this.Selection);
                  this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
                  this.studies_to_remove = []
                }
              );
              this.component_extracted = true
            }
          });
      }
      else if (this.extraction_component_field === "Study Name") {
        // update field study name with values in column
        console.log(component_value)
      }
      else{

      }
    }
  }
  itemSelectionToggle(_study_id: string): void {
    this.checklistSelection.toggle(_study_id);
    console.log(this.Selection)
    if (this.checklistSelection.isSelected(_study_id)) {
      this.studies_to_create.push(_study_id)
    }
    else {
      this.studies_to_create = this.studies_to_create.filter(study_id => study_id !== _study_id)
    }
    console.log(this.studies_to_create, 'are ready to be created')
  }
  itemRemoveToggle(_study_id: string): void {
    this.removeListSelection.toggle(_study_id);
    //console.log(this.removeSelection)
    if (this.removeListSelection.isSelected(_study_id)) {
      this.studies_to_remove.push(_study_id)
    }
    else {
      this.studies_to_remove = this.studies_to_remove.filter(study_id => study_id !== _study_id)
    }
    //console.log(this.studies_to_remove, 'are ready to be created')
  }
  get get_associated_header() {
    return this.associated_header
  }
  get get_study_associated_header() {
    return this.study_associated_header
  }
  get_study_associated_header_values(key: string): string {
    if (this.study_associated_header.associated_values.filter(value => value === key).length > 0) {
      return this.study_associated_header.associated_values.filter(value => value === key)[0]
    }
    else {
      return ""
    }
  }
  get_associated_header_values(key: string) {
    //console.log(this.associated_header.associated_values.filter(value => value === key))
    if (this.associated_header.associated_values.filter(value => value === key).length > 0) {
      return this.associated_header.associated_values.filter(value => value === key)[0]
    }
    else {
      return ""
    }
  }
  has_associated_header_values(key: string) {
/*     console.log(key)
    console.log(this.associated_header)
    console.log(this.associated_header.associated_values) */
    return this.associated_header.associated_values.filter(value => value === key).length !== 0
  }
  get get_component_extracted() {
    return this.get_component_extracted
  }
  get get_studies_to_create() {
    return this.studies_to_create
  }
  get get_studies_to_remove() {
    return this.studies_to_remove
  }
  get get_checklistSelection() {
    return this.checklistSelection
  }
  get get_removeListSelection() {
    return this.removeListSelection
  }
  // convenience getter for easy access to form fields
  get define_f() {
    return this.definecolumnForm.controls;
  }
  get f() {
    return this.generalForm.controls;
  }
  get get_generalForm() {
    return this.generalForm
  }
  get get_detected_values() {
    return this.detected_values
  }
  get get_detected_studies() {
    return this.detected_studies
  }

  get get_extract_component_options() {
    return this.extract_component_options
  }
  get get_extraction_component(): string {
    return this.extraction_component
  }
  get get_extraction_component_field(): string {
    return this.extraction_component_field
  }
  get get_projectPersons(): { 'persons': PersonInterface[], 'roles': string[], 'groups': string[] } {
    return this.projectPersons
  }
  get get_studyPersons(): { 'studies': StudyInterface[], 'persons': PersonInterface[], 'roles': string[] } {
    return this.studyPersons
  }
  get get_existing_studies_ids() {
    return this.existing_studies_ids
  }
  get_component(field: string) {
    return this.extract_component_options.options.filter(prop => prop.fields.includes(field))[0]['value']
    //console.log(this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });)
  }
  get get_headers() {
    return this.headers
  }
  get get_definecolumnForm() {
    return this.definecolumnForm
  }
  get get_parent_id() {
    return this.parent_id
  }
  get_output_from_child(val: any) {
    if (val === 'cancel the form') {
      console.log("Cancel form")
    }
    else {
      console.log("Cancel form")
    }
  }

  get_model(model_type: string) {
    let cleaned_model = [];

    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    this.globalService.get_model(model_type).toPromise().then(data => {
      var keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {
          keys.splice(i, 1);
          i--;
        }
        else {
          var dict = {}
          dict["key"] = keys[i]
          dict["pos"] = data[keys[i]]["Position"]
          dict["level"] = data[keys[i]]["Level"]
          dict["format"] = data[keys[i]]["Format"]
          dict["Associated_ontologies"] = data[keys[i]]["Associated_ontologies"]
          cleaned_model.push(dict)
        }
      }
      cleaned_model = cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
    });
    return cleaned_model

  }
  onNoClick(): void {
    this.dialogRef.close({ event: "Cancelled" });
  }

  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed" });
  }


}
