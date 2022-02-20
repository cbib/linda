import { Component, OnInit, Input, ViewChild,  Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GlobalService, AlertService, OntologiesService } from '../../../services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators/unique-id-validator.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import * as uuid from 'uuid';
import { SelectionComponent } from '../dialogs/selection.component';
import { SampleSelectionComponent } from '../dialogs/sample-selection.component';
import {JoyrideService} from 'ngx-joyride';
import { BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import { ExperimentalFactorDialogModel } from '../../../models/experimental_factor_models' 
import { PersonInterface } from 'src/app/models/linda/person';

@Component({
  selector: 'app-observation-unit-form',
  templateUrl: './observation-unit-form.component.html',
  styleUrls: ['./observation-unit-form.component.css']
})
export class ObservationUnitFormComponent implements OnInit {
  @ViewChild('matMenu', { static: true }) public matMenu: any;
  //Input parameters from user tree component
  @Input() level;
  @Input() parent_id;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();

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
  private currentUser:PersonInterface
  selectedRowIndex = -1;
  private startfilling: boolean = false;
  ontology_type: string;
  show_spinner: boolean = false;
  ou_index_row=0
  mat_index_row = 0
  observation_id = ""
  biological_material_id = ""
  experimental_factor_id = ""
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
  bm_data = []
  ef_data = []
  sample_data = []


  constructor(private fb: FormBuilder, public globalService: GlobalService,
    public ontologiesService: OntologiesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private readonly joyrideService: JoyrideService,
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
    console.log(this.model_key)
    

  }

  async ngOnInit() {
    this.mode_table = false
    this.observationUnitTouchedRows = [];
    this.biologicalMaterialTouchedRows = [];
    this.experimentalFactorTouchedRows = [];
    this.sampleTouchedRows = [];
    this.bm_data = []
    this.ef_data = []
    this.sample_data = []
    this.ou_index_row = 0
    this.mat_index_row = 0
    this.observation_id = ""
    this.experimental_factor_id = ""
    this.observationUnitTable = this.fb.group({
      observationUnitRows: this.fb.array([]),
      biologicalMaterialRows: this.fb.array([]),
      experimentalFactorRows: this.fb.array([]),
      sampleRows: this.fb.array([]),
    });
    //this.get_model()
    console.log(this.model_key)
    console.log(this.model_type)
    if (this.model_key !== "") {
      this.get_model_by_key();
    }
    await this.get_model()
    this.onClickTour()

  }
 
  ngAfterOnInit() {
    this.ou_index_row = 0
    this.mat_index_row = 0
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
  addFactorValues(index: number, factor_value: string) {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    var fv = observationUnitControl.controls[index].value["Observation Unit factor value"]
    if (fv) {
      fv += "/" + factor_value
    }
    else {
      fv = factor_value
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
      const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
      if (this.mode !== "create") {
        console.log(this.model_to_edit)
        this.bm_data = []
        this.ef_data = []
        this.sample_data = []

        for (var i = 0; i < this.model_to_edit["Observation unit ID"].length; i++) {
          observationUnitControl.push(this.initiateObservationUnitForm(this.mode, i));

        }
        this.observation_id = this.model_to_edit['obsUUID'][0]
        this.globalService.get_all_observation_unit_childs(this.model_to_edit['_id'].split("/")[1]).toPromise().then(
          observation_unit_childs_data => {
            console.log(observation_unit_childs_data)
            //get all biological materials

            for (var i = 0; i < observation_unit_childs_data.length; i++) {
              var child_id: string = observation_unit_childs_data[i]['e']['_to']
              //console.log(observation_unit_childs_data[i])

              if (child_id.includes("biological_materials")) {
                //console.log(child_id)
                //console.log(observation_unit_childs_data[i]['e']['biological_materials'])
                this.biological_material_id = observation_unit_childs_data[i]['e']['biological_materials'][0]['bmUUID']
                var tmp_bm: [] = observation_unit_childs_data[i]['e']['biological_materials']
                this.bm_data = this.bm_data.concat(tmp_bm)

              }
              else if (child_id.includes("experimental_factors")) {
                //console.log(child_id)
                //console.log(observation_unit_childs_data[i]['e']['experimental_factors'])
                var tmp_ef: [] = observation_unit_childs_data[i]['e']['experimental_factors']
                this.ef_data = this.ef_data.concat(tmp_ef)
              }
              //type sample childs
              else {
                //console.log(child_id)

                var sample_data = observation_unit_childs_data[i]['s']['vertices'][1]
                //console.log(sample_data)
                var sample_keys = Object.keys(sample_data);
                var sample = {}
                sample_keys.forEach(key => {
                  if (!key.startsWith("_") && !key.startsWith("Definition")) {
                    sample[key] = sample_data[key]
                  }
                });
                this.sample_data.push(sample)
                // var tmp_samples:[]=observation_unit_childs_data[i]['e']['samples']
                // samples=samples.concat(tmp_samples)

              }
            }
            console.log(this.bm_data)
            console.log(this.ef_data)
            console.log(this.sample_data)



          }
        );


      }


    });
  }
  get_model_by_key() {
    this.model_to_edit = [];
    this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
      this.model_to_edit = data;
      console.log(this.model_to_edit)
      //this.modelForm.patchValue(this.model_to_edit);
    });
  }

  get_experimental_factor(observation_id: string) {
    var obs_ef_data = []
    this.ef_data.forEach(element => {
      if (element.obsUUID === observation_id) {
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
      if (mode !== "create") {
        value = this.model_to_edit[attr["key"]][index]
      }

      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        // if (mode !== "create") {
        //   value = this.model_to_edit[attr["key"]][index]
        // }
        if (attr["key"].includes("ID")) {
          //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
          //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
          attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
        }
        else if (attr["key"].includes("Project Name")) {
          attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
        }
        else if (attr["key"].includes("Study Name")) {
          attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
      }
        else {
          attributeFilters[attr["key"]] = [value];
        }
        if (mode === "create") {
          attributeFilters['obsUUID'] = uuid.v4()
        }
        else {
          attributeFilters['obsUUID'] = this.model_to_edit["obsUUID"][index]
        }

        this.observation_id = attributeFilters['obsUUID']
      }


    });
    //console.log(attributeFilters)
    //console.log(attributeFilters)

    return this.formBuilder.group(attributeFilters);
  }



  ObservationTableRowSelected(i) {

    this.ou_index_row = i

    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.observation_id = observationUnitControl.controls[i].value['obsUUID']
    const biologicalMaterialControl = this.observationUnitTable.get('biologicalMaterialRows') as FormArray;
    if (biologicalMaterialControl.controls.length > 0) {
      this.biological_material_id = biologicalMaterialControl.controls[0].value['bmUUID']
      console.log(this.biological_material_id)
    }
    //console.log(control.controls[i].value)
  }

  MaterialTableRowSelected(i) {
    //console.log(i)
    this.mat_index_row = i
    this.biological_material_id = this.bm_data[i]['bmUUID']
  }


  addObservationUnitRow() {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    observationUnitControl.push(this.initiateObservationUnitForm("create"));
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

  deleteSampleRow(index: number) {

    this.sample_data.splice(index, 1);
  }

  deletebiologicalMaterialRow(index: number) {

    if (index > -1) {
      //neeed to remeove all sample associated with this 

      this.sample_data = this.sample_data.reduce((p, c) => (c['bmUUID'] !== this.bm_data[index]['bmUUID'] && p.push(c), p), []);
      this.bm_data.splice(index, 1);
    }
  }
  deleteObservationUnitRow(index: number) {
    //console.log(this.index_row)
    //console.log(index)
    

    if (index > -1) {
      const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
      this.observation_id = observationUnitControl.controls[index].value['mat-id']
      //neeed to remeove all bm and ef associated with this observation and remove all sample
      this.bm_data = this.bm_data.reduce((p, c) => (c['obsUUID'] !== observationUnitControl.controls[index].value['obsUUID'] && p.push(c), p), []);
      this.ef_data = this.ef_data.reduce((p, c) => (c['obsUUID'] !== observationUnitControl.controls[index].value['obsUUID'] && p.push(c), p), []);
      observationUnitControl.removeAt(index);
      this.sample_data = this.sample_data.reduce((p, c) => (c['bmUUID'] !== this.bm_data[index]['bmUUID'] && p.push(c), p), []);
    }

  }
  deleteExperimentalFactorRow(index: number) {
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





  get get_bm_field() {
    return Object.keys(this.bm_data[0]);
  }
  get get_ef_field() {
    return Object.keys(this.ef_data[0]);
  }

  get get_sample_field() {
    return Object.keys(this.sample_data[0]);
  }
  
  addBiologicalMaterial() {
    const dialogRef = this.dialog.open(SelectionComponent,
      { width: '1400px', autoFocus: true, disableClose: true, maxHeight: '500px', data: { model_id: "", parent_id: this.parent_id, model_type: "biological_material", values: [], already_there: this.get_biological_material_list() } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        var biologicalMaterialData = result['data']
        for (var h = 0; h < biologicalMaterialData.length; h++) {
          var bm: BiologicalMaterialDialogModel
          bm = biologicalMaterialData[h]
          bm.bmUUID = uuid.v4()
          bm.obsUUID = this.observation_id
          this.biological_material_id = bm.bmUUID
          this.bm_data.push(bm)

        }
      }
    });
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





    

  }
//return a list of secondary biological material id list
get_biological_material_list() {
  var bm_list_id = []
  this.bm_data.forEach(element => {
    if (element['obsUUID'] === this.observation_id) {
      var secondary_id = element["materialId"] + "_" + element["biologicalMaterialId"]
      //var secondary_id=element["Material source ID (Holding institute/stock centre, accession)"]+ "_" + element["Biological material ID"]

      bm_list_id.push(secondary_id)
    }
  });
  console.log(bm_list_id)
  return bm_list_id
}
  get_experimental_factor_list() {
    var ef_list_id = []
    this.ef_data.forEach(element => {
      if (element['obsUUID'] === this.observation_id) {
        ef_list_id.push(element['experimentalFactorType'])
      }
    });
    return ef_list_id
  }


  addExperimentalFactor() {


    const dialogRef = this.dialog.open(SelectionComponent,
      { width: '1400px', autoFocus: true, disableClose: true, restoreFocus: false, maxHeight: '500px', data: { model_id: "", parent_id: this.parent_id, model_type: "experimental_factor", values: [], already_there: this.get_experimental_factor_list(), observation_id: this.observation_id } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        console.log(result)
        let message = "experimental factor selected! "
        this.alertService.success(message);

        var experimentalFactorData = result['data']
        for (var i = 0; i < experimentalFactorData.length; i++) {

          var ef: ExperimentalFactorDialogModel
          ef = experimentalFactorData[i]
          console.log(experimentalFactorData[i])

          // ef.experimentalFactorType=experimentalFactorData[i]['experimentalFactorType']
          // ef.experimentalFactorDescription=experimentalFactorData[i]['experimentalFactorDescription']
          // ef.experimentalFactorAccessionNumber=experimentalFactorData[i]['experimentalFactorAccessionNumber']
          // ef.experimentalFactorValues=experimentalFactorData[i]['experimentalFactorValues']
          // var ef={}
          //var keys = Object.keys(experimentalFactorData[i]);
          // keys.forEach(key => {
          //   if (!key.startsWith("_") ) {
          //     ef[key]=experimentalFactorData[i][key]
          //   }
          // });

          ef.efUUID = uuid.v4()
          this.experimental_factor_id = ef.efUUID
          ef.obsUUID = this.observation_id
          //ef.lindaID = experimentalFactorData[i]['_id']
          
          console.log(experimentalFactorData[i])
          this.ef_data.push(ef)
        }
      }
    });

  }

  addSamples() {
    const dialogRef = this.dialog.open(SampleSelectionComponent,
      { width: '1400px', autoFocus: true, disableClose: true, restoreFocus: false, maxHeight: '500px', data: { model_id: "", parent_id: this.parent_id, bm_data: this.bm_data, model_type: "sample", values: [], observation_id: this.observation_id } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        for (var i = 0; i < result.length; i++) {
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
    if  (!this.currentUser.tutoriel_done){
      if (this.currentUser.tutoriel_step==="15"){
        let new_step=14
        this.currentUser.tutoriel_step=new_step.toString()
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      else{

      }
    }
    this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });

  };


  submitForm() {
    const observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    this.observationUnitTouchedRows = observationUnitControl.controls.filter(row => row.touched).map(row => row.value);

    var return_data = { "observation_units": [], "biological_materials": [], "samples": [], "experimental_factors": [] }
    var obs_unit: {}
    //first loop for each obs unit
    for (var i = 0; i < observationUnitControl.controls.length; i++) {
      obs_unit = observationUnitControl.controls[i].value
      return_data.observation_units.push(obs_unit)
      console.log("looking for observation unit :", obs_unit['Observation unit ID'], "with uuid: ", obs_unit['obsUUID'])
      //for each bm, check if same observation id, then 
      var bm_list = []

      var global_sample_list = []
      var bm: {}
      for (var j = 0; j < this.bm_data.length; j++) {
        
        bm = this.bm_data[j]
        console.log("---------looking for biological material :", bm['biologicalMaterialId'], "with uuid: ", bm['bmUUID'])
        if (bm['obsUUID'] === obs_unit['obsUUID']) {
          console.log("---------found biological material obs uuid:", bm['obsUUID'], "equal to obs uuid: ", obs_unit['obsUUID'])
          bm_list.push(bm)
          var sample_list = []
          var sample: {}
          for (var k = 0; k < this.sample_data.length; k++) {
            sample = this.sample_data[k]
            if ((sample['obsUUID'] === obs_unit['obsUUID']) && (sample['bmUUID'] === bm['bmUUID'])) {
              console.log("-------------------------looking for sample :", sample['Sample ID'], "with uuid: ", sample['sampleUUID'])
              sample_list.push(sample)

            }
          }

          console.log("sample list:", sample_list)
          if (sample_list.length>0){
            global_sample_list.push(sample_list)
          }



        }



      }
      return_data.biological_materials.push(bm_list)
      return_data.samples.push(global_sample_list)
      console.log("bm list:", bm_list)
      var ef_list = []
      console.log(this.ef_data)
      for (var j = 0; j < this.ef_data.length; j++) {
        console.log("---------looking for experimental factor obs uuid:", this.ef_data[j]['obsUUID'], "equal to with OBS uuid: ", obs_unit['obsUUID'])
        if (this.ef_data[j]['obsUUID'] === obs_unit['obsUUID']) {
          console.log("---------found experimental factor obs uuid:",this.ef_data[j]['obsUUID'], "equal to obs uuid: ", obs_unit['obsUUID'])

          ef_list.push(this.ef_data[j])
        }
      }
      return_data.experimental_factors.push(ef_list)
    }




    // if (Object.getOwnPropertyNames(return_data).length == 0) {
    //   this.save(return_data)
    // }
    // else{
    //   this.alertService.error("nothing to load !!!!")
    // }
    console.log(return_data)
    this.save(return_data)
    


  }

  save(form: any): boolean {


    // if (this.marked) {
    //   this.globalService.saveTemplate(form.value, this.model_type).pipe(first()).toPromise().then(
    //     data => {
    //       if (data["success"]) {
    //         let message = "Template saved! " + data["message"]
    //         this.alertService.success(message);
    //       }
    //       else {
    //         let message = "Cannot save template! " + data["message"]
    //         this.alertService.error(message);
    //       }
    //     }
    //   );
    // }
    if (this.mode === "create") {


      this.globalService.add_observation_units(form, this.model_type, this.parent_id).pipe(first()).toPromise().then(
        data => {
          if (data["success"]) {

            this.model_id = data["id"];
            if  (!this.currentUser.tutoriel_done){
              if (this.currentUser.tutoriel_step==="11"){
                  let new_step=12
                  this.currentUser.tutoriel_step=new_step.toString()
                  localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              }
              else{
                this.alertService.error("You are not in the right form as requested by the tutorial")
              }
            }
            this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
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
      this.globalService.update_observation_units(form, this.model_key, this.model_type, this.parent_id).pipe(first()).toPromise().then(
        data => {
          console.log(data)
          if (data["success"]) {
            var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
            this.alertService.success(message)
            this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_id.split('/')[1] } });
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
  onClickTour() {
    console.log('start tour part 2')
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
    console.log(this.currentUser['tutoriel_step'])
        console.log(this.currentUser)
        if (this.currentUser['tutoriel_step'] === "11"){
            this.joyrideService.startTour(
                { steps: ['generalContent', 'addObservationUnit', 'associateBiologicalMAterial', 'addBiologicalSample', 'StepDemoForm'], stepDefaultPosition: 'center'} // Your steps order
            );
            //this.currentUser.tutoriel_step="2"
            //localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
 }
 onDone() {
  console.log(this.currentUser['tutoriel_step'])
  if (this.currentUser['tutoriel_step']==="11"){
    this.observationUnitControl = this.observationUnitTable.get('observationUnitRows') as FormArray;
    //this.observationUnitControl.push(this.initiateObservationUnitForm("create", 0))
    var parent_name = this.parent_id.split("/")[0]
    var parent_key = this.parent_id.split("/")[1]
    
    this.globalService.get_type_child_from_parent(parent_name, parent_key, "experimental_factors")
      .toPromise().then(
        experimental_factor_data => {
          this.globalService.get_type_child_from_parent(parent_name, parent_key, "biological_materials").toPromise().then(
            biological_material_data => {
              let cpt=1
              var obs_cpt=0
              var jmin=0
              var jmax=0
              var mode_ef=""
              for (var i=0;i<10;i++){
                var ef = {
                  "experimentalFactorType": "Watering",
                  "experimentalFactorDescription": "Daily watering 1L per plant",
                  "experimentalFactorValues": [],
                  "experimentalFactorAccessionNumber": "EFO:0000470",
                  "lindaID":experimental_factor_data[0]._id,
                  "obsUUID": "",
                  "efUUID": ""
                }
                var ef_tmp: ExperimentalFactorDialogModel
                ef_tmp=ef
          
                ef_tmp.experimentalFactorValues.push("rainfed")
                ef_tmp.experimentalFactorValues.push("watered")
                ef_tmp.efUUID = uuid.v4()
                
                this.observationUnitControl.push(this.initiateObservationUnitForm("create", i))
                //get obs uuid 
                //console.log(this.observationUnitControl.controls[i].value["obsUUID"])
                let obs_uuid=this.observationUnitControl.controls[i].value["obsUUID"]
                ef_tmp.obsUUID=obs_uuid
                console.log(ef_tmp)
                this.ef_data.push(ef_tmp)



                //get obs id 
                let obs_id = 'plot' + (i+1)
                let external_obs_id = 'BIOSAMPLES:plot' + (i+1)
                this.observationUnitControl.controls[i].patchValue({ "Observation unit ID": obs_id })
                this.observationUnitControl.controls[i].patchValue({ "External ID": external_obs_id })
                this.observationUnitControl.controls[i].patchValue({ "Observation unit type": "plot" })
                
                
                if (i<5){
                  jmin=1
                  jmax=6
                  mode_ef="rainfed"
                  this.observationUnitControl.controls[i].patchValue({ "Observation Unit factor value": mode_ef })  
                }
                else if (i==5){
                  jmin=6
                  jmax=11
                  mode_ef="watered"
                  obs_cpt=0
                  this.observationUnitControl.controls[i].patchValue({ "Observation Unit factor value": mode_ef })
                }
                else{
                  
                  mode_ef="watered"
                  this.observationUnitControl.controls[i].patchValue({ "Observation Unit factor value": mode_ef })
                }
                console.log(mode_ef)
                // this.globalService.get_type_child_from_parent(parent_name, parent_key, "biological_materials").toPromise().then(
                //   biological_material_data => {
                console.log(biological_material_data)
                console.log(i)
                console.log(obs_cpt)
                console.log(jmin)   
                console.log(jmax)
                for (var j = jmin; j < jmax; j++) {
                  var mat_id=biological_material_data[0]["Material source ID (Holding institute/stock centre, accession)"][obs_cpt]
                  var id = mat_id +'_' + j
                  var bm = {
                    "biologicalMaterialId": id,
                    "materialId": mat_id,
                    "genus": "Zea",
                    "species": "mays",
                    "lindaID": biological_material_data[0]._id,
                    "obsUUID": "",
                    "bmUUID": ""
                  }
                  var bm_tmp: BiologicalMaterialDialogModel
                  bm_tmp = bm
                  console.log(bm_tmp)
                  bm_tmp.bmUUID = uuid.v4()
                  bm.obsUUID = obs_uuid
                  this.bm_data.push(bm_tmp)
                  cpt += 1
                }
                obs_cpt+=1
              }
              console.log(this.ef_data)
              console.log(this.bm_data)
              this.startfilling=true
            }
          );
          
        }
      );
      
    // var values=[]
    // values.push("rainfed")
    // values.push("watered")

    
    
    
  }
 }

}
