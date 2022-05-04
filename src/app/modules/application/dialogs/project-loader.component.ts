import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AuthenticationService, AlertService, FileService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInterface } from 'src/app/models/linda/person';
import { first } from 'rxjs/operators';
import { DelimitorComponent } from '../dialogs/delimitor.component';
import * as XLSX from 'xlsx';
import { AssociatedHeadersInterface } from 'src/app/models/linda/data_files'
import { DataFileInterface } from 'src/app/models/linda/data_files'
import { timeStamp } from 'console';
import { Investigation, InvestigationInterface } from 'src/app/models/linda/investigation';
import { Study } from 'src/app/models/linda/study';
import * as JSZip from 'jszip';
import { ThrowStmt } from '@angular/compiler';


interface DialogData {
  parent_id: string;
  group_key: string;
}

@Component({
  selector: 'app-project-loader',
  templateUrl: './project-loader.component.html',
  styleUrls: ['./project-loader.component.css']
})
export class ProjectLoaderComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  parent_id: string = ""
  group_key: string = ""
  currentUser: UserInterface
  fileUploaded: File = null;
  fileName: string = ""
  fileUploadProgress: string = null;
  upproject_loadedFilePath: string = null;
  uploadResponse = { status: '', message: 0, filePath: '' };
  error = { message: '' }
  private csv_lines_dict = []
  private delimitor: string;
  private csv: any;
  private headers = [];
  private associated_headers: AssociatedHeadersInterface[] = [];
  private csv_lines_array = [];
  private data_model: { 'Data file description': string, 'Data file version': string, 'Data file link': string, 'Data': any[], 'associated_headers': AssociatedHeadersInterface[], 'headers': string[] };
  private project_model: Investigation
  private study_models: Study[]
  private study_model: Study


  form: FormGroup;
  private project_already_there:boolean= false
  private project_loaded: boolean = false
  private studies_loaded: boolean = false
  private added: boolean = false
  private preview_request: boolean = false
  private hierarchy: { filepath: string[], model_type: string[], parent_id: string[] }
  private zipFile: JSZip

  dataTable: any;
  dtOptions: any;
  tableData = [];

  constructor(private formBuilder: FormBuilder,
    private fileService: FileService,
    private globalService: GlobalService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<ProjectLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public delimdialog: MatDialog) {
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
    console.log(this.parent_id)
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }
  ngOnInit() {
    this.project_model = new Investigation()
    this.study_model = new Study()
    this.project_already_there = false
    this.study_models = []
    let attributeFilters = { file: [''] };
    this.form = this.formBuilder.group(attributeFilters);
    this.data_model = { 'Data file description': "", 'Data file version': "", 'Data file link': "", 'Data': [], 'associated_headers': [], 'headers': [] }

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
  // I/O event
  onFileChange(event) {
    /* this.headers = [];
    this.associated_headers = [];
    this.csv_lines_array = [];
    this.csv_lines_dict = []; */
    this.onGiveUp()

    if (event.target.files.length > 0) {
      this.uploadResponse.status = 'progress'
      this.fileUploaded = event.target.files[0];
      this.fileName = this.fileUploaded.name

      if (this.fileUploaded.type === "text/csv") {
        const dialogRef = this.delimdialog.open(DelimitorComponent, { width: '1000px', data: { delimitor: "" } });
        dialogRef.afterClosed().subscribe(data => {
          if (data !== undefined) {
            this.delimitor = data.delimitor;
            this.read_csv(this.delimitor)
          };
        });

      }
      else if (this.fileUploaded.type === "application/zip") {
        this.loadZip()
      }
      else {
        this.readExcel();
      }
      //this.project_loaded=true
      this.form.get('file').setValue(this.fileUploaded);

    }
    this.error.message = ""
  }
  loadZip() {
    this.fileService.open_zip(this.fileUploaded).then((zip) => {
      this.zipFile = zip
      this.set_hierarchy()
      this.uploadResponse.status=""

    });

  }
  set_hierarchy() {
    Object.keys(this.zipFile.files).reverse().forEach((filename) => {
      if (filename.includes('hierarchy')) {
        this.zipFile.files[filename].async('text').then((fileData) => {
          console.log(JSON.parse(fileData));
          if (fileData) {
            this.hierarchy = JSON.parse(fileData)

          }
          else {

          }
        });
      }
    });
  }
  importProject() {
    console.log(this.project_model)
    let new_investigation: Investigation = new Investigation()
    console.log(new_investigation)
    Object.keys(new_investigation).forEach(key => {
      new_investigation[key] = this.project_model[key]
    })
    console.log(new_investigation)

    this.globalService.add(new_investigation, "investigation", this.parent_id, false, this.group_key).pipe(first()).toPromise().then(
      data => {
        if (data["success"]) {
          console.log(data)
          this.project_model['_id']=data['_id']
          this.alertService.success("Project has been successfully imported")
          //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type: 'investigation', model_id: data['_id'], mode: "edit", activeTab: 'identifiers', role: "owner" } });
          //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });
        }
      }
    );
  }

  importStudies() {
    console.log(this.project_model)
    console.log(this.study_models)
    this.study_models.forEach(study_model=>{
      this.globalService.add(study_model, "study", this.project_model['_id'], false, this.group_key).pipe(first()).toPromise().then(
        data => {
          if (data["success"]) {
            console.log(data)
            this.alertService.success("Studdy has been successfully imported")
            //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type: 'investigation', model_id: data['_id'], mode: "edit", activeTab: 'identifiers', role: "owner" } });
            //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });
          }
        }
      );
    })


  }

  async onLoadStudies() {
    Object.keys(this.zipFile.files).reverse().forEach((filename) => {
      /* const studies_files_regex = /\/studies_[0-9]+\.csv/g;
      let test="studies_34556666.csv"
      if (test.match(studies_files_regex)){
        console.log("true")
      } */
      if (filename.includes('studies')) {
        if (!this.zipFile.files[filename].dir) {
          if (filename.includes('.csv')){
            this.zipFile.files[filename].async('text').then((fileData) => { // <----- HERE
              fileData = fileData.replace('\ufeff', "")
              let allTextLines = fileData.split(/\r|\n|\r/);
              allTextLines = allTextLines.filter(line => line !== "")
              let study_model = new Study()
              allTextLines.forEach(line => {
                study_model[line.split(',')[0]] = line.split(',')[1]
              });
              this.study_models.push(study_model)
              if (this.study_models.length == this.hierarchy.model_type.filter(model => model == 'studies').length) {
                this.studies_loaded = true
              }
            });
          } 
          else if (filename.includes('.tsv')){
            this.zipFile.files[filename].async('text').then((fileData) => { // <----- HERE
              fileData = fileData.replace('\ufeff', "")
              let allTextLines = fileData.split(/\r|\n|\r/);
              allTextLines = allTextLines.filter(line => line !== "")
              let study_model = new Study()
              allTextLines.forEach(line => {
                study_model[line.split('\t')[0]] = line.split('\t')[1]
              });
              this.study_models.push(study_model)
              if (this.study_models.length == this.hierarchy.model_type.filter(model => model == 'studies').length) {
                this.studies_loaded = true
              }
            });
          }
          else{
            this.zipFile.files[filename].async('text').then((fileData) => {
              this.study_models.push(JSON.parse(fileData))
              if (this.study_models.length == this.hierarchy.model_type.filter(model => model == 'studies').length) {
                this.studies_loaded = true
              }
              
            });
          }
        }
        
      }

    });
  }
  
  onLoadProject() {
    Object.keys(this.zipFile.files).reverse().forEach((filename) => {
      if (filename.includes('investigations')) {
        console.log(filename)
        console.log(this.zipFile.files[filename])
        if (filename.includes('.csv')) {
          this.zipFile.files[filename].async('text').then(async (fileData) => { // <----- HERE
            console.log(fileData)
            fileData = fileData.replace('\ufeff', "")
            let allTextLines = fileData.split(/\r|\n|\r/);
            allTextLines = allTextLines.filter(line => line !== "")
            allTextLines.forEach(line => {
              this.project_model[line.split(',')[0]] = line.split(',')[1]
            })
            
            this.project_loaded = true
            if (await this.check_exists(this.project_model['Investigation unique ID'], 'Investigation unique ID', 'investigation', this.currentUser._id)) {
              console.log("already exist")
              this.project_loaded = false
            }
          });
        }
        else if (filename.includes('.tsv')) {
          this.zipFile.files[filename].async('text').then(async (fileData) => { // <----- HERE
            console.log(fileData)
            fileData = fileData.replace('\ufeff', "")
            let allTextLines = fileData.split(/\r|\n|\r/);
            allTextLines = allTextLines.filter(line => line !== "")
            allTextLines.forEach(line => {
              this.project_model[line.split('\t')[0]] = line.split('\t')[1]
            })
            this.project_loaded = true
            if (await this.check_exists(this.project_model['Investigation unique ID'], 'Investigation unique ID', 'investigation', this.currentUser._id)) {
              console.log("already exist")
              this.project_loaded = false
            }
            
          });
        }
        // .json
        else{
          this.zipFile.files[filename].async('text').then(async (fileData) => {
            this.project_model= JSON.parse(fileData)
            this.project_loaded = true
            if (await this.check_exists(this.project_model['Investigation unique ID'], 'Investigation unique ID', 'investigation', this.currentUser._id)) {
              this.project_loaded = false
            }
            
          });
        }
      }
    });
  }
  openZip() {
    let file_data: any;
    this.fileService.open_zip(this.fileUploaded).then((zip) => { // <----- HERE
      this.uploadResponse.message = 100
      Object.keys(zip.files).reverse().forEach((filename) => {
        /* const studies_files_regex = /\/studies_[0-9]+\.csv/g;
        let test="studies_34556666.csv"
        if (test.match(studies_files_regex)){
          console.log("true")
        } */
        if (filename.includes('investigations')) {
          console.log(filename)
          console.log(zip.files[filename])
          zip.files[filename].async('text').then((fileData) => { // <----- HERE
            console.log(fileData)
            fileData = fileData.replace('\ufeff', "")
            let allTextLines = fileData.split(/\r|\n|\r/);
            allTextLines = allTextLines.filter(line => line !== "")
            allTextLines.forEach(line => {
              this.project_model[line.split(',')[0]] = line.split(',')[1]
            })
            console.log(allTextLines)
            console.log(this.project_model)
            this.project_loaded = true


            //let headers = allTextLines.split(",")
            ///console.log(headers) */
          });
          /*  zip.files[filename].async('string').then((fileData) => { // <----- HERE
             file_data = file_data + '**$$##$$**' + fileData;
             console.log(fileData)
             let allTextLines = fileData.split(/\r|\n|\r/);
             let headers = allTextLines[0].split(",")
             console.log(headers)
             let json = JSON.stringify(allTextLines);
             console.log(json)
             this.project_loaded=true
             //this.project_model
             
           }); */

        }
        else if (filename.includes('studies')) {
          if (!zip.files[filename].dir) {
            zip.files[filename].async('text').then((fileData) => { // <----- HERE
              console.log(filename)
              console.log(zip.files[filename])
              console.log(fileData)
              fileData = fileData.replace('\ufeff', "")
              let allTextLines = fileData.split(/\r|\n|\r/);
              allTextLines = allTextLines.filter(line => line !== "")
              let study_model = new Study()
              allTextLines.forEach(line => {
                study_model[line.split(',')[0]] = line.split(',')[1]
              });
              console.log(allTextLines)
              console.log(study_model)
              this.study_models.push(study_model)
              console.log(this.study_models)
              this.studies_loaded = true
              //let headers = allTextLines.split(",")
              ///console.log(headers) */
            });
          }
        }
        else {
          console.log('other components')
        }
      });


    });


  }
  // I/O function
  read_csv(delimitor: string) {
    //let allTextLines= this.fileService.read_csv(this.fileUpproject_loaded)
    //this.load_csv2(allTextLines, delimitor)
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var csv = fileReader.result;
      this.load_csv(csv, e.loaded, e.total, delimitor)
    }
    fileReader.readAsText(this.fileUploaded);
  }
  readExcel() {
    //let allTextLines= this.fileService.readExcel(this.fileUpproject_loaded)
    //this.load_csv2(allTextLines)
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var storeData: any = fileReader.result;
      var data = new Uint8Array(storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var book = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = book.SheetNames[0];
      var worksheet = book.Sheets[first_sheet_name];
      var csv = XLSX.utils.sheet_to_csv(worksheet);
      this.load_csv(csv, e.loaded, e.total);
    }
    fileReader.readAsArrayBuffer(this.fileUploaded);
  }
  load_csv(csvData: any, e_project_loaded: any, e_total: any, delimitor: string = ",") {
    console.log("entering load_csv()")

    this.csv_lines_array = [];
    this.csv_lines_dict = []
    this.associated_headers = []

    let allTextLines = csvData.split(/\r|\n|\r/);
    ///console.log(allTextLines)
    this.headers = allTextLines[0].split(delimitor)
    ///console.log(this.headers )
    for (let i = 0; i < this.headers.length; i++) {

      this.headers[i] = this.headers[i].replace(/['"]+/g, '').replace(/\./g, '_')
    }
    let type_dict = {}
    for (let i = 1; i < allTextLines.length; i++) {
      let csv_dict = {}
      this.uploadResponse.message = Math.round(100 * (e_project_loaded / e_total))
      // split content based on separator
      let line = allTextLines[i].split(delimitor);

      if (line.length === this.headers.length) {
        let csv_arr = [];
        let tmpAttributesGroups = {}
        for (let j = 0; j < this.headers.length; j++) {

          tmpAttributesGroups[this.headers[j]] = [this.headers[j]]
          let tmp = { header: "", associated_linda_id: "", name: "Assign MIAPPE components", value: "" }
          tmp['header'] = this.headers[j]

          csv_arr.push(line[j].replace(/['"]+/g, ''));
          csv_dict[this.headers[j]] = line[j].replace(/['"]+/g, '')
          if (i === 1) {
            if (this.isNumeric(csv_dict[this.headers[j]])) {
              type_dict[this.headers[j]] = true
            }
            else {
              type_dict[this.headers[j]] = false
            }
          }
        }
        this.csv_lines_array.push(csv_arr);
        this.csv_lines_dict.push(csv_dict)

      }
    }
    this.project_loaded = true
    // console.log(this.headers_by_filename[this.fileName])
    for (var i = 0; i < this.headers.length; i++) {
      this.associated_headers.push({ header: this.headers[i], selected: false, associated_term_id: "", associated_component: "", associated_component_field: "", associated_values: [], associated_linda_id: [],associated_parent_id: [], is_time_values: false, is_numeric_values: type_dict[this.headers[i]] })
    }
    console.log(this.csv_lines_dict)
    console.log(this.csv_lines_array)


  }
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  Preview() {
    if (this.added) {
      this.preview_request = true
    }
    else {
      this.preview_request = false
      //this.added=false
      this.alertService.error("you need to upload file first")
    }
  }
  Upload() {

  }
  // unload data
  onGiveUp(): void {
    this.alertService.clear()
    this.project_loaded = false
    this.studies_loaded=false
    this.project_model = new Investigation()
    this.study_model = new Study()
    this.project_already_there = false
    this.study_models = []
    this.added = false
    this.preview_request = false
    this.headers = [];
    this.associated_headers = [];
    this.csv_lines_array = [];
    this.csv_lines_dict = [];
    this.fileName = ""
    this.delimitor = ""
    this.data_model = { 'Data file description': "", 'Data file version': "", 'Data file link': "", 'Data': [], 'associated_headers': [], 'headers': [] }

  }
  async check_exists(model_id: string, field: string, model_type: string, parent_id:string) {
    console.log(model_id)
    const data = await this.globalService.is_exist(field, model_id, model_type, parent_id).pipe(first()).toPromise();
    console.log(data)
    if (model_id === "") {
      return false;
    }
    if (!data["success"]){
      this.project_already_there = true
      this.alertService.error("this Investigation unique ID is already used. You cannot integrate this project in Linda cause a project with the same unique id exists !! ");
    }
    return data["success"] ? false : data["success"];
  }

  get already_there(){
    return this.project_already_there  
  }
  get get_hierarchy() {
    return this.hierarchy
  }
  get fileLoaded(): boolean {
    return this.fileUploaded !== null
  }
  get get_project_loaded() {
    return this.project_loaded
  }
  get get_studies_loaded() {
    return this.studies_loaded
  }
  get get_added() {
    return this.added
  }
  get get_preview_request() {
    return this.preview_request
  }
  get get_data_model() {
    return this.data_model
  }
  get get_project_model() {
    return { "Data": [this.project_model] }
  }
  get get_studies_model() {
    return { "Data": this.study_models }
  }
  get get_project_columns() {
    return Object.keys(this.project_model).filter(key => !key.startsWith('_'))
  }
  get get_study_columns() {
    return Object.keys(this.study_model).filter(key => !key.startsWith('_'))
  }
  get get_columns() {
    return this.data_model.headers
  }

  onClose(): void {
    this.dialogRef.close({ event: "Closed" });
  }

}
