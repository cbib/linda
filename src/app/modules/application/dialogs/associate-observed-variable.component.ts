import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import { ExperimentalFactorDialogModel } from '../../../models/experimental_factor_models'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BiologicalMaterialFullInterface } from 'src/app/models/linda/biological-material';
import { Router } from '@angular/router';
import { ObservedVariable, ObservedVariableInterface } from 'src/app/models/linda/observed-variable';
import { FormGenericComponent } from './form-generic.component';
import { TemplateSelectionComponent } from './template-selection.component';
import { first } from 'rxjs/operators';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  total_available_plots: number;
  role: string;
  grand_parent_id: string;
  group_key: string;
}
const OBSERVED_VARIABLE_ELEM: ObservedVariableInterface[] = []


@Component({
  selector: 'app-associate-observed-variable',
  templateUrl: './associate-observed-variable.component.html',
  styleUrls: ['./associate-biological-material.component.css']
})

export class AssociateObservedVariable implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<AssociateObservedVariable>
  private model_id: string;
  private user_key: string;
  private result: []
  private model_type: string;
  private parent_id: string;
  search_type: string

  dataSource = new MatTableDataSource(OBSERVED_VARIABLE_ELEM);
  displayedColumns: string[] = ['Template type', 'select'];
  private initialSelection = []
  selection = new SelectionModel<ObservedVariableInterface>(false, this.initialSelection /* multiple */);
  panel_disabled: boolean = false;
  role: string = ""
  grand_parent_id: string = ""
  group_key: string = ""
  loaded: boolean = false
  total_available_plots: number = 0
  observations: any;
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
  }

  async ngOnInit() {
    await this.set_all_observed_variables()
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
  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel", selected_material: null });
  }
  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed", selected_observations: this.observations });
  }

}
