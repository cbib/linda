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
import { first } from 'rxjs/operators';

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

  form: FormGroup;
  cleaned_model = []
  model_type_label = ""
  study_array = []
  variable_array = []
  headers_form = {}
  global = {}
  displayedColumns: {} = {};
  displayedcomponentColumns: {} = {};
  datasources: {} = {};
  filename_used = []
  initialSelection = []
  selection = new SelectionModel<{}>(true, this.initialSelection /* multiple */);
  selected_file: string = ""
  save_as_template: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private router: Router,
    private alertService: AlertService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
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
  }
  onFilenameChange(values: string) {
    this.selected_file = values

  }
  async get_data() {
    const data = await this.globalService.get_all_data_files(this.model_key).toPromise();
    this.filename_used = []
    if (data.length > 0 && data[0] !== null) {
      data[0].forEach(data_file => {
        if (!this.filename_used.includes(data_file.filename)) {
          this.filename_used.push(data_file.filename)
          this.global[data_file.filename] = []
          this.displayedColumns[data_file.filename] = []
          this.displayedColumns[data_file.filename].push('study ID')
          this.displayedcomponentColumns[data_file.filename] = []
          this.datasources[data_file.filename] = new MatTableDataSource()
        }

        let my_dict = {};
        if(! this.study_array.includes(data_file.efrom)){
          this.study_array.push(data_file.efrom);
        }
        my_dict['study ID'] = data_file.efrom;
        my_dict['datafile ID'] = data_file.eto;

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
              my_dict[element['header']] = element['associated_linda_id'];
            }
            else {
              my_dict[element['header']] = 'unset';
            }
          }
        })
        if (!this.displayedColumns[data_file.filename].includes('select')) {
          this.displayedColumns[data_file.filename].push('select');
        }
        this.global[data_file.filename].push(my_dict)
        this.datasources[data_file.filename] = this.global[data_file.filename]

        //Harmonize keys for non present/detected component 
        var defaultObj = this.datasources[data_file.filename].reduce((m, o) => (Object.keys(o).forEach(key => m[key] = "notfound"), m), {});
        this.datasources[data_file.filename] = this.datasources[data_file.filename].map(e => Object.assign({}, defaultObj, e));

        this.selected_file = this.filename_used[0]
      });
      console.log(this.datasources)
    }

  }
  get_model_type() {
    return this.model_type
  }
  ngOnInit() {
    let attributeFilters = { variables: [''] };
    this.form = this.formBuilder.group(attributeFilters);
    this.model_type_label = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ")
    this.get_model(this.model_type);
    this.get_data()
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
    const numRows = this.datasources[selected_file].length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(selected_file: string) {
    this.isAllRowSelected(selected_file) ?
      this.selection.clear() :
      this.datasources[selected_file].forEach(row => {
        this.selection.select(row)
      });
  }

  Delete_extracted_component(value: string, filename: string){

  }

  clickToggle(value: string, filename: string) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    //check if this header is already extracted from another file
    if (this.get_state(value, filename) === 'all_extracted') {
      this.alertService.error("This component has already been extracted for all studies. Do you want to extract again ? ")
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'extract_env_var_again', user_key: user._key, model_type: this.model_type, values: {}, parent_key: this.parent_id.split("/")[1], model_filename: this.selected_file , header:value} });
      dialogRef.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          if (confirmResult.event == 'Confirmed') {
            console.log("you have confirmed new extraction of " + this.model_type_label + ": " + value)
            //first delete all component associated with this header 
            this.datasources[filename].forEach(element => {
              this.globalService.remove_childs_by_type_and_id(this.parent_id, this.model_type, element[value]).pipe(first()).toPromise().then(
                data => { 
                  this.globalService.remove_association(element[value], element['datafile ID']).pipe(first()).toPromise().then(
                    association => { 
                      element[value]='unset';

                    });
                  
                }

              )
              
              
            });
            
          }
        }
      })
      //propose to extract and replace component
    }
    else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'extract_env_var', user_key: user._key, model_type: this.model_type, values: {}, parent_key: this.parent_id.split("/")[1], model_filename: this.selected_file , header:value} });
      dialogRef.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          if (confirmResult.event == 'Confirmed') {
            console.log("you have confirmed extraction of " + this.model_type_label + ": " + value)
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
              this.datasources[filename].forEach(
                element => {
                  element[value] = "ready"
              });

            }
            else if (confirmResult.use_existing) {
              console.log("You have confirmed extraction from already described " + this.model_type_label + 's')
              window.location.reload();            
              //open a dialog with model type already extracted in other file
            }
            else {
              const formDialogRef = this.dialog.open(FormDialogComponent, { width: '1200px', data: { model_type: this.model_type, formData: {} } });
              formDialogRef.afterClosed().subscribe((result) => {
                if (result) {
                  if (result.event == 'Confirmed') {
                    console.log("You have described your " + this.model_type_label + " form !")
                    this.headers_form[value] = result["formData"]["form"]
                    this.save_as_template = result["formData"]["template"]
                    // this.global[filename].forEach(element => {
                    //   element[value] = "ready"
                    // });
                    this.datasources[filename].forEach(
                      element => {
                        element[value] = "ready"
                    });
                  }
                  else {
                    console.log("you have cancelled your " + this.model_type_label + " form !")
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
    console.log("ready to extract !!!!! ")
    var cnt = 0
    this.datasources[this.selected_file].forEach(
      element => {

        Object.keys(element).forEach(
          key => {
            if (element[key] === 'ready') {
              let modelForm = this.headers_form[key]
              if (cnt > 0) {
                this.save_as_template = false
              }
              this.globalService.add(modelForm, this.model_type, element['study ID'], this.save_as_template).pipe(first()).toPromise().then(
                data => {
                  if (data["success"]) {
                    let added_model_id = data["_id"];
                    let data_file_to_update = element['datafile ID']
                    this.globalService.update_associated_headers_linda_id(data_file_to_update, data["_id"], key, 'data_files').pipe(first()).toPromise().then(
                      data => {}
                    )
                    // var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                    // this.alertService.success(message)

                    return true;
                  }
                  else {
                    this.alertService.error("this form contains errors! " + data["message"]);
                    return false;
                  }
                }
              );
            }
          }
        )
        cnt += 1

      });
    this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
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
    else if (key.includes('extracted')) {

      return { backgroundColor: 'LightGreen', 'border-radius': '4px', 'float': 'left' }
    }
    else {
      return { backgroundColor: 'LightSteelBlue', 'border-radius': '4px', 'float': 'left' }
    }
  }

  get_state(column: string, filename: string) {
    console.log(this.global[filename])
    var tmp_list = []
    let res = ""
    this.global[filename].forEach(
      element => {
        console.log(element)
        if (element[column].includes(this.model_type + "s")) {
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
    console.log(this.global[filename].length)
    console.log(tmp_list.filter(component => component == 'extracted').length)
    console.log(res)
    return res
  }

}
