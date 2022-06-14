import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import {ExperimentalFactorDialogModel} from '../../../models/experimental_factor_models' 
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BiologicalMaterialFullInterface } from 'src/app/models/linda/biological-material';
import { Router } from '@angular/router';
import { PlotDesign } from 'src/app/models/linda/experimental-design';

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  plot_design:PlotDesign;
  role:string;
  grand_parent_id:string;
  group_key:string;
}
export interface PlotMaterial{
  biological_material_id:string;
  row_num:number;
  column_num:number;
  harvested_date:Date;
  alive:boolean;
}

@Component({
  selector: 'app-plot-overview',
  templateUrl: './plot-overview.component.html',
  styleUrls: ['./plot-overview.component.css']
})
export class PlotOverviewComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private model_id: string;
  model_type: string;
  private parent_id: string;
  role:string=""
  grand_parent_id:string=""
  total_available_material_by_plots:number=0
  group_key:string=""
  loaded:boolean=false
  plot_design:PlotDesign;
  selected_material:PlotMaterial;
  private dataSource: MatTableDataSource<PlotMaterial>;
  private displayedColumns: string[] = [];

  constructor(
    private globalService: GlobalService, 
    private alertService:AlertService,
    public dialogRef: MatDialogRef<PlotOverviewComponent>,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
    this.model_id = this.data.model_id
    this.model_type = this.data.model_type
    this.parent_id = this.data.parent_id
    this.plot_design=this.data.plot_design
    this.role = this.data.role
    this.grand_parent_id = this.grand_parent_id
    this.group_key = this.data.group_key
    console.log(this.plot_design)
}

  ngOnInit() {
    this.loaded=true
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onClose(): void {
    this.dialogRef.close({event:"Close"});
  }


}
