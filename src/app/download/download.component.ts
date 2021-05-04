import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { FileService, GlobalService,  AlertService } from '../services';
import { OntologyTerm } from '../ontology/ontology-term';
import { first } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { DateformatComponent } from '../dateformat/dateformat.component';
import { DelimitorDialogComponent } from '../dialog/delimitor-dialog.component';
import { HelpLoaderDialogComponent } from '../dialog/help-loader-dialog.component';
import * as XLSX from 'xlsx';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import {LineChartComponent} from '@swimlane/ngx-charts'    
import { getUniqueXDomainValues } from '@swimlane/ngx-charts';   
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    // input part
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

    
    private extract_options = [
        {name:'Extract MIAPPE components', value:'undefined'}, 
        {name:'Extract Study labels from column', value:'study'},
        {name:'Extract Experimental Factors', value:'experimental_factor'},
        {name:'Extract Material Sources', value:'material_source'},    
        {name:'Extract Observation Units', value:'observation_unit'},
        {name:'Extract Observed variables', value:'observed_variable'},
        {name:'Extract Timeline', value:'time'}
    ];
    private extract_study_options = [
        {name:'Extract MIAPPE components', value:'undefined'}, 
        {name:'Extract Study labels from column', value:'study'},
        {name:'Extract Study sites from column', value:'site'},
    ];

    
    //Chart part
    view: any[] = [1500, 300];
    // options
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    rotateXAxisTicks: boolean = true
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Day';
    yAxisLabel: string = '';
    timeline: boolean = false;
    autoScale: boolean = true



    
    xScaleMin: any
    xScaleMax: any
    scaleType:string;
    roundDomains:boolean =false
    xSet: any;


    
    //radio button box
    checked = false;
    indeterminate = false;
    labelPosition: 'all' | 'only_studies' | 'only_data' = 'only_studies';
    disabled = false;

    //parsing CSV
    private data_to_extract ={}
    private lines_dict = []
    private time_set:boolean= false
    private delimitor:string;
    private csv:any;

    private cleaned_data_file_model =[]
    private cleaned_study_model =[]
    // data to be send
    private headers=[];
    private headers_select=[];
    private associated_headers=[];
    private associated_columns={};
    private lines_arr=[];
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
    formatTime(val){
        console.log(val)
        return val

    }
    ngOnInit() {
        if (this.mode.includes('edit')){
                this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(received_data => {
                    console.log(typeof(received_data))
                    this.data=received_data;
                    this.headers=this.data["headers"];
                    this.associated_headers=this.data["associated_headers"];

                    this.associated_headers.forEach(element=>{
                        if(element['is_time_values']){
                            this.time_set=true
                        }
                    })
                    // Object.keys(this.associated_headers).forEach(key=>{
                    //     if (this.associated_headers[key]['is_time_values']){
                    //         this.time_set=true
                    //     }
                    // });
                    console.log(this.associated_headers)
                    if (this.model_type=="data_file"){
                        this.lines_dict=this.data["Data"]
                    }
                    else{
                        this.lines_arr=this.data["data"]
                    }
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
         this.get_model('study');
         this.get_model('data_file');
         let attributeFilters = {file: ['']};
         this.form = this.formBuilder.group(attributeFilters);
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
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    load_csv(csvData:any,e:any,delimitor:string=","){

        this.lines_arr = [];
        this.lines_dict=[]
        this.associated_columns= {}
        this.associated_headers = []
        
        let allTextLines = csvData.split(/\r|\n|\r/);
        this.headers = allTextLines[0].split(delimitor)
        
        for (let i = 0; i < this.headers.length; i++) {
            this.headers[i]=this.headers[i].replace(/['"]+/g, '').replace(/\./g, '_')
        }
        let type_dict={}        
        for (let i = 1; i < allTextLines.length; i++) {
            let csv_dict={}
            this.uploadResponse.message=Math.round(100* (e.loaded / e.total))            
            // split content based on separator
            let line = allTextLines[i].split(delimitor);

            if (line.length === this.headers.length) {
                let csv_arr = [];
                for (let j = 0; j < this.headers.length; j++) {
                    
                    csv_arr.push(line[j].replace(/['"]+/g, ''));
                    csv_dict[this.headers[j]]=line[j].replace(/['"]+/g, '')
                    if (i === 1){
                        if(this.isNumeric(csv_dict[this.headers[j]])){
                            type_dict[this.headers[j]]=true
                        }
                        else{
                            type_dict[this.headers[j]]=false
                        }
                    }
                }
                this.lines_arr.push(csv_arr);
                this.lines_dict.push(csv_dict)
            }
        }
        for (var i = 0; i < this.headers.length; i++){
            this.associated_columns[this.headers[i]]={selected:false, associated_component:"", is_time_values:false}
            this.associated_headers.push({header:this.headers[i], selected:false, associated_term_id:"",associated_component:"", associated_linda_id:"", is_time_values:false, is_numeric_values:type_dict[this.headers[i]]})
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
    get_associated_header(key:string){
        return this.associated_headers.filter(prop => prop.header == key)
    }
    get_model(model_type:string) {
        let model = [];

        //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
        this.globalService.get_model(model_type).toPromise().then(data => {
            model = data;
            //console.log(this.model)
            var keys = Object.keys(model);
            let cleaned_model = []
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
                    cleaned_model.push(dict)
                }
            }
            cleaned_model  = cleaned_model .sort(function (a, b) { return a.pos - b.pos; });
            console.log(cleaned_model )
            if (model_type == 'study'){
                this.cleaned_study_model=cleaned_model
            }
            else{
                this.cleaned_data_file_model=cleaned_model
            }
        });
        
    }
    //events 
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.headers_select, event.previousIndex, event.currentIndex);
        this.modified=true
    }
    onFileChange(event) {
        this.headers=[];
        this.headers_select=[];
        this.associated_headers=[];
        this.associated_columns={};
        this.lines_arr=[];
        this.lines_dict=[];
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
    onExtractStudy(values:string, key:string) {
        console.log(values);
        if (values==="time"){
            const dialogRef = this.dialog.open(DateformatComponent, {width: '1000px', data: {date_format: ""}});
            dialogRef.afterClosed().subscribe(result => {
                //this.associated_headers[key]={selected:true, associated_term_id:result.date_format, associated_component:"time", is_time_values:true, is_numeric_values:false}
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = result.date_format; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = "time"; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = true; });

                // this.associated_headers.filter(prop => prop.header == key)['selected']=true
                // this.associated_headers.filter(prop => prop.header == key)['associated_term_id']=result.date_format
                // this.associated_headers.filter(prop => prop.header == key)['associated_component']="time"
                // this.associated_headers.filter(prop => prop.header == key)['is_time_values']=true
                console.log(result); 
                this.time_set=true  
                this.checklistSelection.toggle(key);
            });
        }
        else{
            this.data_to_extract[values]=key
            let groups_label=[]
            for (var i = 0; i < this.headers.length; i++){
                if (this.headers[i]==key){
                    for (var j = 0; j < this.lines_arr.length; j++){
                        groups_label.push(this.lines_arr[j][i])
                    }
                }
            }
            this.checklistSelection.toggle(key);
            let component_set=new Set(groups_label)
            let found="found "+ component_set.size + " " +  key + " !! "
            //     //console.log(found)
            this.associated_columns[key]={selected:true, associated_component:values, is_time_values:false}
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = ''; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = values; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = false; });

            //this.associated_headers[key]={selected:true, associated_term_id:"", associated_component:values, is_time_values:false}
            console.log(this.associated_headers)
        }
        
    }
    onSelectOntology(values:string, key:string) {
        if (values === "study"){
            this.associated_headers[key]={selected:true, associated_term_id:key, associated_component:"study",associated_linda_id:"", is_time_values:false}
            console.log(values)
            console.log(key)
            let groups_label=[]
            for (var i = 0; i < this.headers.length; i++){
                if (this.headers[i]==key){
                    for (var j = 0; j < this.lines_arr.length; j++){
                        groups_label.push(this.lines_arr[j][i])
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
                    this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
                    this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = term_ids; });
                    this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = "ontology"; });
                    //this.associated_headers[key]={selected:true, associated_term_id:term_ids,  associated_component:"ontology", is_time_values:false}
                };
            });
        }
    }
    onSelectTime(values:string, key:string) {
        if (values==="custom_date_format"){
            const dialogRef = this.dialog.open(DateformatComponent, {width: '1000px', data: {date_format: ""}});
            dialogRef.afterClosed().subscribe(result => {
                //this.associated_headers[key]={selected:true, associated_term_id:result.date_format, associated_component:"time", is_time_values:true, is_numeric_values:false}
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = result.date_format; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = 'time'; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = true; });
                console.log(result); 
                this.time_set=true  
                this.checklistSelection.toggle(key);
            });
        }
        else{

            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = values; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = 'time'; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = true; });
            //this.associated_headers[key]={selected:true, associated_term_id:values,associated_component:"time", is_time_values:true}
            this.checklistSelection.toggle(key);
            this.time_set=true  
        }
    }
    Focused(values:string, key:string){
        console.log(values)
    }
    onShowHelp(page: string){
        const dialogRef = this.dialog.open(HelpLoaderDialogComponent, { width: '1200px', data: { help_page: page } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.event == 'Confirmed') {
                    console.log("hello")
                }
            }
        });
    }
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(key:string): void {
 
        this.checklistSelection.toggle(key);
        // if (this.mode === 'extract' ){
        //     if (this.checklistSelection.isSelected(key)) {
        //         console.log(this.associated_headers)
        //         this.associated_columns[key]['selected']=true
        //         this.associated_headers[key]['selected']=true
        //     }
        //     else{
        //         this.associated_columns[key]['selected']=false
        //         this.associated_headers[key]['selected']=false
        //     }
        // }
        // else{
            if (this.checklistSelection.isSelected(key)) {
                this.associated_headers.filter(prop => prop.header == key)['selected']=true
                console.log(key)
                let obj = {'name':key, 'series':[]}
                let time_index=0
                let time_key=""
                for (var i = 0; i < this.headers.length; i++){
                    if (this.associated_headers.filter(prop => prop.header == this.headers[i])['is_time_values'] == true){
                        console.log("time index", i)
                        time_index=i
                        time_key=this.headers[i]
                    }
                }
                for (var i = 0; i < this.headers.length; i++){
                    if (this.headers[i]==key){
                        console.log(this.headers[i])
                        if (this.model_type==='data_file'){
                            for (var j = 0; j < this.lines_dict.length; j++){
                                let obj2 = {'name':'', 'value':0}
                                obj2.name=this.lines_dict[j][time_key]
                                obj2.value=parseInt(this.lines_dict[j][key], 10)
                                obj.series.push(obj2)
                            }
                        }
                        else{
                            for (var j = 0; j < this.lines_arr.length; j++){
                                console.log(this.lines_arr[j])
                                let obj2 = {'name':'', 'value':0}
                                obj2.name=this.lines_arr[j][time_index]
                                obj2.value=parseInt(this.lines_arr[j][i], 10)
                                console.log(obj2)
                                obj.series.push(obj2)
                            }
                        }
                    }
                }
                this.multi.push(obj)
                this.multi = [...this.multi]
            }
            else{
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = false; });
                
                this.multi =this.multi.filter(prop => prop.name != key)
                this.multi = [...this.multi]
            }
            // var timelineXDomain= this.getXDomain()
            // var timelineWidth=1500
            // var timelineXScale = this.getXScale(timelineXDomain, timelineWidth);
        //}
    }
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
            console.log(this.lines_arr.length)
            if (this.lines_arr.length!==0){
                const formData = new FormData();
                formData.append('file', this.form.get('file').value);
                let user=JSON.parse(localStorage.getItem('currentUser'));
                //let parent_id="studies/981995"
                //this.associated_headers['associated_linda_id']=this.parent_id
                this.fileService.upload2(this.fileName,this.lines_arr,this.headers,this.associated_headers,this.parent_id).pipe(first()).toPromise().then(data => {console.log(data);})
                this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
            }
            else{
                this.alertService.error("you need to select a file")
            }
        }
        else if(this.mode==="extract"){
            console.log(this.data_to_extract)
            if (Object.keys(this.data_to_extract).length === 0){
                this.alertService.error("You need to assign one original header for Study component Label; see Help button for more details")
            }
            if (this.data_to_extract['study']){
                let groups_label=[]
                
                //search for column declared as study column
                for (var i = 0; i < this.headers.length; i++){
                    if (this.headers[i]==this.data_to_extract['study']){
                        for (var j = 0; j < this.lines_arr.length; j++){
                            groups_label.push(this.lines_arr[j][i])
                        }
                    }
                }
                //get unique study names
                let study_component_set=new Set(groups_label)
                
                //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build    
                let study_model_array = []
                let user=JSON.parse(localStorage.getItem('currentUser'));



                let study_model_dict = {}
                this.cleaned_study_model.forEach(attr => {study_model_dict[attr["key"]] = ""});
                var study_model = {...study_model_dict};
                var study_component_set_array = Array.from(study_component_set);
                    

                for (var i = 0; i < study_component_set_array.length; i++){
                    console.log(study_component_set_array[i])
                    study_model["Study unique ID"] = study_component_set_array[i]
                    study_model["Short title"] = study_component_set_array[i]
                    let unique_study_label= study_component_set_array[i]
                    //get the header label for study column in the csv file
                    var study_column_name = this.data_to_extract['study']
                   
                    // filter lines_dict to keep lines that match unique_study_label
                    var study_lines = this.lines_dict.filter(line => {
                        // var line_keys = Object.keys(line);
                        // line_keys.forEach(
                        //     key => {
                        //         if (line[key] === "NA"){
                        //             line[key]= null
                        //         }

                        //     }
                        // )
                        return line[study_column_name] === unique_study_label;
                    });



                    //build data file object
                    let data_model_dict = {}
                    this.cleaned_data_file_model.forEach(attr => {data_model_dict[attr["key"]] = ""});
                    var data_model = {...data_model_dict};
                    //let obj2send = {'data': study_lines, 'associated_headers': this.associated_columns, 'headers': this.headers};
                    data_model['Data file description']= 'Data have been extracted for ' +study_component_set_array[i]+ ' from '+ this.fileName
                    data_model['Data file version']= '1.0'
                    data_model['Data file link'] = this.fileName
                    data_model['Data'] = study_lines
                    data_model['associated_headers'] = this.associated_headers
                    data_model['headers'] = this.headers
                    
                    console.log(study_lines)
                    console.log(data_model)

                    // here tyr to add Study associated with data files
                    if (this.labelPosition==="all") {
                        this.globalService.add_parent_and_childs(study_model, data_model, 'study', this.parent_id, 'data_file').pipe(first()).toPromise().then(
                            add_study_res => {
                                if (add_study_res["success"]) {
                                    console.log(add_study_res["message"])
                                }
                            });
                        this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                    }
                    else if(this.labelPosition==="only_data"){
                        this.fileService.upload3(this.fileName, study_lines,this.headers,this.associated_headers, this.parent_id).pipe(first()).toPromise().then(
                            data_upload => {
                                if (data_upload["success"]) {
                                    console.log(data_upload["message"])
                                }
                            });
                        this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                    }
                    else{
                        this.globalService.add(study_model, 'study', this.parent_id).pipe(first()).toPromise().then(
                            add_study_res => {
                                if (add_study_res["success"]) {
                                    console.log(add_study_res["message"])
                                }
                            }
                        );
                        this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });

                    }
                }
                    


                // // Get study model
                // this.globalService.get_model('study').toPromise().then(model_study => {
                //     let keys = Object.keys(model_study);
                //     for (var i = 0; i <  keys.length; i++) {
                //         if ( keys[i].startsWith("_") ||  keys[i].startsWith("Definition")) {
                //             keys.splice(i, 1);
                //             i--;
                //         }
                //         else {
                //             var dict = {}
                //             dict["key"] = keys[i]
                //             dict["pos"] = model_study[keys[i]]["Position"]
                //             study_model_array.push(dict)
                            
                //         }   
                //     }

                //     study_model_array = study_model_array.sort(function (a, b) { return a.pos - b.pos; });
                    
                    
                //     let study_model_dict = {}
                //     study_model_array.forEach(attr => {
                //         study_model_dict[attr["key"]] = ""
                //     });
                //     var model_tmp = {...study_model_dict};
                //     var study_component_set_array = Array.from(study_component_set);
                    
                //     for (var i = 0; i < study_component_set_array.length; i++){
                //         model_tmp["Study unique ID"]=study_component_set_array[i]
                //         model_tmp["Short title"]=study_component_set_array[i]
                        
                //         var study_column_name=this.data_to_extract['study']
                //         var study_lines = this.lines_dict.filter(line => {
                //             return line[study_column_name] === study_component_set_array[i];
                //         });
                //         let obj2send = {'data': study_lines, 'associated_headers': this.associated_columns, 'headers': this.headers};
                //         console.log(study_lines)

                //         // here tyr to add Study associated with data files
                //         this.globalService.add_parent_and_childs(model_tmp, obj2send, 'study', this.parent_id, 'data_file').pipe(first()).toPromise().then(
                //             add_study_res => {
                //                 if (add_study_res["success"]) {
                //                     console.log(add_study_res["message"])
                //                 }
                //             });

                //         // this.globalService.add(model_tmp, 'study', this.parent_id).pipe(first()).toPromise().then(
                //         //     add_study_res => {
                //         //         if (add_study_res["success"]) {
                //         //             console.log(add_study_res["message"])
                                    
                //         //             // if (this.labelPosition==="all") {
                //         //             //     var data_file_model_array = []
                //         //             //     this.globalService.get_model('data_file').toPromise().then(model_data_file => {
                //         //             //         let keys = Object.keys(model_data_file);
                //         //             //         for (var i = 0; i <  keys.length; i++) {
                //         //             //             if ( keys[i].startsWith("_") ||  keys[i].startsWith("Definition")) {
                //         //             //                 keys.splice(i, 1);
                //         //             //                 i--;
                //         //             //             }
                //         //             //             else {
                //         //             //                 var dict = {}
                //         //             //                 dict["key"] = keys[i]
                //         //             //                 dict["pos"] = model_data_file[keys[i]]["Position"]
                //         //             //                 data_file_model_array.push(dict)    
                //         //             //             }   
                //         //             //         }
                //         //             //         data_file_model_array = data_file_model_array.sort(function (a, b) { return a.pos - b.pos; });
                //         //             //         let data_file_model_dict = {}
                //         //             //         data_file_model_array.forEach(attr => {
                //         //             //             data_file_model_dict[attr["key"]] = ""
                //         //             //         });
                //         //             //         var data_file_model_tmp = {...data_file_model_dict};
                //         //             //         data_file_model_tmp["Data"]= study_lines
                //         //             //         console.log(data_file_model_tmp)
                //         //             //         //return true;
                //         //             //         // this.fileService.upload3(this.fileName, study_lines,this.headers,this.associated_headers,add_study_res["_id"]).pipe(first()).toPromise().then(
                //         //             //         //     data_upload => {
                //         //             //         //         this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                //         //             //         //         //var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                //         //             //         //         //this.alertService.success(message)
                //         //             //         //         return true;
                                                
                //         //             //         //     }
                //         //             //         // );
                //         //             //     });
                //         //             // }
                //         //             // else{
                //         //             //     this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                //         //             // }
                //         //             return true
                //         //         }
                //         //         else {
                //         //             this.alertService.error("this form contains errors! " + add_study_res["message"]);
                //         //         }
                //         //     }
                //         // );
                //         console.log("next study")
                //     }                       
                // });
            

            }
        }
        else{
            if (this.mode==='edit'){
                if (this.lines_arr.length!==0){
                
                    let user=JSON.parse(localStorage.getItem('currentUser'));
                    //let parent_id="studies/981995"
                    this.globalService.update(this.model_key,this.data,this.model_type).pipe(first()).toPromise().then(data => {console.log(data);})
                    this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                }
                else{
                    this.alertService.error("you need to select a file")
                }   
            }
            else{
                if (this.lines_dict.length!==0){
                
                    let user=JSON.parse(localStorage.getItem('currentUser'));
                    console.log(this.data)
                    //let parent_id="studies/981995"
                    this.globalService.update(this.model_key,this.data,this.model_type).pipe(first()).toPromise().then(data => {console.log(data);})
                    this.router.navigate(['/tree'],{ queryParams: { key: user._key  } });
                }
                else{
                    this.alertService.error("you need to select a file")
                }  
            }
        }

        //    this.fileService.upload(this.lines).subscribe(
        //      (res) => this.uploadResponse = res,
        //      (err) => this.error = err
        //    );
    }
    //test new selecct mode
    //getters and  setters
    public get_headers(){
        return this.headers
    }
    public get_associated_headers(){
        return this.associated_headers;
    }
    public get_associated_columns(){
        return this.associated_columns;
    }
    public get_headers_select(){
        return this.headers_select;
    }
    public get_lines(){
        return this.lines_arr
    }
    isDate(value): boolean {
        if (value instanceof Date) {
          return true;
        }
    
        return false;
      }
    getScaleType(values): string {
        let date = true;
        let num = true;
    
        for (const value of values) {
          if (!this.isDate(value)) {
            date = false;
          }
    
          if (typeof value !== 'number') {
            num = false;
          }
        }
    
        if (date) { return 'time'; }
        if (num) { return 'linear'; }
        return 'ordinal';
      }
    getXDomain(): any[] {
        let values = getUniqueXDomainValues(this.multi);
    
        this.scaleType = this.getScaleType(values);
        let domain = [];
    
        if (this.scaleType === 'linear') {
          values = values.map(v => Number(v));
        }
    
        let min;
        let max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
          min = this.xScaleMin
            ? this.xScaleMin
            : Math.min(...values);
    
          max = this.xScaleMax
            ? this.xScaleMax
            : Math.max(...values);
        }
    
        if (this.scaleType === 'time') {
          domain = [new Date(min), new Date(max)];
          this.xSet = [...values].sort((a, b) => {
            const aDate = a.getTime();
            const bDate = b.getTime();
            if (aDate > bDate) { return 1; }
            if (bDate > aDate) { return -1; }
            return 0;
          });
        } else if (this.scaleType === 'linear') {
          domain = [min, max];
          // Use compare function to sort numbers numerically
          this.xSet = [...values].sort((a, b) => (a - b));
        } else {
          domain = values;
          this.xSet = values;
        }
    
        return domain;
      }
      getXScale(domain, width): any {
        let scale;
    
        if (this.scaleType === 'time') {
          scale = scaleTime()
            .range([0, width])
            .domain(domain);
        } else if (this.scaleType === 'linear') {
          scale = scaleLinear()
            .range([0, width])
            .domain(domain);
    
          if (this.roundDomains) {
            scale = scale.nice();
          }
        } else if (this.scaleType === 'ordinal') {
          scale = scalePoint()
            .range([0, width])
            .padding(0.1)
            .domain(domain);
        }
    
        return scale;
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
