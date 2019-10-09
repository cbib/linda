import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from  '@angular/forms';
import { UploadService,GlobalService,  AlertService } from '../services';
import { OntologyTerm } from '../ontology/ontology-term';

import { first } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { DateformatComponent } from '../dateformat/dateformat.component';
import { DataTablesModule } from 'angular-datatables';

import * as XLSX from 'xlsx';
    
        
            
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    @Input() parent_id; 
    @Input() model_key:string;
    @Input() model_type:string;
    @Input() mode:string;
    form: FormGroup;
    private data={}
    private selectedOntology:string;
    today: number = Date.now();
    fileData: File = null;
    fileUploaded: File;  

    fileName:string=""
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    error: string;
    userId: number = 1;
    csv:any;
    storeData:any;
    worksheet: any;
    protected headers=[];
    private associated_headers={};
    private lines=[];
    //private loaded:boolean=false;
    ontology_type:string
    selected_term:OntologyTerm
    uploadResponse = { status: '', message: 0, filePath: '' };
  
    constructor(private formBuilder: FormBuilder, private uploadService: UploadService,private router: Router,
        private alertService: AlertService, private globalService: GlobalService,
        private route: ActivatedRoute,public dialog: MatDialog) { 
        
        
        this.route.queryParams.subscribe(
            params => {        
            this.model_type=params['model_type'];
            this.model_key=params['model_key'];
            this.mode=params['mode'];
            this.parent_id=params['parent_id']
            //this.investigation_key=params['key']
            //console.log(this.investigation_key);
            if (this.mode==="edit"){
                this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(data => {
                    console.log(data);
                    this.data=data;
                    this.headers=data["headers"];
                    this.associated_headers=data["associated_headers"];
                    this.lines=data["data"]
                })
            }
            }
        );
    }
//    fileProgress(fileInput: any) {
//        this.fileData = <File>fileInput.target.files[0];
//        this.preview();
//    }
    get_headers(){
        return this.headers
    }
    get_lines(){
        return this.lines
    }
    ngOnInit() {
        console.log(this.mode)
        this.form = this.formBuilder.group({file: ['']});
    }
//    reset(event){
//        console.log("1#################################################")
//        console.log(event.target)
//    }
    onFileChange(event) {
        console.log("1#################################################")
        this.fileData = <File>event.target.files[0];
        
        
        if (event.target.files.length > 0) {
            
            this.uploadResponse.status='progress'
            this.fileUploaded = event.target.files[0];
            let fileReader = new FileReader();
            this.fileName=this.fileUploaded.name
                
            if (this.fileUploaded.type==="text/csv"){
                this.read_csv() 
            }
            else{               
                this.readExcel();
                
            }
            //this.loaded=true
            this.form.get('file').setValue(this.fileUploaded);
            
        }
    }
    
    read_csv(){
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.csv=fileReader.result;
            
            this.load_csv(this.csv,e)
            
//            let allTextLines = this.csv.split(/\r|\n|\r/);
//            this.headers = allTextLines[0].split(',');
//            if (allTextLines.length>100){
//                this.alertService.error("Displaying 100 of "+this.lines.length+ "items")
//            }
//            this.lines = [];
//            for (let i = 1; i < allTextLines.length; i++) {
//                this.uploadResponse.message=Math.round(100* (e.loaded / e.total))
//
//                // split content based on comma
//                let data = allTextLines[i].split(',');
//                if (data.length === this.headers.length) {
//                    let tarr = [];
//                    for (let j = 0; j < this.headers.length; j++) {
//                        tarr.push(data[j]);
//                    }
//                    // log each row to see output 
//                    this.lines.push(tarr);
//                }
//            }
//
//            for (var i = 0; i < this.headers.length; i++){
//                this.associated_headers[this.headers[i]]={selected:false,associated_term_id:"",is_time_values:false}
//            }
        }
        fileReader.readAsText(this.fileUploaded); 
    }
    
    readExcel() {  
        let fileReader = new FileReader();  
        fileReader.onload = (e) => {  
                    this.storeData=fileReader.result;
                    var data = new Uint8Array(this.storeData);  
                    var arr = new Array();  
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);  
                    var bstr = arr.join(""); 
                    var book = XLSX.read(bstr, { type: "binary" }); 
                    var first_sheet_name = book.SheetNames[0];  
                    this.worksheet = book.Sheets[first_sheet_name]; 
                    var csvData = XLSX.utils.sheet_to_csv(this.worksheet);  

                    this.load_csv(csvData,e) 
//                    let allTextLines = csvData.split(/\r|\n|\r/);
//                    this.headers = allTextLines[0].split(',');
//                    this.lines = [];
//                    for (let i = 1; i < allTextLines.length; i++) {
//                        this.uploadResponse.message=Math.round(100* (e.loaded / e.total))
//                        // split content based on comma
//                        let data = allTextLines[i].split(',');
//                        if (data.length === this.headers.length) {
//                            let tarr = [];
//                            for (let j = 0; j < this.headers.length; j++) {
//                                tarr.push(data[j]);
//                            }
//                            this.lines.push(tarr);
//                        }
//                    }
//                    for (var i = 0; i < this.headers.length; i++){
//                        this.associated_headers[this.headers[i]]={selected:false,associated_term_id:"",is_time_values:false}
//                    }

        }  
        fileReader.readAsArrayBuffer(this.fileUploaded);  
    }
    
    
    load_csv(csvData:any,e:any){
        let allTextLines = csvData.split(/\r|\n|\r/);
        this.headers = allTextLines[0].split(',');
        this.lines = [];
        for (let i = 1; i < allTextLines.length; i++) {
            this.uploadResponse.message=Math.round(100* (e.loaded / e.total))
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length === this.headers.length) {
                let tarr = [];
                for (let j = 0; j < this.headers.length; j++) {
                    tarr.push(data[j]);
                }
                this.lines.push(tarr);
            }
        }
        for (var i = 0; i < this.headers.length; i++){
            this.associated_headers[this.headers[i]]={selected:false,associated_term_id:"",is_time_values:false}
        }
    }
      
    readAsCSV() {  
        var csvData = XLSX.utils.sheet_to_csv(this.worksheet);  
        const data: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          
        //FileSaver.saveAs(data, "CSVFile" + new Date().getTime() + '.csv');  
    }

    onSubmit() {
        if(this.mode==="create"){
            console.log(this.lines.length)
            if (this.lines.length!==0){
                //console.log(this.form.get('avatar').value)
                //console.log(this.loaded)
                const formData = new FormData();
                formData.append('file', this.form.get('file').value);
                let user=JSON.parse(localStorage.getItem('currentUser'));
                //let parent_id="studies/981995"
                this.uploadService.upload2(this.fileName,this.lines,this.headers,this.associated_headers,this.parent_id).pipe(first()).toPromise().then(data => {console.log(data);})
                this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
            }
            else{
                this.alertService.error("you need to select a file")
            }
        }
        else{
            if (this.lines.length!==0){
             
                let user=JSON.parse(localStorage.getItem('currentUser'));
                //let parent_id="studies/981995"
                this.globalService.update(this.model_key,this.data,this.model_type).pipe(first()).toPromise().then(data => {console.log(data);})
                this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
            }
            else{
                this.alertService.error("you need to select a file")
            }
        }

        //    this.uploadService.upload(this.lines).subscribe(
        //      (res) => this.uploadResponse = res,
        //      (err) => this.error = err
        //    );
    }
    Focused(values:string, key:string){
        console.log(values)
    }
    onSelect(values:string, key:string) {
        console.log(this.selectedOntology)
        console.log(values)
        console.log(key)
        const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', data: {ontology_type: values,selected_term: null,selected_set:[]}});
        dialogRef.afterClosed().subscribe(result => {
            if (result!==undefined){
                this.ontology_type = result.ontology_type;
                this.selected_term = result.selected_term;
                this.associated_headers[key]={selected:true, associated_term_id:this.selected_term.id,is_time_values:false}
                console.log(this.associated_headers);
            };
        });
    }
    
    onSelectTime(values:string, key:string) {
        console.log(values)
        console.log(key)
        if (values==="custom_date_format"){
            const dialogRef = this.dialog.open(DateformatComponent, {width: '1000px', data: {date_format: ""}});
            dialogRef.afterClosed().subscribe(result => {
                this.associated_headers[key]={selected:true, associated_term_id:result.date_format, is_time_values:true}
                console.log(result);   
        });
        }
        else{
            this.associated_headers[key]={selected:true, associated_term_id:values,is_time_values:true}
            console.log(this.lines)
        }
        
        
            
    }
//    cancel(modelForm){
//        console.log(this.form.get('file').value)
//        this.fileData=null
//        this.loaded=false
//        this.form.reset();
//        console.log(this.form.get('file').value)
//        
//    }

}

