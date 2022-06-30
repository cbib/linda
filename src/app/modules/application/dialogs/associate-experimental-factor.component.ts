import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ExperimentalFactor, ExperimentalFactorInterface } from 'src/app/models/linda/experimental_factor';
import { AlertService, GlobalService } from 'src/app/services';
import { AssociateBiologicalMaterial } from './associate-biological-material.component';
import { FormGenericComponent } from './form-generic.component';
import { TemplateSelectionComponent } from './template-selection.component';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  total_available_plots:number;
  role:string;
  grand_parent_id:string;
  available_designs: string[];
  group_key:string;
}

@Component({
  selector: 'app-associate-experimental-factor',
  templateUrl: './associate-experimental-factor.component.html',
  styleUrls: ['./associate-experimental-factor.component.css']
})
export class AssociateExperimentalFactorComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private model_id: string;
  private parent_id: string;
  model_type: string;
  total_available_plots:number=0
  role:string=""
  grand_parent_id:string=""
  group_key:string=""
  public available_designs: string[]
  public block_design_subtype: string
  private initialSelection = []
  observation_level:string=""
  observation_levels= [
    {
      "levelName": "study",
      "levelOrder": 1
    },
    {
      "levelName": "rep",
      "levelOrder": 2
    },
    {
      "levelName": "block",
      "levelOrder": 3
    },
    {
      "levelName": "row",
      "levelOrder": 4
    },
    {
      "levelName": "column",
      "levelOrder": 5
    },
    {
      "levelName": "plot",
      "levelOrder": 6
    }
  ]
  selection = new SelectionModel<ExperimentalFactorInterface>(true, this.initialSelection /* multiple */);
  panel_disabled: boolean = true
  panel_expanded: boolean = false
  selected_material:ExperimentalFactorInterface;
  private dataSource: MatTableDataSource<ExperimentalFactorInterface>;

  private displayedColumns: string[] = ['Experimental Factor description', 'Experimental Factor values', 'Experimental Factor accession number', 'Experimental Factor type', 'select'];
  contextMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };

  loaded:boolean=false
 
  constructor(
    private globalService: GlobalService, 
    private alertService:AlertService,
    public dialogRef: MatDialogRef<AssociateExperimentalFactorComponent>,
    private router: Router,
    public dialog: MatDialog,
    private _cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
      this.model_id = this.data.model_id
      this.model_type = this.data.model_type
      this.parent_id = this.data.parent_id
      this.total_available_plots=this.data.total_available_plots
      this.role = this.data.role
      this.grand_parent_id = this.grand_parent_id
      this.available_designs = this.data.available_designs
      this.group_key = this.data.group_key
      console.log(this.available_designs)

     }

    async ngOnInit() {
      this.dataSource = new MatTableDataSource([]);
      //console.log(this.parent_id)
      await this.set_all_experimental_factors()
      this.loaded = true
    }
    async set_all_experimental_factors(){
      var data = await this.globalService.get_all_experimental_factors(this.parent_id.split('/')[1]).toPromise();
        console.log(data);
        if (data.length>0){
          this.dataSource = new MatTableDataSource(data);
          //console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      

    }
    get get_observation_level(){
      return this.observation_level
    }
    onObservationLevelChange(value){
      console.log(value)
      this.observation_level=value
      if(value==='study'){
      }
      else if(value==='rep'){
      }
      else if (value==='block'){
      }
      else if(value==='row'){
      }
      else if (value==='column'){
        
      }
      //plot
      else{

      }
    }

    public handlePageBottom(event: PageEvent) {
      this.paginator.pageSize = event.pageSize;
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.page.emit(event);
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    get get_displayedColumns() {
      return this.displayedColumns
    }
    get get_dataSource() {
      ////console.log(this.newTableData)
      return this.dataSource
    }
    get get_parent_id(){
      return this.parent_id
    }
    onSelect(element: ExperimentalFactorInterface) {
        console.log(element)
        this.selected_material=element
        this.alertService.success("You have selected "+ this.selected_material['Material source ID (Holding institute/stock centre, accession)'] +" !!!! Click on OK to associate this biological material with your experimental design ")
    }
    add_experimental_factor(template: boolean = false) {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      //let exp_factor: ExperimentalFactor = new ExperimentalFactor()
      console.log(this.model_type)
      console.log(this.parent_id)
      if (template) {
        const dialogRef = this.dialog.open(TemplateSelectionComponent, { disableClose: true, width: '90%', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: 'experimental_factor', values: {}, parent_id: this.parent_id } });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log(result)
            result = Object.keys(result).filter(key => !key.startsWith("_")).reduce((obj, key) => {obj[key] = result[key];return obj;}, {});
            let exp_factor: ExperimentalFactor= result
            this.globalService.add(exp_factor, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
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


            /* var keys = Object.keys(result);
  
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
            ); */
          }
        });
      }
      else {
        const formDialogRef = this.dialog.open(FormGenericComponent, {disableClose: true, width: '1200px', data: { model_type: this.model_type, parent_id:this.parent_id, formData: {} , mode: "preprocess"} });
        formDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            if (result.event == 'Confirmed') {
              console.log(result)
              let exp_factor: ExperimentalFactor= result["formData"]["form"]

              this.globalService.add(exp_factor, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
                data => {
                  if (data["success"]) {
                      console.log(data)
                      this.ngOnInit()
                    // this.reloadComponent()
                  }
              });
            }
          }
        });
      }
    }
    go_to_exp_factor_form(){
      //this.dialogRef.close()
      const formDialogRef = this.dialog.open(FormGenericComponent, {disableClose: true, width: '1200px', data: { model_type: this.model_type, parent_id:this.parent_id, formData: {} , mode: "preprocess"} });
      formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.event == 'Confirmed') {
            console.log(result)
            let exp_factor: ExperimentalFactor= result["formData"]["form"]

            this.globalService.add(exp_factor, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
              data => {
                if (data["success"]) {
                    console.log(data)
                    this.ngOnInit()
                   // this.reloadComponent()
                }
            });
          }
        }
      });
      
      //this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: 'biological_material', mode: "create", role:this.role, grand_parent_id:this.grand_parent_id, group_key:this.group_key } });
    }
    /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  rowToggle(row) {
    
    this.selection.toggle(row)
    console.log(this.selection.selected)
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
      this.dialogRef.close({event:"Cancel", selected_material: null});
    }
    onOkClick(): void {
      this.dialogRef.close({event:"Confirmed", selected_material:  this.selected_material});
    }

}
