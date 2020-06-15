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
import { DelimitorDialogComponent } from '../dialog/delimitor-dialog.component';
import * as XLSX from 'xlsx';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


        
            
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    @Input() parent_id:string; 
    @Input() model_key:string;
    @Input() model_type:string;
    @Input() mode:string;
    form: FormGroup;
    private data={}
    //private selectedOntology:string;
    //fileData: File = null;
    fileUploaded: File;  
    fileName:string=""
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    error: string;
    userId: number = 1;
    
    //parsing EXCEL
    storeData:any;
    worksheet: any;
    public modified:boolean=false;
    
    //parsing CSV
    private delimitor:string;
    private csv:any;
    private headers=[];
    private headers_select=[];
    private associated_headers={};
    private lines=[];
    //private loaded:boolean=false;
    ontology_type:string
    selected_term:OntologyTerm
    uploadResponse = { status: '', message: 0, filePath: '' };
  
    constructor(
            private formBuilder: FormBuilder, 
            private uploadService: UploadService,
            private router: Router,
            private alertService: AlertService, 
            private globalService: GlobalService,
            private route: ActivatedRoute,
            public dialog: MatDialog) { 
        
        
//        if (this.mode==="edit"){
//                this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(received_data => {
//                    console.log(received_data);
//                    this.data=received_data;
//                    this.headers=this.data["headers"];
//                    this.associated_headers=this.data["associated_headers"];
//                    this.lines=this.data["data"]
//                })
//            }
        
        this.route.queryParams.subscribe(
            params => {        
                this.model_type=params['model_type'];
                this.model_key=params['model_key'];
                this.mode=params['mode'];
                this.parent_id=params['parent_id']
            console.log(params)
            console.log(params['model_key'])
            console.log(params['parent_id'])
            //this.investigation_key=params['key']
            console.log(this.mode);
            
            }
        );
    }
    get_headers(){
        return this.headers
    }
    get_associated_headers(){
        return this.associated_headers;
    }
    get_headers_select(){
        return this.headers_select;
    }
    get_lines(){
        return this.lines
    }
//    fileProgress(fileInput: any) {
//        this.fileData = <File>fileInput.target.files[0];
//        this.preview();
//    }
    ngOnInit() {
        console.log(this.mode)
        console.log(this.model_key)
        console.log(this.model_type)
        if (this.mode==="edit"){
                this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(received_data => {
                    console.log(received_data);
                    this.data=received_data;
                    this.headers=this.data["headers"];
                    this.associated_headers=this.data["associated_headers"];
                    this.lines=this.data["data"]
                    for (var i = 0; i < this.headers.length; i++){
                        if (i===0){
                            this.headers_select.push('time')
                        }
                        else{
                            this.headers_select.push('others')
                        }

                    }
                })
            }
        this.form = this.formBuilder.group({file: ['']});
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.headers_select, event.previousIndex, event.currentIndex);
        this.modified=true
        console.log(this.headers)
        console.log(this.associated_headers)
    }
//    reset(event){
//        console.log("1#################################################")
//        console.log(event.target)
//    }
    onFileChange(event) {
        console.log("1#################################################")
        this.headers=[];
        this.headers_select=[];
        this.associated_headers={};
        this.lines=[];
        //this.fileUploaded = <File>event.target.files[0];
        
        
        if (event.target.files.length > 0) {
            
            this.uploadResponse.status='progress'
            this.fileUploaded = event.target.files[0];
            let fileReader = new FileReader();
            this.fileName=this.fileUploaded.name
                
            if (this.fileUploaded.type==="text/csv"){
                const dialogRef = this.dialog.open(DelimitorDialogComponent, {width: '1000px', data: {delimitor: ""}});
                dialogRef.afterClosed().subscribe(data => {
                    console.log(data)
                if (data!==undefined){
                    console.log(data.delimitor)
                    this.delimitor = data.delimitor;
                    console.log(this.delimitor);
                    this.read_csv(this.delimitor) 
                };
            });
                
                
                
                
                
            }
            else{               
                this.readExcel();
                
            }
            //this.loaded=true
            this.form.get('file').setValue(this.fileUploaded);
            
        }
    }
    
    read_csv(delimitor:string){
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.csv=fileReader.result;
            this.load_csv(this.csv,e,delimitor)
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
                    this.csv = XLSX.utils.sheet_to_csv(this.worksheet);  
                    this.load_csv(this.csv,e) ;


        }  
        fileReader.readAsArrayBuffer(this.fileUploaded);  
    }
    
    
    load_csv(csvData:any,e:any,delimitor:string=","){
        let allTextLines = csvData.split(/\r|\n|\r/);
        this.headers = allTextLines[0].split(delimitor);
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
            if (i===0){
                this.headers_select.push('time')
            }
            else{
                this.headers_select.push('others')
            }
            
        }
        console.log(this.associated_headers)
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
        //console.log(this.selectedOntology)
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
