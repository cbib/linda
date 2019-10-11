import { Component, OnInit, AfterViewInit,Input } from '@angular/core';
import { GlobalService,  AlertService, OntologiesService } from '../services';
import { FormBuilder, FormGroup, Validators ,FormArray, FormControl} from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import { DateValidatorComponent,UniqueIDValidatorComponent} from '../validators';
import {formatDate } from '@angular/common';
import localeES from "@angular/common/locales/es";
import localeFr from '@angular/common/locales/fr';
import { map, catchError, tap  } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit//, AfterViewInit 
 {
    @Input() level;
    @Input() parent_id; 
    @Input() model_key:string;
    @Input() model_type:string;
    @Input() mode:string;
    
    private startfilling:boolean=false;
    ontology_type: string;
    selected_term:OntologyTerm
    selected_set:[]
    validated_term={}
    marked = false;
    theCheckbox = false;
    modelForm: FormGroup;
    submitted = false;
    loading = false;
    model_id:string;
    max_level=1;
    model:any = [];
    model_to_edit:any = [];
    levels=[] 
    dict_array:any=[];
    keys:any = [];

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
                this.level=params['level'];
                this.model_type=params['model_type'];
                this.model_key=params['model_key'];
                this.mode=params['mode'];
                this.parent_id=params['parent_id']
            }
        );
        if (this.model_key!=""){
            this.get_model_by_key();
        }
        this.get_model();
    }
   
    ngOnInit() { 
        this.get_max_level();
        this.modelForm = new FormGroup({});    
    };
  
    get f() { 
        return this.modelForm.controls; 
    }
    
    onSelect(values:string, key:string) {
        const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', data: {ontology_type: values,selected_term: null,selected_set:[]}});
        dialogRef.afterClosed().subscribe(result => {
            if (result!==undefined){
                this.ontology_type = result.ontology_type;
                this.selected_set = result.selected_set;
                this.selected_term = result.selected_term;
                this.validated_term[key]={selected:true};
                this.modelForm.controls[key].patchValue(this.selected_term.id)
            }
            });            
    }

    isFormEmpty():boolean{
        this.keys.forEach(attr => {
            if (this.modelForm.value[attr]!==""){
                this.startfilling=true;
            }
        });
        return true
    }
    onTaskAdd(event){
        this.startfilling=false;
        this.keys.forEach(attr => {
            if (this.modelForm.value.attr!==""){
                this.startfilling=true;
            }
        }); 
    }

    get_max_level(){
        this.globalService.get_max_level(this.model_type).toPromise().then(data => {
            this.max_level=data;
            for (var i=1; i<this.max_level+1;i++ ){
                this.levels.push(i)
          
             }
        });
        
    }
    get_model(){
        
        this.model=[];        
        this.globalService.get_model(this.model_type).toPromise().then(data => {
            this.model = data;
            this.keys=Object.keys(this.model);
            this.dict_array=[]
            for( var i = 0; i < this.keys.length; i++){     
                if ( this.keys[i].startsWith("_") || this.keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    this.keys.splice(i, 1); 
                    i--;
                }
                else{
                    var dict={}
                    dict["key"]=this.keys[i]
                    dict["pos"]=this.model[this.keys[i]]["Position"]
                    this.dict_array.push(dict)
                }
                
            }

            this.dict_array=this.dict_array.sort(function (a, b) {return a.pos - b.pos;});

            if (this.mode ==="create"){

                let attributeFilters = [];

                this.dict_array.forEach(attr => {
                    
                    this.validated_term[attr["key"]]={selected:false}
                    if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")){
                        if  (attr["key"].includes("ID")){
                            //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
                            //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
                            attributeFilters[attr["key"]] = ['',[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr["key"])];
                            //attributeFilters[attr] = ['',[], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
                        }
                        else{
                            attributeFilters[attr["key"]] = [''];
                        }
                    }
                });
                this.modelForm= this.formBuilder.group(attributeFilters);
            }
            else{  
                let attributeFilters = [];

                this.dict_array.forEach(attr => {  
                    if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")){

                         this.validated_term[attr["key"]]={selected:false}
                         attributeFilters[attr["key"]] = [this.model_to_edit[attr["key"]]];
                         //attributeFilters[attr] = ['']
                    }
                });
                this.modelForm= this.formBuilder.group(attributeFilters);
            }                
        });
    };
    
    get_model_by_key(){
        //this.modelForm = new FormGroup({});
        this.model_to_edit=[];        
        this.globalService.get_by_key(this.model_key,this.model_type).toPromise().then(data => {
            this.model_to_edit = data;
            //this.modelForm.value=this.model_to_edit
            this.modelForm.patchValue(this.model_to_edit);
        });
    };
    
   
    get diagnostic() { 
        return JSON.stringify(this.modelForm); 
    };
    
    get_startfilling(){
        return this.startfilling;
    };
    
    toggleVisibility(e){
        this.marked= e.target.checked;
        (console.log("checkbox checked is " +this.marked))
    };
    
    save(form: any): boolean {
        
        if (!form.valid) {
            this.alertService.error("this form contains errors! ");

            return false;
        }
        else{
            if (parseInt(this.level)==this.max_level){

                if(this.marked){
                    this.globalService.saveTemplate(this.modelForm.value,this.model_type).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]){
                                this.alertService.success("Template saved! " + data["message"]);
                            }
                            else{
                                this.alertService.error("Cannot save template! " + data["message"]);
                            }
                        }
                    );
                }
                if (this.mode==="create"){
                    this.globalService.add(this.modelForm.value,this.model_type, this.parent_id).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]){
                                this.model_id=data["_id"];
                                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                this.alertService.success("Your component has been successfully integrated in your history !!")

                                return true;
                                //this.router.navigate(['/investigation'],{ queryParams: { key:  this.investigation_key} });
                            }
                            else{
                                this.alertService.error("this form contains errors! " + data["message"]);
                                return false;
                                //this.router.navigate(['/studies']);
                            }
                        }
                    );
                }
                else{
                    let element = event.target as HTMLInputElement;
                    let value_field = element.innerText;
                    this.globalService.update(this.model_key, this.modelForm.value,this.model_type,).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]){
                                    //this.alertService.success('INVESTIGATION successful registration', true);
                                    //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                    this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                    return true;
                                    //this.router.navigate(['/home']);
                                }
                                else{
                                    this.alertService.error("this form contains errors! " + data["message"]);

                                    return false;
                                    //this.router.navigate(['/studies']);
                                };


                            }
                    );
                }
                
                
            }
            else{
                return true;
            }
        }
        //Here register the form with the correct investigation id et study id
        //this.formDataService.setAddress(this.address);
        return true;
    };

    cancel(form: any) {
        this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_id.split('/')[1]} });

    };
    
    back(modelForm,level){
        this.router.navigate(['/generic'],{ queryParams: {level:parseInt(level)-1, parent_id: this.parent_id, model_key:this.model_key,model_type:this.model_type,mode:this.mode}});

        
    };
    submit(form: any){
        if (this.save(form)) {
        }
    };
    goToNext(form: any,level) {
        this.router.navigate(['/generic'],{ queryParams: {level:parseInt(level)+1, parent_id: this.parent_id, model_key:this.model_key,model_type:this.model_type,mode:this.mode}});

    };
}




