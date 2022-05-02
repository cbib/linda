import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators/unique-id-validator.component';
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import * as uuid from 'uuid';
import { BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import { MatPaginator } from '@angular/material';
import { date, RxwebValidators } from "@rxweb/reactive-form-validators"
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  bm_data: [];
  values: [];
  observation_id: string[]
}

export interface Sample {
  sampleID: string;
  plantAnatomicalEntity: string;
  plantStructureDevelopmentStage: string;
  sampleDescription: string;
  externalID: string;
  collectionDate: Date;
  sampleUUID: string;
}

const SAMPLE_ELEMENT_DATA: Sample[] = []
const BM_ELEMENT_DATA: BiologicalMaterialDialogModel[] = []

@Component({
  selector: 'app-sample-selection',
  templateUrl: './sample-selection.component.html',
  styleUrls: ['./sample-selection.component.css']
})


export class SampleSelectionComponent implements OnInit {
  @ViewChild('matpaginator', { static: true }) matpaginator: MatPaginator;
  @ViewChild('sampleselectionpaginator', { static: true }) sampleselectionpaginator: MatPaginator;
  ready_to_show: boolean = false
  sampleTable: FormGroup;
  sampleControl: FormArray;
  sampleTouchedRows: any;
  panel_disabled: boolean = true
  panel_expanded: boolean = false
  model_loaded: boolean = false
  private model_id: string;
  private result: []
  private model_type: string;
  private parent_id: string;
  private bm_data: [];
  selected_term: OntologyTerm
  selected_set: []
  validated_term = {}
  model: any = [];
  cleaned_model: any = [];
  observation_id = []
  sample_id = ""
  use_sample_list: boolean = false;
  autogenerateIsChecked: boolean = false
  technicalReplicateIsChecked: boolean = false
  TechnicalReplicateNumber: number = 1;
  displayedMaterialColumns: string[] = ['biologicalMaterialId', 'materialId', 'genus', 'species', 'lindaID', 'select'];

  //displayedMaterialColumns: string[] = ['Biological material ID', 'Material source ID (Holding institute/stock centre, accession)', 'Genus', 'Species', 'Database id', 'select'];
  displayedSampleColumns: string[] = ['Sample ID', 'Plant anatomical entity', 'Plant structure development stage', 'Sample description', 'External ID', 'Collection date', 'Edit'];
  private sampledataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<BiologicalMaterialDialogModel>
  private initialSelection = []
  selection = new SelectionModel<BiologicalMaterialDialogModel>(true, this.initialSelection /* multiple */);
  sample_index_row: number = 0;
  SampleDate: Date;
  sample_ready: boolean = false;
  totalSample: number = 1;
  totalSampleByMaterial: number = 1;
  SampleDescription: string = "";
  PlantAnatomicalEntity: string = "";
  PlantStructureDevelopmentStage: string = ""

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private _cdr: ChangeDetectorRef,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<SampleSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog) {
    this.model_id = this.data.model_id;
    this.model_type = this.data.model_type;
    this.parent_id = this.data.parent_id;
    this.bm_data = this.data.bm_data
    this.observation_id = this.data.observation_id
    this.result = []
    this.sampleTable = this.fb.group({
      sampleRows: this.fb.array([])
    });
    console.log(this.bm_data)
    console.log(this.observation_id)
  }

  async ngOnInit() {
    console.warn(this.model_type)
    console.warn(this.parent_id)

    /* this.observation_id = this.data.observation_id
    var parent_name = this.data.parent_id.split("/")[0]
    var parent_key = this.data.parent_id.split("/")[1] */
    var child_type = this.model_type + "s"
    this.sampleTouchedRows = [];
    this.sample_id = ""

    //console.log(this.materialdataSource)
    this.materialdataSource.data = this.load_material()
    this.materialdataSource.sort = this.sort
    this.materialdataSource.paginator = this.matpaginator;
    this._cdr.detectChanges()
    await this.get_model()
  }
  ngAfterViewInit() {
    this.materialdataSource.paginator = this.matpaginator;
    this._cdr.detectChanges()
  }


  load_material(): BiologicalMaterialDialogModel[] {

    return this.bm_data.filter(element => this.observation_id.includes(element["obsUUID"]))
    /* var data = []
    this.bm_data.forEach(element => {
      if (element["obsUUID"]===this.observation_id){
        data.push(element);

      }
    }); 
    return data*/
    //console.log(data)

    // var mat_ids = []
    // mat_ids = attr['Material source ID (Holding institute/stock centre, accession)']
    // var mat_size = mat_ids.length
    // for (var i = 0; i < mat_size; i++) {
    //   var mat_id = mat_ids[i]
    //   var genus = attr['Genus']
    //   var species = attr['Species']
    //   for (var j = 0; j < keys.length; j++) {
    //     if (!keys[j].startsWith("_") && !keys[j].startsWith("Definition")) {
    //       if (keys[j].includes("Biological material ID")) {
    //         var tmp_key_array = []
    //         tmp_key_array = attr[keys[j]][i]
    //         for (var k = 0; k < tmp_key_array.length; k++) {
    //           data.push({
    //             biologicalMaterialId: tmp_key_array[k],
    //             materialId: mat_id,
    //             genus: genus,
    //             species: species,
    //             lindaID: attr["_id"]
    //           })
    //         }
    //       }
    //     }
    //   }
    // }

  }

  async get_model() {
    this.model = [];
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    await this.globalService.get_model(this.model_type).toPromise().then(data => {
      this.model = data;
      // //console.log(this.model)
      var sample_keys = Object.keys(this.model);
      this.cleaned_model = []
      for (var i = 0; i < sample_keys.length; i++) {
        if (sample_keys[i].startsWith("_") || sample_keys[i].startsWith("Definition")) {
          sample_keys.splice(i, 1);
          i--;
        }
        else {
          var dict = {}
          dict["key"] = sample_keys[i]
          dict["pos"] = this.model[sample_keys[i]]["Position"]
          dict["level"] = this.model[sample_keys[i]]["Level"]
          dict["Associated_ontologies"] = this.model[sample_keys[i]]["Associated ontologies"]
          this.cleaned_model.push(dict)
          this.validated_term[sample_keys[i]] = { selected: false, values: "" }
        }
      }
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
      this.model_loaded = true
    });
  }

  ngAfterOnInit() {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
  }
  //initiateSampleForm(bm_id:string="", obs_id=""): FormGroup {
  initiateSampleForm(bm: BiologicalMaterialDialogModel): FormGroup {
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      //this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Sample ID")) {
          //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
          //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService,this.model_type, attr)];
          //attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"], this.parent_id)];
          attributeFilters[attr["key"]] = [value, [RxwebValidators.unique(), RxwebValidators.required()]];

        }
        else if (attr["key"].includes("External ID")) {
          attributeFilters[attr["key"]] = [value, RxwebValidators.unique()];
        }
        else if (attr["key"].includes("Sample description")) {
          attributeFilters[attr["key"]] = [this.SampleDescription, RxwebValidators.required()];
        }
        else if (attr["key"].includes("Plant anatomical entity")) {
          attributeFilters[attr["key"]] = [this.PlantAnatomicalEntity, RxwebValidators.required()];

        }
        else if (attr["key"].includes("Plant structure development stage")) {
          attributeFilters[attr["key"]] = [this.PlantStructureDevelopmentStage, RxwebValidators.required()];

        }
        else if (attr["key"].includes("Collection date")) {
          attributeFilters[attr["key"]] = [this.SampleDate, RxwebValidators.required()];
        }
        else {
          attributeFilters[attr["key"]] = [value];
        }
        //attributeFilters['sampleUUID'] = uuid.v4()
        attributeFilters['bmUUID'] = bm['bmUUID']
        attributeFilters['obsUUID'] = bm['obsUUID']
        //this.sample_id = attributeFilters['sampleUUID']
      }
    });
    //console.log(attributeFilters)

    return this.fb.group(attributeFilters);
  }
  addSampleRow() {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    this.sampleControl.clear()
    this.totalSample = 0
    for (var i = 0; i < this.getTechnicalReplicateNumber(); i++) {
      for (var j = 0; j < this.selection.selected.length; j++) {
        for (var k = 0; k < this.totalSampleByMaterial; k++) {
          var select = this.selection.selected[j]
          //console.log("selected: ", select)
          var bm_id = select["bmUUID"]
          //console.log(bm_id)
          this.sampleControl.push(this.initiateSampleForm(select))

          if (this.autogenerateIsChecked) {
            let rep_label = "_rep_" + (k + 1)
            var select = this.selection.selected[j]
            //console.log("selected: ", select)

            //console.log(bm_id)

            /* for (var j = 0; j < this.sampleControl.controls.length; j++) { */
            //console.log(this.sampleControl.controls[j].value)
            var auto_generated_sampleid = select['biologicalMaterialId'] + '_sample_' + (i + 1) + rep_label
            //this.sampleControl.controls[j].patchValue({'Sample ID': select['biologicalMaterialId'] })
            this.sampleControl.controls[this.totalSample].get('Sample ID').patchValue(auto_generated_sampleid)
            this.sampleControl.controls[this.totalSample].get('Sample ID').setValue(auto_generated_sampleid)

          }
          this.totalSample++
        }
      }
    }
    /* if (this.autogenerateIsChecked){
      this.autoGenerateID()
    } */
    this.sampledataSource = new MatTableDataSource((this.sampleTable.get('sampleRows') as FormArray).controls);
    this.sampledataSource.paginator = this.sampleselectionpaginator;
    this._cdr.detectChanges()
    this.ready_to_show = true
  }
  autoGenerateID() {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    //console.log(this.sampleControl)
    //console.log("autogenerate id activated")
    //console.log('TechnicalReplicateNumber: ',this.getTechnicalReplicateNumber())
    //console.log('this.selection.selected.length: ',this.selection.selected.length)
    //console.log("autogenerate id activated")
    this.totalSample = 0
    for (var k = 0; k < this.totalSampleByMaterial; k++) {
      for (var j = 0; j < this.selection.selected.length; j++) {
        for (var i = 0; i < this.getTechnicalReplicateNumber(); i++) {
          let rep_label = "_rep_" + (i + 1)
          var select = this.selection.selected[j]
          //console.log("selected: ", select)
          var bm_id = select["bmUUID"]
          //console.log(bm_id)
          /* for (var j = 0; j < this.sampleControl.controls.length; j++) { */
          //console.log(this.sampleControl.controls[j].value)
          var auto_generated_sampleid = select['biologicalMaterialId'] + '_sample_' + (k + 1) + rep_label
          //this.sampleControl.controls[j].patchValue({'Sample ID': select['biologicalMaterialId'] })
          this.sampleControl.controls[this.totalSample].get('Sample ID').patchValue(auto_generated_sampleid)
          this.sampleControl.controls[this.totalSample].get('Sample ID').setValue(auto_generated_sampleid)
          this.totalSample++
        }
      }

    }
  }



  getActualIndex(index: number) { return index + this.sampledataSource.paginator.pageSize * this.sampledataSource.paginator.pageIndex; }

  sampleTableRowSelected(i: number) {
    ////console.log(i)

    this.sample_index_row = i
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    this.sample_id = sampleControl.controls[i].value
  }


  deleteSampleRow(index: number) {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    this.sampleControl.removeAt(index);
    if (this.sampleControl.controls.length === 0) {
      this.ready_to_show = false
    }
  }
  get get_sampledataSource() { return this.sampledataSource }

  get getSampleDescription() {
    return this.SampleDescription
  }
  get getPlantAnatomicalEntity() {
    return this.PlantAnatomicalEntity
  }
  get getPlantStructureDevelopmentStage() {
    return this.PlantStructureDevelopmentStage
  }

  getSampleDate(): Date {
    //console.log(this.SampleDate)
    return this.SampleDate
  }
  getTotalSampleByMaterial(): number {
    return this.totalSampleByMaterial
  }
  getTechnicalReplicateNumber() {
    return this.TechnicalReplicateNumber
  }
  onDateAdd(event) {
    //console.log(event)
    this.sample_ready = true;
  }
  get get_model_loaded(): boolean {
    return this.model_loaded
  }
  get get_sample_ready() {
    return this.sample_ready
  }

  get getSampleFormControls() { return this.sampleTable.get('sampleRows') as FormArray; }
  get get_ready_to_show() { return this.ready_to_show }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.materialdataSource.data.length;
    return numSelected == numRows;
  }
  rowToggle(row) {
    this.selection.toggle(row)
    if (this.selection.selected.length === 0) {
      this.panel_disabled = true
    }
    else (
      this.panel_disabled = false
    )
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.materialdataSource.data.forEach(row => this.selection.select(row)); this.panel_disabled = false
  }

  //Event functions


  onSampleNumberChange(value: number) {
    this.TechnicalReplicateNumber = value
  }
  onGlobalOntologyTermSelection(ontology_id: string, key: string, multiple: boolean = true) {
    //this.show_spinner = true;
    //console.log(key)
    //console.log(ontology_id)
    const dialogRef = this.dialog.open(OntologyTreeComponent, { disableClose: true, width: '1000px', autoFocus: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], selected_key: "", uncheckable: false, multiple: multiple, model_type: this.model_type, mode_simplified: false, observed: false, sub_class_of: "" } });
    // dialogRef..afterOpened().subscribe(result => {
    //     this.show_spinner = false;
    // })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // //console.log(multiple)
        //console.log(result)
        if (!multiple) {
          if (result.selected_set !== undefined) {
            if (key === "Plant structure development stage") {
              this.PlantStructureDevelopmentStage = result.selected_set[0]['id']
            }
            else {
              this.PlantAnatomicalEntity = result.selected_set[0]['id']
            }
            this.validated_term[key] = { selected: true, values: result.selected_set[0]['id'] };
          }
        }



      }
    });
  }
  onOntologyTermSelection(ontology_id: string, key: string, index: number, multiple: boolean = true) {
    //this.show_spinner = true;
    const dialogRef = this.dialog.open(OntologyTreeComponent, { disableClose: true, width: '1000px', autoFocus: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], selected_key: "", uncheckable: false, multiple: multiple, model_type: this.model_type, mode_simplified: false, observed: false, sub_class_of: "" } });
    // dialogRef..afterOpened().subscribe(result => {
    //     this.show_spinner = false;
    // })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // //console.log(multiple)
        //console.log(key)
        //this.ontology_type = result.ontology_type;
        this.selected_set = result.selected_set;
        if (this.selected_set !== undefined) {
          if (multiple) {
            var term_ids = this.getSampleFormControls.controls[index].value[key] + '/'
            for (var i = this.selected_set.length - 1; i >= 0; i--) {
              term_ids += this.selected_set[i]['id'] + '/'
            }
            term_ids = term_ids.slice(0, -1);
            this.validated_term[key] = { selected: true, values: term_ids };
            this.getSampleFormControls.controls[index].value[key].patchValue(term_ids)
          }
          else {
            if (this.selected_set.length > 0) {
              this.validated_term[key] = { selected: true, values: result.selected_set[0]['id'] };
              this.addSampleTerm(index, key, result.selected_set[0]['id'])
              //this.getSampleFormControls.controls[index].value[key].patchValue(result.selected_set[0]['id'])
            }
          }
        }
      }
    });
  }
  addSampleTerm(index: number, key: string, id: string) {
    //console.log(key)
    //console.log(index)
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    sampleControl.controls[index].patchValue({ key: id })
    //console.log(sampleControl.controls[index])
  }
  onTaskAdd(event) {
    ////console.log(event.target.value)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    if (this.sampleTable.valid) {
      var sample_data = []
      const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
      for (var j = 0; j < sampleControl.controls.length; j++) {
        var element = sampleControl.controls[j]
        var keys = Object.keys(element.value)
        var tmp_data = {}
        for (var k = 0; k < keys.length; k++) {
          tmp_data[keys[k]] = element.value[keys[k]]
        }
        sample_data.push(tmp_data)
      }

      this.dialogRef.close({ event: "Confirmed", sample_data: sample_data });
    }
    else (
      this.alertService.error("Some sample do not have ID associated")
    )


  }
}
