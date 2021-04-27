import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from  '@angular/forms';
import { FileService, GlobalService,  AlertService } from '../services';
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
import { SelectionModel } from '@angular/cdk/collections';
import {LineChartComponent} from '@swimlane/ngx-charts'
import { push_uniq } from 'terser';
        
            
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
    //@ViewChild('chart') chart: LineChartComponent;
    @ViewChild(LineChartComponent,{static:false }) chart: LineChartComponent;
    form: FormGroup;
    private data={}
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
    private data_to_extract ={}
    private data_arr = []
    private time_set:boolean= false
    private delimitor:string;
    private csv:any;
    private headers=[];
    private headers_select=[];
    private associated_headers={};
    private lines=[];
    private multi = []
    private initialSelection = []
    private checklistSelection = new SelectionModel<string>(true, this.initialSelection /* multiple */);
    //private loaded:boolean=false;
    ontology_type:string
    selected_term:OntologyTerm
    selected_set:[]
    uploadResponse = { status: '', message: 0, filePath: '' };
  
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
                this.model_type=params['model_type'];
                this.model_key=params['model_key'];
                this.mode=params['mode'];
                this.parent_id=params['parent_id']
            }
        );
    }

    //getters and  setters
    public get_headers(){
        return this.headers
    }
    public get_associated_headers(){
        return this.associated_headers;
    }
    public get_headers_select(){
        return this.headers_select;
    }
    public get_lines(){
        return this.lines
    }
//    fileProgress(fileInput: any) {
//        this.fileData = <File>fileInput.target.files[0];
//        this.preview();
//    }
    ngOnInit() {
        
        if (this.mode==="edit"){
                this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(received_data => {
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

    // I/O part
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
        this.headers = allTextLines[0].split(delimitor)
        for (let i = 0; i < this.headers.length; i++) {
            this.headers[i]=this.headers[i].replace(/['"]+/g, '')
        }
        
        
        this.lines = [];
        this.data_arr=[]
        
        for (let i = 1; i < allTextLines.length; i++) {
            let csv_dict={}
            this.uploadResponse.message=Math.round(100* (e.loaded / e.total))
            
            // split content based on comma

            let line = allTextLines[i].split(',');

            if (line.length === this.headers.length) {
                let tarr = [];
                for (let j = 0; j < this.headers.length; j++) {
                    tarr.push(line[j]);
                    csv_dict[this.headers[j]]=line[j]
                }
                this.lines.push(tarr);
                this.data_arr.push(csv_dict)
            }
        }
        console.log(this.headers)
        console.log(this.data_arr)
        for (var i = 0; i < this.headers.length; i++){
            this.associated_headers[this.headers[i]]={selected:false, associated_term_id:"", is_time_values:false}
            if (i===0){
                this.headers_select.push('time')
            }
            else{
                this.headers_select.push('others')
            } 
        }
        console.log(this.associated_headers)
        console.log(this.headers)
        console.log(this.data_arr)
    }
      
    readAsCSV() {  
        var csvData = XLSX.utils.sheet_to_csv(this.worksheet);  
        const data: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          
        //FileSaver.saveAs(data, "CSVFile" + new Date().getTime() + '.csv');  
    }


    //events 
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.headers_select, event.previousIndex, event.currentIndex);
        this.modified=true
    }

    onFileChange(event) {
        this.headers=[];
        this.headers_select=[];
        this.associated_headers={};
        this.lines=[];
        //this.fileUploaded = <File>event.target.files[0];
        if (event.target.files.length > 0) {
            this.uploadResponse.status='progress'
            this.fileUploaded = event.target.files[0];
            //let fileReader = new FileReader();
            this.fileName=this.fileUploaded.name
            if (this.fileUploaded.type==="text/csv"){
                const dialogRef = this.dialog.open(DelimitorDialogComponent, {width: '1000px', data: {delimitor: ""}});
                dialogRef.afterClosed().subscribe(data => {
                    if (data!==undefined){
                        this.delimitor = data.delimitor;
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
    onExtract(values:string, key:string) {

        this.data_to_extract[values]=key

        console.log(this.data_to_extract)
        // console.log([... new Set(groups_label)])
        //let component_set=new Set(groups_label)
        //let found="found "+ component_set.size + " " +  key + " !! "
        //     //console.log(found)
        ///this.associated_headers[key]={selected:true, associated_term_id:component_set, is_time_values:false}
        //console.log(this.associated_headers)
        
    }

    onSelect(values:string, key:string) {
        //console.log(this.selectedOntology)
        if (values === "study"){
            this.associated_headers[key]={selected:true, associated_term_id:key,is_time_values:false}
            console.log(values)
            console.log(key)
            let groups_label=[]
            for (var i = 0; i < this.headers.length; i++){
                if (this.headers[i]==key){
                    for (var j = 0; j < this.lines.length; j++){
                        groups_label.push(this.lines[j][i])
                    }
                }
            }
        }
        else{
            const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', autoFocus: false, maxHeight: '90vh', data: {ontology_id: values, selected_term: null,selected_set:[], multiple:false, uncheckable: false, observed:true}});
            dialogRef.afterClosed().subscribe(result => {
                if (result!==undefined){
                    this.ontology_type = result.ontology_id;
                    this.selected_term = result.selected_term;
                    this.selected_set = result.selected_set;
                    var term_ids=""
                    for(var i = this.selected_set.length - 1; i >= 0; i--) {
                        term_ids+=this.selected_set[i]['id'] + '/'
                    }
                    term_ids = term_ids.slice(0, -1);
                    
                    this.associated_headers[key]={selected:true, associated_term_id:term_ids,is_time_values:false}
                };
            });
        }
    }

    onSelectTime(values:string, key:string) {
        if (values==="custom_date_format"){
            const dialogRef = this.dialog.open(DateformatComponent, {width: '1000px', data: {date_format: ""}});
            dialogRef.afterClosed().subscribe(result => {
                this.associated_headers[key]={selected:true, associated_term_id:result.date_format, is_time_values:true}
                console.log(result); 
                this.time_set=true  
        });
        }
        else{
            this.associated_headers[key]={selected:true, associated_term_id:values,is_time_values:true}
            this.time_set=true  
        }
    }

    Focused(values:string, key:string){
        console.log(values)
    }
    
    
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(key:string): void {
        this.checklistSelection.toggle(key);
        console.log(key)
        console.log(this.checklistSelection)
        console.log(this.checklistSelection.isSelected(key))
        if (this.checklistSelection.isSelected(key)) {
            console.log(key)
            let test=[]
            let obj = {'name':key, 'series':[]}
            
            
            let time_index=0
            for (var i = 0; i < this.headers.length; i++){
                if (this.associated_headers[this.headers[i]]['is_time_values'] == true){
                    time_index=i
                }
            }
            for (var i = 0; i < this.headers.length; i++){
                if (this.headers[i]==key){
                    for (var j = 0; j < this.lines.length; j++){
                        let obj2 = {'name':'', 'value':0}
                        obj2.name=this.lines[j][time_index]
                        obj2.value=parseInt(this.lines[j][i], 10)
                        obj.series.push(obj2)
                    }
                }
            }
            this.multi.push(obj)
            this.multi = [...this.multi]
            console.log(this.multi)
            // this.chart.filteredDomain = null; 
            // this.chart.update();
        }
        else{
            console.log(key)
            console.log(this.multi)
            this.multi =this.multi.filter(prop => prop.name != key)
            console.log(this.multi)
            this.multi = [...this.multi]
            console.log(this.multi)
            console.log("to remove")
        }
    }
     //Chart part
     view: any[] = [1200, 300];

     // options
     legend: boolean = true;
     showLabels: boolean = true;
     animations: boolean = true;
     xAxis: boolean = true;
     yAxis: boolean = true;
     showYAxisLabel: boolean = true;
     showXAxisLabel: boolean = true;
     xAxisLabel: string = 'Day';
     yAxisLabel: string = 'Degree';
     timeline: boolean = false;
 
     colorScheme = {
         domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
     };
     
     onSelectChart(data): void {
         console.log('Item clicked', JSON.parse(JSON.stringify(data)));
     }
 
     onActivate(data): void {
         console.log('Activate', JSON.parse(JSON.stringify(data)));
     }
 
     onDeactivate(data): void {
         console.log('Deactivate', JSON.parse(JSON.stringify(data)));
     }
 


    onSubmit() {
        if(this.mode==="create"){
            console.log(this.lines.length)
            if (this.lines.length!==0){
                const formData = new FormData();
                formData.append('file', this.form.get('file').value);
                let user=JSON.parse(localStorage.getItem('currentUser'));
                //let parent_id="studies/981995"
                this.fileService.upload2(this.fileName,this.lines,this.headers,this.associated_headers,this.parent_id).pipe(first()).toPromise().then(data => {console.log(data);})
                this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
            }
            else{
                this.alertService.error("you need to select a file")
            }
        }
        else if(this.mode==="extract"){
            console.log(this.data_to_extract)
            if (this.data_to_extract['study']){
                let groups_label=[]

                for (var i = 0; i < this.headers.length; i++){
                    if (this.headers[i]==this.data_to_extract['study']){
                        for (var j = 0; j < this.lines.length; j++){
                            groups_label.push(this.lines[j][i])
                        }
                    }
                }
                let study_component_set=new Set(groups_label)
                //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build    
                let model = []
                let user=JSON.parse(localStorage.getItem('currentUser'));
                this.globalService.get_model('study').toPromise().then(data => {
                    let keys = Object.keys(data);
                    for (var i = 0; i <  keys.length; i++) {
                        if ( keys[i].startsWith("_") ||  keys[i].startsWith("Definition")) {
                            keys.splice(i, 1);
                            i--;
                        }
                        else {
                            var dict = {}
                            dict["key"] = keys[i]
                            dict["pos"] = data[keys[i]]["Position"]
                            model.push(dict)
                            
                        }   
                    }
                    model = model.sort(function (a, b) { return a.pos - b.pos; });
                    let model2={}
                    model.forEach(attr => {
                        model2[attr["key"]] = ""
                    });

                    var model_tmp = {...model2};
                    var study_component_set_array = Array.from(study_component_set);
                    
                    for (var i = 0; i < study_component_set_array.length; i++){
                        model_tmp["Study unique ID"]=study_component_set_array[i]
                        model_tmp["Short title"]=study_component_set_array[i]
                        console.log(model_tmp)
                        console.log(this.lines)
                        console.log(study_component_set_array[i])
                        // var study_lines = this.lines.filter(function (studyLines) {
                        //     return studyLines.filter(prop => prop === study_component_set_array[i]);
                        //   });


                        // var data = [ { ... }, ... ];  // Your array
                        // var newData = data.filter((elt, eltIndex) => data.some((sameNameElt, sameNameEltIndex) => sameNameElt.name === elt.name && sameNameEltIndex !== eltIndex));
                        // console.log("new table: ", newTable);

                        console.log(this.data_arr)
                        var line_key=this.data_to_extract['study']
                        console.log(line_key)
                        var study_lines = this.data_arr.filter(line => {
                            return line[line_key] === study_component_set_array[i];
                        });

                        console.log(study_lines)
                        //study_lines=
                        

                        this.globalService.add(model_tmp, 'study', this.parent_id).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]) {

                                    this.fileService.upload2(this.fileName, study_lines,this.headers,this.associated_headers,data["_id"]).pipe(first()).toPromise().then(
                                        data_upload => {
                                            console.log(data_upload);
                                            this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                                            //var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                                            //this.alertService.success(message)
                                            return true;
                                        
                                        })
                                   
                                    return true;
                                    
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                    return false;
                                }
                            }
                        );
                    }                       
                });
            

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

        //    this.fileService.upload(this.lines).subscribe(
        //      (res) => this.uploadResponse = res,
        //      (err) => this.error = err
        //    );
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
