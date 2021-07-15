import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService, GlobalService, AlertService } from '../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonToggle } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../dialog/form-dialog.component';
import { BiologicalMaterialDialogComponent } from '../dialog/biological-material-dialog.component';
import { first } from 'rxjs/operators';
import { JoyrideService } from 'ngx-joyride';
import * as uuid from 'uuid';

/*
 Maybe add data filename to investigation component when adding data files with studies in download_component.ts
  It will be easier to build this page knowing the filename
  Get all studies associated data files and list them by filename
      For each filename :
      First data file found
      daily env.csv
      Variable globale subies par tous les individus des studies et reliée aux observations dans le temps ?
      Variable reliée aux observations des individus ?
      select   | studies | var 1   | var 2    |
      checkbox | study 1 | absence | presence |
      checkbox | study 2 | absence | presence |
      checkbox | study 3 | absence | presence |
      checkbox | study 4 | absence | presence |
      Export_button
      User select variable column to export (if clicked on header => all lines selected else only checked lines are exported)
      By cLicking on export button, user will open the observed variable form in a modal dialog.
      Once validated (for each or for one only ?) for each study, related variable will be added as study child nodes.
      here again need to inform investigation node that global observed variable has been set to further investigate data with statistics ?
      The user can build
*/

@Component({
  selector: 'app-extract-component',
  templateUrl: './extract-component.component.html',
  styleUrls: ['./extract-component.component.css']
})
export class ExtractComponentComponent implements OnInit {
  // input part
  @Input() parent_id: string;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatButtonToggle, { static: false }) toggle: MatButtonToggle;
  material_types: any[] = ["Material ID", "biological Material ID"];
  material_type = "Material ID"
  observation_unit_types: any[] = ["block", "sub-block", "plot", "plant", "trial", "pot", "replicate", "individual", "virtual_trial", "unit-parcel"];
  observation_unit_type = ""
  form: FormGroup;
  cleaned_model = []
  model_type_label = ""
  study_array = []
  variable_array = []
  headers_form = {}
  global = {}
  datafile_ids = {}
  datafile_study_ids = {}
  ObservedVariables: {} = {};
  AllObservedVariables: {} = {};
  displayedColumns: {} = {};
  displayedcomponentColumns: {} = {};
  datasources: {} = {};
  data_ready: boolean = false
  filename_used = []
  initialSelection = []
  selection = new SelectionModel<{}>(true, this.initialSelection /* multiple */);
  selected_file: string = ""
  save_as_template: boolean = false
  private currentUser
  private demo_subset = 0
  part2 = false

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private router: Router,
    private alertService: AlertService,
    private globalService: GlobalService,
    private readonly joyrideService: JoyrideService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialog2: MatDialog) {
    //use this when you pass argument using this.router.navigate
    // else use @input if you pass argument in template html  
    this.route.queryParams.subscribe(
      params => {
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
      }
    );
    this.data_ready = false
    this.get_data()
  }
  ngOnInit() {
    let attributeFilters = { variables: [''] };
    this.form = this.formBuilder.group(attributeFilters);
    this.model_type_label = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ")
    this.get_model(this.model_type);
    ///this.get_data()
    this.data_ready = true
    this.onClickTour()
  }
  onFilenameChange(values: string) {
    this.selected_file = values
  }

  async get_data() {
    const data = await this.globalService.get_all_data_files(this.model_key).toPromise();
    this.filename_used = []
    if (data.length > 0 && data[0] !== null) {
      data[0].forEach(
        data_file => {
          //console.log(data_file)

          if (!this.filename_used.includes(data_file.filename)) {
            this.datafile_ids[data_file.filename] = data_file.eto
            this.datafile_study_ids[data_file.filename] = data_file.efrom
            this.filename_used.push(data_file.filename)
            this.global[data_file.filename] = []
            this.displayedColumns[data_file.filename] = []
            this.displayedColumns[data_file.filename].push('study ID')
            this.displayedcomponentColumns[data_file.filename] = []
            this.ObservedVariables[data_file.filename] = []
            this.AllObservedVariables[data_file.filename] = []
            this.datasources[data_file.filename] = new MatTableDataSource()
            this.selected_file = this.filename_used[0]
          }
          

          let my_dict = {};
          if (!this.study_array.includes(data_file.efrom)) {
            this.study_array.push(data_file.efrom);
          }
          my_dict['study ID'] = data_file.efrom;
          my_dict['datafile ID'] = data_file.eto;
          this.globalService.get_type_child_from_parent(data_file.efrom.split("/")[0], data_file.efrom.split("/")[1], this.model_type + 's').toPromise().then(
            observed_variable_data => {
              //console.log(observed_variable_data)
              observed_variable_data.forEach(observed_variable => {
                //console.log(observed_variable)
                var found = false
                this.AllObservedVariables[data_file.filename].push({ 'observed_variable': observed_variable, 'study_id': data_file.efrom })
                this.ObservedVariables[data_file.filename].forEach(variable => {
                  //console.log(variable)
                  if (this.model_type === 'observed_variable') {
                    if (variable['observed_variable']["Variable name"] === observed_variable["Variable name"]) {
                      found = true
                    }
                  }
                  if (this.model_type === 'experimental_factor') {
                    if (variable['observed_variable']['Experimental Factor type'] === observed_variable['Experimental Factor type']) {
                      found = true
                    }
                  }
                  if (this.model_type === 'biological_material') {
                    if (variable['observed_variable']['_id'] === observed_variable['_id']) {
                      found = true
                    }
                  }
                });
                if (!found) {
                  this.ObservedVariables[data_file.filename].push({ 'observed_variable': observed_variable, 'study_id': data_file.efrom })
                }


              });
              //console.log(this.ObservedVariables)

              data_file.associated_headers.forEach(element => {
                if (element['associated_component'] === this.model_type) {
                  if (!this.variable_array.includes(element['header'])) {
                    this.variable_array.push(element['header']);
                  }
                  if (!this.displayedColumns[data_file.filename].includes(element['header'])) {
                    this.displayedColumns[data_file.filename].push(element['header'])
                  }
                  if (element['header'] != 'study ID') {
                    if (!this.displayedcomponentColumns[data_file.filename].includes(element['header'])) {
                      this.displayedcomponentColumns[data_file.filename].push(element['header'])
                    }
                  }
                  this.headers_form[element['header']] = {}
                  if (element['associated_linda_id'] !== '') {
                    my_dict[element['header']] = { "state": "extracted", "already_there": true, "id": element['associated_linda_id'], };
                  }
                  else {
                    my_dict[element['header']] = { "state": 'unset', "already_there": false, 'id': "" };
                  }
                }
              })
              if (!this.displayedColumns[data_file.filename].includes('select')) {
                this.displayedColumns[data_file.filename].push('select');
              }
              this.global[data_file.filename].push(my_dict)
              this.datasources[data_file.filename] = new MatTableDataSource(this.global[data_file.filename])
              //this.datasources[data_file.filename] = this.global[data_file.filename]

              //   //Harmonize keys for non present/detected component 
              // var defaultObj = this.datasources[data_file.filename].reduce((m, o) => (Object.keys(o).forEach(key => m[key] = "notfound"), m), {});
              console.log(this.displayedColumns[data_file.filename])
              // this.datasources[data_file.filename] = this.datasources[data_file.filename].map(e => Object.assign({}, defaultObj, e));
              console.log(this.datasources[data_file.filename])
              console.log(this.global[data_file.filename])
            });
        }
      );
      ////console.log(this.datasources)
    }
  }
  get_model_type() {
    return this.model_type
  }
  onTypeChange(values: string) {
    this.material_type = values
  }
  onOUTypeChange(values: string) {
    this.observation_unit_type = values
  }
  cancel() {

    if (!this.currentUser.tutoriel_done) {
      if (this.currentUser.tutoriel_step === "15") {
        if (this.model_type === "investigation") {
          var new_step = 14
          this.currentUser.tutoriel_step = new_step.toString()
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
      }
      else {
        this.alertService.error("You are not in the right form as requested by the tutorial")

      }
    }
    this.router.navigate(['/tree'])
  }


  get_model(model_type: string) {
    let model = [];
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    this.globalService.get_model(model_type).toPromise().then(data => {
      model = data;
      var keys = Object.keys(model);
      let cleaned_model_array = []
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {
          keys.splice(i, 1);
          i--;
        }
        else {
          var dict = {}
          dict["key"] = keys[i]
          dict["pos"] = model[keys[i]]["Position"]
          dict["level"] = model[keys[i]]["Level"]
          dict["format"] = model[keys[i]]["Format"]
          dict["Associated_ontologies"] = model[keys[i]]["Associated_ontologies"]
          cleaned_model_array.push(dict)
        }
      }
      cleaned_model_array = cleaned_model_array.sort(function (a, b) { return a.pos - b.pos; });
      this.cleaned_model = cleaned_model_array
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllRowSelected(selected_file: string) {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasources[selected_file]['filteredData'].length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(selected_file: string) {
    this.isAllRowSelected(selected_file) ?
      this.selection.clear() :
      this.datasources[selected_file]['filteredData'].forEach(row => {
        this.selection.select(row)
      });
  }

  Delete_extracted_component(value: string, filename: string) {

  }
  clickToggleExisting(value: string, filename: string) {
    var variable_name = value['Variable name']
    let user = JSON.parse(localStorage.getItem('currentUser'));
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'extract_existing_env_var', user_key: user._key, model_type: this.model_type, values: {}, parent_key: this.parent_id.split("/")[1], model_filename: this.selected_file, header: value, headers: this.displayedcomponentColumns[filename] } });
    dialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        if (confirmResult.event == 'Confirmed') {
          var test = this.AllObservedVariables[filename].filter(ov => ov['observed_variable']["Variable name"] == variable_name)
          //this.headers_form[value] = this.ObservedVariables[filename]
          this.datasources[filename]['filteredData'].forEach(
            element => {
              let variable_id = test.filter(ov => ov["study_id"] == element["study ID"])[0]['observed_variable']['_id']
              element[confirmResult.selected_header]["state"] = "ready"
              element[confirmResult.selected_header]["id"] = variable_id
              element[confirmResult.selected_header]["already_there"] = true
              this.part2 = true
              this.joyrideService.startTour(
                { steps: ['StepCheck'], stepDefaultPosition: 'bottom' } // Your steps order
              );
            });
        }
      }
    });
  }


  clickToggle(value: string, filename: string) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    //check if this header is already extracted from another file
    if (this.get_state(value, filename) === 'all_extracted') {
      this.alertService.error("This component has already been linked for all studies. Do you want to extract again ? ")
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'extract_env_var_again', user_key: user._key, model_type: this.model_type, values: {}, parent_key: this.parent_id.split("/")[1], model_filename: this.selected_file, header: value } });
      dialogRef.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          if (confirmResult.event == 'Confirmed') {
            //first delete all component associated with this header 
            this.datasources[filename]['filteredData'].forEach(element => {
              this.globalService.remove_association(element[value], element['datafile ID']).pipe(first()).toPromise().then(
                association => {
                  //console.log(association)
                  element[value]["state"] = 'unset';
                  element[value]["id"] = '';
                  element[value]["already_there"] = false;
                });
            });
          }
        }
      })
      //propose to extract and replace component
    }
    else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'extract_env_var', user_key: user._key, model_type: this.model_type, values: {}, parent_key: this.parent_id.split("/")[1], model_filename: this.selected_file, header: value } });
      dialogRef.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          if (confirmResult.event == 'Confirmed') {
            ////console.log("you have confirmed linkage of " + this.model_type_label + ": " + value)
            // Use template mode
            if (confirmResult.use_template) {
              let data_from_template = {}
              for (var key in confirmResult["template_data"]) {
                if (!key.startsWith("_")) {
                  data_from_template[key] = confirmResult["template_data"][key]
                }
              }
              //clean template with _key, _id, 
              this.headers_form[value] = data_from_template
              // this.global[filename].forEach(element => {
              //   element[value] = "ready"
              // })
              this.datasources[filename]['filteredData'].forEach(
                element => {
                  element[value]["state"] = "ready"
                });

            }
            else if (confirmResult.use_existing) {
              ////console.log("You have confirmed extraction from already described " + this.model_type_label + 's')
              window.location.reload();
              //open a dialog with model type already extracted in other file
            }
            else {
              const formDialogRef = this.dialog.open(FormDialogComponent, { width: '1200px', data: { model_type: this.model_type, formData: {} } });
              formDialogRef.afterClosed().subscribe((result) => {
                if (result) {

                  if (result.event == 'Confirmed') {
                    //console.log("You have described your " + this.model_type_label + " form !")
                    this.headers_form[value] = result["formData"]["form"]
                    this.save_as_template = result["formData"]["template"]
                    // this.global[filename].forEach(element => {
                    //   element[value] = "ready"
                    // });
                    if (this.model_type === "observation_unit") {
                      //console.log('observation unit form have been fullfilled')
                      ///console.log(this.headers_form[value])
                      //add observations units 
                      
                      
                      this.headers_form[value] = { "observation_units": [], "biological_materials": [], "samples": [], "experimental_factors": [] }
                      // get data for observation unit id
                      console.log(this.global[filename])
                      this.globalService.get_associated_component_by_type_from_datafiles(this.datafile_ids[filename].split('/')[1], "experimental_factor").toPromise().then(ef_data => {
                        //  get experimental factor associated
                        console.log(ef_data)
                        this.globalService.get_associated_component_by_type_from_datafiles(this.datafile_ids[filename].split('/')[1], "biological_material").toPromise().then(bm_data => {

                        var headers= bm_data[0][0]['header']+'linda_separator'+ef_data[0][0]['header']+'linda_separator'+value
                          this.globalService.get_multidata_from_datafiles(this.datafile_ids[filename].split('/')[1], headers).toPromise().then(headers_data => {
                            console.log(headers_data)
                            
                            let cpt=0
                            headers_data[2][0].forEach(obs_unit => {
                            //   // generate  obs unit
                              let ou= {
                                "Observation unit ID": obs_unit,
                                "obsUUID": uuid.v4(),
                                "External ID": "",
                                "Observation unit type": this.observation_unit_type,
                                "Observation Unit factor value": headers_data[1][0][cpt],
                                "Spatial distribution": ""
                              }
                              var bm = {
                                "biologicalMaterialId": "",
                                "materialId":headers_data[0][0][cpt] ,
                                "genus": "",
                                "species": "",
                                "lindaID": bm_data[0][0]['id'],
                                "obsUUID": ou.obsUUID,
                                "bmUUID": uuid.v4()
                              }
                              var ef = {
                                "experimentalFactorType": "",
                                "experimentalFactorDescription": "",
                                "experimentalFactorValues": new Set(headers_data[1][0]),
                                "experimentalFactorAccessionNumber": "EFO:0000470",
                                "lindaID":ef_data[0][0]['id'],
                                "obsUUID": ou.obsUUID,
                                "efUUID": uuid.v4()
                              }  
                              this.headers_form[value]['observation_units'].push(ou)
                              this.headers_form[value]['biological_materials'].push([bm])
                              this.headers_form[value]['experimental_factors'].push([ef])
                              this.headers_form[value]['samples'].push([])
                            //   this.headers_form[value]['observation_units'].push(ou)
                            //   // get data for biological material column
                            //   // get data for experimental factor column
                            //   // add observation unit edge for each ef and bm with their own uuid   
                            // });
                            
                            cpt+=1
                            console.log(this.headers_form[value]) 
                            });
                          });
                          
                        });
                      });
                      
                    }
                    if (this.model_type === "biological_material") {
                      //console.log('biological material form have been fullfilled')
                      //console.log(result)
                      // need  to select which type of id are linked to each observation ?
                      // is it material id or biological material ? 
                      if (this.material_type === "biological Material ID") {
                        // more complex create as many biological material 
                        // but either the material is already defined or you have to created the corresponding materila to  receive the bm data

                      }
                      else {

                        // create as many material source id as unique ID in the column
                        let groups_label = []
                        //console.log(this.headers_form[value])
                        //console.log("material ids required")
                        this.globalService.get_data_from_datafiles(this.datafile_ids[filename].split('/')[1], value).toPromise().then(header_data => {
                          //console.log(header_data)
                          //get unique study names
                          let unique_component_set = new Set(header_data[0])
                          ////console.log(unique_component_set)
                          var unique_component_set_array = Array.from(unique_component_set);
                          //foreach study identifier found other than Study unique ID
                          this.headers_form[value]["Material source ID (Holding institute/stock centre, accession)"][0] = unique_component_set_array[0]
                          for (var i = 1; i < unique_component_set_array.length; i++) {
                            this.headers_form[value]["Material source ID (Holding institute/stock centre, accession)"].push(unique_component_set_array[i])
                            /////console.log(this.headers_form[value]);   
                          }
                          Object.keys(this.headers_form[value]).forEach(key => {
                            ////console.log(key);  
                            if (key.includes("Biological") && key !== "Biological material ID") {
                              for (var i = 1; i < unique_component_set_array.length; i++) {
                                this.headers_form[value][key].push([""])
                              }
                            }
                            if (key == "Biological material ID") {
                              this.headers_form[value][key][0] = [unique_component_set_array[0] + '_1']
                              for (var i = 1; i < unique_component_set_array.length; i++) {
                                this.headers_form[value][key].push([unique_component_set_array[i] + '_1'])
                              }
                            }
                            if (key == "Infraspecific name") {
                              this.headers_form[value][key][0] = unique_component_set_array[0]
                              for (var i = 1; i < unique_component_set_array.length; i++) {
                                this.headers_form[value][key].push(unique_component_set_array[i])
                              }
                            }
                            if (key.includes("Material") && key !== "Material source ID (Holding institute/stock centre, accession)") {
                              for (var i = 1; i < unique_component_set_array.length; i++) {
                                this.headers_form[value][key].push("")
                              }
                            }
                          });
                          //console.log(this.headers_form[value]);
                          let formDialogRef2 = this.dialog2.open(BiologicalMaterialDialogComponent, { width: '1200px', data: { material_type: this.material_type, data_filename: filename } });
                          formDialogRef2.afterClosed().subscribe((result2) => {
                            if (result2) {

                              if (result2.event == 'Confirmed') {
                                let biological_material_n = result2.biological_material_n
                                //console.log(biological_material_n)
                                Object.keys(this.headers_form[value]).forEach(key => {
                                  //console.log(key)
                                  //console.log(this.headers_form[value][key])
                                  ////console.log(unique_component_set_array)
                                  if (key.includes("Biological") && key !== "Biological material ID") {
                                    for (var i = 0; i < unique_component_set_array.length; i++) {
                                      //console.log(this.headers_form[value][key][i])
                                      for (var j = 2; j <= biological_material_n; j++) {
                                        //console.log(j)
                                        this.headers_form[value][key][i].push("")
                                      }
                                    }
                                  }
                                  if (key == "Biological material ID") {
                                    for (var i = 0; i < unique_component_set_array.length; i++) {
                                      //console.log(this.headers_form[value][key][i])
                                      this.headers_form[value][key][i][0] = unique_component_set_array[i] + '_1'
                                      for (var j = 2; j <= biological_material_n; j++) {
                                        //console.log(j)
                                        this.headers_form[value][key][i].push(unique_component_set_array[i] + '_' + j)
                                      }
                                    }
                                  }
                                });
                                //console.log(this.headers_form[value]); 

                              }
                            }
                          });






                        });

                        //search for column declared as study column
                        // for (var i = 0; i < this.displayedColumns[filename].length; i++) {
                        //     if (this.displayedColumns[filename][i] == this.data_to_extract['study']) {
                        //         for (var j = 0; j < this.lines_arr.length; j++) {
                        //             groups_label.push(this.lines_arr[j][i])
                        //         }
                        //     }
                        // }
                      }

                    }

                    this.datasources[filename]['filteredData'].forEach(
                      element => {
                        element[value]["state"] = "ready"
                      });
                  }
                  else {
                    ////console.log("you have cancelled your " + this.model_type_label + " form !")
                  }
                }
              });
            }
          }
        }
      });
    }
  }


  onSubmit() {

    if (this.selection.selected.length === 0) {
      this.alertService.error("You have to select row(s) in the component table")
    }
    else {

      ////console.log("ready to extract !!!!! ")
      var cnt = 0
      this.datasources[this.selected_file]['filteredData'].forEach(
        element => {
          ////console.log(element)
          Object.keys(element).forEach(
            key => {
              if (element[key]["state"] === 'ready') {
                if (element[key]["already_there"] === true) {
                  let data_file_to_update = element['datafile ID']
                  this.globalService.update_associated_headers_linda_id(data_file_to_update, element[key]["id"], key, 'data_files').pipe(first()).toPromise().then(
                    data => {
                      //console.log("passed")
                    }
                  )
                }
                else {
                  let modelForm = this.headers_form[key]
                  if (cnt > 0) {
                    this.save_as_template = false
                  }

                  if (this.model_type === 'biological_material') {
                    //submit the form
                    //get study id
                    this.globalService.add(this.headers_form[key], this.model_type,  element['study ID'], false).pipe(first()).toPromise().then(
                      data => {
                        if (data["success"]) {
                          let added_model_id = data["_id"];
                          let data_file_to_update = element['datafile ID']
                          //this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                          this.globalService.update_associated_headers_linda_id(data_file_to_update, data["_id"], key, 'data_files').pipe(first()).toPromise().then(
                            data => { }
                          )   
                          var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                          this.alertService.success(message)
                          return true;
                        }
                        else {
                          this.alertService.error("this form contains errors! " + data["message"]);
                          return false;
                        }
                      }
                    );

                  }
                  else if (this.model_type === 'observation_unit'){
                    this.globalService.add_observation_units(this.headers_form[key], this.model_type, element['study ID']).pipe(first()).toPromise().then(
                      data => {
                        if (data["success"]) {  
                          let added_model_id = data["_id"];
                          let data_file_to_update = element['datafile ID']
                          this.globalService.update_associated_headers_linda_id(data_file_to_update, data["_id"], key, 'data_files').pipe(first()).toPromise().then(
                            data_ou => { console.log(data_ou)}
                          )            
                          this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                          var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                          this.alertService.success(message)
                          return true;
                        }
                        else {
                          this.alertService.error("this form contains errors! " + data["message"]);
                          return false;
                        }
                      }
                    );
                  }
                  else {

                    this.globalService.add(modelForm, this.model_type, element['study ID'], this.save_as_template).pipe(first()).toPromise().then(
                      data => {
                        if (data["success"]) {
                          let added_model_id = data["_id"];
                          let data_file_to_update = element['datafile ID']
                          this.globalService.update_associated_headers_linda_id(data_file_to_update, data["_id"], key, 'data_files').pipe(first()).toPromise().then(
                            data => { }
                          )
                          // var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                          // this.alertService.success(message)

                          return true;
                        }
                        else {
                          this.alertService.error("this form contains errors! " + data["message"]);
                          return false;
                        }
                      });
                  }
                }
              }
            }
          )
          cnt += 1

        });
      if (!this.currentUser.tutoriel_done) {
        if (this.currentUser.tutoriel_step === "15") {
          let new_step = 16
          this.currentUser.tutoriel_step = new_step.toString()
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
        else {
          this.alertService.error("You are not in the right form as requested by the tutorial")
        }

      }
      this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
    }
    //for each selected rows and ready  to extract columns
    // 

  }

  getIconStyle(key: string): Object {
    if (key.includes('study')) {

      return { backgroundColor: '#b6b6b6', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('event')) {

      return { backgroundColor: 'lightcoral', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('observed_variable')) {

      return { backgroundColor: '#2E8B57', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('material')) {

      return { backgroundColor: '#72bcd4', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('biological_material')) {

      return { backgroundColor: 'LightBlue', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('observation_unit')) {

      return { backgroundColor: '#FF7F50', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('unset')) {

      return { backgroundColor: 'LightGray', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('notfound')) {

      return { backgroundColor: 'Gray', 'border-radius': '4px', 'width': '100px' }
    }
    else if (key.includes('ready')) {

      return { backgroundColor: 'LightGreen', 'border-radius': '4px', 'width': '100px' }
    }
    else {
      return { backgroundColor: 'LightSteelBlue', 'border-radius': '100px' }
    }
  }

  getToggleStyle(key: string): Object {
    if (key.includes('study')) {

      return { backgroundColor: '#b6b6b6', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('event')) {

      return { backgroundColor: 'lightcoral', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('observed_variable')) {

      return { backgroundColor: '#2E8B57', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('material')) {

      return { backgroundColor: '#72bcd4', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('biological_material')) {

      return { backgroundColor: 'LightBlue', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('observation_unit')) {

      return { backgroundColor: '#FF7F50', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('unset')) {

      return { backgroundColor: 'LightGray', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('ready')) {

      return { backgroundColor: 'LightGreen', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('ready-tuto')) {

      return { backgroundColor: 'LightGreen', 'border-radius': '4px', 'float': 'right' }
    }
    else if (key.includes('extracted')) {

      return { backgroundColor: 'LightGreen', 'border-radius': '4px', 'float': 'left' }
    }
    else if (key.includes('test')) {
      return { backgroundColor: 'LightSteelBlue', 'border-radius': '4px' }
    }
    else {
      return { backgroundColor: 'LightSteelBlue', 'border-radius': '4px', 'float': 'left' }
    }
  }

  get_state(column: string, filename: string) {
    ////console.log(this.global[filename])
    var tmp_list = []
    let res = ""
    this.global[filename].forEach(
      element => {
        ////console.log(element)
        if (element[column]['id'].includes(this.model_type + "s")) {
          //return "extracted"
          tmp_list.push("extracted")
        }
        // else if(element[column].includes(this.model_type+"s")){

        //   tmp_list.push("extracted")
        // }
        else {
          //return "unset"
          tmp_list.push("unset")
        }
      }
    )

    if (tmp_list.filter(component => component == 'extracted').length === this.global[filename].length) {
      res = 'all_extracted'
    }
    else if (tmp_list.filter(component => component == 'unset').length === this.global[filename].length) {
      res = 'all_unset'
    }
    else {
      res = 'some_extracted_some_unset'
    }
    ////console.log(this.global[filename].length)
    ////console.log(tmp_list.filter(component => component == 'extracted').length)
    ////console.log(res)
    return res
  }
  onClickTour() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    ////console.log(this.currentUser)
    if (this.currentUser['tutoriel_step'] === "15") {
      if (!this.part2) {
        this.joyrideService.startTour(
          { steps: ['StepDescription', 'StepSelectFile', 'StepComponentTable', 'StepAddComponent', 'StepLinkComponent', 'StepClickToggle'], stepDefaultPosition: 'bottom' } // Your steps order
        );
      }
    }
  }

}
