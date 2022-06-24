import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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

interface DialogData {
  model_id: string;
  parent_id: string;
  model_type: string;
  total_available_plots:number;
  role:string;
  grand_parent_id:string;
  group_key:string;
}


@Component({
  selector: 'app-associate-biological-material',
  templateUrl: './associate-biological-material.component.html',
  styleUrls: ['./associate-biological-material.component.css']
})

export class AssociateBiologicalMaterial implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    private model_id: string;
    model_type: string;
    private parent_id: string;
    role:string=""
    grand_parent_id:string=""
    group_key:string=""
    loaded:boolean=false
    total_available_plots:number=0
    selected_material:BiologicalMaterialFullInterface;
    private dataSource: MatTableDataSource<BiologicalMaterialFullInterface>;
    private displayedColumns: string[] = ['Genus', 'Species', 'Infraspecific name','total materials','biological materials by replicate', 'replicates','total biological materials'];
    constructor(
        private globalService: GlobalService, 
        private alertService:AlertService,
        public dialogRef: MatDialogRef<AssociateBiologicalMaterial>,
        private router: Router,
        private _cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
        ) {
        this.model_id = this.data.model_id
        this.model_type = this.data.model_type
        this.parent_id = this.data.parent_id
        this.total_available_plots=this.data.total_available_plots
        this.role = this.data.role
        this.grand_parent_id = this.grand_parent_id
        this.group_key = this.data.group_key
    }

    async ngOnInit() {
        this.dataSource = new MatTableDataSource([]);
        //console.log(this.parent_id)
        await this.set_all_biological_materials()
        this.loaded = true
    }
    goto_material_form(){
      this.dialogRef.close()
      this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: 'biological_material', mode: "create", role:this.role, grand_parent_id:this.grand_parent_id, group_key:this.group_key } });
    }
    async set_all_biological_materials() {
        var data = await this.globalService.get_all_biological_materials(this.parent_id.split('/')[1]).toPromise();
        console.log(data);
        if (data.length>0){
          for (let index = 0; index < data.length; index++) {
            //const element = data[index];
            data[index]['replicates']= Array.from(new Set(data[index]['replication']))[0]
            data[index]['total materials']=data[index]["Material source ID (Holding institute/stock centre, accession)"].length
            data[index]['biological materials by replicate']=data[index]["Biological material ID"][0].length/ data[index]['replicates']
            data[index]['total biological materials']=data[index]["Biological material ID"][0].length*data[index]['total materials']
            data[index]['Infraspecific name']=Array.from(new Set(data[index]['Infraspecific name']))
            data[index]['Species']=Array.from(new Set(data[index]['Species']))
            data[index]['Genus']=Array.from(new Set(data[index]['Genus']))
            if (data[index]['Infraspecific name'].length>3){
              data[index]['Infraspecific name']=data[index]['Infraspecific name'].slice(0, 3);
              data[index]['Infraspecific name'].push("...")
            }
            if (data[index]['Species'].length>3){
              data[index]['Species']=data[index]['Species'].slice(0, 3);
              data[index]['Species'].push("...")
            }
            if (data[index]['Genus'].length>3){
              data[index]['Genus']=data[index]['Genus'].slice(0, 3);
              data[index]['Genus'].push("...")
            }
            
          }
          console.log(data[0]['Species']);
        this.dataSource = new MatTableDataSource(data);
        //console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    
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
      onSelect(element: BiologicalMaterialFullInterface) {
          console.log(element)
          this.selected_material=element
          this.alertService.success("You have selected "+ this.selected_material['Material source ID (Holding institute/stock centre, accession)'] +" !!!! Click on OK to associate this biological material with your experimental design ")
      }
      onNoClick(): void {
        this.dialogRef.close({event:"Cancel", selected_material: null});
      }
      onOkClick(): void {
        this.dialogRef.close({event:"Confirmed", selected_material:  this.selected_material});
      }



}