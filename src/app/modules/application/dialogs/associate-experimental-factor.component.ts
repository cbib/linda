import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { indexOf, isBuffer } from 'lodash';
import { first } from 'rxjs/operators';
import { BlockDesignInterface, ExperimentalDesign, PlotDesign } from 'src/app/models/linda/experimental-design';
import { ExperimentalFactor, ExperimentalFactorInterface } from 'src/app/models/linda/experimental_factor';
import { AlertService, GlobalService } from 'src/app/services';
import { AssociateBiologicalMaterial } from './associate-biological-material.component';
import { FormGenericComponent } from './form-generic.component';
import { TemplateSelectionComponent } from './template-selection.component';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  total_available_plots: number;
  role: string;
  grand_parent_id: string;
  available_designs: string[];
  group_key: string;
  design: ExperimentalDesign;
  total_blocks_per_row: number;
  total_columns_per_block: number;

  block_design_type: string;
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
  total_available_plots: number = 0
  total_available_blocks: number = 0
  total_blocks_per_row: number = 0
  total_columns_per_block: number = 0
  role: string = ""
  grand_parent_id: string = ""
  group_key: string = ""
  design: ExperimentalDesign;
  private block_design_type: string;
  public available_designs: string[]
  public block_design_subtype: string = ""
  private initialSelection = []
  private factor_values: string[] = []
  private obs_unit_factor_values: {} = {}
  observation_level: string = ""
  factors_col = [
    'LightCoral',
    'lightblue',
    'Silver',
    'lightgreen',
    'Gainsboro',
    'LightPink',
    'Orange',
    'DarkKhaki',
    'AntiqueWhite',
    'CornflowerBlue',
    'DarkMagenta',
    'LavenderBlush',
    'Turquoise'
  ]
  my_bg_colors = {}
  observation_levels = [
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
  selected_material: ExperimentalFactorInterface;
  private dataSource: MatTableDataSource<ExperimentalFactorInterface>;

  private displayedColumns: string[] = ['Experimental Factor description', 'Experimental Factor values', 'Experimental Factor accession number', 'Experimental Factor type', 'select'];
  contextMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };

  loaded: boolean = false
  block_index: number = 0;

  constructor(
    private globalService: GlobalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AssociateExperimentalFactorComponent>,
    private router: Router,
    public dialog: MatDialog,
    private _cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.total_available_plots = this.data.total_available_plots
    this.role = this.data.role
    this.grand_parent_id = this.grand_parent_id
    this.available_designs = this.data.available_designs
    this.group_key = this.data.group_key
    console.log(this.available_designs)
    this.design = this.data.design
    this.total_blocks_per_row = this.data.total_blocks_per_row
    this.block_design_type = this.data.block_design_type
    this.total_columns_per_block = this.data.total_columns_per_block

    this.design.Blocking.value.forEach(block => {
      this.total_available_blocks += 1
      /* block['Plot design'].value.forEach(plot => {
        this.total_available_plots += 1
      }) */
    });

  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    //console.log(this.parent_id)
    await this.set_all_experimental_factors()
    this.loaded = true
  }
  async set_all_experimental_factors() {
    var data = await this.globalService.get_all_experimental_factors(this.parent_id.split('/')[1]).toPromise();
    console.log(data);
    if (data.length > 0) {
      this.dataSource = new MatTableDataSource(data);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /* EXPERIMENTAL FACTOR TABLE */
  rowToggle(row) {
    this.selection.toggle(row)
    console.log(this.selection.selected)
    if (this.selection.selected.length === 0) {
      this.panel_disabled = true
    }
    else {
      this.panel_disabled = false
      this.factor_values = this.selection.selected[0]['Experimental Factor values'].split(";")
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row)); this.panel_disabled = false
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

  add_experimental_factor(template: boolean = false) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    //let exp_factor: ExperimentalFactor = new ExperimentalFactor()
    if (template) {
      const dialogRef = this.dialog.open(TemplateSelectionComponent, { disableClose: true, width: '90%', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: 'experimental_factor', values: {}, parent_id: this.parent_id } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result)
          result = Object.keys(result).filter(key => !key.startsWith("_")).reduce((obj, key) => { obj[key] = result[key]; return obj; }, {});
          let exp_factor: ExperimentalFactor = result
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
        }
      });
    }
    else {
      const formDialogRef = this.dialog.open(FormGenericComponent, { disableClose: true, width: '1200px', data: { model_type: this.model_type, parent_id: this.parent_id, formData: {}, mode: "preprocess" } });
      formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.event == 'Confirmed') {
            console.log(result)
            let exp_factor: ExperimentalFactor = result["formData"]["form"]

            this.globalService.add(exp_factor, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
              data => {
                if (data["success"]) {
                  console.log(data)
                  this.ngOnInit()
                }
              });
          }
        }
      });
    }
  }
  go_to_exp_factor_form() {
    //this.dialogRef.close()
    const formDialogRef = this.dialog.open(FormGenericComponent, { disableClose: true, width: '1200px', data: { model_type: this.model_type, parent_id: this.parent_id, formData: {}, mode: "preprocess" } });
    formDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'Confirmed') {
          console.log(result)
          let exp_factor: ExperimentalFactor = result["formData"]["form"]

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

  /* OBSERVATION LEVEL SELECTION */

  onObservationLevelChange(value) {
    //check if mulitple else fill as many as possible
    this.observation_level = value
    if (this.observation_level === 'study') {
    }
    else if (this.observation_level === 'rep') {
    }
    else if (this.observation_level === 'block') {
      if (this.total_available_blocks % this.get_factor_values.length === 0) {
        let total_needed_colors = this.get_factor_values.length
        for (let index = 0; index < this.total_available_blocks; index++) {
          const random = Math.floor(Math.random() * this.get_factor_values.length);
          console.log(random, this.get_factor_values[random]);
          this.my_bg_colors[index + 1] = this.factors_col[random]
        }
      }
      else {

      }

    }
    else if (this.observation_level === 'row') {
    }
    else if (this.observation_level === 'column') {

    }
    //plot
    else {
      console.log(this.total_available_plots)
      if (this.total_available_plots % this.get_factor_values.length === 0) {
        let total_needed_colors = this.get_factor_values.length
        for (let index = 0; index < this.total_available_plots; index++) {
          const random = Math.floor(Math.random() * this.get_factor_values.length);
          console.log(random, this.get_factor_values[random]);
          this.my_bg_colors[index + 1] = this.factors_col[random]
        }
      }
      else {

      }
    }
    console.log(this.my_bg_colors)
  }





  /* GRID */


  get_associated_material_source(_pd: PlotDesign) {
    if (_pd['Associate_material_source'].value !== null) {
      return _pd['Plot number'].value + ": " + _pd['Associate_material_source'].value
    }
    else {
      return _pd['Plot number'].value + ": No material defined"
    }
  }
  get_background_code_color(index: number) {
    return this.factors_col[index + 1]
  }
  shuffle(t) {
    let last = t.length
    let n
    while (last > 0) {
      n = this.rand(last)
      this.swap(t, n, --last)
    }
  }

  private rand = n =>
    Math.floor(Math.random() * n)

  swap(t, i, j) {
    let q = t[i]
    t[i] = t[j]
    t[j] = q
    return t
  }
  change_design_subtype(e) {
    console.log(e)
    console.log(e.value)
    this.block_design_subtype = e.value
    // Factor values are equally distributed among each plot in each block (full random)
    if (this.block_design_subtype === 'completely randomized design') {
      if (this.total_available_plots % this.get_factor_values.length === 0) {
        let my_values = []
        for (let index = 0; index < this.get_factor_values.length; index++) {
          /* console.log(this.total_available_plots)
          let factor_ratio:number=this.total_available_plots / this.get_factor_values.length
          console.log(factor_ratio) */
          for (let j = 0; j < this.total_available_plots / this.get_factor_values.length; j++) {
           // console.log("factor index ", index, "plot index ", j)
            my_values.push(this.get_factor_values[index])
          }
        }
        this.shuffle(my_values)
        for (let j = 0; j < my_values.length; j++) {
          this.my_bg_colors[j + 1] = {'color':this.factors_col[indexOf(this.get_factor_values,my_values[j])],"factor_value":my_values[j]}
          this.obs_unit_factor_values[j+1]=my_values[j]
        }
        /* console.log(this.my_bg_colors)
        console.log(my_values)
        console.log(this.obs_unit_factor_values) */
      }
      else {
        //some plots will not be treated

      }

    }
    else if (this.block_design_subtype === 'Latin square') {
      // Test that the number of plots is the square of the number of treatments
      this.printLatin(4)
      if (this.factor_values.length * this.factor_values.length === this.total_available_plots) {
        
      }
      else {
        this.alertService.error("you cannot use this design due to uncorrect ratio between factor values and plot number")
      }
    }
    // one factor value per block, if 4 blocks and 2 factor values => 2 block with factor value 1, 2 blocks with factor valeu
    else if (this.block_design_subtype === 'Randomized complete block design') {
      if (this.total_available_plots % this.get_factor_values.length === 0) {
        let total_needed_colors = this.get_factor_values.length
        for (let index = 0; index < this.total_available_plots; index++) {
          const random = Math.floor(Math.random() * this.get_factor_values.length);
          console.log(random, this.get_factor_values[random]);
          this.my_bg_colors[index + 1] = this.factors_col[random]
        }
      }
    }

    else if (this.block_design_subtype === 'Balanced incomplete design') {
      if (this.total_available_blocks >= this.factor_values.length) {
        if (this.total_available_plots < this.factor_values.length) {

        }
        else {

          this.alertService.error("You cannot performed balanced incomplete with this configuration !!! \n Total number of plots must be lower than treament (factor) values")
          this.block_design_subtype = ""
        }

      }
      else {
        this.alertService.error("You cannot performed balanced incomplete with this configuration !!! ")
        this.block_design_subtype = ""
      }
    }
    //partially balance block design
    else {
      this.alertService.error("this deign is not yet implemented !!! ")
      this.block_design_subtype = ""

    }
  }
  printLatin(n:number){
    // A variable to control the rotation
    // point.
    let str=''
    let k = n+1;
    for (let i = 1; i < n; i++) {
      let temp = k;
      while (temp <= n){
            str+=temp+'\n'
            temp++;
      }
      for (let j = 1; j < n; j++) {
        str+=j+'\t'
      }
      k--
      str+='\n'

    }
    console.log(str)
  }
 
  dispatch_again() {
    this.my_bg_colors={}
    // Factor values are equally distributed among each plot in each block (full random)
    if (this.block_design_subtype === 'completely randomized design') {
      if (this.total_available_plots % this.get_factor_values.length === 0) {
        let my_values = []
        for (let index = 0; index < this.get_factor_values.length; index++) {
          /* console.log(this.total_available_plots)
          let factor_ratio:number=this.total_available_plots / this.get_factor_values.length
          console.log(factor_ratio) */
          for (let j = 0; j < this.total_available_plots / this.get_factor_values.length; j++) {
            //console.log("factor index ", index, "plot index ", j)
            my_values.push(this.get_factor_values[index])
          }
        }
        //console.log(my_values)
        this.shuffle(my_values)
        //console.log(my_values)
        for (let j = 0; j < my_values.length; j++) {
          this.my_bg_colors[j + 1] = {'color':this.factors_col[indexOf(this.get_factor_values,my_values[j])],"factor_value":my_values[j]}
        }
        //this.my_bg_colors[index + 1] = this.factors_col[random]


        /* let total_needed_colors = this.get_factor_values.length
        for (let index = 0; index < this.total_available_blocks; index++) {
          const random = Math.floor(Math.random() * this.get_factor_values.length);
          console.log(random, this.get_factor_values[random]);
          this.my_bg_colors[index + 1] = this.factors_col[random]
        } */
      }
      else {
        //some plots will not be treated

      }

    }
    else if (this.block_design_subtype === 'Latin square') {
      // Test that the number of plots is the square of the number of treatments
      if (this.factor_values.length * this.factor_values.length === this.total_available_plots) {

      }
      else {
        this.alertService.error("you cannot use this design due to uncorrect ratio between factor values and plot number")
      }
    }
    // one factor value per block, if 4 blocks and 2 factor values => 2 block with factor value 1, 2 blocks with factor valeu
    else if (this.block_design_subtype === 'Randomized complete block design') {
      if (this.total_available_plots % this.get_factor_values.length === 0) {
        let total_needed_colors = this.get_factor_values.length
        for (let index = 0; index < this.total_available_plots; index++) {
          const random = Math.floor(Math.random() * this.get_factor_values.length);
          console.log(random, this.get_factor_values[random]);
          this.my_bg_colors[index + 1] = this.factors_col[random]
        }
      }
    }

    else if (this.block_design_subtype === 'Balanced incomplete design') {
      if (this.total_available_blocks >= this.factor_values.length) {
        if (this.total_available_plots < this.factor_values.length) {

        }
        else {

          this.alertService.error("You cannot performed balanced incomplete with this configuration !!! \n Total number of plots must be lower than treament (factor) values")
          this.block_design_subtype = ""
        }

      }
      else {
        this.alertService.error("You cannot performed balanced incomplete with this configuration !!! ")
        this.block_design_subtype = ""
      }
    }
    //partially balance block design
    else {
      this.alertService.error("this deign is not yet implemented !!! ")
      this.block_design_subtype = ""

    }
  }
  get_background_color(index: number, subtype: string = "") {
    /* console.log(index)
    if (subtype === 'completely randomized design') {
      console.log(subtype)
    }
    else if (subtype === 'Randomized complete block design') {
      console.log(subtype)
    }
    else if (subtype === 'Balanced incomplete design') {
      console.log(subtype)
    }
    else if (subtype === 'Partially balanced design') {
      console.log(subtype)
    }
    else if (subtype === 'Latin square') {
      console.log(subtype)
    }
    else {
      console.log(subtype)
    } */
    return this.my_bg_colors[index + 1]['color']


  }
  get_block_background_color(index: number, subtype: string = ""){
    if (subtype === 'completely randomized design') {
      console.log(subtype)
      return 'blue'
    }
    
  }
  get get_design(): ExperimentalDesign { return this.design }
  get get_observation_level() { return this.observation_level }
  get get_factor_values(): string[] { return this.factor_values }
  get get_displayedColumns() { return this.displayedColumns }
  get get_dataSource() { return this.dataSource }
  get get_parent_id() { return this.parent_id }
  get get_block_design_subtype() { return this.block_design_subtype }
  onClickTour(help_mode: boolean = false, step: number) {
  }

  display_block(_block: BlockDesignInterface) {
    this.block_index = _block['Block number'].value - 1
  }

  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel", selected_material: null });
  }
  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed", selected_experimental_factor: this.selection.selected,block_design_subtype:this.block_design_subtype,experimental_factor_values:this.my_bg_colors});
  }

}
