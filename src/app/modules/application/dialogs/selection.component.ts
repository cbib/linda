import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import {ExperimentalFactorDialogModel} from '../../../models/experimental_factor_models' 


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
export class SelectionComponent implements OnInit {

  private model_id: string;
  private result: []
  private bm_data: []
  model_type: string;
  private parent_id: string;
  observation_id: string = ""
  ready_to_show: boolean = false
  private already_there: string[]
  displayedMaterialColumns: string[] = ['biologicalMaterialId', 'materialId', 'genus', 'species', 'lindaID', 'select'];
  displayedFactorColumns: string[] = ['experimentalFactorType', 'experimentalFactorDescription', 'experimentalFactorValues', 'experimentalFactorAccessionNumber', 'lindaID', 'select'];
  pretty_displayedMaterialColumns: string[] = ['biological Material Id', 'Material id', 'Genus', 'Species', 'database id', 'Select'];
  pretty_displayedFactorColumns: string[] = ['Experimental factor type', 'Experimental factor description', 'Experimental factor values', 'Experimental factor accession number', 'database id', 'Select'];

  private materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
  private factordataSource = new MatTableDataSource(EF_ELEMENT_DATA);
  private sources: {} = { "biological_material": this.materialdataSource, "experimental_factor": this.factordataSource }
  private columns: {} = { "biological_material": this.displayedMaterialColumns, "experimental_factor": this.displayedFactorColumns }
  private columns_label: {} = { "biological_material": this.pretty_displayedMaterialColumns, "experimental_factor": this.pretty_displayedFactorColumns }

  //private return_data: {} = { "biological_material": { material_ids: [], biological_material_ids: [], data: [] }, "experimental_factor": { data: [] } }


  private return_data: {} = { "biological_material": { data: [] }, "experimental_factor": { data: [] } }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private initialefSelection = []
  private initialbmSelection = []
  private bmselection = new SelectionModel<BiologicalMaterialDialogModel>(true, this.initialbmSelection /* multiple */);
  private efselection = new SelectionModel<ExperimentalFactorDialogModel>(true, this.initialefSelection /* multiple */);

  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<SelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.result = []
    this.already_there = this.data.already_there
    this.observation_id = this.data.observation_id
    this.bm_data= this.data.bm_data

  }

  ngOnInit() {

    this.sources[this.model_type].sort = this.sort
    var parent_name = this.data.parent_id.split("/")[0]
    var parent_key = this.data.parent_id.split("/")[1]
    var child_type = this.model_type + "s"
    this.globalService.get_type_child_from_parent(parent_name, parent_key, child_type)
      .toPromise().then(
        data => {
          this.result = data;
          console.log(data)
          //   this.result.forEach(attr=>{
          //       if (this.model_type === "biological_material") {
          //         this.load_material(attr)
          //         //this.materialdataSource.data = this.load_material(attr)
          //       }
          //       else if (this.model_type === "experimental_factor") {
          //         this.load_factor(attr)
          //       }
          //   });
          //   this.ready_to_show = true
        }
      );
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllBmSelected() {
    const numSelected = this.bmselection.selected.length;
    const numRows = this.sources[this.model_type].data.length;
    const numRowsMinusExcluded = this.materialdataSource.data.filter(row => !this.already_there.includes(row.materialId + '_' + row.biologicalMaterialId)).length;

    return numSelected == numRowsMinusExcluded;
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

  load_material(attr: {}): BiologicalMaterialDialogModel[] {

    var data = []
    var keys = Object.keys(attr);
    var mat_ids = []
    mat_ids = attr['Material source ID (Holding institute/stock centre, accession)']
    var mat_size = mat_ids.length
    for (var i = 0; i < mat_size; i++) {
      var mat_id = mat_ids[i]
      var genus = attr['Genus']
      var species = attr['Species']
      for (var j = 0; j < keys.length; j++) {
        if (!keys[j].startsWith("_") && !keys[j].startsWith("Definition")) {
          if (keys[j].includes("Biological material ID")) {
            var tmp_key_array = []
            tmp_key_array = attr[keys[j]][i]
            for (var k = 0; k < tmp_key_array.length; k++) {
              data.push({
                biologicalMaterialId: tmp_key_array[k],
                materialId: mat_id,
                genus: genus,
                species: species,
                lindaID: attr["_id"]
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
    // console.log(attr)
    // console.log(attr["_id"])
    var obj={}
    obj={
      experimentalFactorType: attr['Experimental Factor type'],
      experimentalFactorDescription: attr['Experimental Factor description'],
      experimentalFactorValues: attr['Experimental Factor values'],
      experimentalFactorAccessionNumber: attr['Experimental Factor accession number'],
      lindaID: attr["_id"],
      obsUUID: this.observation_id
    }
    // console.log(obj)
    data.push(obj)
    // console.log(data)
    return data

  }

  
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
  onSelect(model_id: string) {
    this.ready_to_show = false
    this.data.model_id = model_id

    //this.sources[this.model_type].data=[]


    this.result.forEach(
      attr => {
        if (attr["_id"] === model_id) {
          var alreadyThere: boolean = false
          this.data.values.forEach(element => {
            if (element["_id"] === attr["_id"]) {
              alreadyThere = true
            }
          })
          if (!alreadyThere) {
            this.data.values.push(attr)
          }
          if (this.model_type === "biological_material") {
            //this.sources[this.model_type].data=[];
            //this.load_material(attr)
            this.materialdataSource.data = this.load_material(attr)
            //console.log(this.sources[this.model_type].data)
            //console.log(this.ready_to_show)
            this.sources[this.model_type].data.forEach(row => {
              //console.log('check row: ', row)
              this.bmselection.selected.forEach(selected_row => {
                //console.log('compare to row: ', selected_row)
                if (this.shallowEqual(row, selected_row)) {
                  this.bmselection.select(row)
                  //console.log(row, ' equal to row: ', selected_row)
                }
                else {
                  ///console.log(row, ' not equal to row: ', selected_row)
                }
              });
            });
          }
          else if (this.model_type === "experimental_factor") {
            this.factordataSource.data = this.load_factor(attr)
            //console.log(this.sources[this.model_type].data)
            //console.log(this.ready_to_show)

            //When there are multiple element in select list, keep trace of selected element
            this.sources[this.model_type].data.forEach(row => {
              //console.log('check row: ', row)
              this.efselection.selected.forEach(selected_row => {
                //console.log('compare to row: ', selected_row)
                if (this.shallowEqual(row, selected_row)) {
                  this.efselection.select(row)
                  //console.log(row, ' equal to row: ', selected_row)
                }
                else {
                  //console.log(row, ' not equal to row: ', selected_row)
                }
              });
            });

          }

          this.ready_to_show = true
        }
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    //var return_data = { material_ids: [], biological_material_ids: [], data: this.data.values }
    // console.log(this.factordataSource.data)
    // console.log(this.data.values)
    // console.log(this.bmselection)
    // console.log(this.efselection)
    if (this.model_type === "biological_material") {
      this.return_data[this.model_type].data = this.bmselection.selected
      // this.return_data[this.model_type].data = this.data.values
      // this.selection.selected.forEach(element => {
      //   console.log(element.materialId)
      //   this.return_data[this.model_type].material_ids.push(element.materialId)
      //   this.return_data[this.model_type].biological_material_ids.push(element.biologicalMaterialId)
      // });
      // console.log(this.data.values)
    }
    else if (this.model_type === "experimental_factor") {
      this.efselection.selected.forEach(element => {
        // console.log(this.efselection)
        // console.log(this.data.values)
        //this.return_data[this.model_type].data = this.data.values
        //it is better to use this.selection.selected than this.data.values to remove _id, _key attributes
        this.return_data[this.model_type].data = this.efselection.selected

      })
    }

    //this.data.template_id=this.template_id
    this.dialogRef.close(this.return_data[this.model_type]);
  }

}

