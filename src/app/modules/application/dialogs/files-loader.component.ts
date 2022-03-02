import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService, AuthenticationService, AlertService, FileService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInterface } from 'src/app/models/linda/person';
import { first } from 'rxjs/operators';
import { DelimitorComponent } from '../dialogs/delimitor.component';
import * as XLSX from 'xlsx';
import { AssociatedHeadersInterface}  from 'src/app/models/linda/data_files'
import { DataFileInterface}  from 'src/app/models/linda/data_files'
import { timeStamp } from 'console';



interface DialogData {
  parent_id: string;
}

@Component({
  selector: 'app-files-loader',
  templateUrl: './files-loader.component.html',
  styleUrls: ['./files-loader.component.css']
})
export class FilesLoaderComponent implements OnInit {
  
  errorMessage: string;
  successMessage: string;
  parent_id:string=""
  currentUser:UserInterface
  fileUploaded: File;
  fileName: string = ""
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadResponse = { status: '', message: 0, filePath: '' };
  error = { message: '' }
  private csv_lines_dict = []
  private delimitor: string;
  private csv: any;
  private headers = [];
  private associated_headers:AssociatedHeadersInterface[] = [];
  private csv_lines_array = [];
  private selected_file: string = ""
  private cleaned_data_file_model = []
  private data_model:{'Data file description':string,'Data file version':string, 'Data file link':string, 'Data':any[],'associated_headers':AssociatedHeadersInterface[], 'headers':string[]};
  form: FormGroup;
  private loaded:boolean=false
  private added:boolean=false
  private preview_request:boolean=false
  
  dataTable: any;
  dtOptions: any;
  tableData = [];

  constructor(private formBuilder: FormBuilder, private fileService:FileService, private globalService: GlobalService, private alertService:AlertService, private authenticationService: AuthenticationService, public dialogRef: MatDialogRef<FilesLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public delimdialog: MatDialog) {
      this.parent_id=this.data.parent_id
      console.log(this.parent_id)
      
     }
    ngOnInit() {
      this.cleaned_data_file_model = this.get_model('data_file');
      let attributeFilters = { file: [''] };
      this.form = this.formBuilder.group(attributeFilters);
      this.data_model={'Data file description':"",'Data file version':"", 'Data file link':"", 'Data':[], 'associated_headers':[], 'headers':[]}

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
          else {
              this.readExcel();
          }
          //this.loaded=true
          this.form.get('file').setValue(this.fileUploaded);

      }
      this.error.message = "no errors"
    }
    // I/O function
    read_csv(delimitor: string) {
      //let allTextLines= this.fileService.read_csv(this.fileUploaded)
      //this.load_csv2(allTextLines, delimitor)
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
          var csv = fileReader.result;
          this.load_csv(csv, e.loaded, e.total, delimitor)
      }
      fileReader.readAsText(this.fileUploaded);
    }
    readExcel() {
      //let allTextLines= this.fileService.readExcel(this.fileUploaded)
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
    load_csv(csvData: any, e_loaded: any, e_total: any, delimitor: string = ",") {
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
          this.uploadResponse.message = Math.round(100 * (e_loaded / e_total))
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
      this.loaded = true
      // console.log(this.headers_by_filename[this.fileName])
      for (var i = 0; i < this.headers.length; i++) {
          this.associated_headers.push({ header: this.headers[i], selected: false, associated_term_id: "", associated_component: "",associated_component_field: "", associated_values:[], associated_linda_id: [], is_time_values: false, is_numeric_values: type_dict[this.headers[i]] })
      }
      this.selected_file = this.fileName
      console.log(this.csv_lines_dict)
      console.log(this.csv_lines_array)


    } 
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    Preview() {
      if (this.added) {
         this.preview_request=true
      }
      else{
        this.preview_request=false
         //this.added=false
         this.alertService.error("you need to upload file first")
      }
    }
    Upload() {
      if (this.csv_lines_array.length !== 0) {
        console.log(this.csv_lines_dict)
        console.log(this.parent_id)
        const formData = new FormData();
        formData.append('file', this.form.get('file').value);
        let user = JSON.parse(localStorage.getItem('currentUser'));
        //let parent_id="studies/981995"
        //this.associated_headers['associated_linda_id']=this.parent_id
        //this.fileService.upload2(this.fileName,this.csv_lines_array,this.headers,this.associated_headers,this.parent_id).pipe(first()).toPromise().then(data => {console.log(data);})

        //build data file object if 
        //let data_model_dict = {}
        //this.cleaned_data_file_model.forEach(attr => { data_model_dict[attr["key"]] = "" });
        //var data_model = { ...data_model_dict };
        this.data_model['Data file description'] = 'Data have been extracted from ' + this.fileName
        this.data_model['Data file version'] = '1.0'
        this.data_model['Data file link'] = this.fileName
        this.data_model['Data'] = this.csv_lines_dict
        this.data_model['associated_headers'] = this.associated_headers
        this.data_model['headers'] = this.headers
        console.log(this.data_model)
        /* var obj_to_send = {
          'page': 1,
          'per_page': 100,
          'total': this.data_model['Data'].length,
          'total_pages': this.data_model['Data'].length / 100,
          'data': this.data_model['Data']
        } */

       /*  this.tableData = obj_to_send.data;
        console.log(this.tableData)
        var columns = []
        var tableData_columns = Object.keys(this.tableData[0]);
        tableData_columns.forEach(key => {
          columns.push({title: key, data: key})
        });
        this.dtOptions = {
          data: this.tableData,
          columns: columns
        }; */
        this.alertService.success("Data file has been loaded! ")
        this.added=true
      }
      else {
          this.added=false
          this.alertService.error("Please select a file using Browse button")
      }
    }
    // unload data
    onGiveUp(): void{
      this.loaded=false
      this.added=false
      this.preview_request=false
      this.headers = [];
      this.associated_headers = [];
      this.csv_lines_array = [];
      this.csv_lines_dict = [];
      this.fileName=""
      this.selected_file=""
      this.delimitor =""

      this.data_model={'Data file description':"",'Data file version':"", 'Data file link':"", 'Data':[], 'associated_headers':[], 'headers':[]}

    }
    get get_loaded(){
      return this.loaded
    }   
    get get_added(){
      return this.added
    }
    get get_preview_request(){
      return this.preview_request
    }
    
    get get_data_model(){
      return this.data_model
    }
    get get_columns(){
      return this.data_model.headers
    }

    onNoClick(): void {
      this.dialogRef.close({event:"Cancelled"});
    }
  
    onSubmit(): void {
      this.fileService.upload4(this.data_model, this.parent_id).pipe(first()).toPromise().then(data => { console.log(data); })
      this.dialogRef.close({event:"Confirmed"});
  
    }

}
