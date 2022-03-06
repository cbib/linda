import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
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
  private cleaned_study_model = []
  //private associated_header: AssociatedHeadersInterface
  private component_extracted: boolean = false
  private study_original_column_label: string = ""
  submitted = false;
  private Selection = []
  private removeSelection = []
  private checklistSelection = new SelectionModel<string>(true, this.Selection /* multiple */);
  private removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */);


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
    // Panel for projects and studies infos 
    // to avoid recreate same study  - 
    // Is it still necesary given that we disabled creatte button when studies already exists ?

    this.generalForm.get('Header').setValue(this.column_original_label);
    this.studyPersons = { 'studies': [], 'persons': [], 'roles': [] }
    this.projectPersons = { 'project_ids': [], 'persons': [], 'roles': [], 'groups': [] }
    this.cleaned_study_model = this.get_model('study');
    this.existing_studies_ids = []
   
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




    // Parse data in selected column
    this.cells = []
    this.cells = this.get_data_by_header(this.column_original_label)
    // get unique values in column
    // check if a study component has already been described in data files

    if (this.has_study_associated_header()) {
      console.log("study column found")
      // fetch the study associated header 
      // get study ccomponents already described adn created
      console.log("study ids were already described ")
      console.log(this.detected_studies)
      console.log(this.detected_values)

      // check that detected values are split into same number of values than study id values (ex: Site= Gaillac for both study Gai12R et GAI12W)
      /* if (this.detected_values.length < this.detected_studies.length) {
        while (this.detected_values.length < this.detected_studies.length) {
          this.detected_values.push(this.detected_values[0])
        }
        //this.detected_values=[this.detected_values[0].repeat(this.detected_studies.length)]
      } */
      // is this column has already been selected (i.e. assigned)
      if (this.associated_header.selected) {
        // set value in general form using component field values in asscociated headers
        this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
        this.extraction_component_field = this.associated_header.associated_component_field
        this.extraction_component = this.associated_header.associated_component
        //this.detected_values=this.associated_header.associated_values
      }
    }
    // if no study component, user has only the right to describe study unique IID field 
    else {
      console.log("study associated header not found")
      this.extract_component_options.options = this.extract_study_options
      // is this column has already been selected (i.e. assigned)
      if (this.associated_header.selected) {
        // set value in general form using component field values in asscociated headers
        this.generalForm.get('Standard term').setValue(this.associated_header.associated_component_field)
        this.extraction_component_field = this.associated_header.associated_component_field
        this.extraction_component = this.associated_header.associated_component
      }
    }
    console.warn("after initialization")
    console.warn("has study column= ", this.has_study_associated_header())
    console.warn("has associated header selected= ", this.associated_header.selected)
    console.warn("detected studies= ", this.detected_studies)
    console.warn("detected ids= ", this.detected_ids)
    console.warn("detected values= ", this.detected_values)
    console.warn("detected associated header= ", this.associated_header)
    console.warn("detected study associated header= ", this.study_associated_header)


  }
  onModify(values: string) {
    console.log(this.associated_header)
    console.log(this.detected_values)
    // column already defined
    if (this.associated_header.selected) {
      // open dialog to confirm
      console.log("you're about to change header assignation - if agree- it will remove all component created using thise column and remove all their childs")
    }
    // column not defined
    else {
      console.log(values)
      this.extraction_component_field = values
      this.extraction_component = this.get_component(values)

      console.log(this.column_original_label)
      console.log(this.data_file.associated_headers)
      if (this.extraction_component === "study") {
        if (this.extraction_component_field === "Study unique ID") {

        }
        else if (["Experimental site name", "Start date of study", "End date of study", "Study Name", "Study title", "Study description", "Contact institution"].includes(this.extraction_component_field)) {
          /* if (this.has_study_associated_header()) {

          }
          else {
            console.log("study column not detected")
          } */
        }
        else {
          /* if (this.has_study_associated_header()) {
            console.log("study column detected")
            console.log(this.associated_header.associated_values)
            console.log(this.associated_header.associated_linda_id)

          }
          else {
            console.log("study column not detected")
            this.update_associated_headers(values)
            //get unique study names

          } */
        }
      }
      if (this.get_component(values) === "observed_variable") {
        if (!this.has_study_associated_header()) {
          this.alertService.error("You need to define one study unique ID column before assigning any others components")
        }
        else {
          this.extraction_component = "observed_variable"
        }
      }
      if (this.get_component(values) === "experimental_factor" && this.has_study_associated_header()) {
        this.extraction_component = "experimental_factor"
      }
      if (this.get_component(values) === "observation_unit" && this.has_study_associated_header()) {
        this.extraction_component = "observation_unit"
      }
      if (this.get_component(values) === "event" && this.has_study_associated_header()) {
        this.extraction_component = "event"
      }
      if (this.get_component(values) === "biological_material" && this.has_study_associated_header()) {
        this.extraction_component = "biological_material"
      }

      ///this.definecolumnForm.get('Study IDs').setValue(this.detected_values);
    }



  }
  onExtract(component_value, index: number): void {
    console.log(component_value)
    console.log(this.extraction_component)
    console.log(this.extraction_component_field)
    if (this.extraction_component === "study") {
      if (this.extraction_component_field === "Study unique ID") {
        console.warn("before modify Study unique ID associated header")
        console.warn("data file= ", this.data_file)
        console.warn("has study column= ", this.has_study_associated_header())
        console.warn("has associated header selected= ", this.associated_header.selected)
        console.warn("detected studies= ", this.detected_studies)
        console.warn("detected ids= ", this.detected_ids)
        console.warn("detected values= ", this.detected_values)
        console.warn("detected associated header= ", this.associated_header)
        console.warn("detected study associated header= ", this.study_associated_header)
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
        if (!this.existing_studies_ids.includes(component_value)) {
          this.globalService.add(study_model, 'study', this.parent_id, false, this.group_key).pipe(first()).toPromise().then(
            add_study_res => {
              if (add_study_res["success"]) {
                console.log(add_study_res)
                console.log(add_study_res["message"])
                let study_id = add_study_res["_id"]
                this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_linda_id.push(study_id)
                this.data_file.associated_headers.filter(prop => prop.header === this.column_original_label)[0].associated_values.push(component_value)
                this.update_associated_headers(this.extraction_component_field)
                var data_model = { ...this.data_file };
                console.warn("after add study ")
                console.warn("data file= ", this.data_file)
                console.warn("has study column= ", this.has_study_associated_header())
                console.warn("has associated header selected= ", this.associated_header.selected)
                console.warn("detected studies= ", this.detected_studies)
                console.warn("detected ids= ", this.detected_ids)
                console.warn("detected values= ", this.detected_values)
                console.warn("detected associated header= ", this.associated_header)
                console.warn("detected study associated header= ", this.study_associated_header)
                this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                  data => {
                    console.log(data['doc']);
                    //this.Selection = []
                    this.data_file = data['doc']
                    //this.checklistSelection = new SelectionModel<string>(true, this.Selection);
                    this.alertService.success("you have created item type " + this.extraction_component + " called " + component_value)
                    //this.studies_to_remove = []
                    console.warn("after update associated header ")
                    console.warn("data file= ", this.data_file)
                    console.warn("has study column= ", this.has_study_associated_header())
                    console.warn("has associated header selected= ", this.associated_header.selected)
                    console.warn("detected studies= ", this.detected_studies)
                    console.warn("detected ids= ", this.detected_ids)
                    console.warn("detected values= ", this.detected_values)
                    console.warn("detected associated header= ", this.associated_header)
                    console.warn("detected study associated header= ", this.study_associated_header)
                    this.component_extracted = true

                  }
                );
              }
            }
          );
        }
        else {
          this.alertService.success("you cannot created study with same unique id : " + component_value)
        }
      }
    }
    else if (this.extraction_component === "experimental_factor"){

    }
  }
  onLink(component_value, _study_id: string, index: number): void {
    console.log(component_value)
    console.log(this.extraction_component)
    console.log(this.extraction_component_field)
    if (this.extraction_component === "study") {
      if (["Experimental site name", "Start date of study", "Study title", "End date of study", "Study Name", "Study description", "Contact institution", "Geographic location (latitude)", "Geographic location (altitude)", "Geographic location (longitude)"].includes(this.extraction_component_field)) {
        // update field Experimental site name with values in column using study name
        let study_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(_study_id)]
        // update field Experimental site name with values in column
        this.globalService.update_field(component_value, study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(
          data => {
            console.log(data);
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_linda_id.push(study_id)
            this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label)[0].associated_values.push(component_value)
            this.update_associated_headers(this.extraction_component_field)
            var data_model = { ...this.data_file };
            this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              data => {
                console.log(data);
                this.data_file = data['doc']
                ///this.Selection = []
                //this.checklistSelection = new SelectionModel<string>(true, this.Selection);
                this.alertService.success("you have updated " + this.extraction_component + " for field: " + this.extraction_component_field + " with value: " + component_value)
                /* this.studies_to_remove = [] */
                this.component_extracted = true
              }
            );


          });
      }
    }
    else if (this.extraction_component === "experimental_factor"){

    }

  }
  onRemove(component_value: string, index: number) {
    if (this.extraction_component === "study") {
      // nee to remove all study childs and pûrge associated headers with the key found
      if (this.extraction_component_field === "Study unique ID") {

        //let study_id = this.detected_ids[index]

        let study_id = this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(component_value)]
        console.warn("detected study id: ", study_id, "index: ", index)
        this.globalService.remove(study_id).pipe(first()).toPromise().then(
          remove_result => {
            if (remove_result["success"]) {
              //this.detected_studies.filter(detected_study => detected_study !== component_value)
              console.log(remove_result)
              console.warn("after remove Study unique ID associated header and update datafile")
              console.warn("data file= ", this.data_file)
              console.warn("has study column= ", this.has_study_associated_header())
              console.warn("has associated header selected= ", this.associated_header.selected)
              console.warn("detected studies= ", this.detected_studies)
              console.warn("detected ids= ", this.detected_ids)
              console.warn("detected values= ", this.detected_values)
              console.warn("detected associated header= ", this.associated_header)
              console.warn("detected study associated header= ", this.study_associated_header)
              this.associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== study_id);
              this.associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== component_value);
              //this.data_file.associated_headers.filter(prop => prop.header == this.column_original_label).forEach(prop => { prop.associated_values.filter(value=>value!==this.associated_header.associated_values[index]); });
              
              
              
              
              this.data_file.associated_headers.filter(prop => prop.associated_component === "study").forEach(associated_header => {
                this.clean_associated_header(associated_header, study_id, component_value)
              })
              console.log(this.data_file.associated_headers)
              // this.clean_current_associated_headers()
              // Clean all associated header with this study id in  linda id

              var data_model = { ...this.data_file };
              // Update only for study component associated header
              this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
                update_result => {
                  console.log(update_result);
                  this.data_file = update_result['doc']
                  this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
                  this.component_extracted = false
                  console.log(component_value)
                  console.warn("after remove Study unique ID associated header and update datafile")
                  console.warn("data file= ", this.data_file)
                  console.warn("has study column= ", this.has_study_associated_header())
                  console.warn("has associated header selected= ", this.associated_header.selected)
                  console.warn("detected studies= ", this.detected_studies)
                  console.warn("detected ids= ", this.detected_ids)
                  console.warn("detected values= ", this.detected_values)
                  console.warn("detected associated header= ", this.associated_header)
                  console.warn("detected study associated header= ", this.study_associated_header)
                  //this.removeSelection = []
                  //this.removeListSelection = new SelectionModel<string>(true, this.removeSelection /* multiple */)
                }
              );
            }
          }
        );
      }
      else if (["Experimental site name", "Start date of study", "Study title", "End date of study", "Study Name", "Study description", "Contact institution", "Geographic location (latitude)", "Geographic location (altitude)", "Geographic location (longitude)"].includes(this.extraction_component_field)) {
        let study_id = this.study_associated_header.associated_linda_id[index]
        // update field Experimental site name with values in column
        console.log(study_id)

        this.globalService.update_field("", study_id.split("/")[1], this.extraction_component_field, "study").pipe(first()).toPromise().then(data => {
          console.log(data);
          if (data['success']) {

            /* this.data_file.associated_headers.filter(prop => prop.associated_component_field === this.extraction_component_field)[0].forEach(associated_header => {
              this.clean_associated_header(associated_header, study_id, component_value)
            }) */
            this.clean_associated_header(this.associated_header, study_id, component_value)
            // this.clean_associated_header_by_index(this.associated_header, index)
            //this.clean_current_associated_headers()
            var data_model = { ...this.data_file };
            console.log(data_model)
            this.globalService.update_associated_headers(this.data_file._id, data_model.associated_headers, 'data_files').pipe(first()).toPromise().then(
              update_result => {
                console.log(update_result);
                this.data_file = update_result['doc']
                this.alertService.success("you have removed item type " + this.extraction_component + " called " + component_value)
                this.component_extracted = false
              }
            );
          }
        })
      }
      else{

      }
    }
  }
  has_study_associated_header(): boolean {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID').length > 0
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
  get detected_studies() {
    if (this.has_study_associated_header()) {
      return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID')[0].associated_values
    }
    else {
      return []
    }
  }
  get detected_values() {
    if (this.extraction_component === 'study') {
      if (this.extraction_component_field === 'Study unique ID') {
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
        console.log(study_id)
        _detected_values.push(Array.from(new Set(this.get_data_by_headers(this.study_associated_header.header, this.column_original_label, study_id)))[0])
      })
      return _detected_values

    }

  }
  get associated_header(): AssociatedHeadersInterface {
    return this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0]
  }
  get study_associated_header() {
    return this.data_file.associated_headers.filter(associated_header => associated_header.associated_component_field === 'Study unique ID')[0]
  }
  get detected_ids() {
    return this.data_file.associated_headers.filter(associated_header => associated_header.header === this.column_original_label)[0].associated_linda_id
  }



  clean_associated_header(_associated_header: AssociatedHeadersInterface, _study_id: string, _component_value) {
    console.log(_associated_header)
    
    if (this.extraction_component_field==='Study unique ID'){
      _associated_header.associated_values = this.associated_header.associated_values.filter(associated_value => associated_value !== _component_value);
    }
    else{
      _associated_header.associated_values.splice(this.associated_header.associated_linda_id.indexOf(_study_id), 1)
      console.log(_associated_header)
    }
    _associated_header.associated_linda_id = this.associated_header.associated_linda_id.filter(linda_id => linda_id !== _study_id);

    if (_associated_header.associated_values.length === 0) {
      _associated_header.associated_component = ""
      _associated_header.associated_component_field = ""
      _associated_header.associated_term_id = ""
      _associated_header.is_time_values = false
      _associated_header.selected = false
      _associated_header.is_numeric_values = false
    }
    console.log(_associated_header)
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
    console.log(_associated_header)
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
    if (this.associated_header.associated_values.filter(value => value === key).length > 0) {
      return this.associated_header.associated_linda_id[index]
      //return this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(this.associated_header.associated_values.filter(value => value === key)[0])]
    }
    else {
      return ""
    }
  }
  get_associated_header_values(key: string, index: number) {
    //console.log(this.associated_header.associated_values.filter(value => value === key))
    if (this.associated_header.associated_values.filter(value => value === key).length > 0) {
      if (this.associated_header.associated_values[index]) {
        return this.associated_header.associated_values[index]
        //return this.associated_header.associated_values.filter(value => value === key)[0]
      }
      else {
        return ""
      }
    }
    else {
      return ""
    }
  }

  get_associated_header_linda_id_by_study_id(study_unique_id: string, index: number) {
    let study_linda_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(study_unique_id)]
    return this.associated_header.associated_linda_id.filter(linda_id => linda_id === study_linda_id)
  }
  has_associated_header_linda_id_by_study_id(study_unique_id: string, index: number) {
    let study_linda_id = this.study_associated_header.associated_linda_id[this.study_associated_header.associated_values.indexOf(study_unique_id)]
    return this.associated_header.associated_linda_id.filter(linda_id => linda_id === study_linda_id).length > 0
  }
  has_associated_header_linda_id_by_value(key: string, index: number) {
    //console.log(key)
    ///console.log(this.associated_header.associated_linda_id.filter(value => value === key))
    if (this.associated_header.associated_linda_id[this.associated_header.associated_values.indexOf(this.associated_header.associated_values.filter(value => value === key)[0])]) {
      return true
      //return this.associated_header.associated_linda_id.filter(value => value === key)[0]
    }
    else {
      return false
    }
    return this.associated_header.associated_linda_id.filter(value => value === key).length !== 0
  }
  has_associated_headers_linda_id_by_value(key: string, index: number) {
    //console.log(key)
    ///console.log(this.associated_header.associated_linda_id.filter(value => value === key))

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
  /* itemSelectionToggle(_study_id: string): void {
  this.checklistSelection.toggle(_study_id);
  console.log(this.Selection)
  if (this.checklistSelection.isSelected(_study_id)) {
    console.log(_study_id)
  }
  else {
    console.log(_study_id)
  }
  console.log(_study_id, 'are ready to be created')
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
} */
  /*   onNoClick(): void {
      this.dialogRef.close({ event: "Cancelled", data_file: this.data_file });
    }
   */
  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  }
  ngOnDestroy(): void {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  }
  /* ngOnDestroy() {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  } */



}
