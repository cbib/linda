import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GlobalService, AlertService } from '../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';
import * as uuid from 'uuid';


interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  bm_data: [];
  values: [];
  observation_id:string
}

export interface Sample {
  sampleID: string;
  plantAnatomicalEntity: string;
  plantStructureDevelopmentStage: string;
  sampleDescription: string;
  externalID: string;
  collectionDate: Date;
  sampleUUID:string;
}

// export interface BiologicalMaterial {
//   'Biological material ID': string;
//   'Material source ID (Holding institute/stock centre, accession)': string;
//   Genus: string;
//   Species: string;
//   'Database id': string;
//   'bm-id': string;

// }

export interface BiologicalMaterial {
  biologicalMaterialId: string;
  materialId: string;
  genus: string;
  species: string;
  lindaID:string;
  bmUUID:string;
  obsUUID:string;
}

const SAMPLE_ELEMENT_DATA: Sample[] = []
const BM_ELEMENT_DATA: BiologicalMaterial[] = []

@Component({
  selector: 'app-sample-selection',
  templateUrl: './sample-selection.component.html',
  styleUrls: ['./sample-selection.component.css']
})


export class SampleSelectionComponent implements OnInit {
  ready_to_show: boolean = false
  sampleTable: FormGroup;
  sampleControl: FormArray;
  sampleTouchedRows: any;
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
  observation_id = ""
  sample_id = ""
  use_sample_list: boolean = false;
  autogenerateIsChecked: boolean = false
  technicalReplicateIsChecked: boolean = false
  SampleNumber: number;

  displayedMaterialColumns: string[] = ['biologicalMaterialId', 'materialId', 'genus', 'species', 'lindaID', 'select'];

  //displayedMaterialColumns: string[] = ['Biological material ID', 'Material source ID (Holding institute/stock centre, accession)', 'Genus', 'Species', 'Database id', 'select'];
  displayedSampleColumns: string[] = ['sampleID', 'plantAnatomicalEntity', 'plantStructureDevelopmentStage', 'sampleDescription', 'externalID', 'collectionDate'];
  private sampledataSource = new MatTableDataSource(SAMPLE_ELEMENT_DATA);
  private materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<BiologicalMaterial>
  private initialSelection = []
  private selection = new SelectionModel<BiologicalMaterial>(true, this.initialSelection /* multiple */);

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<SampleSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog) {
    this.model_id = this.data.model_id;
    this.model_type = this.data.model_type;
    this.parent_id = this.data.parent_id;
    this.bm_data = this.data.bm_data
    this.observation_id=this.data.observation_id


    this.result = []
  }

  async ngOnInit() {
    this.materialdataSource.sort = this.sort
    this.observation_id=this.data.observation_id
    var parent_name = this.data.parent_id.split("/")[0]
    var parent_key = this.data.parent_id.split("/")[1]
    var child_type = this.model_type + "s"
    this.sampleTouchedRows = [];
    this.sample_id = ""
    this.sampleTable = this.fb.group({
      sampleRows: this.fb.array([])
    });
    console.log(this.materialdataSource)

    this.materialdataSource.data = this.load_material()
    // this.bm_data.forEach(element => {
    //   this.materialdataSource.data.push(element);
    // });

    //this.materialdataSource.data=this.materialdataSource.data
    //this.materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
    //this.materialdataSource.connect().next(this.bm_data)
    await this.get_model()
  }

  load_material(): BiologicalMaterial[] {

    var data = []
    this.bm_data.forEach(element => {
      if (element["obsUUID"]===this.observation_id){
        data.push(element);

      }
      
      // data.push({
      //   biologicalMaterialId: element['Biological material ID'],
      //   materialId: element['Material source ID (Holding institute/stock centre, accession)'],
      //   genus: element['Genus'],
      //   species: element['Species'],
      //   lindaID: element["Database id"]
      // })
    });
    console.log(data)

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
    return data
  }

  get_model() {
    this.model = [];
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    this.globalService.get_model(this.model_type).toPromise().then(data => {
      this.model = data;
      // console.log(this.model)
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
        }
      }
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
    });
  }

  ngAfterOnInit() {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
  }

  //initiateSampleForm(bm_id:string="", obs_id=""): FormGroup {
  initiateSampleForm(bm_id: string = "", obs_id = ""): FormGroup {

    // console.log(this.cleaned_model)


    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''

      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {

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
        attributeFilters['sampleUUID'] = uuid.v4()

        attributeFilters['bmUUID'] = bm_id
        attributeFilters['obsUUID'] = this.observation_id

        this.sample_id = attributeFilters['sampleUUID']
      }


    });

    return this.fb.group(attributeFilters);
  }

  addSampleRow() {
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    // this.materialdataSource.data.forEach(row =>{
    //   console.log(row["bm-id"])
    //   console.log(row["observation_id"])
    //   this.selection.select(row)

    //   sampleControl.push(this.initiateSampleForm(row["bm-id"],row["observation_id"]));

    // });
    sampleControl.push(this.initiateSampleForm())
    this.ready_to_show = true
  }

  deleteSampleRow(index: number) {
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    sampleControl.removeAt(index);
    if (sampleControl.controls.length === 0) {
      this.ready_to_show = false
    }
  }

  get getSampleFormControls() {
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    return sampleControl;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.materialdataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.materialdataSource.data.forEach(row => this.selection.select(row));
  }

  //Event functions
  autoGenerateID() {
    this.sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    console.log("autogenerate id activated")
    if (this.technicalReplicateIsChecked) {
      for (var i = 0; i < this.SampleNumber; i++) {
      }
    }
    else {
      for (var j = 0; j < this.sampleControl.controls.length; j++) {
        console.log(this.sampleControl.controls[j].value)
        //var generate_id=this.sampleControl.controls[j]['bm-id']+"_"+
        this.sampleControl.controls[j].patchValue({ 'Sample ID': this.sampleControl.controls[j].value['bm-id'] })
      }


    }
  }

  onSampleNumberChange(value: number) {
    this.SampleNumber = value
  }

  onOntologyTermSelection(ontology_id: string, key: string, index: number, multiple: boolean = true) {
    //this.show_spinner = true;
    const dialogRef = this.dialog.open(OntologyTreeComponent, { width: '1000px', autoFocus: true, disableClose: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], uncheckable: false, multiple: multiple } });
    // dialogRef..afterOpened().subscribe(result => {
    //     this.show_spinner = false;
    // })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // console.log(multiple)
        console.log(key)
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

              // console.log(this.getSampleFormControls)
              // console.log(this.getSampleFormControls.controls)
              // console.log(this.getSampleFormControls.controls[index].value)
              // console.log(this.getSampleFormControls.controls[index].value[key])
              // console.log(this.selected_set)
              // console.log(this.selected_set)
              // console.log(this.getSampleFormControls)
              // console.log(result.selected_set[0]['id'])
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
    console.log(key)
    console.log(index)
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;
    sampleControl.controls[index].patchValue({ key: id })
    console.log(sampleControl.controls[index])
  }

  onTaskAdd(event) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    var sample_data = []
    console.log(this.data.values)
    console.log(this.selection)
    const sampleControl = this.sampleTable.get('sampleRows') as FormArray;

    for (var i = 0; i < this.selection.selected.length; i++) {
      var select = this.selection.selected[i]
      console.log("selected: ", select)
      var bm_id = select["bmUUID"]
      console.log(bm_id)
      for (var j = 0; j < sampleControl.controls.length; j++) {
        var element = sampleControl.controls[j]
        var keys = Object.keys(element.value)
        var tmp_data = {}
        for (var k = 0; k < keys.length; k++) {
          tmp_data[keys[k]] = element.value[keys[k]]
        }
        tmp_data['bmUUID'] = bm_id
        tmp_data["obsUUID"] = select["obsUUID"]
        console.log(tmp_data)
        sample_data.push(tmp_data)
      }
    }
    //this.materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);

    this.dialogRef.close(sample_data);

  }
}
