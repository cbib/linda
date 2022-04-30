import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import {ExperimentalFactorDialogModel} from '../../../models/experimental_factor_models' 
import { MatPaginator } from '@angular/material/paginator';


interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  values: [];
  already_there: string[];
  observation_id: string;
  bm_data:[];
}

const BM_ELEMENT_DATA: BiologicalMaterialDialogModel[] = []
const EF_ELEMENT_DATA: ExperimentalFactorDialogModel[] = []

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})

export class SelectionComponent implements OnInit, AfterViewInit {

  //@ViewChild(MatPaginator, { static: false }) paginatorbm: MatPaginator;
  @ViewChild('bmpaginator', { static: false }) bmpaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortef: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatoref: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortbm: MatSort;

  //ATTRIBUTES
  private model_id: string;
  model_type: string;
  private parent_id: string;
  private result: []
  private bm_data: []
  
  
  observation_id: string = ""
  private already_there: string[]
  displayedMaterialColumns: string[] = ['biologicalMaterialId', 'materialId', 'genus', 'species', 'lindaID', 'select'];
  displayedFactorColumns: string[] = ['experimentalFactorType', 'experimentalFactorDescription', 'experimentalFactorValues', 'experimentalFactorAccessionNumber', 'lindaID', 'select'];
  pretty_displayedMaterialColumns: string[] = ['biological Material Id', 'Material id', 'Genus', 'Species', 'database id', 'Select'];
  pretty_displayedFactorColumns: string[] = ['Experimental factor type', 'Experimental factor description', 'Experimental factor values', 'Experimental factor accession number', 'database id', 'Select'];
  private materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
  private factordataSource = new MatTableDataSource(EF_ELEMENT_DATA);
  private sources: {"biological_material":MatTableDataSource<BiologicalMaterialDialogModel>,"experimental_factor":MatTableDataSource<ExperimentalFactorDialogModel>} = { "biological_material": this.materialdataSource, "experimental_factor": this.factordataSource }
  private columns: {} = { "biological_material": this.displayedMaterialColumns, "experimental_factor": this.displayedFactorColumns }
  private columns_label: {} = { "biological_material": this.pretty_displayedMaterialColumns, "experimental_factor": this.pretty_displayedFactorColumns }
  //private return_data: {} = { "biological_material": { material_ids: [], biological_material_ids: [], data: [] }, "experimental_factor": { data: [] } }
  private return_data: {} = { "biological_material": { data: [] }, "experimental_factor": { data: [] } }
  private initialefSelection = []
  private initialbmSelection = []
  private bmselection = new SelectionModel<BiologicalMaterialDialogModel>(true, this.initialbmSelection /* multiple */);
  private efselection = new SelectionModel<ExperimentalFactorDialogModel>(true, this.initialefSelection /* multiple */);
  loaded:boolean=false
  ready_to_show: boolean = true

  constructor(
    private globalService: GlobalService, 
    public dialogRef: MatDialogRef<SelectionComponent>,
    private _cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.result = []
    this.already_there = this.data.already_there
    this.observation_id = this.data.observation_id
    this.bm_data= this.data.bm_data
  }
  ngOnInit() {
    var parent_name = this.data.parent_id.split("/")[0]
    var parent_key = this.data.parent_id.split("/")[1]
    var child_type = this.model_type + "s"
    this.globalService.get_type_child_from_parent(parent_name, parent_key, child_type)
      .toPromise().then(
        data => {
          this.result = data;
        }
      );
  }
  ngAfterViewInit() {
    if (this.model_type==='experimental_factor'){
    this.sources[this.model_type].sort= this.sortef;
    this.sources[this.model_type].paginator = this.paginatoref;
  }
  else{
    this.sources[this.model_type].sort= this.sortbm;
    this.sources[this.model_type].paginator = this.bmpaginator;
  }
    this._cdr.detectChanges()
  }
  get get_ready_to_show(){
    return this.ready_to_show
  }
  onSelect(model_id: string) {
    this.ready_to_show = true

    this.data.model_id = model_id
    this.result.forEach(
      model => {
        if (model["_id"] === model_id) {
          var alreadyThere: boolean = false
          this.data.values.forEach(element => {
            if (element["_id"] === model["_id"]) {
              alreadyThere = true
            }
          })
          if (!alreadyThere) {
            this.data.values.push(model)
          }
          if (this.model_type === "biological_material") {
            this.sources[this.model_type].data = this.load_material(model)
            this.sources[this.model_type].data.forEach(row => {
              this.bmselection.selected.forEach(selected_row => {
                if (this.shallowEqual(row, selected_row)) {
                  this.bmselection.select(row)
                }
              });
            });
            this.sources[this.model_type].sort= this.sortbm;
            this.sources[this.model_type].paginator = this.bmpaginator;
            this._cdr.detectChanges()
            this.loaded=true
            
            
            
          }
          else if (this.model_type === "experimental_factor") {
            this.factordataSource.data = this.load_factor(model)
            //When there are multiple element in select list, keep trace of selected element
            this.sources[this.model_type].data.forEach(row => {
              this.efselection.selected.forEach(selected_row => {
                if (this.shallowEqual(row, selected_row)) {
                  this.efselection.select(row)
                }
              });
            });
            this.sources[this.model_type].sort= this.sortef;
            this.sources[this.model_type].paginator = this.paginatoref;
            this._cdr.detectChanges()
            this.loaded=true
           
            
          }
        }
      }
    );
    console.log(this.loaded)
    
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllBmSelected() {
    const numSelected = this.bmselection.selected.length;
    const numRows = this.sources[this.model_type].data.length;
    const numRowsMinusExcluded = this.materialdataSource.data.filter(row => !this.already_there.includes(row.materialId + '_' + row.biologicalMaterialId)).length;

    return numSelected == numRowsMinusExcluded;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterBmToggle() {
    this.isAllBmSelected() ?
      this.bmselection.clear() :
      this.sources[this.model_type].data.forEach(row => {
        if (!this.already_there.includes(row.materialId + '_' + row.biologicalMaterialId)) {
          this.bmselection.select(row)
        }
      });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllEfSelected() {
    const numSelected = this.efselection.selected.length;
    const numRows = this.sources[this.model_type].data.length;
    const numRowsMinusExcluded = this.sources[this.model_type].data.filter(row => !this.already_there.includes(row.experimentalFactorType)).length;

    return numSelected == numRowsMinusExcluded;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterEfToggle() {
    this.isAllBmSelected() ?
      this.efselection.clear() :
      this.sources[this.model_type].data.forEach(row => {

        if (!this.already_there.includes(row.experimentalFactorType)) {
          this.efselection.select(row)
        }

      });
  }
  load_material(model: {}): BiologicalMaterialDialogModel[] {
    var data = []
    var keys = Object.keys(model);
    var mat_ids = []
    mat_ids = model['Material source ID (Holding institute/stock centre, accession)']
    var mat_size = mat_ids.length
    for (var i = 0; i < mat_size; i++) {
      var mat_id = mat_ids[i]
      var genus = model['Genus'][i]
      var species = model['Species'][i]
      for (var j = 0; j < keys.length; j++) {
        if (!keys[j].startsWith("_") && !keys[j].startsWith("Definition")) {
          if (keys[j].includes("Biological material ID")) {
            var tmp_key_array = []
            tmp_key_array = model[keys[j]][i]
            for (var k = 0; k < tmp_key_array.length; k++) {
              data.push({
                biologicalMaterialId: tmp_key_array[k],
                materialId: mat_id,
                genus: genus,
                species: species,
                lindaID: model["_id"],
                obsUUID: this.observation_id
              })
            }
          }
        }
      }
    }
    return data
  }
  load_factor(attr: {}): ExperimentalFactorDialogModel[] {
    var data = []
    var obj={}
    obj={
      experimentalFactorType: attr['Experimental Factor type'],
      experimentalFactorDescription: attr['Experimental Factor description'],
      experimentalFactorValues: attr['Experimental Factor values'],
      experimentalFactorAccessionNumber: attr['Experimental Factor accession number'],
      lindaID: attr["_id"],
      obsUUID: this.observation_id
    }
    data.push(obj)
    return data

  }
  get get_loaded(){
    return this.loaded
  }
  //Same object check
  shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }
  get get_bm_data(){
    return this.bm_data
  }
  get get_bmselection(){
    return this.bmselection
  }
  get get_parent_id(){
    return this.parent_id
  }
  get get_already_there(){
    return this.already_there
  }
  get get_columns(){
    return this.columns
  }
  get get_efselection(){
    return this.efselection
  }
  get get_sources(){
    return this.sources
  }
  get get_columns_label(){
    return this.columns_label
  }
  get get_field() {
    return Object.keys(this.sources[this.model_type].data)
  }
  get get_result() {
    return this.result;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    if (this.model_type === "biological_material") {
      this.return_data[this.model_type].data = this.bmselection.selected
    }
    else if (this.model_type === "experimental_factor") {
      this.efselection.selected.forEach(element => {
        //it is better to use this.selection.selected than this.data.values to remove _id, _key attributes
        this.return_data[this.model_type].data = this.efselection.selected

      })
    }
    this.dialogRef.close(this.return_data[this.model_type]);
  }

}

