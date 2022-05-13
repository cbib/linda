import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { timeStamp } from 'console';
import { ObservedVariableInterface } from 'src/app/models/linda/observed-variable';
import { TemplateElement } from 'src/app/models/template_models';
import { GlobalService} from '../../../services';



interface DialogData {
  search_type :string
  model_id: string;
  parent_id: string;
  user_key:string;
  model_type:string;
  values:{};
}

const TEMPLATE_ELEM: TemplateElement[] = []
const OBSERVED_VARIABLE_ELEM: ObservedVariableInterface[] = []
@Component({
  selector: 'app-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent implements OnInit {
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: false }) table: MatTable<TemplateSelectionComponent>
    private model_id: string;
    private user_key: string;
    private result:[]
    private model_type: string;
    private parent_id: string;
    search_type:string
    
    dataSource = new MatTableDataSource(OBSERVED_VARIABLE_ELEM);
    displayedColumns: string[] = ['Template type', 'select'];
    private initialSelection = []
    selection = new SelectionModel<ObservedVariableInterface>(false, this.initialSelection /* multiple */);
    panel_disabled: boolean=false;


    constructor(
        private globalService : GlobalService,
        private _cdr: ChangeDetectorRef,
        public dialogRef: MatDialogRef<TemplateSelectionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    { 
        this.search_type= this.data.search_type
        this.model_id=this.data.model_id
        this.user_key=this.data.user_key
        this.model_type=this.data.model_type
        this.parent_id=this.data.parent_id
        this.result=[] 
        console.log(this.search_type)       
    }

    ngOnInit() {
        if (this.search_type=="Template"){
            this.globalService.get_templates_by_user(this.user_key,this.model_type).toPromise().then(
                data => {
                    this.result=data;
                    console.log(data)
                    this.displayedColumns=Object.keys(data[0]).filter(key=>!key.startsWith('_'))
                    this.displayedColumns.push('select')
                    //console.log(this.materialdataSource)
                    this.dataSource.data = data
                    this.dataSource.sort = this.sort
                    this.dataSource.paginator = this.paginator;
                    this._cdr.detectChanges()

                }
            );
        }
        if (this.search_type=="biological_material"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]


            var child_type="biological_materials"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );
        }
        if (this.search_type=="observed_variable"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]

            console.log(parent_name)
            console.log(parent_key)
            var child_type="observed_variables"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );
        }
        if (this.search_type=="experimental_factor"){
            //need to get parent study id
            var parent_name=this.data.parent_id.split("/")[0]
            var parent_key=this.data.parent_id.split("/")[1]


            var child_type="experimental_factors"
            this.globalService.get_type_child_from_parent(parent_name,parent_key,child_type)
            .toPromise().then(
                    data => {
                        this.result=data;
                        console.log(data)
                    }
                );

        }

    }

    onSelect(values:string){
        console.log(values)
        this.data.model_id=values
        this.result.forEach(
            attr => {
                if (attr["_id"]===values){
                    this.data.values=attr
                }   
            }   
        );
    }
    get get_parent_id(){
        return this.parent_id
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
    get get_result(){
        return this.result;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        //this.data.template_id=this.template_id
        console.log(this.selection.selected[0])
        this.dialogRef.close(this.selection.selected[0]);
    }

    

}
