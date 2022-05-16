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

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  total_available_plots: number;
  role: string;
  grand_parent_id: string;
  group_key: string;
  design:ExperimentalDesign;
}
const OBSERVED_VARIABLE_ELEM: ObservedVariableInterface[] = []
const SAMPLE_ELEM: SampleInterface[] = []


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

  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('samplepaginator', { static: true }) samplepaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ///@ViewChild(MatTable, { static: false }) table: MatTable<AssociateObservedVariable>
  
  private model_id: string;
  private design:ExperimentalDesign;
  private user_key: string;
  private result: []
  private model_type: string;
  private parent_id: string;
  search_type: string
  //sampledataSource = new MatTableDataSource(SAMPLE_ELEM);
  private sampledataSource: MatTableDataSource<SampleInterface>;
  //private sampledataSource:MatTableDataSource<SAMPLE_ELEM>
  dataSource = new MatTableDataSource(OBSERVED_VARIABLE_ELEM);
  displayedColumns: string[] = ['No Observed variables defined', 'select'];
  displayedSamplesColumns: string[] = ['No Samples defined', 'select'];
  private initialSampleSelection = []
  sampleSelection = new SelectionModel<SampleInterface>(true, this.initialSampleSelection /* multiple */);
  private initialSelection = []
  selection = new SelectionModel<ObservedVariableInterface>(false, this.initialSelection /* multiple */);
  panel_disabled: boolean = false;
  sample_panel_disabled: boolean=false;
  role: string = ""
  grand_parent_id: string = ""
  group_key: string = ""
  loaded: boolean = false
  sampleloaded:boolean=false
  total_available_plots: number = 0
  observations: ObservationInterface[];
  observation_type: string="";
  samples:[]
  ObservationDate:Date;
  
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
    this.total_available_plots = this.data.total_available_plots
    this.role = this.data.role
    this.grand_parent_id = this.grand_parent_id
    this.group_key = this.data.group_key
    this.design=this.data.design
    this.sampleloaded=false
    this.set_all_observed_variables()
    ///this.sampledataSource = new MatTableDataSource([])
    //this.sampledataSource = new MatTableDataSource(this.design.get_associated_samples())
    //this.sampledataSource.paginator= this.samplepaginator
    console.log(this.sampledataSource)
    this.observations=[]
  }

  async ngOnInit() {
    this.displayedSamplesColumns= Object.keys(this.design.get_associated_samples()[0]).filter(key=>!key.includes('UUID'))
      this.displayedSamplesColumns.push('select')
      this.sampledataSource = new MatTableDataSource(this.design.get_associated_samples()); 
      this.sampledataSource.paginator = this.samplepaginator;
      this._cdr.detectChanges()
      
      this.observation_type=""
    //await this.set_all_observed_variables()
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sampledataSource.paginator= this.samplepaginator
    this._cdr.detectChanges()
  }
  onDateAdd(event){
    this.ObservationDate=event.target.value
  }
  async set_all_observed_variables() {
    var data = await this.globalService.get_all_observed_variables(this.parent_id.split('/')[1]).toPromise();

    console.log(data);
    if (data.length > 0) {
      this.displayedColumns=Object.keys(data[0]).filter(key=>!key.startsWith('_'))
      this.displayedColumns.push('select')
      //console.log(this.materialdataSource)
      this.dataSource.data = data
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      this._cdr.detectChanges()

    }
  }
  add_data(){
    
  }
  onObservationTypeChange(_observation_type:string){
    this.observation_type=_observation_type
    if (this.observation_type==='Destructive'){
      this.sampleloaded=true
      
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
          ////////console.log(new_values)
          this.globalService.add(new_values, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
              if (data["success"]) {
                //////////console.log(data["message"])
                //this.model_id=data["_id"];
                this.ngOnInit();
                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " based on " + result['_id'] + " has been successfully integrated in your history !!"
                this.alertService.success(message)
                return true;
              }
              else {
                //////////console.log(data["message"])
                this.alertService.error("this form contains errors! " + data["message"]);

                return false;
                //this.router.navigate(['/studies']);
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
      this.sample_panel_disabled = true
    }
    else (
      this.sample_panel_disabled = false
    )
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  sampleMasterToggle() {
    this.isAllSampleSelected() ?
      this.sampleSelection.clear() :
      this.sampledataSource.data.forEach(row => this.sampleSelection.select(row)); this.sample_panel_disabled = false
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
  get_observation_type(){
    return this.observation_type
  }
  get get_design(){
    return this.design
  }
  get get_sampleDataSource(){
    return this.sampledataSource
  }
  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel", selected_material: null });
  }
  onOkClick(): void {
    console.log(this.observations)
    console.log(this.selection.selected)
    console.log(this.sampleSelection.selected)
    this.selection.selected.forEach(obs_var=>{
      if (this.observation_type==='Destructive'){
        this.sampleSelection.selected.forEach(sample=>{
          let obs_uuid="sedwfxd"
          this.observations.push(new Observation(obs_uuid,'observation first test', this.ObservationDate,true,sample['Sample ID'],sample.obsUUID, obs_var['_id']))
        })
      }
      else{
        this.design.Blocking.value.forEach(block=>{
          block['Plot design'].value.forEach(plot=>{
            let obs_uuid="sedwfxd"
            this.observations.push(new Observation(obs_uuid,'observation first test', this.ObservationDate,false, 'Not defined', plot.get_observation_uuid(), obs_var['_id']))
          })
        })
      }
    });
    this.dialogRef.close({ event: "Confirmed", selected_observed_variable: this.selection.selected, observation_type:this.observation_type, observations:this.observations });
  }

}
