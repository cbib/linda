import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GlobalService, AlertService, OntologiesService } from '../services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';
import * as uuid from 'uuid';
import { SelectionDialogComponent } from '../dialog/selection-dialog.component';
import { TemplateSelectionDialogComponent } from '../dialog/template-selection-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SampleSelectionComponent } from '../dialog/sample-selection.component';

export interface BiologicalMaterial {
  biologicalMaterialId: string;
  materialId: string;
  genus: string;
  species: string;
  lindaID:string;
  bmUUID:string;
  obsUUID:string;
}

@Component({
  selector: 'app-observation-unit-form',
  templateUrl: './observation-unit-form.component.html',
  styleUrls: ['./observation-unit-form.component.css']
})
export class ObservationUnitFormComponent implements OnInit {
  @ViewChild('matMenu', {static: true}) public matMenu: any;
  //Input parameters from user tree component
  @Input() level;
  @Input() parent_id;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;

  observationUnitTable: FormGroup;
  observationUnitControl: FormArray;
  biologicalMaterialControl: FormArray;
  experimentalFactorControl: FormArray;
  sampleControl: FormArray;
  mode_table: boolean = false;
  observationUnitTouchedRows: any;
  biologicalMaterialTouchedRows: any;
  experimentalFactorTouchedRows: any;
  sampleTouchedRows: any;


  private startfilling: boolean = false;
  ontology_type: string;
  show_spinner: boolean = false;
  index_row = 0
  observation_id = ""
  biological_material_id = ""
  selected_term: OntologyTerm
  selected_set: []
  validated_term = {}
  marked = false;
  ontologies = ['XEO', 'EO', 'EnvO', 'PO_Structure', 'PO_Development']
  model_id: string;
  max_level = 1;
  model: any = [];
  model_to_edit: any = [];
  levels = []
  cleaned_model: any = [];
  keys: any = [];
  bm_data=[]
  ef_data=[]
  sample_data=[]


  constructor(private fb: FormBuilder, public globalService: GlobalService,
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
  }

  async ngOnInit() {
    this.mode_table = false
    this.observationUnitTouchedRows = [];
    this.biologicalMaterialTouchedRows = [];
    this.experimentalFactorTouchedRows = [];
    this.sampleTouchedRows = [];
    this.bm_data=[]
    this.ef_data=[]
    this.sample_data=[]

    this.index_row = 0
    this.observation_id = ""
    this.observationUnitTable = this.fb.group({
      observationUnitRows: this.fb.array([]),
      biologicalMaterialRows: this.fb.array([]),
      experimentalFactorRows: this.fb.array([]),
      sampleRows: this.fb.array([]),
    });
    //this.get_model()
    await this.get_model()

  }
  ngAfterOnInit() {
    this.observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.biologicalMaterialControl = this.observationUnitTable.get('biologicalMaterialRows') as FormArray;
    this.experimentalFactorControl = this.observationUnitTable.get('experimentalFactorRows') as FormArray;
    this.sampleControl = this.observationUnitTable.get('sampleRows') as FormArray;


  }
  onTaskAdd(event) {
    this.startfilling = false;
    this.keys.forEach(attr => {
      if (this.observationUnitTable.value[attr] !== "") {
        this.startfilling = true;
      }
    });
  }
  addFactorValues(index: number, factor_value:string) {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    var fv = observationUnitControl.controls[index].value["Observation Unit factor value"]
    if (fv){
      fv+="/" + factor_value
    }
    else{
      fv=factor_value
    }
    
    observationUnitControl.controls[index].patchValue({ "Observation Unit factor value": fv })
  }

  get_model() {
    this.model = [];
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    this.globalService.get_model(this.model_type).toPromise().then(data => {
      this.model = data;
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
          dict["Associated_ontologies"] = this.model[this.keys[i]]["Associated ontologies"]
          this.cleaned_model.push(dict)
        }
      }
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
    });
  }
  get_model_by_key() {
    this.model_to_edit = [];
    this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
      this.model_to_edit = data;
      //this.modelForm.patchValue(this.model_to_edit);
    });
  }

  get_experimental_factor(observation_id:string){
    var obs_ef_data=[]
    this.ef_data.forEach(element => {
      if (element.observation_id===observation_id){
        obs_ef_data.push(element)
      }
    });

    return obs_ef_data
  }

  initiateObservationUnitForm(mode: string = "create", index: number = 0): FormGroup {
    // console.log(this.cleaned_model)


    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''

      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (mode !== "create") {
          value = this.model_to_edit[attr["key"]][index]
        }
        if (attr["key"].includes("ID")) {
          //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
          //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
          attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
        }
        else if (attr["key"].includes("Short title")) {
          attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
        }
        else {
          attributeFilters[attr["key"]] = [value];
        }
        attributeFilters['obs-id'] = uuid.v4()
        this.observation_id = attributeFilters['obs-id']
      }


    });

    return this.formBuilder.group(attributeFilters);
  }



  ObservationTableRowSelected(i) {
    //console.log(i)
    this.index_row = i
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.observation_id = observationUnitControl.controls[i].value['obs-id']
    const biologicalMaterialControl = this.observationUnitTable.get('biologicalMaterialRows') as FormArray;
    if (biologicalMaterialControl.controls.length>0){
      this.biological_material_id=biologicalMaterialControl.controls[0].value['bmUUID']
    }
    //console.log(control.controls[i].value)
  }

  MaterialTableRowSelected(i) {
    //console.log(i)
    this.index_row = i
    this.biological_material_id=this.bm_data[i]['bmUUID']
  }


  addObservationUnitRow() {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    observationUnitControl.push(this.initiateObservationUnitForm());
    //this.index_row+=1
    //console.log(this.material_id)
    //console.log(this.index_row)
  }
  // addBiologicalMaterialRow() {
  //   //console.log(this.material_id)
  //   if (this.material_id === "") {
  //     this.alertService.error("you need to select or create a material first !!!!")
  //   }
  //   else {
  //     const biologicalMaterialControl = this.observationUnitTable.get('biologicalMaterialRows') as FormArray;
  //     biologicalMaterialControl.push(this.initiateBiologicalMaterialForm());
  //   }
  // }

  deleteSampleRow(index: number){

    this.sample_data.splice(index, 1);
  }

  deletebiologicalMaterialRow(index: number){

    if (index > -1) {
      //neeed to remeove all sample associated with this 
      
      this.sample_data = this.sample_data.reduce((p,c) => (c['bmUUID'] !== this.bm_data[index]['bmUUID'] && p.push(c),p),[]);
      this.bm_data.splice(index, 1);
    }
  }
  deleteObservationUnitRow(index: number) {
    //console.log(this.index_row)
    //console.log(index)
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.observation_id = observationUnitControl.controls[index].value['mat-id']
    observationUnitControl.removeAt(index);
  }
  deleteExperimentalFactorRow(index: number){
    if (index > -1) {
      this.ef_data.splice(index, 1);
    }
  }


  get getObservationUnitFormControls() {
   
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    return observationUnitControl;
  }
  // get getBiologicalMaterialFormControls() {
  //   const biologicalMaterialControl = this.observationUnitTable.get('biologicalMaterialRows') as FormArray;

  //   return biologicalMaterialControl;
  // }
  // get getGeneralFormControls() {
  //   const generalControl = this.observationUnitTable.get('generalRows') as FormArray;
  //   return generalControl;

  // }


  
  

  get get_bm_field(){
    return Object.keys(this.bm_data[0]);
  }
  get get_ef_field(){
      return Object.keys(this.ef_data[0]);
  }

  get get_sample_field(){
    return Object.keys(this.sample_data[0]);
}
  
  addBiologicalMaterial() {
    const dialogRef = this.dialog.open(SelectionDialogComponent, 
      {width: '1400px', autoFocus: true, disableClose: true, maxHeight: '500px', data: {model_id: "", parent_id:this.parent_id, model_type:"biological_material", values:[], already_there:this.get_biological_material_list()} }
      );

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log(result)

        let message = "biological_material selected! "
        this.alertService.success(message);
        var biologicalMaterialData =result['data']
        for (var h =0;h<biologicalMaterialData.length;h++){
          var bm:BiologicalMaterial
          bm=biologicalMaterialData[h]
          bm.bmUUID= uuid.v4()
          bm.obsUUID=this.observation_id
          this.biological_material_id=bm.bmUUID
          this.bm_data.push(bm)

        }
        // var material_ids=result['material_ids']
        // var biological_material_ids=result['biological_material_ids']
        // var mat_index=0
        // var bio_mat_index=0

        // for (var h =0;h<biologicalMaterialData.length;h++){
        //   console.log('biologicalMaterialData index: ', h)
        //   for (var i =0;i<material_ids.length;i++){
        //     console.log('MaterialData index: ', i, ' material_ids[',i,']: ', material_ids[i])
        //     if (biologicalMaterialData[h]["Material source ID (Holding institute/stock centre, accession)"].indexOf(material_ids[i])!==-1){
        //       var bm={}
        //       mat_index=biologicalMaterialData[h]["Material source ID (Holding institute/stock centre, accession)"].indexOf(material_ids[i])
        //       console.log('Mat index in whole obj: ', mat_index)
        //       bio_mat_index=biologicalMaterialData[h]["Biological material ID"][mat_index].indexOf(biological_material_ids[i])
        //       var keys = Object.keys(biologicalMaterialData[h]);
        //       keys.forEach(key => {

        //         if (!key.startsWith("_") ) {
        //           console.log(key, biologicalMaterialData[h][key][mat_index])
        //           if (key.includes("Biological material ID")) {
        //             bm[key]=biologicalMaterialData[h][key][mat_index][bio_mat_index]
        //           }
        //           if (key.includes("Material source ID (Holding institute/stock centre, accession)")) {
        //             bm[key]=biologicalMaterialData[h][key][mat_index]
        //           }
        //           if (typeof biologicalMaterialData[h][key]==='string'){
        //             bm[key]=biologicalMaterialData[h][key]

        //           }
                  
        //         }

        //       });
        //       bm['observation_id']=this.observation_id
        //       bm['Database id']=biologicalMaterialData[h]['_id']
        //       bm['bm-id'] = uuid.v4()
        //       this.biological_material_id=bm['bm-id']
        //       this.bm_data.push(bm)
        //     }

        //   }
        // }
        
        console.log(this.bm_data)
        

        

      }
    });

  }

  get_experimental_factor_list(){
    var ef_list_id=[]
    this.ef_data.forEach(element => {
      ef_list_id.push(element['Database id'])
    });
    return ef_list_id
  }

  //return a list of secondary biological material id list
  get_biological_material_list(){
    var bm_list_id=[]
    this.bm_data.forEach(element => {
      var secondary_id=element["Material source ID (Holding institute/stock centre, accession)"]+"_" + element["Biological material ID"]
      bm_list_id.push(secondary_id)
    });
    return bm_list_id
  }
  addExperimentalFactor() {
    
    
    const dialogRef = this.dialog.open(SelectionDialogComponent, 
      {width: '1400px', autoFocus: true, disableClose: true, restoreFocus:false, maxHeight: '500px', data: {model_id: "", parent_id:this.parent_id, model_type:"experimental_factor", values:[], already_there:this.get_experimental_factor_list(),observation_id:this.observation_id} }
      );
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        
        console.log(result)
        let message = "experimental factor selected! "
        this.alertService.success(message);

        var experimentalFactorData =result['data']
        for (var i =0;i<experimentalFactorData.length;i++){
          var ef={}
          var keys = Object.keys(experimentalFactorData[i]);
        
          keys.forEach(key => {
            if (!key.startsWith("_") ) {
              ef[key]=experimentalFactorData[i][key]
            }
          });
          ef['observation_id']=this.observation_id
          ef['Database id']=experimentalFactorData[i]['_id']
          this.ef_data.push(ef)
        }
      }
    });

  }

  addSamples() {
    const dialogRef = this.dialog.open(SampleSelectionComponent, 
      {width: '1400px', autoFocus: true, disableClose: true, restoreFocus:false, maxHeight: '500px', data: {model_id: "", parent_id:this.parent_id, bm_data: this.bm_data, model_type:"sample", values:[],observation_id:this.observation_id} }
      );
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log(result)
        for (var i =0;i<result.length;i++){
          result[i]['sampleUUID'] = uuid.v4()
          //console.log(result[i])
          this.sample_data.push(result[i])
        
        }
        let message = "experimental factor selected! "
        this.alertService.success(message);

      }
    });
    

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
    this.marked = e.target.checked;
  };
  cancel() {
    this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });

  };


  submitForm() {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.observationUnitTouchedRows = observationUnitControl.controls.filter(row => row.touched).map(row => row.value);

    var return_data = {}
    var obs_unit:{}
    //first loop for each obs unit
    for (var i=0; i<observationUnitControl.controls.length;i++ ){
      obs_unit=observationUnitControl.controls[i].value
      console.log("looking for observation unit :", obs_unit['Observation unit ID'], "with uuid: ",  obs_unit['obs-id'])
      //for each bm, check if same observation id, then 
      var bm_list=[]
      var bm:{}
      for (var j=0; j<this.bm_data.length;j++ ){
        bm=this.bm_data[j]
        if (bm['obsUUID']===obs_unit['obs-id']){
          console.log("---------looking for biological material :", bm['biologicalMaterialId'], "with uuid: ",  bm['bmUUID'])
          bm_list.push(bm)
          var sample_list=[]
          var sample:{}
          for (var k=0; k<this.sample_data.length;k++ ){
            sample=this.sample_data[k]
            if ((sample['obsUUID']===obs_unit['obs-id'])  && (sample['bmUUID']===bm['bmUUID'])){
              console.log("-------------------------looking for sample :", sample['Sample ID'], "with uuid: ",  sample['sampleUUID'])
              sample_list.push(sample)
              
            }
          } 
          console.log("found sample :", sample_list)



        }

      }
      console.log("found bm :", bm_list)
      var ef_list=[]
      for (var j=0; j<this.ef_data.length;j++ ){
        if (this.ef_data[j]['obsUUID']===obs_unit['obs-id']){
          ef_list.push(this.ef_data[j])
        }
      }
    }
    


    // if (Object.getOwnPropertyNames(return_data).length == 0) {
    //   this.save(return_data)
    // }
    // else{
    //   this.alertService.error("nothing to load !!!!")
    // }
    
    //this.save(return_data)
    console.log(return_data)

    
  }

  save(form: any): boolean {


    if (this.marked) {
      this.globalService.saveTemplate(form.value, this.model_type).pipe(first()).toPromise().then(
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

      this.globalService.add(form, this.model_type, this.parent_id).pipe(first()).toPromise().then(
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
      this.globalService.update(this.model_key, form, this.model_type,).pipe(first()).toPromise().then(
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
    return true;
  };

  toggleTheme() {
    this.mode_table = !this.mode_table;
  }
}
