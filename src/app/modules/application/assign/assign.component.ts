import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import * as XLSX from 'xlsx';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { file } from 'jszip';
import { log } from 'console';
import { element } from 'protractor';
import { JoyrideService } from 'ngx-joyride';

//DIALOGS
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { DateformatComponent } from '../dialogs/dateformat.component';
import { DelimitorComponent } from '../dialogs/delimitor.component';
import { FormGenericComponent } from '../dialogs/form-generic.component';
import { HelpLoaderComponent } from '../dialogs/help-loader.component';
import { FileService, GlobalService, AlertService } from '../../../services';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import { UserInterface } from 'src/app/models/linda/person';

export interface componentInterface {
    name: string;
    value: string;
}


@Component({
    selector: 'app-assign',
    templateUrl: './assign.component.html',
    styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {

    // input part
    @Input() parent_id: string;
    @Input() model_key: string;
    @Input() model_type: string;
    @Input() mode: string;
    //@ViewChild('chart') chart: LineChartComponent;
    form: FormGroup;
    dataFileComponentForm = {};
    dataFileComponentFieldForm = {};
    //AttributesGroups = {}
    private data = {}
    private data_files = []
    fileUploaded: File;
    fileName: string = ""
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    userId: number = 1;
    //parsing EXCEL
    public modified: boolean = false;
    private options: componentInterface[];
    public selectedOption: componentInterface;
    private extract_fields_options = {}
    private loaded: boolean = false

    private extract_component_options = {
        'options': [
            { header: "", associated_linda_id: "", name: 'Assign MIAPPE components', value: '' },
            { header: "", associated_linda_id: "", name: 'Assign Study Identifiers from column', value: 'study' },
            { header: "", associated_linda_id: "", name: 'Assign Experimental Factors', value: 'experimental_factor' },
            { header: "", associated_linda_id: "", name: 'Assign Material Sources', value: 'biological_material' },
            { header: "", associated_linda_id: "", name: 'Assign Observation Units', value: 'observation_unit' },
            { header: "", associated_linda_id: "", name: 'Assign Observed variables', value: 'observed_variable' },
            { header: "", associated_linda_id: "", name: 'Assign Timeline', value: 'time' }],
        'defaut':
            { name: 'Assing MIAPPE components', value: '', label: 'test' }
    };

    private extract_component_options2 = {
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


    observation_unit_types: any[] = ["block", "sub-block", "plot", "plant", "trial", "pot", "replicate", "individual", "virtual_trial", "unit-parcel"];
    observation_unit_type = ""


    ///////// //////// ///////// ////////// Chart part
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
    scaleType: string;
    roundDomains: boolean = false
    xSet: any;



    //radio button box
    checked = false;
    indeterminate = false;
    labelPosition: 'all' | 'only_data' | 'None' = 'only_data';
    disabled = false;

    ///////// //////// ///////// ////////// parsing CSV
    private data_to_extract = {}
    private lines_dict = []
    private time_set: boolean = false
    private delimitor: string;
    private csv: any;
    private cleaned_data_file_model = []
    private cleaned_study_model = []
    private cleaned_component_model = []
    ///////// //////// ///////// ////////// data to be send
    private headers = [];
    ///////// //////// ///////// ////////// private headers_select = [];
    private associated_headers = [];
    private lines_arr = [];
    private filename_used = []
    private multi = []
    private initialSelection = []
    private checklistSelection = new SelectionModel<string>(true, this.initialSelection /* multiple */);
    private headers_by_filename = {}
    private associated_headers_by_filename = {}
    options_components_by_filename = {}
    options_fields_by_component_by_filename = {}
    private selected_file: string = ""
    optionForm: FormGroup;
    private currentUser: UserInterface
    private mySubscription

    ///////// //////// ///////// //////////  private loaded:boolean=false;
    ontology_type: string
    selected_term: OntologyTerm
    selected_set: []
    uploadResponse = { status: '', message: 0, filePath: '' };
    error = { message: '' }
    demo_subset = 1


    constructor(
        private formBuilder: FormBuilder,
        private fileService: FileService,
        private router: Router,
        private alertService: AlertService,
        private globalService: GlobalService,
        private route: ActivatedRoute,
        private readonly joyrideService: JoyrideService,
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
        this.selectedOption = <componentInterface>{ name: 'Assign MIAPPE components', value: '' }
        this.demo_subset = 1
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.initializeInvites();
                this.router.navigated = false;
            }
        });
        this.loaded = false
    }
    ngOnInit() {
        this.observation_unit_type = "select observation unit type"
        this.selected_file = ""
        console.log(this.mode)
        if (this.mode.includes('edit')) {
            this.globalService.get_by_key(this.model_key, this.model_type).pipe(first()).toPromise().then(received_data => {
                this.data = received_data;
                console.log(this.data)
                this.selected_file = this.data["filename"]
                this.headers = this.data["headers"];
                this.associated_headers = this.data["associated_headers"];
                this.associated_headers.forEach(element => {
                    if (element['is_time_values']) {
                        this.time_set = true
                    }
                })
                if (this.model_type == "data_file") {
                    this.lines_dict = this.data["Data"]
                }
                else {
                    this.lines_arr = this.data["data"]
                }
            })
        }
        if (this.mode === 'extract-again' || this.mode === 'extract-form') {
            this.cleaned_component_model = this.get_model(this.model_type);
            this.get_data()
        }
        this.cleaned_study_model = this.get_model('study');
        this.cleaned_data_file_model = this.get_model('data_file');
        let attributeFilters = { file: [''] };
        this.form = this.formBuilder.group(attributeFilters);
        this.onClickTour()
    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
    }

    /**
   * Get data with get_all_data_files() from globalService .
   *
   * @remarks
   * This method is part of the {@link download.ts} component.
   *
   * @param void
   * @returns void - buold the form to assign header
   *
   * @beta
   */
    get_data() {
        this.data_files = []

        this.globalService.get_all_data_files(this.model_key).toPromise().then(data => {
            this.data_files = data
            this.filename_used = []
            this.headers = []
            this.extract_fields_options['options'] = []
            this.cleaned_component_model.forEach(
                component_model => {
                    if (component_model.key !== "Observation unit type") {
                        this.extract_fields_options['options'].push({ header: "", associated_linda_id: "", name: component_model.key, value: "" })
                    }
                }
            );
            if (this.model_type === "observation_unit" && this.mode === "extract-form") {
                this.extract_fields_options['options'].push({ header: "", associated_linda_id: "", name: "associated_material_id", value: "" })
                this.extract_fields_options['options'].push({ header: "", associated_linda_id: "", name: "associated_biological_material_id", value: "" })
            }

            console.log(this.data_files)
            if (this.data_files.length === 2) {
                this.data_files[0].forEach(data_file => {
                    if (!this.filename_used.includes(data_file.filename)) {
                        this.filename_used.push(data_file.filename)
                        this.headers_by_filename[data_file.filename] = []
                        this.associated_headers_by_filename[data_file.filename] = []
                        //this.selectedStudy[data_file.filename]=[]
                        //this.AttributesGroups[data_file.filename] = []
                        this.options_components_by_filename[data_file.filename] = []
                        this.options_fields_by_component_by_filename[data_file.filename] = []
                        let tmpAttributesGroups = {}
                        data_file.associated_headers.forEach(element => {
                            if (!this.headers_by_filename[data_file.filename].includes(element.header)) {
                                ///if (!this.headers.includes(element.header)){
                                var header = element.header
                                let tmp_associated_header = { 'header': element.header, selected: element.selected, associated_component: element.associated_component, associated_component_field: element.associated_component_field, is_time_values: element.is_time_values, is_numeric_values: element.is_numeric_values }
                                if (element.associated_component != "") {
                                    ///let tmp = {}
                                    let tmp = { ...this.extract_component_options2.options.filter(prop => prop.value === element.associated_component)[0] }
                                    tmp['header'] = element.header
                                    tmp['associated_linda_id'] = element.associated_linda_id
                                    this.options_components_by_filename[data_file.filename].push(tmp)

                                    if (element.associated_component_field != "") {
                                        let tmp2 = { header: element.header, associated_linda_id: element.associated_linda_id, name: "Assign MIAPPE component name to add ", value: element.associated_component_field }
                                        this.options_fields_by_component_by_filename[data_file.filename].push(tmp2)
                                    }
                                    else {
                                        let tmp2 = { header: element.header, associated_linda_id: "", name: "Assign MIAPPE component fields", value: "" }
                                        this.options_fields_by_component_by_filename[data_file.filename].push(tmp2)
                                    }
                                }
                                else {
                                    let tmp = { header: element.header, associated_linda_id: "", name: "Assign MIAPPE components", value: "" }
                                    this.options_components_by_filename[data_file.filename].push(tmp)

                                    let tmp2 = { header: element.header, associated_linda_id: "", name: "Assign MIAPPE component fields", value: "" }
                                    this.options_fields_by_component_by_filename[data_file.filename].push(tmp2)
                                }


                                tmpAttributesGroups[header] = [header]
                                //this.AttributesGroups[data_file.filename].push(tmpAttributesGroups)
                                this.headers.push(element.header)
                                this.headers_by_filename[data_file.filename].push(element.header)
                                this.associated_headers_by_filename[data_file.filename].push(tmp_associated_header)
                            }
                        });
                        //this.AttributesGroups[data_file.filename].push(tmpAttributesGroups)
                        this.dataFileComponentForm[data_file.filename] = this.formBuilder.group(tmpAttributesGroups)
                        //this.dataFileComponentFieldForm[data_file.filename] = this.formBuilder.group(tmpAttributesGroups)
                        this.options_components_by_filename[data_file.filename].forEach(option => {
                            //console.log(option.header)
                            this.dataFileComponentForm[data_file.filename].get(option.header).setValue(option.value);
                        });
                    }

                });
                this.selected_file = this.filename_used[0]
                console.log(this.dataFileComponentForm)

            }
            //add corresponding component fields
            //this.options_fields_by_component_by_filename[this.model_type]=[]
            // this.extract_fields_options['options']=[]
            // this.cleaned_component_model.forEach(
            //     element => {
            //         this.extract_fields_options['options'].push({header: "", associated_linda_id: "", name: element.key, value: '' })
            //     }
            // );

            //this.selected_file = this.filename_used[0]
            // console.log(this.options_components_by_filename)
            // console.log(this.extract_fields_options)
            // console.log(this.headers_by_filename)
            // console.log(this.dataFileComponentForm)
            // console.log(this.associated_headers_by_filename)


        });

        //console.log(this.associated_headers_by_filename)
    }



    /**
   * Test if n is numeric type.
   *
   * @remarks
   * This method is part of the {@link download.ts} component.
   *
   * @param n - The value to test
   * @returns void
   *
   * @beta
   */
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    load_csv(csvData: any, e_loaded: any, e_total: any, delimitor: string = ",") {


        this.lines_arr = [];
        this.lines_dict = []
        this.associated_headers = []
        this.associated_headers_by_filename[this.fileName] = []
        this.options_components_by_filename[this.fileName] = []
        this.headers_by_filename[this.fileName] = []

        let allTextLines = csvData.split(/\r|\n|\r/);
        ///console.log(allTextLines)
        this.headers = allTextLines[0].split(delimitor)
        ///console.log(this.headers )
        for (let i = 0; i < this.headers.length; i++) {

            this.headers[i] = this.headers[i].replace(/['"]+/g, '').replace(/\./g, '_')
            this.headers_by_filename[this.fileName].push(this.headers[i])
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
                    this.options_components_by_filename[this.fileName].push(tmp)

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
                this.dataFileComponentForm[this.fileName] = this.formBuilder.group(tmpAttributesGroups)
                this.lines_arr.push(csv_arr);
                this.lines_dict.push(csv_dict)

            }
        }
        this.loaded = true
        // console.log(this.headers_by_filename[this.fileName])
        for (var i = 0; i < this.headers.length; i++) {
            this.associated_headers.push({ header: this.headers[i], selected: false, associated_term_id: "", associated_component: "", associated_component_field: "", associated_linda_id: "", is_time_values: false, is_numeric_values: type_dict[this.headers[i]] })
            this.associated_headers_by_filename[this.fileName].push({ header: this.headers[i], selected: false, associated_term_id: "", associated_component: "", associated_component_field: "", associated_linda_id: "", is_time_values: false, is_numeric_values: type_dict[this.headers[i]] })
        }
        this.selected_file = this.fileName
        this.options_components_by_filename[this.selected_file].forEach(option => {
            this.dataFileComponentForm[this.selected_file].get(option.header).setValue(option.value);
        });

    }

    onFilenameChange(values: string) {
        this.selected_file = values
        this.options_components_by_filename[this.selected_file].forEach(option => {
            this.dataFileComponentForm[this.selected_file].get(option.header).setValue(option.value);
        });
    }

    formatTime(val) {
        return val
    }
    get_component(field: string) {
        return this.extract_component_options2.options.filter(prop => prop.fields.includes(field))[0]['value']
        //console.log(this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });)
    }

    onModify(values: string, key: string, filename: string) {

        console.log(values)
        console.log(key)
        this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
        if (values === "time") {
            const dialogRef = this.dialog.open(DateformatComponent, { disableClose: true, width: '1000px', data: { date_format: "" } });
            dialogRef.afterClosed().subscribe(result => {
                //this.associated_headers[key]={selected:true, associated_term_id:result.date_format, associated_component:"time", is_time_values:true, is_numeric_values:false}
                this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
                this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = result.date_format; });
                this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component = "time"; });
                this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component_field = ""; });
                this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = true; });
                this.time_set = true
                this.checklistSelection.toggle(key);
            });
        }
        else if (values === "" || values === undefined) {
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = false; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = "" });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component = ""; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component_field = ""; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = false; });
        }
        else {
            this.data_to_extract[values] = key
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = ''; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component = this.get_component(values); });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.associated_component_field = values; });
            this.associated_headers_by_filename[filename].filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = false; });

            //this.associated_headers[key]={selected:true, associated_term_id:"", associated_component:values, is_time_values:false}
            console.log(this.associated_headers_by_filename[filename])
        }
    }
    onExtractField(values: string, key: string, filename: string) {
        console.log(values)
    }
    onExtractStudy(values: string, key: string) {
        console.log(values)
        console.log(key)
        if (values === "time") {
            const dialogRef = this.dialog.open(DateformatComponent, {  disableClose: true,width: '1000px', data: { date_format: "" } });
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
                this.time_set = true
                this.checklistSelection.toggle(key);
            });
        }
        else if (values === "") {
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = false; });
            //this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = "" });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = ""; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = false; });
        }
        else {
            this.data_to_extract[values] = key
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
            /// this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = ''; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = values; });
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.is_time_values = false; });
            //this.associated_headers[key]={selected:true, associated_term_id:"", associated_component:values, is_time_values:false}
            //console.log(this.associated_headers)
        }

    }
    onSelectOntology(values: string, key: string) {
        // if (values === "study"){
        //     this.associated_headers[key]={selected:true, associated_term_id:key, associated_component:"study",associated_linda_id:"", is_time_values:false}
        //     console.log(values)
        //     console.log(key)
        //     let groups_label=[]
        //     for (var i = 0; i < this.headers.length; i++){
        //         if (this.headers[i]==key){
        //             for (var j = 0; j < this.lines_arr.length; j++){
        //                 groups_label.push(this.lines_arr[j][i])
        //             }
        //         }
        //     }
        // }
        // else{
        const dialogRef = this.dialog.open(OntologyTreeComponent, {  disableClose: true,width: '1000px', autoFocus: false, maxHeight: '90vh', data: { ontology_id: values, selected_term: null, selected_set: [], multiple: false, uncheckable: false, observed: true } });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.ontology_type = result.ontology_id;
                this.selected_term = result.selected_term;
                this.selected_set = result.selected_set;
                var term_ids = ""
                for (var i = this.selected_set.length - 1; i >= 0; i--) {
                    term_ids += this.selected_set[i]['id'] + '/'
                }
                term_ids = term_ids.slice(0, -1);
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = true; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_term_id = term_ids; });
                this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.associated_component = ""; });
                //this.associated_headers[key]={selected:true, associated_term_id:term_ids,  associated_component:"ontology", is_time_values:false}
            };
        });
        //}
    }
    Focused(values: string, key: string) {
        console.log(values)
    }
    onShowHelp(page: string) {
        // Add argument for mode : 
        // for example for extract-form mode , 
        // the help page is not the same as for the extract mode

        const dialogRef = this.dialog.open(HelpLoaderComponent, { disableClose: true, width: '1200px', data: { help_page: page } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.event == 'Confirmed') {
                    console.log("hello")
                }
            }
        });
    }
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(key: string): void {

        this.checklistSelection.toggle(key);
        //plot the data
        if (this.checklistSelection.isSelected(key)) {
            this.associated_headers.filter(prop => prop.header == key)['selected'] = true
            let obj = { 'name': key, 'series': [] }
            let time_index = 0
            let time_key = ""
            for (var i = 0; i < this.headers.length; i++) {
                if (this.associated_headers.filter(prop => prop.header == this.headers[i])[0]['is_time_values'] == true) {
                    time_index = i
                    time_key = this.headers[i]
                }
            }
            for (var i = 0; i < this.headers.length; i++) {
                if (this.headers[i] == key) {
                    if (this.model_type === 'data_file') {
                        for (var j = 0; j < this.lines_dict.length; j++) {
                            let obj2 = { 'name': '', 'value': 0 }
                            obj2.name = this.lines_dict[j][time_key]
                            obj2.value = parseInt(this.lines_dict[j][key], 10)
                            obj.series.push(obj2)
                        }
                    }
                    else {
                        for (var j = 0; j < this.lines_arr.length; j++) {
                            let obj2 = { 'name': '', 'value': 0 }
                            obj2.name = this.lines_arr[j][time_index]
                            obj2.value = parseInt(this.lines_arr[j][i], 10)
                            obj.series.push(obj2)
                        }
                    }
                }
            }
            this.multi.push(obj)
            this.multi = [...this.multi]
        }
        else {
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = false; });

            this.multi = this.multi.filter(prop => prop.name != key)
            this.multi = [...this.multi]
        }
        // var timelineXDomain= this.getXDomain()
        // var timelineWidth=1500
        // var timelineXScale = this.getXScale(timelineXDomain, timelineWidth);
        //}
    }
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    itemSelectionToggle(key: string): void {
        console.log(this.associated_headers)
        this.checklistSelection.toggle(key);
        if (this.checklistSelection.isSelected(key)) {
            this.associated_headers.filter(prop => prop.header == key)['selected'] = true
            let obj = { 'name': key, 'series': [] }
            let time_index = 0
            let time_key = ""
            for (var i = 0; i < this.headers.length; i++) {
                if (this.associated_headers.filter(prop => prop.header == this.headers[i])[0]['is_time_values'] == true) {
                    time_index = i
                    time_key = this.headers[i]
                }
            }
            for (var i = 0; i < this.headers.length; i++) {
                if (this.headers[i] == key) {
                    if (this.model_type === 'data_file') {
                        for (var j = 0; j < this.lines_dict.length; j++) {
                            let obj2 = { 'name': '', 'value': 0 }
                            obj2.name = this.lines_dict[j][time_key]
                            obj2.value = parseInt(this.lines_dict[j][key], 10)
                            obj.series.push(obj2)
                        }
                    }
                    else {
                        for (var j = 0; j < this.lines_arr.length; j++) {
                            let obj2 = { 'name': '', 'value': 0 }
                            obj2.name = this.lines_arr[j][time_index]
                            obj2.value = parseInt(this.lines_arr[j][i], 10)
                            obj.series.push(obj2)
                        }
                    }
                }
            }
            this.multi.push(obj)
            this.multi = [...this.multi]
        }
        else {
            this.associated_headers.filter(prop => prop.header == key).forEach(prop => { prop.selected = false; });
            this.multi = this.multi.filter(prop => prop.name != key)
            this.multi = [...this.multi]
        }
        console.log(this.multi)
        // var timelineXDomain= this.getXDomain()
        // var timelineWidth=1500
        // var timelineXScale = this.getXScale(timelineXDomain, timelineWidth);
        //}
    }

    get_selected_option(header, filename) {
        return this.dataFileComponentForm[filename].get(header).value;
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
    public get_headers() {
        return this.headers
    }
    public get_headers_by_filename(filename: string) {
        return this.headers_by_filename[filename]
    }
    public get_associated_headers() {
        return this.associated_headers;
    }
    public get_lines() {
        return this.lines_arr
    }
    isDate(value): boolean {
        if (value instanceof Date) {
            return true;
        }

        return false;
    }

    get_data_to_extract() {
        return this.data_to_extract
    }
    get_lines_dict() {
        return this.lines_dict
    }
    get_lines_arr() {
        return this.lines_arr
    }

    get_delimitor() {
        return this.delimitor
    }
    get_csv() {
        return this.csv
    }
    get_cleaned_data_file_model() {
        return this.cleaned_data_file_model
    }
    get_cleaned_study_model() {
        return this.cleaned_study_model
    }
    get_initialSelection() {
        return this.initialSelection
    }
    get_associated_headers_by_filename() {
        return this.associated_headers_by_filename
    }
    get_associated_component_field(header, filename, associated_component) {
        //search for assoxciated headers if he has a field associated
    }
    get_associated_header(key: string) {
        return this.associated_headers.filter(prop => prop.header == key)[0]
    }
    get_associated_header_by_filename(key: string, filename) {
        return this.associated_headers_by_filename[filename].filter(prop => prop.header == key)[0]
    }
    get_options_components_by_filename() {
        return this.options_components_by_filename
    }
    reloadComponent(path: [string]) {
        let currentUrl = this.router.url;
        console.log(currentUrl)
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(path);
    }

    get get_selected_file() {
        return this.selected_file
    }
    get get_checklistSelection() {
        return this.checklistSelection
    }
    get get_extract_fields_options() {
        return this.extract_fields_options
    }
    get get_filename_used() {
        return this.filename_used
    }
    get get_extract_component_options() {
        return this.extract_component_options2
    }
    get get_multi() {
        return this.multi
    }
    get get_time_set() {
        return this.time_set
    }
    get get_ontology_selected() {
        return this.ontology_type
    }
    onNext(index: any) {
        // this.demo_subset+=1
        console.log(index)
        console.log(this.loaded)
        if (index == "load_csv") {
            console.log("step2")
            this.fileName = "my_data.csv"
            var csv_text = "Study_ID,plotID,treatment,plant.height,code_ID\nMaizeStudy1,plot1,rainfed,23,B73\nMaizeStudy1,plot2,rainfed,22,PH207\nMaizeStudy1,plot3,rainfed,24,Oh43\nMaizeStudy1,plot4,rainfed,21.8,W64A\nMaizeStudy1,plot5,rainfed,23.4,EZ47\nMaizeStudy1,plot6,watered,48.3,B73\nMaizeStudy1,plot7,watered,49.5,PH207\nMaizeStudy1,plot8,watered,52,Oh43\nMaizeStudy1,plot9,watered,48,W64A\nMaizeStudy1,plot10,watered,45,EZ47"
            this.load_csv(csv_text, 100, 100, ",")
        }
        if (index == 0) {
            //assign study to row 0
            this.onModify('study', 'Study_ID', this.fileName)
        }
        else if (index == 1) {
            //assign study to row 0
            this.onModify('observation_unit', 'plotID', this.fileName)
        }
        else if (index == 2) {
            //assign study to row 0
            this.onModify('experimental_factor', 'treatment', this.fileName)
        }
        else if (index == 3) {
            //assign study to row 0
            this.onModify('observed_variable', 'plant_height', this.fileName)
        }
        else if (index == 4) {
            //assign study to row 0
            this.onModify('biological_material', 'code_ID', this.fileName)
        }
        else {
            //assign study to row 0
        }
    }
    ///////// //////// ///////// //////////  Set default values and re-fetch any data you need.
    initializeInvites() {
        this.joyrideService.closeTour()
    }
    onClickTour() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.currentUser)
        if (this.currentUser['tutoriel_step'] === "13") {
            this.joyrideService.startTour(
                { steps: ['StepMenuForm', 'StepExampleForm', 'StepTableForm', 'Row0', 'Row1', 'Row2', 'Row3', 'Row4', 'StepUpload1Form', 'StepUpload2Form', 'StepUpload3Form'], stepDefaultPosition: 'bottom' } // Your steps order
            );
            //this.currentUser.tutoriel_step="2"
            //localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
    onSubmit() {
        //metadatafiles creation (obsolete ? )
        if (this.mode === "create") {
            console.log(this.lines_arr.length)
            if (this.lines_arr.length !== 0) {
                console.log(this.lines_dict)
                const formData = new FormData();
                formData.append('file', this.form.get('file').value);
                let user = JSON.parse(localStorage.getItem('currentUser'));
                //let parent_id="studies/981995"
                //this.associated_headers['associated_linda_id']=this.parent_id
                //this.fileService.upload2(this.fileName,this.lines_arr,this.headers,this.associated_headers,this.parent_id).pipe(first()).toPromise().then(data => {console.log(data);})

                this.fileService.upload3(this.fileName, this.lines_dict, this.headers, this.associated_headers, this.parent_id).pipe(first()).toPromise().then(data => { console.log(data); })

                this.router.navigate(['/projects_tree'], { queryParams: { key: user._key } });
            }
            else {
                this.alertService.error("you need to select a file")
            }
        }
        ///extract from files 
        else if (this.mode === "extract") {
            if (Object.keys(this.data_to_extract).length === 0) {
                console.log(this.data_to_extract)
                this.alertService.error("You need to assign one original header for Study component Label; see Help button for more details")
            }
            console.log(this.data_to_extract)
            if (this.data_to_extract['Study unique ID']) {
                let groups_label = []
                //search for column declared as study column
                for (var i = 0; i < this.headers.length; i++) {
                    if (this.headers[i] == this.data_to_extract['Study unique ID']) {
                        for (var j = 0; j < this.lines_arr.length; j++) {
                            groups_label.push(this.lines_arr[j][i])
                        }
                    }
                }
                //get unique study names
                let study_component_set = new Set(groups_label)
                //console.log(study_component_set)
                //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build    
                let study_model_dict = {}
                this.cleaned_study_model.forEach(attr => { study_model_dict[attr["key"]] = "" });
                var study_model = { ...study_model_dict };
                let study_model_array = []
                let user = JSON.parse(localStorage.getItem('currentUser'));


                // mode extract with only data upload
                if (this.labelPosition !== "only_data") {
                    //build study form for field 
                    const formDialogRef = this.dialog.open(FormGenericComponent, { disableClose: true, width: '1200px', data: { model_type: this.model_type, formData: {}  , mode: "preprocess"} });
                    formDialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            if (result.event == 'Confirmed') {
                                //console.log(result["formData"]["form"])
                                study_model = result["formData"]["form"]
                                let is_template = result["formData"]["template"]
                                var study_component_set_array = Array.from(study_component_set);
                                //foreach study identifier found other than Study unique ID
                                for (var i = 0; i < study_component_set_array.length; i++) {
                                    //console.log(study_component_set_array[i])
                                    study_model["Study unique ID"] = study_component_set_array[i]
                                    study_model["Study Name"] = study_component_set_array[i]
                                    let unique_study_label = study_component_set_array[i]
                                    //get the header label for study column in the csv file
                                    var study_column_name = this.data_to_extract['Study unique ID']

                                    // filter lines_dict to keep lines that match unique_study_label
                                    var study_lines = this.lines_dict.filter(line => {
                                        return line[study_column_name] === unique_study_label;
                                    });



                                    //build data file object if 
                                    let data_model_dict = {}
                                    this.cleaned_data_file_model.forEach(attr => { data_model_dict[attr["key"]] = "" });
                                    var data_model = { ...data_model_dict };
                                    data_model['Data file description'] = 'Data have been extracted for ' + study_component_set_array[i] + ' from ' + this.fileName
                                    data_model['Data file version'] = '1.0'
                                    data_model['Data file link'] = this.fileName
                                    data_model['Data'] = study_lines
                                    data_model['associated_headers'] = this.associated_headers_by_filename[this.fileName]
                                    data_model['headers'] = this.headers

                                    //TODO Need to add dialog form for study form in order to pre fill

                                    // here try to add Study associated with data files
                                    if (this.labelPosition === "all") {
                                        //console.log(this.parent_id)
                                        this.globalService.add_parent_and_childs(study_model, data_model, 'study', this.parent_id, 'data_file').pipe(first()).toPromise().then(
                                            add_study_res => {
                                                if (add_study_res["success"]) {
                                                    console.log(add_study_res["message"])
                                                    this.router.navigate(['/projects_tree']);
                                                }
                                            });
                                        //this.router.navigate(['/projects_tree']);
                                    }
                                    else {
                                        this.globalService.add(study_model, 'study', this.parent_id, false).pipe(first()).toPromise().then(
                                            add_study_res => {
                                                if (add_study_res["success"]) {
                                                    console.log(add_study_res["message"])
                                                    this.router.navigate(['/projects_tree']);
                                                }
                                            }
                                        );
                                        //this.router.navigate(['/projects_tree']);

                                    }
                                }

                            }
                        }
                    });

                }
                else {
                    var study_component_set_array = Array.from(study_component_set);
                    // foreach study identifier found other than Study unique ID
                    for (var i = 0; i < study_component_set_array.length; i++) {
                        console.log(study_component_set_array[i])
                        let unique_study_label = study_component_set_array[i]
                        // // get the header label for study column in the csv file
                        // var study_column_name = this.data_to_extract['study']
                        // // filter lines_dict to keep lines that match unique_study_label
                        // var study_lines = this.lines_dict.filter(line => {
                        //     return line[study_column_name] === unique_study_label;
                        // });
                        // // build data file object if 
                        // let data_model_dict = {}
                        // this.cleaned_data_file_model.forEach(attr => { data_model_dict[attr["key"]] = "" });
                        // var data_model = { ...data_model_dict };
                        // data_model['Data file description'] = 'Data have been extracted for ' + unique_study_label + ' from ' + this.fileName
                        // data_model['Data file version'] = '1.0'
                        // data_model['Data file link'] = this.fileName
                        // data_model['Data'] = study_lines
                        // data_model['associated_headers'] = this.associated_headers
                        // data_model['headers'] = this.headers

                        // // get this study_id with unique_study_label
                        // // problem when two invvestiagtion have same study ID
                        // console.log(unique_study_label)
                        // console.log(this.parent_id.split("/")[1])
                        this.globalService.get_study_by_ID(unique_study_label, this.parent_id.split("/")[1]).pipe(first()).toPromise().then(
                            data => {
                                // get the header label for study column in the csv file
                                var study_column_name = this.data_to_extract['Study unique ID']
                                // filter lines_dict to keep lines that match unique_study_label
                                var study_lines = this.lines_dict.filter(line => {
                                    return line[study_column_name] === unique_study_label;
                                });
                                // build data file object if 
                                let data_model_dict = {}
                                this.cleaned_data_file_model.forEach(attr => { data_model_dict[attr["key"]] = "" });
                                var data_model = { ...data_model_dict };
                                data_model['Data file description'] = 'Data have been extracted for ' + unique_study_label + ' from ' + this.fileName
                                data_model['Data file version'] = '1.0'
                                data_model['Data file link'] = this.fileName
                                data_model['Data'] = study_lines
                                data_model['associated_headers'] = this.associated_headers_by_filename[this.fileName]
                                data_model['headers'] = this.headers

                                // get this study_id with unique_study_label
                                // problem when two invvestiagtion have same study ID
                                // console.log(unique_study_label)
                                // console.log(this.parent_id.split("/")[1])
                                data['study_ids'].forEach(study_id => {
                                    console.log(study_id)
                                    this.fileService.upload4(data_model, study_id).pipe(first()).toPromise().then(
                                        data_upload => {
                                            console.log(data_upload)
                                            if (data_upload[0]["id"]) {
                                                console.log(data_upload[0]["new"]["Data file description"])


                                                if (!this.currentUser.tutoriel_done) {
                                                    if (this.currentUser.tutoriel_step === "13") {
                                                        let new_step = 14
                                                        this.currentUser.tutoriel_step = new_step.toString()
                                                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                                    }
                                                    else {
                                                        this.alertService.error("You are not in the right form as requested by the tutorial")
                                                    }

                                                }

                                                //this.router.navigate(['/projects_tree']);
                                                this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', model_id: this.parent_id, mode: "edit", activeTab: 'Assign' } });

                                                //this.reloadComponent(['/projects_tree'])
                                            }
                                        }
                                    );
                                });
                            }
                        );
                    }

                }
            }
            else {
                this.alertService.error("You need to assign one original header for Study component Label; see Help button for more details")
            }
        }
        else {
            if (this.mode === 'edit') {
                if (this.lines_arr.length !== 0) {
                    let user = JSON.parse(localStorage.getItem('currentUser'));
                    //let parent_id="studies/981995"
                    this.globalService.update_document(this.model_key, this.data, this.model_type).pipe(first()).toPromise().then(data => { console.log(data); })
                    this.router.navigate(['/projects_tree']);
                }
                else {
                    this.alertService.error("you need to select a file")
                }
            }
            ///observations unit mode
            else if (this.mode === 'extract-form') {
                console.log("extract observation units")

            }
            //mode extract-again
            else {
                if (this.associated_headers_by_filename[this.selected_file].length !== 0) {
                    let user = JSON.parse(localStorage.getItem('currentUser'));
                    this.data_files[0].forEach(data_file => {
                        if (data_file.filename === this.selected_file) {
                            this.associated_headers_by_filename[this.selected_file].forEach(element => {
                                data_file.associated_headers.filter(header => header.header === element.header)[0]["associated_component"] = element.associated_component
                                data_file.associated_headers.filter(header => header.header === element.header)[0]["is_numeric_values"] = element.is_numeric_values
                                data_file.associated_headers.filter(header => header.header === element.header)[0]["is_time_values"] = element.is_time_values
                                data_file.associated_headers.filter(header => header.header === element.header)[0]["selected"] = element.selected
                            });
                            this.globalService.update_associated_headers(data_file['eto'], data_file.associated_headers, 'data_files').pipe(first()).toPromise().then(
                                data => {
                                    //this.router.navigate(['/projects_tree']);
                                    this.alertService.success("headers assignatioon update !! ")
                                })

                        }


                    });
                    //this.router.navigate(['/projects_tree']);
                }
                else {
                    this.alertService.error("you need to select a file")
                }
            }
        }


        //    this.fileService.upload(this.lines).subscribe(
        //      (res) => this.uploadResponse = res,
        //      (err) => this.error = err
        //    );
    }
    cancel() {
        if (this.mode === 'create') {
            this.router.navigate(['/projects_tree'])
        }
        else if (this.mode === "extract-form") {
            //this.router.navigate(['/projects_tree']) 
        }
        else {
            if (!this.currentUser.tutoriel_done) {
                if (this.currentUser.tutoriel_step === "13") {

                    var new_step = 12
                    this.currentUser.tutoriel_step = new_step.toString()
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }
                else {
                    this.alertService.error("You are not in the right form as requested by the tutorial")
                }
            }
            this.router.navigate(['/projects_page'])
        }
    }

}

