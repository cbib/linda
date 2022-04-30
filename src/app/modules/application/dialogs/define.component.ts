import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssociatedHeadersInterface, DataFileInterface } from 'src/app/models/linda/data_files';
import { PersonInterface } from 'src/app/models/linda/person';
import { GlobalService, AlertService } from '../../../services';
import { DateformatComponent } from '../dialogs/dateformat.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { Study, StudyInterface } from 'src/app/models/linda/study';
import { SelectionModel } from '@angular/cdk/collections';
import { first } from 'rxjs/operators';
import { LindaEvent } from 'src/app/models/linda/event';
import { ExperimentalFactor } from 'src/app/models/linda/experimental_factor';
import { ConfirmationComponent } from './confirmation.component';
import { isBuffer } from 'util';
import { Environment } from 'src/app/models/linda/environment';
import { ObservedVariable } from 'src/app/models/linda/observed-variable';

interface DialogData {
  column_original_label: string;
  data_file: DataFileInterface;
  parent_id: string;
  group_key: string;
}

interface SelectValue {
  header: string;
  ids: string[];
  values: string[];
  parents: string[];
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
export class DefineComponent implements OnInit, OnDestroy {
  private data_file: DataFileInterface;
  private cells: string[] = []
  private column_original_label: string;
  private headers: string[] = []
  private projectPersons: { 'project_ids': string[], 'persons': PersonInterface[], 'roles': string[], 'groups': string[] };
  private studyPersons: { 'studies': StudyInterface[], 'persons': PersonInterface[], 'roles': string[] };
  private existing_studies_ids: string[] = []
  private existing_studies: StudyInterface[] = []
  private studies_to_remove: string[] = []
  private parent_id: string;
  private group_key: string;
  private extraction_component: string = ""
  private extraction_component_field: string = ""
  private linked: boolean = false
  //private cleaned_event_model = []
  //private cleaned_study_model = []
  //private cleaned_experimental_factor_model = []
  //private associated_header: AssociatedHeadersInterface
  private component_extracted: boolean = false
  private study_original_column_label: string = ""
  submitted = false;
  while_added: boolean = false
  private Selection = []
  private removeSelection = []
  private checklistSelection = new SelectionModel<string>(true, this.Selection /* multiple */);
  private removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */);
  private selected_value: SelectValue;
  private studyValuesDictionary: {} = {}



  definecolumnForm: FormGroup = this.formBuilder.group({
    'Detected studies': [''],
    'test': [''],
    'Study IDs': ['', [Validators.required, Validators.minLength(6)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, "user", "Person ID")],
  }, { validator: MustNotMatch('Study IDs', 'Detected studies') }
  );

  generalForm: FormGroup = this.formBuilder.group({
    'Header': [''],
    'Standard term': [''],
  }
  );
  dtOptions: DataTables.Settings = {};

  //use when no study associated header exists 
  private extract_study_options = [
    { disabled: true, header: "", associated_linda_id: "", name: 'Assign MIAPPE components', value: '', fields: [] },
    { disabled: false, header: "", associated_linda_id: "", name: 'Study', value: 'study', fields: ['Study unique ID',] }
  ]
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
  current_study: any;

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<DefineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public timedialog: MatDialog,
    public dialog: MatDialog
  ) {
    this.column_original_label = this.data.column_original_label
    this.data_file = this.data.data_file
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
  }

  async ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    // Panel for projects and studies infos 
    // to avoid recreate same study  - 
    // Is it still necesary given that we disabled creatte button when studies already exists ?

    this.generalForm.get('Header').setValue(this.column_original_label);
    this.generalForm.get('Header').disable()
    this.studyPersons = { 'studies': [], 'persons': [], 'roles': [] }
    this.projectPersons = { 'project_ids': [], 'persons': [], 'roles': [], 'groups': [] }
    //this.cleaned_study_model = this.get_model('study');
    //this.cleaned_experimental_factor_model = this.get_model('experimental_factor');
    // this.cleaned_event_model = this.get_model('event');
    this.existing_studies_ids = []
    const edges = await this.globalService.get_studies_and_persons(this.parent_id.split('/')[1]).toPromise()
    //console.log(edges)
    // get persons and person roles by projects with _to contains "persons" edge to get all persons found in this investigations
    edges.filter(edge => edge['e']['_to'].includes("persons") && edge['e']['_from'].includes("investigations")).forEach(edge => { this.projectPersons.persons.push(edge["v"]); this.projectPersons.roles.push(edge["e"]["role"]); edge["e"]["group_keys"].forEach(element => { this.projectPersons.groups.push(element) }) })
    //console.log(this.projectPersons)
    // get studies in this investigation with _to contains "studies"
    edges.filter(edge => edge['e']['_to'].includes("studies")).forEach(edge => { this.existing_studies_ids.push(edge["v"]["Study unique ID"]) })
    edges.filter(edge => edge['e']['_to'].includes("studies")).forEach(edge => { this.existing_studies.push(edge["v"]) })
    // then find all persons roles by studies

    //this.definecolumnForm.get('Detected studies').setValue(this.existing_studies_ids);
    edges.filter(edge => edge['e']['_from'].includes("studies")).forEach(edge => {
      //this.existing_studies_ids.push(edge["e"]['_from']); 
      this.studyPersons.persons.push(edge["v"]);
      this.studyPersons.roles.push(edge["e"]["role"])
    })
    for (let index = 0; index < this.existing_studies_ids.length; index++) {
      const element = this.existing_studies_ids[index];
      edges.filter(edge => edge['e']['_to'].includes("studies") && edge['e']['_to'] === element).forEach(edge => { this.studyPersons.studies.push(edge["v"]) })
    }
    //edges.filter(edge=> edge['e']['_to'].includes("studies")).forEach(edge=>{this.studyPersons.studies.push(edge["v"])})
    //console.log(this.studyPersons)
    // Parse data in selected column
    this.cells = []
    this.cells = this.get_data_by_header(this.column_original_label)
    // get unique values in column
    // check if a study component has already been described in data files
    //console.log(this.cells)
    if (this.associated_header.selected) {
      // set value in general form using component field values in asscociated headers
      this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
      this.extraction_component_field = this.associated_header.associated_component_field
      this.extraction_component = this.associated_header.associated_component
      //this.detected_values=this.associated_header.associated_values
    }
    if (!this.has_study_associated_header()) {
      //console.log("study associated header not found")
      this.extract_component_options.options = this.extract_study_options
    }
    this.studyValuesDictionary = this.data_file.Data.reduce((prev, curr) => {
      return {
        ...prev,
        [curr["Study linda ID"]]: curr[this.column_original_label]
      }
    }, {})
    //console.log(this.studyValuesDictionary)
    //console.log(this.existing_studies_ids)
  }
  get get_studyValuesDictionary() {
    return this.studyValuesDictionary
  }
  get_associated_studies(): string[] {
    return Object.keys(this.studyValuesDictionary)
  }
  get_associated_study(key: string, index: number) {
    /* const valuesDictionary = this.data_file.Data.reduce((prev, curr) => {
      return {
        ...prev,
        //[curr[this.column_original_label]]: curr["Study linda ID"]
        [curr["Study linda ID"]]: curr[this.column_original_label]
      }
    }, {})
    //console.log(valuesDictionary) */
    return Object.keys(this.studyValuesDictionary)[index]
  }
  onModify(values: string) {

    var data_model = { ...this.data_file };
    if (this.associated_header.associated_component_field !== values && this.associated_header.associated_component_field !== "") {
      if (this.associated_header.associated_linda_id.length !== 0) {
        const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'change_field', model_type: "data_file" } });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            if (result.event == 'Confirmed') {
              let unique_field = ['Study unique ID', 'Event accession number', 'Experimental Factor accession number']
              if (unique_field.includes(this.associated_header.associated_component_field)) {
                //console.log(this.associated_header.associated_component_field)
                if (this.associated_header.associated_linda_id.length > 0) {
                  let linda_ids = data_model.associated_headers.filter(associated_header => associated_header.header === this.associated_header.header)[0].associated_linda_id
                  //console.log(linda_ids)
                  for (let index = 0; index < linda_ids.length; index++) {
                    const linda_id = linda_ids[index];
                    //console.log(linda_id)
                    await this.globalService.remove(linda_id).pipe(first()).toPromise().then(
                      async remove_result => {
                        if (remove_result["success"]) {
                          //this.detected_studies.filter(detected_study => detected_study !== component_value)
                          //console.log(remove_result)
                          this.associated_header.associated_parent_id.splice(this.associated_header.associated_linda_id.indexOf(linda_id), 1)
                          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== linda_id);
                          //this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
                          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
                          this.associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(linda_id), 1)

                          if (this.associated_header.associated_values.length === 0) {
                            this.associated_header.associated_component = ""
                            this.associated_header.associated_component_field = ""
                            this.associated_header.associated_term_id = ""
                            this.associated_header.is_time_values = false
                            this.associated_header.selected = false
                            this.associated_header.is_numeric_values = false
                          }



                          let ass_headers_to_clean = data_model.associated_headers.filter(prop => prop.associated_linda_id.includes(linda_id) && !unique_field.includes(prop.associated_component_field))
                          for (let index = 0; index < ass_headers_to_clean.length; index++) {
                            const associated_header = ass_headers_to_clean[index];
                            for (let subindex = 0; subindex < associated_header.associated_linda_id.length; subindex++) {
                              this.clean_associated_header(associated_header, associated_header.associated_parent_id[subindex], associated_header.associated_linda_id[subindex], associated_header.associated_values[subindex])
                            }
                          }

                        }
                      }
                    );
                  }
                  //console.log(data_model)
                  let data_update: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
                  //console.log(data_update);
                  if (data_update['success']) {
                    this.extraction_component_field = values
                    this.extraction_component = this.get_component(values)
                    this.data_file = data_update['doc']
                  }
                }
              }
              else {
                //console.log(this.associated_header.associated_component_field)
                if (data_model.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_linda_id.length > 0) {
                  let linda_ids = data_model.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_linda_id
                  let parents_ids = data_model.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_parent_id
                  //console.log(linda_ids)
                  for (let index = 0; index < linda_ids.length; index++) {
                    const linda_id = linda_ids[index];
                    //console.log(linda_id)
                    await this.globalService.update_field("", linda_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
                      async update_data => {
                        data_model.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = []
                        data_model.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = []
                        data_model.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = []
                      }
                    );
                  }
                  let data: {} = await this.globalService.update_associated_headers(data_model._id, data_model.associated_headers, 'data_files').toPromise()
                  if (data['success']) {
                    this.data_file = data['doc']
                    this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: ''")
                    //this.component_extracted = true
                    this.extraction_component_field = values
                    this.extraction_component = this.get_component(values)
                  }
                }
              }
            }
            else {
              this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
              this.extraction_component_field = this.associated_header.associated_component_field
              this.extraction_component = this.associated_header.associated_component

            }
          }
        });
      }
    }

    else {
      this.extraction_component_field = values
      this.extraction_component = this.get_component(values)
    }

  }
  filteredByField(obj: {}) {
    if (obj[this.column_original_label] === this.current_study) {
      return true
    }
    else {
      return false;
    }

  }
  onChangeHeader(){
    this.generalForm.get('Header').enable()

  }
  async onSaveHeader(){
    this.while_added = true
    console.log(this.generalForm.get('Header').value)

    var header_value=this.generalForm.get('Header').value
    
    this.data_file.Data=this.data_file.Data.map((data)=>{
      data[header_value]=data[this.column_original_label]
      delete data[this.column_original_label]
      return data
    })
    console.log(this.data_file.Data)
    this.data_file.associated_headers.filter(associated_header=>associated_header.header===this.column_original_label)[0].header=header_value
    this.data_file.headers[this.data_file.headers.indexOf(this.column_original_label)]=header_value
    
    var data_model = { ...this.data_file };
    let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
    if (data['success']) {

      this.data_file = data['doc']
      //this.data_file = data_model
      this.alertService.success("you have changed header value " + this.column_original_label + " for " + header_value)
      this.component_extracted = true
      this.column_original_label=header_value
      this.generalForm.get('Header').setValue(this.column_original_label);
      this.generalForm.get('Header').disable()
      this.while_added=false

    }

      
    

    //let add_study_res = await this.globalService.add_multiple(header_value, this.data_file._key).toPromise()

  }


  /*STUDY PART ROUTINES*/

  async onExtractStudy(component_value, index: number) {
    this.while_added = true
    //console.log(component_value)
    //console.log(this.extraction_component)
    //console.log(this.extraction_component_field)
    if (this.extraction_component === "study") {
      if (this.extraction_component_field === "Study unique ID") {
        this.show_infos()
        /*  let study_model_dict = {}
         this.cleaned_study_model.forEach(attr => { study_model_dict[attr["key"]] = "" });
         var study_model = { ...study_model_dict };
         study_model['Study unique ID'] = component_value */
        //var data_model = { ...this.data_file };
        let study_model = new Study()
        study_model['Study unique ID'] = component_value
        study_model['Study Name'] = component_value
        if (!this.existing_studies_ids.includes(component_value)) {
          let add_study_res = await this.globalService.add(study_model, 'study', this.parent_id, false, this.group_key).toPromise()
          if (add_study_res["success"]) {
            //console.log(add_study_res)
            //console.log(add_study_res["message"])
            let study_id = add_study_res["_id"]
            this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(this.parent_id)
            this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(study_id)
            this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
            this.update_associated_headers(this.extraction_component_field)
            var data_model = { ...this.data_file };
            this.show_infos()
            data_model.Data.filter(line => line[this.column_original_label] === component_value).forEach(l => { l["Study linda ID"] = study_id });
            let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
            //console.log(data);
            //let data = await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').toPromise()
            if (data['success']) {
              this.while_added = false
              //console.log(data['doc']);
              this.data_file = data['doc']
              //this.data_file = data_model
              this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
              this.component_extracted = true
            }
            else{
              this.component_extracted = false
              this.alertService.error("you cannot created item type " + this.extraction_component + " called " + component_value)


            }
          }
        }
        else {
          this.while_added = false
          const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'link_study', model_type: "data_file" } });
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
              if (result.event == 'Confirmed') {
                const add_study_res = await this.globalService.get_lindaID_by_studyID(component_value, this.parent_id.split('/')[1]).toPromise()
                if (add_study_res['success']) {
                  let study_id = add_study_res["_id"]
                  this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(this.parent_id)
                  this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(study_id)
                  this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
                  this.update_associated_headers(this.extraction_component_field)
                  var data_model = { ...this.data_file };
                  this.show_infos()
                  data_model.Data.filter(line => line[this.column_original_label] === component_value).forEach(l => { l["Study linda ID"] = study_id });
                  let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
                  //console.log(data);
                  //let data = await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').toPromise()
                  if (data) {
                    this.while_added = false
                    //console.log(data['doc']);
                    //this.data_file = data['doc']
                    this.data_file = data_model
                    this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
                    this.component_extracted = true
                  }
                }
              }
              else {
                this.alertService.error("you cannot created study with same unique id : " + component_value)
              }
            }
          });

        }
      }
    }
  }
  async onExtractAllStudies() {
    this.while_added = true
    let values: StudyInterface[] = []
    let values_to_link: string[] = []
    let parent_ids: string[] =[]
    for (let index = 0; index < this.detected_values.length; index++) {
      const element = this.detected_values[index];
      if (!this.existing_studies_ids.includes(element)) {
        values.push(new Study(element))
      }
      else {
        values_to_link.push(element)
      }
      parent_ids.push(this.parent_id)
    }
    
    if (values.length > 0) {
      let add_study_res = await this.globalService.add_multiple(values, 'study', this.parent_id, false, this.group_key, this.data_file._key, this.column_original_label, 'Study unique ID', parent_ids).toPromise()
      if (add_study_res['success']) {
        // if some studies are already present (values_to_link >0), just link the asssociated heaers to the corresponding study_id
        if (values_to_link.length !== 0) {
          const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'link_study', model_type: "data_file" } });
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
              if (result.event == 'Confirmed') {
                let keys: string[] = []
                for (let index = 0; index < values_to_link.length; index++) {
                  const element = values_to_link[index];
                  const add_study_res = await this.globalService.get_lindaID_by_studyID(element, this.parent_id.split('/')[1]).toPromise()
                  if (add_study_res['success']) {
                    keys.push(add_study_res["_id"].split("/")[1])
                  }
                }
                const res = await this.globalService.update_multiple_field(values_to_link, this.parent_id, keys, this.extraction_component_field, "study", this.data_file._key, this.column_original_label, this.extraction_component_field).toPromise()
                if (res['success']) {
                  this.data_file = res['datafile']
                }
              }
            }
          });
        }
        else {
          this.data_file = add_study_res['datafile']
        }
        this.while_added = false
      }
    }
    else {
      if (values_to_link.length !== 0) {
        const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'link_study', model_type: "data_file" } });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            if (result.event == 'Confirmed') {
              let keys: string[] = []
              for (let index = 0; index < values_to_link.length; index++) {
                const element = values_to_link[index];
                const add_study_res = await this.globalService.get_lindaID_by_studyID(element, this.parent_id.split('/')[1]).toPromise()
                if (add_study_res['success']) {
                  keys.push(add_study_res["_id"].split("/")[1])
                }
              }
              const res = await this.globalService.update_multiple_field(values_to_link, this.parent_id, keys, this.extraction_component_field, "study", this.data_file._key, this.column_original_label, this.extraction_component_field).toPromise()
              if (res['success']) {
                this.data_file = res['datafile']
              }
            }
          }
        });
      }
      this.while_added = false
    }
  }
  async onRemoveStudy(component_value: string, index: number) {

    //let study_id = this.detected_ids[index]
    let study_id = this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(component_value)]
    this.globalService.remove(study_id).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          this.show_infos()
          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== study_id);
          this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
          this.data_file.associated_headers.filter(prop => prop.associated_component === "study").forEach(associated_header => {
            this.clean_associated_header(associated_header, this.parent_id, study_id, component_value)
          })
          // Clean all associated header with this study id in  linda id
          var data_model = { ...this.data_file };
          data_model.Data.filter(line => line[this.column_original_label] === component_value).forEach(l => { l["Study linda ID"] = "" });
          let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
          if (data) {
            this.while_added = false
            this.data_file = data['doc']
            this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
            this.component_extracted = false
            this.show_infos()
          }
        }
      }
    );
  }
  async onRemoveAllStudies() {
    let study_ids = this.associated_header.associated_linda_id
    this.globalService.remove_multiple(study_ids).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          //console.log(remove_result)
        }
      })
  }
  async onLinkStudy(component_value: string, _component_id: string, index: number) {
    let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(_component_id)]
    // update field Experimental site name with values in column
    await this.globalService.update_field(component_value, study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(
      async data => {
        // when user add column, id was already added
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(study_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(this.parent_id)
        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => {
            //console.log(data);
            this.data_file = data['doc']
            this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
            this.component_extracted = true
          }
        );
      }
    );


  }
  async onLinkAllStudies() {
    this.while_added = true
    //console.log(this.detected_values)
    //console.log(this.detected_ids)
    //console.log(this.detected_studies)
    let keys: string[] = []
    for (let index = 0; index < this.detected_studies.length; index++) {
      const element = this.detected_studies[index];
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(element)]
      keys.push(study_id.split("/")[1])
    }
    //console.log(this.detected_studies)
    //console.log(keys)
    const res = await this.globalService.update_multiple_field(this.detected_values, this.parent_id, keys, this.extraction_component_field, "study", this.data_file._key, this.column_original_label, this.extraction_component_field).toPromise()
    //console.log(res)
    if (res['success']) {
      this.data_file = res['datafile']
      this.while_added = false
    }


  }
  async onUnlinkStudy(component_value: string, _component_id: string, index: number) {
    //console.log(component_value)
    //console.log(_component_id)
    //console.log(index)
    //console.log(this.extraction_component)
    //console.log(this.extraction_component_field)
    if (["Experimental site name", "Start date of study", "Study title", "End date of study", "Study Name", "Study description", "Contact institution", "Geographic location (latitude)", "Geographic location (country)", "Geographic location (altitude)", "Geographic location (longitude)"].includes(this.extraction_component_field)) {
      // update field Experimental site name with values in column using study name
      //let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(_component_id)]
      //let study_id =this.get_associated_header_linda_id_by_study_id(_component_id, index)
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(_component_id)]

      await this.globalService.update_field("", study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(
        async data => {
          //console.log(data);
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== study_id)
          // when user add column, id was already added
          /* if (this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id[index] !== study_id) {
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(study_id)
          } */
          let associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.indexOf(study_id)
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.slice(associated_value_index, 1);
          ///this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push("")
          this.update_associated_headers(this.extraction_component_field)
          var data_model = { ...this.data_file };
          await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
            data => {
              //console.log(data);
              this.data_file = data['doc']
              ///this.Selection = []
              //this.checklistSelection = new SelectionModel<string>(true, this.Selection);
              this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
              /* this.studies_to_remove = [] */
              this.component_extracted = true
            }
          );
        }
      );
    }

  }
  async onUnlinkAllStudies() {
  }
  has_study_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID').length > 0
  }
  get study_associated_header() {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID')[0]
  }


  /*EVENT PART ROUTINES*/
  async onExtractAllEvents() {
    this.while_added = true
    let values: LindaEvent[] = []
    let values_to_link: string[] = []
    let keys: string[] = []
    let parent_ids: string[] = []
    for (let index = 0; index < this.detected_studies.length; index++) {
      const element = this.detected_studies[index];
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(element)]
      keys.push(study_id.split("/")[1])
      parent_ids.push(study_id)
      let event_model = new LindaEvent()
      event_model['Event accession number'] = this.detected_values[index]
      values.push(event_model)
    }
    let add_event_res = await this.globalService.add_multiple(values, 'event', this.parent_id, false, this.group_key, this.data_file._key, this.column_original_label, this.extraction_component_field, parent_ids).toPromise()
    if (add_event_res['success']) {
      this.data_file = add_event_res['datafile']
      this.while_added = false
    }

  }
  async onExtractEvent(_study_id, component_value, index: number) {
    this.while_added = false
    let event_model = new LindaEvent()
    event_model['Event accession number'] = component_value
    const res = await this.globalService.add(event_model, 'event', _study_id, false, this.group_key).toPromise()
    if (res["success"]) {
      let component_id = res["_id"]
      //console.log(component_id)
      this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(component_id)
      this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
      this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(_study_id)
      this.update_associated_headers(this.extraction_component_field)
      var data_model = { ...this.data_file };
      let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
      if (data) {
        this.while_added = false
        this.data_file = data['doc']
        this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
        this.component_extracted = true
      }

    }

  }
  async onRemoveEvent(_study_id, component_value: string, index: number) {
    //console.log(this.detected_ids)
    let event_id = this.associated_header.associated_linda_id[this.associated_header.associated_parent_id.indexOf(_study_id)]
    //let event_id = this.detected_ids[index]
    console.warn("detected event id: ", event_id, "index: ", index)

    this.globalService.remove(event_id).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          //this.detected_studies.filter(detected_study => detected_study !== component_value)
          //console.log(remove_result)
          this.show_infos()
          this.associated_header.associated_parent_id.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)
          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== event_id);
          //this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
          this.associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)

          if (this.associated_header.associated_values.length === 0) {
            this.associated_header.associated_component = ""
            this.associated_header.associated_component_field = ""
            this.associated_header.associated_term_id = ""
            this.associated_header.is_time_values = false
            this.associated_header.selected = false
            this.associated_header.is_numeric_values = false
          }
          this.data_file.associated_headers.filter(prop => prop.associated_linda_id.includes(event_id)).forEach(associated_header => {
            //associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== event_id);
            //associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)
            this.clean_associated_header(associated_header, _study_id, event_id, component_value)
          })
          //console.log(this.data_file.associated_headers)
          // Clean all associated header with this study id in  linda id
          var data_model = { ...this.data_file };
          let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
          //console.log(data);
          if (data) {
            this.while_added = false
            //console.log(data['doc']);
            this.data_file = data['doc']
            this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
            this.component_extracted = false
            //console.log(component_value)
            this.show_infos()
          }
        }
      }
    );
  }
  async onLinkEvent(component_value: string, _study_id: string, _component_id: string) {
    if (["Event date", "Event type", "Event description"].includes(this.extraction_component_field)) {
      if (this.has_event_associated_header()) {
        // more than one event is defined in this file
        this.globalService.update_field(component_value, _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
          update_data => {
            //console.log(update_data);
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(_component_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.push(_study_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
            this.update_associated_headers(this.extraction_component_field)
            var data_model = { ...this.data_file };
            this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              data => {
                this.data_file = data['doc']
                this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
                this.component_extracted = true
              });
          });
      }
      else {
        this.alertService.error('You do not have any event defined')
      }
    }

  }
  async onUnlinkEvent(component_value: string, _parent_id: string, _component_id: string) {
    if (["Event date", "Event type", "Event description"].includes(this.extraction_component_field)) {
      if (this.has_event_associated_header()) {
        // more than one event is defined in this file
        this.globalService.update_field("", _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
          async update_data => {
            let associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.indexOf(_component_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.filter(parent_id => parent_id !== _parent_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== _component_id)
            // when user add column, id was already added
            /* if (this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id[index] !== study_id) {
              this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(study_id)
            } */
            let tmp_list = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values
            tmp_list.forEach((element, index) => {
              if (index == associated_value_index) tmp_list.splice(index, 1);
            });
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = tmp_list
            //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.slice(associated_value_index, 1);
            ///this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push("")
            //this.update_associated_headers(this.extraction_component_field)
            var data_model = { ...this.data_file };
            await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              data => {
                this.data_file = data['doc']
                ///this.Selection = []
                //this.checklistSelection = new SelectionModel<string>(true, this.Selection);
                this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
                /* this.studies_to_remove = [] */
                this.component_extracted = true
              }
            );


          }
        );
      }
    }

  }
  get filter_event_associated_headers() {
    // let accepted_component_field=["Study unique ID", "Experimental Factor accession number", "Event accession number"]
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === "Event accession number" && associated_header.associated_linda_id.length > 0)
  }
  get detected_events(): AssociatedHeadersInterface[] {

    if (this.has_event_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Event accession number')
    }
    else {
      return []
    }
  }
  get filter_detected_events(): AssociatedHeadersInterface[] {
    return this.detected_events.filter(detected_event =>
      detected_event.associated_linda_id.filter(x => !this.selected_value.ids.includes(x)).length === 0
    )
  }
  has_event_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Event accession number').length > 0
  }
  /*ExperimentalFactor PART ROUTINES*/
  async onExtractAllExperimentalFactors() {
    this.while_added = true
    let values: ExperimentalFactor[] = []
    let values_to_link: string[] = []
    let keys: string[] = []
    let parent_ids: string[] = []
    for (let index = 0; index < this.detected_studies.length; index++) {
      const element = this.detected_studies[index];
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(element)]
      keys.push(study_id.split("/")[1])
      parent_ids.push(study_id)
      let factor_model = new ExperimentalFactor()
      factor_model['Experimental Factor accession number'] = this.detected_values[index]
      values.push(factor_model)
    }
    let add_factor_res = await this.globalService.add_multiple(values, 'experimental_factor', this.parent_id, false, this.group_key, this.data_file._key, this.column_original_label, this.extraction_component_field, parent_ids).toPromise()
    if (add_factor_res['success']) {
      this.data_file = add_factor_res['datafile']
      this.while_added = false
    }

  }
  async onExtractExperimentalFactor(_parent_id, component_value, index: number) {
    if (this.extraction_component_field === "Experimental Factor accession number") {
      let experimental_factor_model = new ExperimentalFactor()
      experimental_factor_model['Experimental Factor accession number'] = component_value
      const res = await this.globalService.add(experimental_factor_model, 'experimental_factor', _parent_id, false, this.group_key).toPromise()
      //this.globalService.add(event_model, 'event', this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(this.detected_studies[index])], false, this.group_key).pipe(first()).toPromise().then(
      if (res["success"]) {
        let component_id = res["_id"]
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(component_id)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(_parent_id)

        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
        //console.log(data);
        if (data) {
          this.while_added = false
          this.data_file = data['doc']
          this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
          this.component_extracted = true
        }
        /* this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => { */

        /* }); */
      }

      /* if (!(await this.check_exists(component_value, 'Experimental Factor accession number', 'experimental_factor', this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(this.get_existing_studies_ids[index])]))) {
        this.globalService.add(experimental_factor_model, 'experimental_factor', this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(this.get_existing_studies_ids[index])], false, this.group_key).pipe(first()).toPromise().then(
          res => {
            if (res["success"]) {
              let component_id = res["_id"]
              this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(component_id)
              this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
              this.update_associated_headers(this.extraction_component_field)
              var data_model = { ...this.data_file };
              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                data => {
                  this.data_file = data['doc']
                  this.while_added = false
                  this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
                  this.component_extracted = true

                }
              );
            }
          }
        );
      } */

    }
  }
  async onRemoveExperimentalFactor(_parent_id, component_value: string, index: number) {
    //console.log(this.detected_ids)
    let component_id = this.associated_header.associated_linda_id[this.associated_header.associated_parent_id.indexOf(_parent_id)]
    //let event_id = this.detected_ids[index]
    console.warn("detected factor id: ", component_id, "index: ", index)

    this.globalService.remove(component_id).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          //this.detected_studies.filter(detected_study => detected_study !== component_value)
          //console.log(remove_result)
          this.show_infos()
          this.associated_header.associated_parent_id.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)
          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== component_id);
          //this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
          this.associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)

          if (this.associated_header.associated_values.length === 0) {
            this.associated_header.associated_component = ""
            this.associated_header.associated_component_field = ""
            this.associated_header.associated_term_id = ""
            this.associated_header.is_time_values = false
            this.associated_header.selected = false
            this.associated_header.is_numeric_values = false
          }
          this.data_file.associated_headers.filter(prop => prop.associated_linda_id.includes(component_id)).forEach(associated_header => {
            //associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== event_id);
            //associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)
            this.clean_associated_header(associated_header, _parent_id, component_id, component_value)
          })
          //console.log(this.data_file.associated_headers)
          // Clean all associated header with this study id in  linda id
          var data_model = { ...this.data_file };
          let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
          //console.log(data);
          if (data) {
            this.while_added = false
            //console.log(data['doc']);
            this.data_file = data['doc']
            this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
            this.component_extracted = false
            //console.log(component_value)
            this.show_infos()
          }
        }
      }
    );
  }
  async onLinkExperimentalFactorValues(component_values: string[], _study_id: string, _component_id: string) {
    if (this.extraction_component_field === "Experimental Factor values") {
      //let exp_factor_id = this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(_component_id)]
      let values = ''
      for (let index = 0; index < component_values.length; index++) {
        if (index === 0) {
          values += component_values[index] + ''
        }
        else {
          values += ';' + component_values[index]
        }
      }
      if (this.has_experimental_factor_associated_header()) {
        let exp_factor_id = _component_id
        this.globalService.update_field(values, exp_factor_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
          update_data => {
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(exp_factor_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(values)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.push(_study_id)
            this.update_associated_headers(this.extraction_component_field)
            var data_model = { ...this.data_file };
            this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              data => {
                this.data_file = data['doc']
                this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + values)
                this.component_extracted = true
              }
            );
          });
      }
      else {
        this.alertService.error('You do not have any factor defined')
      }

    }
  }
  async onLinkExperimentalFactor(component_value: string, _study_id: string, _component_id: string) {
    //let exp_factor_id = this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(_component_id)]
    if (this.has_experimental_factor_associated_header()) {
      this.globalService.update_field(component_value, _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
        update_data => {
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(_component_id)
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.push(_study_id)
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
          this.update_associated_headers(this.extraction_component_field)
          var data_model = { ...this.data_file };
          this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
            data => {
              this.data_file = data['doc']
              this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
              this.component_extracted = true
            }
          );
        }
      );
    }
    else {
      this.alertService.error('You do not have any factor defined')
    }
  }
  async onUnlinkExperimentalFactorValues(component_values: string[], _parent_id: string, _component_id: string) {
    if (this.has_experimental_factor_associated_header()) {
      // one or more event(s) are defined in this file
      this.globalService.update_field("", _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
        async update_data => {
          const associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.indexOf(_component_id)
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.filter(parent_id => parent_id !== _parent_id)
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== _component_id)
          let tmp_list = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values
          tmp_list.forEach((element, index) => {
            if (index == associated_value_index) tmp_list.splice(index, 1);
          });
          this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = tmp_list
          var data_model = { ...this.data_file };
          await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
            data => {
              this.data_file = data['doc']
              this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_values)
              this.component_extracted = true
            }
          );
        }
      );
    }
  }
  async onUnlinkExperimentalFactor(component_value: string, _parent_id: string, _component_id: string) {
    if (["Experimental Factor description", "Experimental Factor type"].includes(this.extraction_component_field)) {
      if (this.has_experimental_factor_associated_header()) {
        // one or more experimental factor(s) are defined in this file
        this.globalService.update_field("", _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
          async update_data => {
            const associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.indexOf(_component_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.filter(parent_id => parent_id !== _parent_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== _component_id)
            let tmp_list = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values
            tmp_list.forEach((element, index) => {
              if (index == associated_value_index) tmp_list.splice(index, 1);
            });
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = tmp_list
            var data_model = { ...this.data_file };
            await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              data => {
                this.data_file = data['doc']
                this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
                this.component_extracted = true
              }
            );
          }
        );
      }
    }
  }
  has_component_linked_id(_parent_id: string, linked_id: string) {

    return this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.includes(linked_id)

    //let associated_linda_id_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.indexOf(_parent_id)
    //return this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id[associated_linda_id_index] === linked_id
  }
  get filter_experimental_factor_associated_headers() {
    // let accepted_component_field=["Study unique ID", "Experimental Factor accession number", "Event accession number"]
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === "Experimental Factor accession number" && associated_header.associated_linda_id.length > 0)
  }
  get detected_factors(): AssociatedHeadersInterface[] {
    if (this.has_experimental_factor_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Experimental Factor accession number')
    }
    else {
      return []
    }
  }
  get filter_detected_factors(): AssociatedHeadersInterface[] {
    return this.detected_factors.filter(detected_factor =>
      detected_factor.associated_linda_id.filter(x => !this.selected_value.ids.includes(x)).length === 0
    )
  }
  has_experimental_factor_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Experimental Factor accession number').length > 0
  }





  /*Environment PART ROUTINES*/
  /*EVENT PART ROUTINES*/
  async onExtractAllEnvironments(){
    this.while_added = true
    let values: Environment[] = []
    let values_to_link: string[] = []
    let keys: string[] = []
    let parent_ids: string[] = []
    for (let index = 0; index < this.detected_studies.length; index++) {
      const element = this.detected_studies[index];
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(element)]
      keys.push(study_id.split("/")[1])
      parent_ids.push(study_id)
      let env_model = new Environment()
      env_model['Environment parameter accession number'] = this.detected_values[index]
      values.push(env_model)
    }
    let add_env_res = await this.globalService.add_multiple(values, 'environment', this.parent_id, false, this.group_key, this.data_file._key, this.column_original_label, this.extraction_component_field, parent_ids).toPromise()
    if (add_env_res['success']) {
      this.data_file = add_env_res['datafile']
      this.while_added = false
    }
  }
  async onExtractEnvironment(_study_id, component_value, index: number) {
    //let _study_id=this.get_associated_study(component_value, index)
    //console.log(_study_id)
    this.while_added = false
    if (this.extraction_component_field === "Environment parameter accession number") {
      let env_model = new Environment()
      env_model['Environment parameter accession number'] = component_value
      const res = await this.globalService.add(env_model, 'environment', _study_id, false, this.group_key).toPromise()
      if (res["success"]) {
        let component_id = res["_id"]
        //console.log(component_id)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(component_id)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(_study_id)

        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
        //console.log(data);
        if (data) {
          this.while_added = false
          this.data_file = data['doc']
          this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
          this.component_extracted = true
        }
      }
    }

  }
  async onRemoveEnvironment(_study_id, component_value: string, index: number) {
    //console.log(this.detected_ids)
    let component_id = this.associated_header.associated_linda_id[this.associated_header.associated_parent_id.indexOf(_study_id)]
    //let event_id = this.detected_ids[index]
    console.warn("detected event id: ", component_id, "index: ", index)

    this.globalService.remove(component_id).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          //this.detected_studies.filter(detected_study => detected_study !== component_value)
          //console.log(remove_result)
          this.show_infos()
          this.associated_header.associated_parent_id.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)
          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== component_id);
          //this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
          this.associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)

          if (this.associated_header.associated_values.length === 0) {
            this.associated_header.associated_component = ""
            this.associated_header.associated_component_field = ""
            this.associated_header.associated_term_id = ""
            this.associated_header.is_time_values = false
            this.associated_header.selected = false
            this.associated_header.is_numeric_values = false
          }
          this.data_file.associated_headers.filter(prop => prop.associated_linda_id.includes(component_id)).forEach(associated_header => {
            //associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== event_id);
            //associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)
            this.clean_associated_header(associated_header, _study_id, component_id, component_value)
          })
          //console.log(this.data_file.associated_headers)
          // Clean all associated header with this study id in  linda id
          var data_model = { ...this.data_file };
          let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
          //console.log(data);
          if (data) {
            this.while_added = false
            //console.log(data['doc']);
            this.data_file = data['doc']
            this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
            this.component_extracted = false
            //console.log(component_value)
            this.show_infos()
          }
        }
      }
    );
  }
  has_environment_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Environment parameter accession number').length > 0
  }
  async onLinkEnvironment(component_value: string, _study_id: string, _component_id: string) {
    this.globalService.update_field(component_value, _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
      update_data => {
        //console.log(update_data);
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(_component_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.push(_study_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => {
            //console.log(data);
            this.data_file = data['doc']
            this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
            this.component_extracted = true
          });
      });


  }
  async onUnlinkEnvironment(component_value: string, _parent_id: string, _component_id: string) {
    //console.log(component_value)
    //console.log(_parent_id)
    //console.log(_component_id)
    // more than one event is defined in this file
    this.globalService.update_field("", _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
      async update_data => {
        let associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.indexOf(_component_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.filter(parent_id => parent_id !== _parent_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== _component_id)
        let tmp_list = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values
        tmp_list.forEach((element, index) => {
          if (index == associated_value_index) tmp_list.splice(index, 1);
        });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = tmp_list
        //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.slice(associated_value_index, 1);
        ///this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push("")
        //this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => {
            //console.log(data);
            this.data_file = data['doc']
            this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
            this.component_extracted = true
          });
      });


  }
  get filter_environment_associated_headers() {
    // let accepted_component_field=["Study unique ID", "Experimental Factor accession number", "Event accession number"]
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === "Environment parameter accession number" && associated_header.associated_linda_id.length > 0)
  }
  get detected_environments(): AssociatedHeadersInterface[] {
    if (this.has_environment_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Environment parameter accession number')
    }
    else {
      return []
    }
  }
  get filter_detected_environments(): AssociatedHeadersInterface[] {
    return this.detected_environments.filter(detected_environment =>
      detected_environment.associated_linda_id.filter(x => !this.selected_value.ids.includes(x)).length === 0
    )
  }


  
  /*Observed variable PART ROUTINES*/
  async onExtractAllObservedVariables(){
    this.while_added = true
    let values: ObservedVariable[] = []
    let values_to_link: string[] = []
    let keys: string[] = []
    let parent_ids: string[] = []
    for (let index = 0; index < this.detected_studies.length; index++) {
      const element = this.detected_studies[index];
      let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(element)]
      keys.push(study_id.split("/")[1])
      parent_ids.push(study_id)
      let env_model = new ObservedVariable()
      env_model['Variable accession number'] = this.detected_values[index]
      values.push(env_model)
    }
    let add_env_res = await this.globalService.add_multiple(values, 'observed_variable', this.parent_id, false, this.group_key, this.data_file._key, this.column_original_label, this.extraction_component_field, parent_ids).toPromise()
    if (add_env_res['success']) {
      this.data_file = add_env_res['datafile']
      this.while_added = false
    }
  }
  async onExtractObservedVariable(_study_id, component_value, index: number) {
    //let _study_id=this.get_associated_study(component_value, index)
    //console.log(_study_id)
    this.while_added = false
    if (this.extraction_component_field === "Variable accession number") {
      let env_model = new ObservedVariable()
      env_model['Variable accession number'] = component_value
      const res = await this.globalService.add(env_model, 'observed_variable', _study_id, false, this.group_key).toPromise()
      if (res["success"]) {
        let component_id = res["_id"]
        //console.log(component_id)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(component_id)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
        this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_parent_id.push(_study_id)

        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
        //console.log(data);
        if (data) {
          this.while_added = false
          this.data_file = data['doc']
          this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
          this.component_extracted = true
        }
      }
    }

  }
  async onRemoveObservedVariable(_study_id, component_value: string, index: number) {
    //console.log(this.detected_ids)
    let component_id = this.associated_header.associated_linda_id[this.associated_header.associated_parent_id.indexOf(_study_id)]
    //let event_id = this.detected_ids[index]
    console.warn("detected event id: ", component_id, "index: ", index)

    this.globalService.remove(component_id).pipe(first()).toPromise().then(
      async remove_result => {
        if (remove_result["success"]) {
          //this.detected_studies.filter(detected_study => detected_study !== component_value)
          //console.log(remove_result)
          this.show_infos()
          this.associated_header.associated_parent_id.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)
          this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== component_id);
          //this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
          //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
          this.associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(component_id), 1)

          if (this.associated_header.associated_values.length === 0) {
            this.associated_header.associated_component = ""
            this.associated_header.associated_component_field = ""
            this.associated_header.associated_term_id = ""
            this.associated_header.is_time_values = false
            this.associated_header.selected = false
            this.associated_header.is_numeric_values = false
          }
          this.data_file.associated_headers.filter(prop => prop.associated_linda_id.includes(component_id)).forEach(associated_header => {
            //associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== event_id);
            //associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(event_id), 1)
            this.clean_associated_header(associated_header, _study_id, component_id, component_value)
          })
          //console.log(this.data_file.associated_headers)
          // Clean all associated header with this study id in  linda id
          var data_model = { ...this.data_file };
          let data: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
          //console.log(data);
          if (data) {
            this.while_added = false
            //console.log(data['doc']);
            this.data_file = data['doc']
            this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
            this.component_extracted = false
            //console.log(component_value)
            this.show_infos()
          }
        }
      }
    );
  }
  has_observed_variable_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Variable accession number').length > 0
  }
  async onLinkObservedVariable(component_value: string, _study_id: string, _component_id: string) {
    this.globalService.update_field(component_value, _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
      update_data => {
        //console.log(update_data);
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(_component_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.push(_study_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
        this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => {
            //console.log(data);
            this.data_file = data['doc']
            this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
            this.component_extracted = true
          });
      });


  }
  async onUnlinkObservedVariable(component_value: string, _parent_id: string, _component_id: string) {
    //console.log(component_value)
    //console.log(_parent_id)
    //console.log(_component_id)
    // more than one event is defined in this file
    this.globalService.update_field("", _component_id.split("/")[1], this.extraction_component_field, this.extraction_component).pipe(first()).toPromise().then(
      async update_data => {
        let associated_value_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.indexOf(_component_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.filter(parent_id => parent_id !== _parent_id)
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.filter(linda_id => linda_id !== _component_id)
        let tmp_list = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values
        tmp_list.forEach((element, index) => {
          if (index == associated_value_index) tmp_list.splice(index, 1);
        });
        this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = tmp_list
        //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.slice(associated_value_index, 1);
        ///this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push("")
        //this.update_associated_headers(this.extraction_component_field)
        var data_model = { ...this.data_file };
        await this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
          data => {
            //console.log(data);
            this.data_file = data['doc']
            this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
            this.component_extracted = true
          });
      });


  }
  get filter_observed_variable_associated_headers() {
    // let accepted_component_field=["Study unique ID", "Experimental Factor accession number", "Event accession number"]
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === "Variable accession number" && associated_header.associated_linda_id.length > 0)
  }
  get detected_observed_variables(): AssociatedHeadersInterface[] {
    if (this.has_observed_variable_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Variable accession number')
    }
    else {
      return []
    }
  }
  get filter_detected_observed_variables(): AssociatedHeadersInterface[] {
    return this.detected_observed_variables.filter(detected_observed_variable =>
      detected_observed_variable.associated_linda_id.filter(x => !this.selected_value.ids.includes(x)).length === 0
    )
  }

  /*Observation unit PART ROUTINES*/

  /*Biological material PART ROUTINES*/
  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  itemSelectionToggle(value: string): void {
    this.checklistSelection.toggle(value);
    //console.log(this.checklistSelection.selected)
  }

  get_component_linked_id(_parent_id: string, linked_id: string) {
    if (this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.includes(linked_id)) {
      let associated_linda_id_index = this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_parent_id.indexOf(_parent_id)

      return this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id[associated_linda_id_index]

    }
    else {
      return "not defined"
    }

  }
  async onLinkComponent(values: SelectValue) {
    //console.log(values)
    values['parents'] = []
    await Promise.all(values.ids.map(async (element, index) => {
      if (element.includes("studies")) {
        values['parents'].push(element)
        //this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===element).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});
      }
      else {
        await this.globalService.get_parent(element).toPromise().then(parent_data => {
          if (parent_data) {
            values['parents'].push(parent_data['_from'])
          }
          else {
            this.linked = false
          }
        })
        // this.tmp_data_file.Data.filter(line=>line["Study linda ID"]===parent_data['_from']).forEach(l=>{l[this.header.value]=this.aliases.controls[index].value});  
      }
    }));
    this.selected_value = values
    //console.log(values)
    this.linked = true
  }
  get get_linked() {
    return this.linked
  }



  async check_exists(model_id: string, field: string, model_type: string, parent_id: string) {
    //console.log(model_id)
    const data = await this.globalService.is_exist(field, model_id, model_type, parent_id).pipe(first()).toPromise();
    //console.log(data)
    if (model_id === "") {
      return false;
    }
    if (!data["success"]) {
      //this.component_already_there = true
      this.alertService.error("this " + field + " is already used. You cannot integrate this project in Linda cause a project with the same unique id exists !! ");
    }
    return data["success"] ? false : data["success"];
  }
  get_data_by_header(header: string) {
    let column_values = []
    this.data_file.Data.forEach(row => {
      column_values.push(row[header])
    })
    return column_values
  }
  get_data_by_headers(study_header: string, header: string, study_id: string) {
    let column_values = []
    this.data_file.Data.forEach(row => {
      if (row[study_header] === study_id) {
        column_values.push(row[header])
      }
    })
    return column_values
  }





  clean_associated_header(_associated_header: AssociatedHeadersInterface, _parent_id: string, _component_id: string, _component_value) {
    //console.log(_associated_header)

    if (this.extraction_component_field === 'Study unique ID') {
      _associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== _component_value);
    }
    else {
      _associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(_component_id), 1)
      //console.log(_associated_header)
    }
    _associated_header.associated_parent_id = this.associated_header.associated_parent_id.filter(parent_id => parent_id !== _parent_id);
    _associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== _component_id);

    if (_associated_header.associated_values.length === 0) {
      _associated_header.associated_component = ""
      _associated_header.associated_component_field = ""
      _associated_header.associated_term_id = ""
      _associated_header.is_time_values = false
      _associated_header.selected = false
      _associated_header.is_numeric_values = false
    }
    //console.log(_associated_header)
  }
  clean_associated_header_by_index(_associated_header: AssociatedHeadersInterface, index: number) {
    _associated_header.associated_linda_id.splice(index, 1)
    _associated_header.associated_values.splice(index, 1)
    if (_associated_header.associated_values.length === 0) {
      _associated_header.associated_component = ""
      _associated_header.associated_component_field = ""
      _associated_header.associated_term_id = ""
      _associated_header.is_time_values = false
      _associated_header.selected = false
      _associated_header.is_numeric_values = false
    }
    //console.log(_associated_header)
  }
  // use when users remove study unique ID in a datafile
  // All studies and childs will be removed and all associated header will be cleaned 
  clean_all_associated_headers() {
    this.data_file.associated_headers.forEach(prop => { prop.selected = false; });
    this.data_file.associated_headers.forEach(prop => { prop.associated_term_id = "" });
    this.data_file.associated_headers.forEach(prop => { prop.associated_component = ""; });
    this.data_file.associated_headers.forEach(prop => { prop.associated_component_field = ""; });
    this.data_file.associated_headers.forEach(prop => { prop.is_time_values = false; });
    this.data_file.associated_headers.forEach(prop => { prop.associated_linda_id = []; });
    this.data_file.associated_headers.forEach(prop => { prop.associated_values = []; });
  }
  // use when users remove field other than study unique ID in a datafile
  // All components will be removed and current associated header will be cleaned 
  clean_current_associated_headers() {
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.selected = false; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_term_id = "" });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component = ""; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_component_field = ""; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.is_time_values = false; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_linda_id = []; });
    this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values = []; });
  }
  update_associated_headers(values: string) {
    //console.log(values)
    //console.log(this.column_original_label)
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


  get_study_associated_header_values(key: string): string {
    if (this.study_associated_header.associated_values.filter(value => value === key).length > 0) {
      return this.study_associated_header.associated_values.filter(value => value === key)[0]
    }
    else {
      return ""
    }
  }
  get_associated_header_linda_id(key: string, index: number) {
    if (this.associated_header.associated_linda_id.filter(value => value === key).length > 0) {
      return this.associated_header.associated_linda_id.filter(value => value === key)[0]
    }
    else {
      return ""
    }
  }
  get_associated_header_value_by_linda_id(key: string, index: number) {
    if (this.associated_header.associated_values[index]) {
      return this.associated_header.associated_values[index]
      //return this.associated_header.associated_linda_id.filter(value => value === key)[0]
    }
    else {
      return ""
    }
  }
  get_associated_header_linda_id_by_value(key: string, index: number) {
    if (this.data_file.associated_headers.filter(associated_header => associated_header.associated_values.includes(key)).length > 0) {

      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_values.includes(key))[0].associated_linda_id[index]
    }
    /*     if (this.associated_header.associated_values.filter(value => value === key).length > 0) {
          //console.log(this.associated_header.associated_values.filter(value => value === key))
          return this.associated_header.associated_linda_id[index]
          //return this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(this.associated_header.associated_values.filter(value => value === key)[0])]
        } */
    else {
      return ""
    }
  }
  get_associated_header_linda_id_by_study_id(study_unique_id: string) {
    ////console.log(this.study_associated_header)
    let study_linda_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(study_unique_id)]
    return this.associated_header.associated_linda_id.filter(linda_id => linda_id === study_linda_id)[0]
  }
  get associated_header(): AssociatedHeadersInterface {
    return this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0]
  }

  has_associated_header_value(key: string, study_unique_id: string, index: number) {
    return this.associated_header.associated_values.filter(value => value === key).length > 0 && this.associated_header.associated_values[index] === key
  }
  has_associated_header_linda_id_by_study_id(study_unique_id: string, index: number) {
    let study_linda_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(study_unique_id)]
    return this.associated_header.associated_linda_id.filter(linda_id => linda_id === study_linda_id).length > 0
  }
  has_associated_header_linda_id_by_value(_value: string) {
    ////console.log(_value)
    let found = true
    this.data_file.Data.filter(line => line[this.column_original_label] === _value).forEach(l => {
      if (l["Study linda ID"] === "") {
        found = false
      }
    })
    return found
    /* /////console.log(this.associated_header.associated_linda_id.filter(value => value === _value))
    if (this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(this.associated_header.associated_values.filter(value => value === _value)[0])]) {
      return true
      //return this.associated_header.associated_linda_id.filter(value => value === key)[0]
    }
    else {
      return false
    } */
    //return this.associated_header.associated_linda_id.filter(value => value === key).length !== 0
  }
  has_associated_header_parent_id_by_index(_parent_id: string, index: number) {
    return this.associated_header.associated_parent_id.filter(parent_id => parent_id === _parent_id).length > 0
  }
  has_associated_header_linda_id_by_index(key: string, index: number) {
    // key is the value
    //console.log('index in has_associated_header_linda_id_by_index', index)
    //console.log('key in has_associated_header_linda_id_by_index', key)
    //console.log('this.associated_header.associated_linda_id in has_associated_header_linda_id_by_index', this.associated_header.associated_linda_id)

    /////console.log(this.associated_header.associated_linda_id.filter(value => value === key))
    if (this.associated_header.associated_linda_id[index]) {
      return true
      //return this.associated_header.associated_linda_id.filter(value => value === key)[0]
    }
    else {
      return false
    }
    //return this.associated_header.associated_linda_id.filter(value => value === key).length !== 0
  }
  has_associated_headers_linda_id_by_value(key: string) {
    ////console.log(key)
    /////console.log(this.associated_header.associated_linda_id.filter(value => value === key))

    //this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(this.associated_header.associated_values.filter(value => value === key)[0])]
    let found = false
    this.data_file.associated_headers.forEach(associated_header => {
      if (associated_header.associated_values.filter(value => value === key).length !== 0) {
        if (associated_header.associated_linda_id[associated_header.associated_values.indexOf(associated_header.associated_values.filter(value => value === key)[0])]) {
          found = true
        }
      }
    })
    return found


    //return this.associated_header.associated_linda_id.filter(value => value === key).length !== 0
  }
  has_associated_header_values(key: string, index: number) {

    if (this.associated_header.associated_values.filter(value => value === key).length !== 0) {
      if (this.associated_header.associated_values[index]) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }

  }



  get detected_studies() {
    if (this.has_study_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID')[0].associated_values
    }
    else {
      return []
    }
  }
  get detected_values() {
    ////console.log(this.get_data_by_header(this.column_original_label))
    if (this.extraction_component === 'study') {
      ////console.log(this.get_data_by_header(this.column_original_label))
      if (this.extraction_component_field === 'Study unique ID') {
        ////console.log(this.get_data_by_header(this.column_original_label))
        return Array.from(new Set(this.get_data_by_header(this.column_original_label)));
      }
      else {
        let _detected_values = []
        this.detected_studies.forEach(study_id => {
          _detected_values.push(Array.from(new Set(this.get_data_by_headers(this.study_associated_header.header, this.column_original_label, study_id)))[0])
        })
        return _detected_values
      }
    }
    else {

      let _detected_values = []
      this.detected_studies.forEach(study_id => {
        ////console.log(study_id)
        _detected_values.push(Array.from(new Set(this.get_data_by_headers(this.study_associated_header.header, this.column_original_label, study_id)))[0])
      })
      return _detected_values

    }

  }
  get detected_ids() {
    if (this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label).length>0){
      if (this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_linda_id.length>0){
        return this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_linda_id
      }
      else{
        return []
      }
    }
    else{
      return []
    }
}


  get get_component_extracted() {
    return this.get_component_extracted
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
  get get_while_added() {
    return this.while_added
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
    ////console.log(this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });)
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
      //console.log("Cancel form")
    }
    else {
      //console.log("Cancel form")
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
  show_infos() {
    console.warn("after remove Study unique ID associated header and update datafile")
    console.warn("data file= ", this.data_file)
    console.warn("has study column= ", this.has_study_associated_header())
    console.warn("has associated header selected= ", this.associated_header.selected)
    console.warn("detected studies= ", this.detected_studies)
    console.warn("detected ids= ", this.detected_ids)
    console.warn("detected values= ", this.detected_values)
    console.warn("detected associated header= ", this.associated_header)
    console.warn("detected study associated header= ", this.study_associated_header)
  }
  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  }
  ngOnDestroy(): void {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  }



}
