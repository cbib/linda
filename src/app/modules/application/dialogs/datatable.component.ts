import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';
interface DialogData {
  collection: string;
  model_key:string;
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})


export class DatatableComponent implements OnInit {
private collection:string=""
private model_key:string=""

dataTable: any;
dtOptions: any;
tableData = [];
@ViewChild('dataTable', {static: true}) table;
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<DatatableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.collection=this.data.collection
      this.model_key=this.data.model_key
     }

  ngOnInit() {
    this.getDataFromSource()
  }
  getDataFromSource() {
    this.globalService.get_data_file(this.model_key).subscribe(data => {
      this.tableData = data.data;
      console.log(this.tableData)
      var columns = []
      var tableData_columns = Object.keys(this.tableData[0]);
      tableData_columns.forEach(key => {
        columns.push({title: key, data: key})
      });
      this.dtOptions = {
        data: this.tableData,
        columns: columns
      };
    }, err => {}, () => {
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOptions);
    });
  
  }
  onNoClick(): void {
    this.dialogRef.close({event:"Cancelled"});
  }

onOkClick(): void {

  this.dialogRef.close({event:"Confirmed"});

}


}
