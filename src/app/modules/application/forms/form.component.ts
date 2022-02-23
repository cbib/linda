import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService, AlertService, OntologiesService } from '../../../services';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators/unique-id-validator.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import { JoyrideService } from 'ngx-joyride';
import { UserInterface } from 'src/app/models/linda/person'; 

// import { isBuffer } from 'util';
// import { ConsoleReporter } from 'jasmine';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit//, AfterViewInit 
{
    //Input parameters from user tree component
    @Input('level') level: number;
    @Input('parent_id') parent_id:string;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('mode') mode: string;
    @Input('inline') inline: string;
    @Input('asTemplate') asTemplate: boolean;
    @Input('onlyTemplate') onlyTemplate: boolean;
    @Input('role') role: string;
    
    @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
    public guided_tour_messages: any = {
        level1: { heading: 'Level 1', message: 'At stage 1, you will see ontology form field for two important Study features' },
        level2: { heading: 'Level 2', message: 'At stage 2, you will see ontology form field for two important Study features' },
        level3: { heading: 'Level 3', message: 'At this stage you will see ontology form field for two important Study features <img src="/Users/benjamin/linda/src/assets/images/ontology_widget_form.png" style="width:100%;height: auto; display: block;" >' }
      }
    private startfilling: boolean = false;
    private currentUser:UserInterface
    private ontology_type: string;
    private show_spinner: boolean = false;
    private Checked = false
    private selected_term: OntologyTerm
    private selected_set: []
    private validated_term = {}
    //private asTemplate = false;
    private modelForm: FormGroup;
    private ontologies = ['XEO', 'EO', 'EnvO', 'PO_Structure', 'PO_Development']
    private model_id: string;
    private max_level = 1;
    private model: {} ={}
    private model_to_edit: any = [];
    private levels = []
    private cleaned_model: {}[] = [];
    private keys: any = [];
    private disabled_id_keys = []
    private help_mode=false
    private left="left"
    private center="center"

    constructor(
        public globalService: GlobalService,
        public ontologiesService: OntologiesService,
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private readonly joyrideService: JoyrideService,
        private route: ActivatedRoute,
        public dialog: MatDialog) {

/*         this.level = 1;
        this.model_type = '';
        this.model_key = '';
        this.mode = '';
        this.parent_id = ''; */
        this.route.queryParams.subscribe(
            params => {
                this.level = params['level'];
                this.model_type = params['model_type'];
                this.model_key = params['model_key'];
                this.mode = params['mode'];
                this.parent_id = params['parent_id']
                this.inline=params['inline']
                this.asTemplate=params['asTemplate']
                this.onlyTemplate=params['onlyTemplate']
                this.role=params['role']

            }
        );
        if (this.model_key != "") {
            console.log(this.model_key)
            this.get_model_by_key();
        }
        console.log(this.mode)
        console.warn(this.role)
        console.log(this.mode)
        
    }

    ngOnInit() {
        ///const id = this.activatedRoute.snapshot.params.id;

        //console.log(this.mode)
        this.set_max_level();
        this.set_model();
        console.log(this.onlyTemplate)
        // if (currentUser['tutoriel_checked'] === false){
        //     this.onClickTour()
        // }
        this.onClickTour()

    };
    onClickTour(help_mode:boolean=false) {
        if(help_mode){
            this.help_mode=true
            if (this.model_type==='investigation'){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepMandatoryID', 'StepNormalField', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            if (this.model_type==='study'){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepMandatoryID', 'StepNormalField','StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            if (this.model_type==='experimental_factor'){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepNormalField','StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            if (this.model_type==='observed_variable'){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepMandatoryID', 'StepNormalField','StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            if (this.model_type==='event'){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepNormalField','StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }

        }
        else{
            this.help_mode=false
            this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
            //console.log(this.currentUser)
            //Investigation form
            if (this.currentUser['tutoriel_step'] === "1"){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepMandatoryID', 'StepNormalField', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
                //this.currentUser.tutoriel_step="2"
                //localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            //Study form
            else if (this.currentUser['tutoriel_step'] === "3"){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepMandatoryID', 'StepNormalField', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            
            }
            else if (this.currentUser['tutoriel_step'] === "5"){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepNormalField', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            else if (this.currentUser['tutoriel_step'] === "7"){
                this.joyrideService.startTour(
                    { steps: ['StepMenuForm', 'StepContentForm', 'StepOntologyField', 'StepMandatoryID', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
                );
            }
            else{

            }
        }

    }
    on_Next() {
        //console.log(this.currentUser['tutoriel_step'])
        //console.log(this.modelForm.value)
        //console.log(this.modelForm.controls)
        //this.joyrideService.closeTour()
        //study form template
        if (this.currentUser['tutoriel_step']==="1"){
            this.modelForm.controls["Investigation unique ID"].patchValue("Maizes1")
            this.modelForm.controls["Short title"].patchValue("maizes1")
            
        }   
        //study form template
        if (this.currentUser['tutoriel_step']==="3"){
            this.modelForm.controls["Study unique ID"].patchValue("MaizeStudy1")
            this.modelForm.controls["Short title"].patchValue("MaizeStudy1")
            this.modelForm.controls["Start date of study"].patchValue(this.formatDate(new Date("6/01/2021")))
            this.modelForm.controls["End date of study"].patchValue(this.formatDate(new Date("6/30/2021")))
            this.modelForm.controls["Type of experimental design"].patchValue("CO_715:0000145")
            this.modelForm.controls["Type of growth facility"].patchValue("CO_715:0000162")
            this.modelForm.controls["Description of growth facility"].patchValue("field environement condition")
            this.modelForm.controls["Observation unit level hierarchy"].patchValue("block>rep>plot")
            this.modelForm.controls["Observation unit description"].patchValue("Observation units consisted in individual plots themselves consisting of a row of 5 plants at a density of 1 plant per square meter ")
            this.modelForm.controls["Experimental site name"].patchValue("INRA pierroton")
            this.modelForm.controls["Experimental site name"].patchValue("INRA, UE Diascope - Chemin de Mezouls - Domaine experimental de Melgueil - 34130 Mauguio - France")
            this.modelForm.controls["Study title"].patchValue("2002 evaluation of hydric stress for a panel of 1 maize line (B73) at the experimental station of Maugio (France).")
            this.modelForm.controls["Cultural practices"].patchValue("Irrigation was applied according needs for one field and not appliedd for the other that stays rainfed during summer to compare water stress.")
            this.startfilling=true
            
        }
        //study form template
        if (this.currentUser['tutoriel_step']==="5"){
            this.modelForm.controls["Experimental Factor type"].patchValue("Watering")
            this.modelForm.controls["Experimental Factor values"].patchValue("rainfed;watered")
            this.modelForm.controls["Experimental Factor accession number"].patchValue("EFO:0000470")
            this.modelForm.controls["Experimental Factor description"].patchValue("Daily watering 1L per plant")
           
        }
        if (this.currentUser['tutoriel_step']==="7"){
            this.modelForm.controls["Variable ID"].patchValue("PH_M_cm")
            this.modelForm.controls["Variable accession number"].patchValue("CO_322:0000996")
            this.modelForm.controls["Variable name"].patchValue("PH_M_cm")
            this.modelForm.controls["Method"].patchValue("PH - Measurement")
            this.modelForm.controls["Scale"].patchValue("cm")
            this.modelForm.controls["Scale accession number"].patchValue("CO_322:0000348")
            this.modelForm.controls["Trait accession number"].patchValue("CO_322:0000994")
            this.modelForm.controls["Method accession number"].patchValue("CO_322:0000995")
            this.modelForm.controls["Method description"].patchValue("Recommended to take multiple plants and measure the height from the base of a plant to the top of the tassel, enter the data individually in the FieldBook and calculate the average")
            this.modelForm.controls["Trait"].patchValue("Plant height")
        }

        this.startfilling=true
        // this.joyrideService.closeTour();
        // this.joyrideService.startTour(
        //     { steps: ['StepSubmit'], stepDefaultPosition: 'bottom'} // Your steps order
        // );
        //console.log(this.modelForm.value)


    //     <p> Add the following on page 1 :</p>
    //     <ul>
    //     <li>  <p>Study unique Id: MaizeStudy1</p></li>
    //     <li> <p> Short title: Study1</p></li>
    //     <li> <p> Start date of study : 1/06/2021</p></li>
    //     <li> <p> End date of study : 30/06/2021</p></li>
    //     </ul>
    
    // <p> Add the following on page 3 :</p>
    // <ul>
    // <li> <p> Type of experimental design: CO_715:0000145</p></li>
    // <li> <p> Type of growth facility: CO_715:0000162</p></li>
    // <li> <p> Observation unit level hierarchy : block &gt; rep &gt; plot</p></li>
    }
    get_message_guided_tour(){
        if (this.model_type==="study"){
            if (this.level<2){
                return this.guided_tour_messages.level1.message
            }
            else if(this.level==2){
                return this.guided_tour_messages.level2.message
            }
            else{
                return this.guided_tour_messages.level3.message
            }
        }
        else{
            return this.guided_tour_messages.level1.message
        }        
    }

    private formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        //console.log(year + '/' + month + '/' + day)
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }
    initiateForm(): FormGroup {
        let attributeFilters = {};
        this.cleaned_model.forEach(attr => {
            this.validated_term[attr["key"]] = { selected: false, values: "" }
            if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
                if (attr["key"].includes("ID")) {
                    //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
                    //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
                    attributeFilters[attr["key"]] = ['', [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
                }
                else if (attr["key"].includes("Short title")) {
                    attributeFilters[attr["key"]] = ['', [Validators.required, Validators.minLength(4)]];
                }
                else {
                    attributeFilters[attr["key"]] = [''];
                }
            }
        });
        return this.formBuilder.group(attributeFilters);
    }
    set_model() {
        this.modelForm = new FormGroup({});
        
        //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
        this.globalService.get_model(this.model_type).toPromise().then(data => {
            this.model = data;
            console.log(this.model)
            this.keys = Object.keys(this.model);
            this.cleaned_model = []
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i].startsWith("_") || this.keys[i].startsWith("Definition")) {
                    this.keys.splice(i, 1);
                    i--;
                }
                else {
                    var dict = {}
                    dict["key"] = this.keys[i]
                    dict["pos"] = this.model[this.keys[i]]["Position"]
                    dict["level"] = this.model[this.keys[i]]["Level"]
                    dict["format"] = this.model[this.keys[i]]["Format"]
                    dict["Associated_ontologies"] = this.model[this.keys[i]]["Associated_ontologies"]
                    this.cleaned_model.push(dict)
                }
            }
            this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a['pos'] - b['pos']; });
            console.log(this.cleaned_model)

            if (this.mode === "create" ) {
                //console.log(this.model_type)
                this.modelForm = this.initiateForm()
                //console.log(this.modelForm.value)
                // patcch value for mater
            }
            else {
                let attributeFilters = [];
                console.warn(this.role)
                this.cleaned_model.forEach(attr => {
                    if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
                        this.validated_term[attr["key"]] = { selected: false, values: "" }
                        //if (attr["key"].includes("ID")) {
                        ///if (attr["format"] === "Unique identifier") {
                        if (attr["key"].includes("ID")) {
                            //attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]];
                            if (this.model_to_edit[attr["key"]]=== ""){
                                attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
                                if (this.role!=='owner'){
                                    this.disabled_id_keys.push(attr["key"])
                                }
                            }
                            else{
                                attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]]//, UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
                                this.disabled_id_keys.push(attr["key"])
                            }
                        }
                        else if (attr["key"].includes("Project Name")) {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]];
                            if (this.role!=='owner'){
                                console.log(this.role)
                                this.disabled_id_keys.push(attr["key"])
                            }
                        }
                        else if (attr["key"].includes("Study Name")) {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]];
                            if (this.role!=='owner'){
                                console.log(this.role)
                                this.disabled_id_keys.push(attr["key"])
                            }
                        }
                        else {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]]];
                            if (this.role!=='owner'){
                                this.disabled_id_keys.push(attr["key"])
                            }
                        }
                    }
                });
                console.log(this.disabled_id_keys)
                this.modelForm = this.formBuilder.group(attributeFilters);

                for (let i = 0; i < this.disabled_id_keys.length; i++) {
                    let attr = this.disabled_id_keys[i]
                    console.log(this.disabled_id_keys[i])
                    // //console.log(this.modelForm.value)
                    // //console.log(this.modelForm.get(this.disabled_id_keys[i]))
                    // //console.log(this.modelForm.value[this.disabled_id_keys[i]])
                    this.modelForm.get(this.disabled_id_keys[i]).disable();
                    /* if (this.disabled_id_keys[i].includes("ID")){
                        this.modelForm.get(this.disabled_id_keys[i]).disable();
                    }
                    else{
                        if (this.modelForm.value[this.disabled_id_keys[i]]){
                            this.modelForm.get(this.disabled_id_keys[i]).disable();
                        }
                    }  */           
    
                }
                //console.log(this.modelForm.value)
            }
        });
    };
    formatLatitudeLabel(value: number) {
        //north hemisphera
        if (value > 0) {
            var decimals = value - Math.floor(value);
            return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′N"
        }
        //south hemisphera
        if (value < 0) {
            var decimals = value - Math.floor(value);
            return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′S"
        }

        else {
            return value;
        }
    }
    formatLabel(value: number) {

        return value + 'm';
    }
    formatLongitudeLabel(value: number) {
        ////console.log(value)
        //east hemisphera
        if (value > 0) {
            var decimals = value - Math.floor(value);
            return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′E"
        }
        //west hemisphera
        if (value < 0) {
            var decimals = value - Math.floor(value);
            return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′W"
        }
        else {
            return value;
        }
    }
    onOntologyTermSelection(ontology_id: string, key: string, multiple: boolean = true) {
        //this.show_spinner = true;
        const dialogRef = this.dialog.open(OntologyTreeComponent, { width: '1000px', autoFocus: true, disableClose: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], uncheckable: false, multiple: multiple } });
        // dialogRef..afterOpened().subscribe(result => {
        //     this.show_spinner = false;
        // })
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.startfilling = true;
                this.ontology_type = result.ontology_type;
                this.selected_set = result.selected_set;
                if (multiple) {
                    var term_ids = this.modelForm.controls[key].value + '/'
                    for (var i = this.selected_set.length - 1; i >= 0; i--) {
                        term_ids += this.selected_set[i]['id'] + '/'
                    }
                    term_ids = term_ids.slice(0, -1);
                    this.validated_term[key] = { selected: true, values: term_ids };
                    this.modelForm.controls[key].patchValue(term_ids)
                }
                else {
                    if (this.selected_set.length > 0) {
                        //console.log(this.selected_set)
                        //console.log(key)
                        var term_id = result.selected_set[0]['id']
                        var term_def = result.selected_set[0]['def']
                        var term_name = result.selected_set[0]['name']
                        var term = result.selected_set[0]['term']
                        //console.log(term)
                        this.validated_term[key] = { selected: true, values: term_id };
                        var var_key = ""
                        var var_name = ""
                        var var_name_id = ""
                        var var_description = ""
                        //console.log(key)


                        if (key.includes(" accession number")) {
                            var_key = key.split(" accession number")[0]
                            var_name = var_key + " name"
                            var_name_id = var_key + " ID"
                            var_description = var_key + " description"
                            if (this.modelForm.controls[var_description]) {
                                if (term_def) {
                                    this.modelForm.controls[var_description].patchValue(term_def)
                                }
                                else {
                                    this.modelForm.controls[var_description].patchValue(term_name)
                                }
                            }
                        }

                        else if (key.includes("Type of ")) {
                            var_key = key.split("Type of ")[1]
                            var_description = "Description of " + var_key
                            if (this.modelForm.controls[var_description]) {
                                if (term_def) {
                                    this.modelForm.controls[var_description].patchValue(term_def)
                                }
                                else {
                                    this.modelForm.controls[var_description].patchValue(term_name)
                                }
                            }
                            var_description = "Description of the " + var_key
                            if (this.modelForm.controls[var_description]) {
                                if (term_def) {
                                    this.modelForm.controls[var_description].patchValue(term_def)
                                }
                                else {
                                    this.modelForm.controls[var_description].patchValue(term_name)
                                }
                            }
                        }

                        //var var_name=var_key+" name"
                        //var var_name_id=var_key+" ID"
                        //var var_description=var_key+" description"
                        this.modelForm.controls[key].patchValue(term_id)

                        if (this.modelForm.controls["Environment parameter value"]) {
                            //console.log(term)
                            this.modelForm.controls["Environment parameter value"].patchValue(term["value"] + " " + term.unit)
                        }
                        if (this.modelForm.controls["Environment parameter"]) {
                            //console.log(term)
                            this.modelForm.controls["Environment parameter"].patchValue(term.name)
                        }

                        if (this.modelForm.controls[var_key]) {
                            this.modelForm.controls[var_key].patchValue(term_name)
                        }
                        if (this.modelForm.controls[key]) {
                            this.modelForm.controls[key].patchValue(term_id)
                        }

                        if (this.modelForm.controls[var_name]) {
                            this.modelForm.controls[var_name].patchValue(term_name)
                        }
                        var term_ids = this.modelForm.controls[key].value + '/'
                        term_ids += term_name
                        if (this.modelForm.controls[var_name_id]) {
                            this.modelForm.controls[var_name_id].patchValue(term_name)
                        }
                        this.startfilling = true;
                    }
                }
            }
        });
    }
    get_model_by_key() {
        this.model_to_edit = [];
        if( this.mode==="edit_template"){
            this.globalService.get_template_by_key(this.model_key, this.model_type).toPromise().then(data => {
                console.log(data)
                this.model_to_edit = data;
                this.modelForm.patchValue(this.model_to_edit);
                this.startfilling = true;
            });
        }
        else{
            this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
                console.log(data)
                this.model_to_edit = data;
                this.modelForm.patchValue(this.model_to_edit);
                this.startfilling = true;
            });
        }
    };
    get_form_model_type(){
        return  this.model_type
    }

    isStartFilling(): boolean {
        this.keys.forEach(attr => {
            if (this.modelForm.value[attr] !== "") {
                this.startfilling = true;
            }
        });
        return this.startfilling
    }

    onTaskAdd(event) {
        this.startfilling = false;
        this.keys.forEach(attr => {
            if (this.modelForm.value[attr] !== "") {
                this.startfilling = true;
            }
        });
        // //console.log(this.startfilling)
        // //console.log(this.modelForm.value)
    }

    set_max_level() {
        this.globalService.get_max_level(this.model_type).toPromise().then(max_level_data => {
            //console.log(max_level_data)
            this.max_level = max_level_data;
            for (var i = 1; i < this.max_level + 1; i++) {
                this.levels.push(i)

            }
        });

    }
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    get f() {
        return this.modelForm.controls;
    }

    get get_modelForm() : FormGroup{
        return this.modelForm
    }
    get diagnostic() {
        return JSON.stringify(this.modelForm);
    };
    get get_left(): string{
        return this.left
    }

    get get_cleaned_model() :{}[]{
        return this.cleaned_model
    }
    get get_max_level() : number{
        return this.max_level
    }
    get get_help_mode()
    {
        return this.help_mode
    }
    get get_model():{}{
        return this.model
    }
    get get_level(): number{
        return this.level
    }
    get get_validated_term(){
        return this.validated_term
    } 
    get getChecked(){
        return this.Checked
    }
    get_startfilling() {
        return this.startfilling;
    };

    notify_checkbox_disabled() {
        if (!this.startfilling) {
            this.alertService.error('need to fill the form first');

        }

    }

    toggleVisibility(e) {
        this.asTemplate = e.target.checked;
    };

    save(form: any): boolean {

        if (!form.valid) {
            let message = "this form contains errors! "
            this.alertService.error(message);
            return false;
        }
        else {
            // if (this.asTemplate) {
            //     this.globalService.saveTemplate(this.modelForm.value, this.model_type).pipe(first()).toPromise().then(
            //         data => {
            //             if (data["success"]) {
            //                 let message = "Template saved! " + data["message"]
            //                 this.alertService.success(message);
            //             }
            //             else {
            //                 let message = "Cannot save template! " + data["message"]
            //                 this.alertService.error(message);
            //             }
            //         }
            //     );
            // }
            if (this.mode === "create") {
                if (this.onlyTemplate===true){
                    this.globalService.add_template(this.modelForm.value, this.model_type).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]) {
                                this.model_id = data["_id"];
                                //console.log(data["res_obj"])
                                //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                                
                                var message = "A new template " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                                this.alertService.success(message)

                                this.router.navigate(['/templates']);
                                return true;
                            }
                            else {
                                this.alertService.error("this form contains errors! " + data["message"]);
                                return false;
                            }
                        }
                    );
                }
                else{
                //console.log(this.asTemplate)
                    this.globalService.add(this.modelForm.value, this.model_type, this.parent_id, this.asTemplate).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]) {
                                this.model_id = data["_id"];
                                //console.log(data["res_obj"])
                                //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                                
                                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
                                this.alertService.success(message)
                                let new_step=0
                                if (!this.currentUser.tutoriel_done){
                                    if (this.currentUser.tutoriel_step==="1"){
                                        if (this.model_type === "investigation") {
                                            new_step=2
                                            this.currentUser.tutoriel_step=new_step.toString()
                                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                        }
                                    }
                                    else{
                                        this.alertService.error("You are not in the right form as requested by the tutorial")

                                    }
                                    if (this.currentUser.tutoriel_step==="3"){
                                        if (this.model_type === "study") {
                                            new_step=4
                                            this.currentUser.tutoriel_step=new_step.toString()
                                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                        }
                                    }
                                    else{
                                        this.alertService.error("You are not in the right form as requested by the tutorial")

                                    }
                                    if (this.currentUser.tutoriel_step==="5"){
                                        if(this.model_type==="experimental_factor"){
                                            new_step=6
                                            this.currentUser.tutoriel_step=new_step.toString()
                                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                        }
                                    }
                                    else{
                                        this.alertService.error("You are not in the right form as requested by the tutorial")

                                    }
                                    if (this.currentUser.tutoriel_step==="7"){
                                        if(this.model_type==="observed_variable"){
                                            new_step=8
                                            this.currentUser.tutoriel_step=new_step.toString()
                                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                        }
                                    }
                                    else{
                                        this.alertService.error("You are not in the right form as requested by the tutorial")

                                    }
            
                                
                                    }
                                this.router.navigate(['/projects_tree']);
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
            else {
                let element = event.target as HTMLInputElement;
                let value_field = element.innerText;
                if (this.mode==="edit_template"){
                    this.globalService.update(this.model_key, this.modelForm.value, this.model_type, true).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]) {
                                var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
                                this.alertService.success(message)
                                //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                                
                                this.router.navigate(['/projects_tree']);
                                return true;
                            }
                            else {
                                this.alertService.error("this form contains errors! " + data["message"]);

                                return false;
                            };


                        }
                    );
                
                }
                else{
                    this.globalService.update(this.model_key, this.modelForm.value, this.model_type).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]) {
                                var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
                                this.alertService.success(message)
                                //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                                this.notify.emit(this.modelForm.value);
                                if (this.inline==="false"){
                                    this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser['_id'] , model_type: this.model_type, model_key: this.model_key , mode: "edit", activeTab: 'identifiers' } });
                                }
                                return true;
                            }
                            else {
                                this.alertService.error("this form contains errors! " + data["message"]);
                                return false;
                            };
                        }
                    );
                }
            }
        }
        //Here register the form with the correct investigation id et study id
        //this.formDataService.setAddress(this.address);
        return true;
    };

    cancel(form: any) {
        //console.log(this.mode)
        if (this.mode==="preprocess"){
            this.notify.emit('cancel the form');
        }
        else{
            let new_step=0
            if (!this.currentUser.tutoriel_done){
                if (this.currentUser.tutoriel_step==="1"){
                    if (this.model_type==="investigation"){
                        new_step=0
                        this.currentUser.tutoriel_step=new_step.toString()
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    }
                }
                else{
                    this.alertService.error("You are not in the right form as requested by the tutorial")

                }
                if (this.currentUser.tutoriel_step==="3"){
                    if(this.model_type==="study"){
                        new_step=2
                        this.currentUser.tutoriel_step=new_step.toString()
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    }
                }
                else{
                    this.alertService.error("You are not in the right form as requested by the tutorial")

                }
                if (this.currentUser.tutoriel_step==="5"){
                    if(this.model_type==="experimental_factor"){
                        new_step=4
                        this.currentUser.tutoriel_step=new_step.toString()
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    }
                }
                else{
                    this.alertService.error("You are not in the right form as requested by the tutorial")

                }
                if (this.currentUser.tutoriel_step==="7"){
                    if(this.model_type==="observed_variable"){
                            new_step=6
                            this.currentUser.tutoriel_step=new_step.toString()
                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    }
                }
                else{
                    this.alertService.error("You are not in the right form as requested by the tutorial")
                }
            
                //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
                this.router.navigate(['/projects_tree']);
            }
        }

    }

    back(modelForm, level) {
        if (this.mode==="preprocess"){
            this.level-=1
            if (this.model_type==="biological_material"){
                this.level=1
            }
        }
        else{
            this.router.navigate(['/generic_form'], { queryParams: { level: parseInt(level) - 1, parent_id: this.parent_id, model_key: this.model_key, model_type: this.model_type, mode: this.mode, inline:this.inline, asTemplate:this.asTemplate , onlyTemplate:this.onlyTemplate}, skipLocationChange: true });
        }

    };

    submit(form: any) {
        //console.log("start to submit")
        if (!this.startfilling && this.mode != "edit") {
            this.alertService.error('need to fill the form first');

        }
        else {
            if (this.mode==="preprocess"){
                //console.log("start to subbmit")
                if (!form.valid) {
                    //console.log("invalid  form")
                    let message = "this form contains errors! "
                    this.alertService.error(message);
                    this.notify.emit('error in the form');
                    return false;
                }
                else {
                    var data={'form':this.modelForm.value, 'template':this.asTemplate}
                    this.notify.emit(data);
                }
            }
            else{
                var data={'form':this.modelForm.value, 'template':this.asTemplate}
                this.notify.emit(data);
                this.save(form)
            }
            
        }
    };
    onNext() {
        // Do something
    }
    goToNext(form: any, level) {
        //console.log(level)
        //console.log(this.mode)
        if (this.mode==="preprocess"){
            this.level+=1
            if (this.model_type==="biological_material"){
                this.level=1
            }
        }
        else{
            /////console.log(typeof(this.level))
            //parseInt(this.level)+=1
            //this.level=parseInt(this.level)+1
            //parseInt(level) + 1
            this.router.navigate(['/generic_form'], { queryParams: { level: parseInt(level) + 1, parent_id: this.parent_id, model_key: this.model_key, model_type: this.model_type, mode: this.mode , inline:this.inline, asTemplate:this.asTemplate, onlyTemplate:this.onlyTemplate}, skipLocationChange: true });
        }

    };
}
