import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  dataTable: any;
  dtOptions: any;
  tableData = [];
  @Input() data:{};
  @Input() vertice:{}
  @ViewChild('dataTable', {static: true}) table;

  constructor(private router: Router,private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => {
          this.data = params['data'];
          this.vertice = params['data_vertice']
      }
  );
   }

  ngOnInit() {
    //console.log(this.data['filteredData'])
    this.getDataFromSource()
  }
  getDataFromSource() {
    let tableData_columns=["Observation unit ID","Observation Unit factor value","Observation unit type", "External ID","Spatial distribution"]
    this.tableData = this.data['filteredData'];
    var columns = []
    //var tableData_columns = Object.keys(this.tableData[0]);
    tableData_columns.forEach(key => {
        columns.push({title: key, data: key})
    });
    this.dtOptions = {
      data: this.tableData,
      columns: columns
    };
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
  
  }

}