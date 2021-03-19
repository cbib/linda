import { Component, OnInit, Input } from '@angular/core';
import { GlobalService, AlertService, OntologiesService } from '../services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';
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
    @Input() level;
    @Input() parent_id;
    @Input() model_key: string;
    @Input() model_type: string;
    @Input() mode: string;

    private startfilling: boolean = false;
    ontology_type: string;
    show_spinner: boolean = false;
    Checked = false
    selected_term: OntologyTerm
    selected_set: []
    validated_term = {}
    marked = false;
    modelForm: FormGroup;
    ontologies = ['XEO', 'EO', 'EnvO', 'PO_Structure', 'PO_Development']
    model_id: string;
    max_level = 1;
    model: any = [];
    model_to_edit: any = [];
    levels = []
    cleaned_model: any = [];
    keys: any = [];
    disabled_id_keys = []

    constructor(
        public globalService: GlobalService,
        public ontologiesService: OntologiesService,
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        public dialog: MatDialog) {

        this.route.queryParams.subscribe(
            params => {
                this.level = params['level'];
                this.model_type = params['model_type'];
                this.model_key = params['model_key'];
                this.mode = params['mode'];
                this.parent_id = params['parent_id']
            }
        );
        if (this.model_key != "") {
            this.get_model_by_key();
        }
        //this.get_model();
    }

    ngOnInit() {
        this.get_max_level();
        this.get_model();

    };

    // addSellingPoint() {
    //     this.sellingPoints.push(this.fb.group({point:''}));
    //   }

    // get modelForm() {
    //     return this.modelForm.get('selling_points') as FormArray;
    //   }

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

    get_model() {
        this.modelForm = new FormGroup({});
        this.model = [];

        //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
        this.globalService.get_model(this.model_type).toPromise().then(data => {
            this.model = data;
            //console.log(this.model)
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
            this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });

            //console.log(this.cleaned_model)

            if (this.mode === "create") {
                console.log(this.model_type)



                this.modelForm = this.initiateForm()
                console.log(this.modelForm.value)

                // let attributeFilters = {};
                // this.cleaned_model.forEach(attr => {
                //     this.validated_term[attr["key"]]={selected:false, values:""}
                //     if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")){
                //         if  (attr["key"].includes("ID")){
                //             //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
                //             //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
                //             attributeFilters[attr["key"]] = ['',[Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr["key"])];
                //         }
                //         else if(attr["key"].includes("Short title")){
                //             attributeFilters[attr["key"]] = ['',[Validators.required, Validators.minLength(4)]];
                //         }
                //         else{
                //             attributeFilters[attr["key"]] = [''];
                //         }
                //     }
                // });
                // this.modelForm= this.formBuilder.group(attributeFilters);

            }
            else {
                let attributeFilters = [];
                this.cleaned_model.forEach(attr => {
                    if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
                        this.validated_term[attr["key"]] = { selected: false, values: "" }
                        //if (attr["key"].includes("ID")) {
                        if (attr["format"] === "Unique identifier") {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]];

                            this.disabled_id_keys.push(attr["key"])

                        }
                        else if (attr["key"].includes("Short title")) {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]], [Validators.required, Validators.minLength(4)]];
                        }
                        else {
                            attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]]];
                        }
                    }
                });
                this.modelForm = this.formBuilder.group(attributeFilters);

                for (let i = 0; i < this.disabled_id_keys.length; i++) {
                    let attr = this.disabled_id_keys[i]
                    console.log(this.disabled_id_keys[i])
                    console.log(this.modelForm.value)
                    console.log(this.modelForm.get(this.disabled_id_keys[i]))
                    console.log(this.modelForm.value[this.disabled_id_keys[i]])
                    if (this.disabled_id_keys[i].includes("ID")){
                        this.modelForm.get(this.disabled_id_keys[i]).disable();
                    }
                    else{
                        if (this.modelForm.value[this.disabled_id_keys[i]]){
                            this.modelForm.get(this.disabled_id_keys[i]).disable();
                        }
                    }
                    
                    
                }




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
        //console.log(value)
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
                        console.log(this.selected_set)
                        console.log(key)
                        var term_id = result.selected_set[0]['id']
                        var term_def = result.selected_set[0]['def']
                        var term_name = result.selected_set[0]['name']
                        var term = result.selected_set[0]['term']
                        console.log(term)
                        this.validated_term[key] = { selected: true, values: term_id };
                        var var_key = ""
                        var var_name = ""
                        var var_name_id = ""
                        var var_description = ""
                        console.log(key)


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
                            console.log(term)
                            this.modelForm.controls["Environment parameter value"].patchValue(term["value"] + " " + term.unit)
                        }
                        if (this.modelForm.controls["Environment parameter"]) {
                            console.log(term)
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
        this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
            this.model_to_edit = data;
            this.modelForm.patchValue(this.model_to_edit);
        });
    };

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
        console.log(this.startfilling)
        console.log(this.modelForm.value)
    }

    get_max_level() {
        this.globalService.get_max_level(this.model_type).toPromise().then(data => {
            this.max_level = data;
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

    get diagnostic() {
        return JSON.stringify(this.modelForm);
    };

    get_startfilling() {
        return this.startfilling;
    };

    notify_checkbox_disabled() {
        if (!this.startfilling) {
            this.alertService.error('need to fill the form first');

        }

    }

    toggleVisibility(e) {
        this.marked = e.target.checked;
    };

    save(form: any): boolean {

        if (!form.valid) {
            let message = "this form contains errors! "
            this.alertService.error(message);
            return false;
        }
        else {
            if (this.marked) {
                this.globalService.saveTemplate(this.modelForm.value, this.model_type).pipe(first()).toPromise().then(
                    data => {
                        if (data["success"]) {
                            let message = "Template saved! " + data["message"]
                            this.alertService.success(message);
                        }
                        else {
                            let message = "Cannot save template! " + data["message"]
                            this.alertService.error(message);
                        }
                    }
                );
            }
            if (this.mode === "create") {
                this.globalService.add(this.modelForm.value, this.model_type, this.parent_id).pipe(first()).toPromise().then(
                    data => {
                        if (data["success"]) {
                            this.model_id = data["_id"];
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
                let element = event.target as HTMLInputElement;
                let value_field = element.innerText;
                this.globalService.update(this.model_key, this.modelForm.value, this.model_type,).pipe(first()).toPromise().then(
                    data => {
                        if (data["success"]) {
                            var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
                            this.alertService.success(message)
                            this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
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
        //Here register the form with the correct investigation id et study id
        //this.formDataService.setAddress(this.address);
        return true;
    };

    cancel(form: any) {
        this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });

    };

    back(modelForm, level) {
        this.router.navigate(['/generic'], { queryParams: { level: parseInt(level) - 1, parent_id: this.parent_id, model_key: this.model_key, model_type: this.model_type, mode: this.mode } });


    };
    submit(form: any) {
        if (!this.startfilling && this.mode != "edit") {
            this.alertService.error('need to fill the form first');

        }
        else {
            this.save(form)
        }
    };
    goToNext(form: any, level) {
        this.router.navigate(['/generic'], { queryParams: { level: parseInt(level) + 1, parent_id: this.parent_id, model_key: this.model_key, model_type: this.model_type, mode: this.mode } });

    };
}




