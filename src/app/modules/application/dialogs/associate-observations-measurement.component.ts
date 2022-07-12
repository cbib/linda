import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ExperimentalDesign } from 'src/app/models/linda/experimental-design';
import { ObservationInterface } from 'src/app/models/linda/observation';
import { AlertService, GlobalService } from 'src/app/services';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  bm_data: [];
  material_id: string;
  total_available_plots: number;
  design: ExperimentalDesign;
}

@Component({
  selector: 'app-associate-observations-measurement',
  templateUrl: './associate-observations-measurement.component.html',
  styleUrls: ['./associate-observations-measurement.component.css']
})
export class AssociateObservationsMeasurementComponent implements OnInit, AfterViewInit {
  //entry params
  private model_id: string;
  private design: ExperimentalDesign;
  private user_key: string;
  private result: []
  private model_type: string;
  private parent_id: string;
  public total_available_plots:number;

  @ViewChild('observationpaginator', { static: true }) observationpaginator: MatPaginator;

  
  labelPosition_obsID: 'from files' | 'paste ids' = 'from files';
  pasted_ids:string[]=[]
  private observationdataSource: MatTableDataSource<ObservationInterface>;
  displayedObservationsColumns: string[] = ['No observations defined', 'select'];
  private initialSelection = []
  panel_disabled: boolean = true;
  selection = new SelectionModel<ObservationInterface>(true, this.initialSelection /* multiple */);
  
  constructor(
    private globalService: GlobalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AssociateObservationsMeasurementComponent>,
    private _cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.total_available_plots = this.data.total_available_plots
    this.design = this.data.design

    this.observationdataSource = new MatTableDataSource([])
  }

  ngOnInit() {
    if(this.design.get_associated_observations()[0]!==undefined){
      this.displayedObservationsColumns = Object.keys(this.design.get_associated_observations()[0]).filter(key => !key.includes('UUID'))
      this.displayedObservationsColumns.push('select')
      console.log(this.displayedObservationsColumns)
      this.observationdataSource = new MatTableDataSource(this.design.get_associated_observations());
      this.observationdataSource.paginator = this.observationpaginator;
    }
  }
  ngAfterViewInit() {
    this.observationdataSource.paginator = this.observationpaginator;
    this._cdr.detectChanges()
  }
  onInput(content: string) {
    
      if (content.split("\n").length!==this.selection.selected.length){
      
        console.log([...new Set(content.split("\n"))].length)
        
        this.alertService.error("you need to have same number of observation IDs than sample selected. in your case, you need " +this.selection.selected.length + " samples Ids")

      }
      else{
        this.alertService.success("Correct number of observation IDs !! ")
            this.pasted_ids=content.split("\n")
      
      }
    
  }

  onPaste(event: ClipboardEvent) {

    let clipboardData = event.clipboardData;
    let content = clipboardData.getData('text');
    console.log(content)

      if (content.split("\n").length!==this.selection.selected.length){
            this.alertService.error("you need to have same number of observation values than total observations selected. in your case, you need " +this.selection.selected.length + " observation values")
      }
      else{
            this.alertService.success("Correct number of observation values !! ")
            this.pasted_ids=content.split("\n")
        }
      
    
  }
  async save() {
    if (this.selection.selected.length!==this.pasted_ids.length || this.selection.selected.length===0){
      this.alertService.error("not valid form ")

    }
    else{
      this.selection.selected.forEach((obs, index) => {
        console.log(this.pasted_ids[index])
        console.log(obs['Observation ID'])
        this.observationdataSource.data.filter(obsv=>obsv['Observation ID']===obs['Observation ID'])[0]['Observed variable measure']=this.pasted_ids[index]
        console.log(this.observationdataSource.data.filter(obsv=>obsv['Observation ID']===obs['Observation ID'])[0])
      })
      this.alertService.success("You have successfully link your measurement to corresponding observations!! ")
      //return true;
    }
    
  };
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.observationdataSource.data.length;
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
      this.observationdataSource.data.forEach(row => this.selection.select(row)); this.panel_disabled = false
  }

  get get_observationDataSource() {
    return this.observationdataSource
  }
  onNoClick(): void {
    this.dialogRef.close({event:"Cancel", selected_material: null});
  }
  onOkClick(): void {
    this.dialogRef.close({event:"Confirmed", observation_unit_id: this.model_id});
  }

}
