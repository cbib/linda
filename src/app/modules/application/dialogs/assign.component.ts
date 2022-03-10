import { Component, OnInit, Inject, ViewChild, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService, AlertService } from '../../../services';
import { DataFileInterface } from '../../../models/linda/data_files'
import { DefineComponent } from './define.component'
import { AddColumnComponent} from './add-column.component'
 
interface DialogData {
  collection: string;
  data_file:DataFileInterface;
  parent_id:string;
  group_key:string;
}

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit, OnDestroy{
  private data_file:DataFileInterface;
  private collection:string;
  private parent_id:string;
  private group_key:string;
  private tableData_columns:string[]
  loaded:boolean=false
  dataTable: any;
  //dtOptions: any;
  dtOptions: DataTables.Settings = {};
  tableData = [];
  @ViewChild('dataTable', {static: true}) table;
    constructor(
      private globalService: GlobalService, 
      private alertService: AlertService, 
      public dialogRef: MatDialogRef<AssignComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      public definedialog: MatDialog) {
        this.collection=this.data.collection
        this.data_file=this.data.data_file
        this.parent_id=this.data.parent_id
        this.group_key=this.data.group_key
       }
  
    ngOnInit() {
      console.log(this.data_file.associated_headers)
      this.getDataFromSource()
    }
    refresh(){
      this.alertService.error("Find a way to refresh table after add a new column")
    }
    add_composite(){
      const dialogRef = this.definedialog.open(AddColumnComponent, { width: '1000px', data: {data_file:this.data_file, parent_id:this.parent_id, group_key:this.group_key} });
              dialogRef.afterClosed().subscribe(data => {
                  if (data !== undefined) {
                      console.log(data)
                      this.data_file=data.data_file
                  };
              });
    }
    add_column(){
      const dialogRef = this.definedialog.open(AddColumnComponent, { width: '1000px', data: {data_file:this.data_file, parent_id:this.parent_id, group_key:this.group_key} });
              dialogRef.afterClosed().subscribe(data => {
                  if (data !== undefined) {
                      console.log(data)
                      this.data_file=data.data_file
                  };
              });

    }

    getDataFromSource() {
      this.globalService.get_data_file(this.data_file._key).subscribe(data => {
        console.log(data)
        this.tableData = data.data;
        console.log(this.tableData)
        var columns = []
        this.tableData_columns = Object.keys(this.tableData[0]);
        this.tableData_columns.forEach(key => {
          columns.push({title: key, data: key})
        });
        this.dtOptions = {
          data: this.tableData,
          columns: columns
        };
      }, err => {}, () => {
        console.log("no errors")
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable(this.dtOptions);
        this.loaded=true
      });
    }
    onDefine(column:string){
      console.log(column)
      const dialogRef = this.definedialog.open(DefineComponent, { width: '1000px', data: { column_original_label:column, data_file:this.data_file, parent_id:this.parent_id, group_key:this.group_key} });
              dialogRef.afterClosed().subscribe(data => {
                  if (data !== undefined) {
                      console.log(data)
                      this.data_file=data.data_file
                  };
              });
    }
    get get_collection(){
      return this.collection
    }
    get get_data_file(){
      return this.data_file
    }
    get get_tableData_columns(){
      return this.tableData_columns
    }
    get get_loaded(){
      return this.loaded
    } 

    onNoClick(): void {
      this.dialogRef.close({event:"Cancelled"});
    }

  
    onOkClick(): void {
      this.dialogRef.close({event:"Confirmed", data_file:this.data_file});
    }
    ngOnDestroy() {
      this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
    }

}
