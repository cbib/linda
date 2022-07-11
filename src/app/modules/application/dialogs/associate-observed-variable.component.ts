import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ObservedVariable, ObservedVariableInterface } from 'src/app/models/linda/observed-variable';
import { FormGenericComponent } from './form-generic.component';
import { TemplateSelectionComponent } from './template-selection.component';
import { first } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material';
import { ExperimentalDesign } from 'src/app/models/linda/experimental-design';
import { SampleInterface } from 'src/app/models/linda/sample';
import { Observation, ObservationInterface } from 'src/app/models/linda/observation';
import { BiologicalMaterialInterface } from 'src/app/models/linda/biological-material';
import { BiologicalMaterialDialogModel } from 'src/app/models/biological_material_models';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  bm_data: [];
  material_id: string;
  total_available_plots: number;
  design: ExperimentalDesign;



}
const OBSERVED_VARIABLE_ELEM: ObservedVariableInterface[] = []
const SAMPLE_ELEM: SampleInterface[] = []
const BM_ELEMENT_DATA: BiologicalMaterialDialogModel[] = []

@Component({
  selector: 'app-associate-observed-variable',
  templateUrl: './associate-observed-variable.component.html',
  styleUrls: ['./associate-biological-material.component.css']
})

export class AssociateObservedVariable implements OnInit {

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };
  autogenerateIsChecked: boolean = false
  ObservationDescription: string = "";
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pasted_ids:string[]=[]
  @ViewChild('obsvarpaginator', { static: true }) obsvarpaginator: MatPaginator;
  @ViewChild('samplepaginator', { static: true }) samplepaginator: MatPaginator;
  @ViewChild('matpaginator', { static: true }) matpaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ///@ViewChild(MatTable, { static: false }) table: MatTable<AssociateObservedVariable>
  labelPosition_observation_ID: 'autogenerate ids' | 'paste ids' = 'autogenerate ids';

  private model_id: string;
  private design: ExperimentalDesign;
  private user_key: string;
  private result: []
  private model_type: string;
  private parent_id: string;
  search_type: string
  //sampledataSource = new MatTableDataSource(SAMPLE_ELEM);
  private sampledataSource: MatTableDataSource<SampleInterface>;
  //private sampledataSource:MatTableDataSource<SAMPLE_ELEM>
  dataSource = new MatTableDataSource(OBSERVED_VARIABLE_ELEM);
  materialdataSource = new MatTableDataSource(BM_ELEMENT_DATA);
  //displayedColumns: string[] = ['No Observed variables defined', 'select'];
  displayedSamplesColumns: string[] = ['No Samples defined', 'select'];
  //displayedMaterialsColumns: string[] = ['No Materials defined', 'select'];
  private initialSampleSelection = []
  sampleSelection = new SelectionModel<SampleInterface>(true, this.initialSampleSelection /* multiple */);
  private initialSelection = []
  selection = new SelectionModel<ObservedVariableInterface>(false, this.initialSelection /* multiple */);

  private initialMatSelection = []
  matSelection = new SelectionModel<BiologicalMaterialDialogModel>(true, this.initialMatSelection /* multiple */);
  panel_disabled: boolean = false;
  sample_panel_disabled: boolean = false;
  mat_panel_disabled: boolean = false;

  loaded: boolean = false
  sampleloaded: boolean = false
  matloaded: boolean = false
  showSample: boolean = false
  showMat: boolean = false
  total_available_plots: number = 0
  observations: ObservationInterface[];
  observation_type: string = "";
  samples: []
  ObservationDate: Date;
  material_id: string = ""
  associated_materials: BiologicalMaterialDialogModel[] = []
  private bm_data: [];
  displayedMaterialColumns: string[] = ['biologicalMaterialId', 'materialId', 'genus', 'species', 'lindaID', 'select'];
  displayedColumns: string[] = ['Trait', 'Method', 'Variable ID', 'Variable name', 'Scale', 'select'];
  constructor(
    private globalService: GlobalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AssociateObservedVariable>,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.material_id = this.data.material_id
    this.bm_data = this.data.bm_data
    this.total_available_plots = this.data.total_available_plots

    this.design = this.data.design
    this.sampleloaded = false

    //set_associated_materials()
    
    this.sampledataSource = new MatTableDataSource([])
    this.dataSource = new MatTableDataSource([])
    //this.sampledataSource = new MatTableDataSource(this.design.get_associated_samples())
    //this.sampledataSource.paginator= this.samplepaginator
    //console.log(this.sampledataSource)
    this.observations = []
  }
  /*  async set_associated_materials() {
     this.associated_materials=await this.globalService.get_biological_material_by_key(this.associated_material_id.split("/")[1]).toPromise()
     console.log(materials)
   } */
  

  async ngOnInit() {
    await this.set_all_observed_variables()
    if(this.design.get_associated_samples()[0]!==undefined){
      this.displayedSamplesColumns = Object.keys(this.design.get_associated_samples()[0]).filter(key => !key.includes('UUID'))
      this.displayedSamplesColumns.push('select')
      this.sampledataSource = new MatTableDataSource(this.design.get_associated_samples());
      this.sampledataSource.paginator = this.samplepaginator;
    }
    /* else{
      this.displayedSamplesColumns = Object.keys(this.design.get_associated_samples()[0]).filter(key => !key.includes('UUID'))
      this.displayedSamplesColumns.push('select')
      this.sampledataSource = new MatTableDataSource(this.design.get_associated_samples());
      this.sampledataSource.paginator = this.samplepaginator;
    } */
    
    this.materialdataSource.data = this.bm_data
    this.materialdataSource.sort = this.sort
    this.materialdataSource.paginator = this.matpaginator;
    console.log(this.materialdataSource.data)
    this._cdr.detectChanges()
    this.observation_type = ""
    //await this.set_all_observed_variables()
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.obsvarpaginator;
    this.sampledataSource.paginator = this.samplepaginator
    this._cdr.detectChanges()
  }
  onDateAdd(event) {
    this.ObservationDate = event.target.value
  }
  async set_all_observed_variables() {
    var data = await this.globalService.get_all_observed_variables(this.parent_id.split('/')[1]).toPromise();
    console.log(data);
    if (data.length > 0) {
      console.log(Object.keys(data[0]))
      //this.displayedColumns = Object.keys(data[0]).filter(key => !key.startsWith('_'))
      //this.displayedColumns.push('select')
      console.log(data)
      this.dataSource.data = data
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.obsvarpaginator;
      this._cdr.detectChanges()
    }
  }

  add_data() {

  }
  onObservationTypeChange(_observation_type: string) {
    this.observation_type = _observation_type
    if (this.observation_type === 'Destructive') {
      this.showSample = true
      this.showMat = false
    }
    else {
      this.showMat = true
      this.showSample = false
    }
  }

  add_observed_variables(template: boolean = false) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    //let exp_factor: ExperimentalFactor = new ExperimentalFactor()
    console.log(this.model_type)
    console.log(this.parent_id)
    if (template) {
      const dialogRef = this.dialog.open(TemplateSelectionComponent, { disableClose: true, width: '90%', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: 'observed_variable', values: {}, parent_id: this.parent_id } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result)
          var keys = Object.keys(result);

          for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
              keys.splice(i, 1);
              //var k=this.keys[i]
              i--;
            }
          }
          var new_values = {}
          keys.forEach(attr => { new_values[attr] = result[attr] })
          
          
          this.globalService.add(new_values, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
              if (data["success"]) {
                this.ngOnInit();
                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " based on " + result['_id'] + " has been successfully integrated in your history !!"
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
      });
    }
    else {
      const formDialogRef = this.dialog.open(FormGenericComponent, { disableClose: true, width: '1400px', data: { model_type: this.model_type, parent_id: this.parent_id, formData: {}, mode: "preprocess" } });
      formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.event == 'Confirmed') {
            console.log(result)
            let obs_variable: ObservedVariable = result["formData"]["form"]
            this.globalService.add(obs_variable, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
              data => {
                if (data["success"]) {
                  console.log(data)
                  this.ngOnInit()
                }
              });;
          }
        }
      });
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  isAllSampleSelected() {
    const numSelected = this.sampleSelection.selected.length;
    const numRows = this.sampledataSource.data.length;
    return numSelected == numRows;
  }
  sampleRowToggle(row) {
    this.sampleSelection.toggle(row)
    if (this.sampleSelection.selected.length === 0) {
      this.panel_disabled = true
    }
    else (
      this.panel_disabled = false
    )
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  sampleMasterToggle() {
    this.isAllSampleSelected() ?
      this.sampleSelection.clear() :
      this.sampledataSource.data.forEach(row => this.sampleSelection.select(row)); this.panel_disabled = false
  }
  isAllMatSelected() {
    const numSelected = this.matSelection.selected.length;
    const numRows = this.materialdataSource.data.length;
    return numSelected == numRows;
  }
  matRowToggle(row) {
    this.matSelection.toggle(row)
    if (this.matSelection.selected.length === 0) {
      this.panel_disabled = true
    }
    else (
      this.panel_disabled = false
    )
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  matMasterToggle() {
    this.isAllMatSelected() ?
      this.matSelection.clear() :
      this.materialdataSource.data.forEach(row => this.matSelection.select(row)); this.panel_disabled = false
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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
      this.dataSource.data.forEach(row => this.selection.select(row)); this.panel_disabled = false
  }
  get_observation_type() {
    return this.observation_type
  }
  get get_design() {
    return this.design
  }
  get get_sampleDataSource() {
    return this.sampledataSource
  }
  get get_associated_materials(): BiologicalMaterialDialogModel[] {
    return this.bm_data
  }
  onInput(content: string) {
    if (this.observation_type === 'Destructive') {
      if (content.split("\n").length!==this.sampleSelection.selected.length){
      
        console.log([...new Set(content.split("\n"))].length)
        
        this.alertService.error("you need to have same number of observation IDs than sample selected. in your case, you need " +this.sampleSelection.selected.length + " samples Ids")

      }
      else{
        if ([...new Set(content.split("\n"))].length!==this.sampleSelection.selected.length){
              this.alertService.error("you have duplicated Ids  !!! ")          
        }
          else{
            this.alertService.success("Correct number of observation IDs !! ")
            this.pasted_ids=content.split("\n")
          }
      }
    }
    else{
      if ([...new Set(content.split("\n"))].length!==this.matSelection.selected.length){
        this.alertService.error("you have duplicated Ids  !!! ")
      }
      else{
          if (content.split("\n").length!==this.matSelection.selected.length){
            this.alertService.error("you need to have same number of sample IDs than biological materials selected. in your case, you need " +this.matSelection.selected.length + " samples Ids")
          }
          else{
            this.alertService.success("Correct number of observation IDs !! ")
            this.pasted_ids=content.split("\n")
          }
      }
    }
  }
  get get_total():number{
    if (this.observation_type === 'Destructive') {
      return this.sampleSelection.selected.length
    }
    else{
      return this.matSelection.selected.length

    }
  } 
  onPaste(event: ClipboardEvent) {

    let clipboardData = event.clipboardData;
    let content = clipboardData.getData('text');
    console.log(content)
    if (this.observation_type === 'Destructive') {
      if ([...new Set(content.split("\n"))].length!==this.sampleSelection.selected.length){
          this.alertService.error("you have duplicated Ids  !!! ")
      }
      else{
          if (content.split("\n").length!==this.sampleSelection.selected.length){
            this.alertService.error("you need to have same number of observation IDs than sample selected. in your case, you need " +this.sampleSelection.selected.length + " samples Ids")
          }
          else{
            this.alertService.success("Correct number of observation IDs !! ")
            this.pasted_ids=content.split("\n")
          }
      }
    }
    else{
      if ([...new Set(content.split("\n"))].length!==this.matSelection.selected.length){
        this.alertService.error("you have duplicated Ids  !!! ")
      }
      else{
          if (content.split("\n").length!==this.matSelection.selected.length){
            this.alertService.error("you need to have same number of sample IDs than biological materials selected. in your case, you need " +this.matSelection.selected.length + " samples Ids")
          }
          else{
            this.alertService.success("Correct number of observation IDs !! ")
            this.pasted_ids=content.split("\n")
          }
      }
    }
  }
  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel", selected_material: null });
  }
  onOkClick(): void {
    console.log(this.observations)
    console.log(this.selection.selected)
    console.log(this.sampleSelection.selected)
    this.selection.selected.forEach(obs_var => {
      if (this.observation_type === 'Destructive') {
        if (this.labelPosition_observation_ID!=='autogenerate ids'){  
          this.sampleSelection.selected.forEach((sample, index) => {
            console.log(sample)
            let obs_uuid = this.pasted_ids[index]
            this.observations.push(new Observation(obs_uuid, this.ObservationDescription, this.ObservationDate, true, sample['Sample ID'], sample.obsUUID, obs_var['_id'], obs_var['Scale'], obs_var['Trait']))
          })
        }
        else{
          this.sampleSelection.selected.forEach((sample, index) => {
            console.log(sample)
            let obs_uuid = sample['Sample ID'] + "_obs_" + (index + 1) 
            this.observations.push(new Observation(obs_uuid, this.ObservationDescription, this.ObservationDate, true, sample['Sample ID'], sample.obsUUID, obs_var['_id'], obs_var['Scale'], obs_var['Trait']))
          })
        }
      }
      else {
        if (this.labelPosition_observation_ID!=='autogenerate ids'){  
          this.matSelection.selected.forEach((bm, index) => {
            let obs_uuid = this.pasted_ids[index]
            this.observations.push(new Observation(obs_uuid, this.ObservationDescription, this.ObservationDate, false, bm.biologicalMaterialId, bm.obsUUID, obs_var['_id'], obs_var['Scale'], obs_var['Trait']))
          })
        }
        else{
          this.matSelection.selected.forEach((bm, index) => {
            let obs_uuid = bm.biologicalMaterialId + "_obs_" + (index + 1) 
            this.observations.push(new Observation(obs_uuid, this.ObservationDescription, this.ObservationDate, false, bm.biologicalMaterialId, bm.obsUUID, obs_var['_id'], obs_var['Scale'], obs_var['Trait']))
          })

        }
        /*this.design.Blocking.value.forEach(block => {
          block['Plot design'].value.forEach(plot => {
            let obs_uuid = "sedwfxd"
            this.observations.push(new Observation(obs_uuid, 'observation first test', this.ObservationDate, false, 'Not defined', plot.get_observation_uuid(), obs_var['_id']))
          })
        })*/
      }
    });
    this.dialogRef.close({ event: "Confirmed", selected_observed_variable: this.selection.selected, observation_type: this.observation_type, observations: this.observations });
  }

}
