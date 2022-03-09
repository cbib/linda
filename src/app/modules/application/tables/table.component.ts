import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data:{};
  @Input() data_columns:[]
  @ViewChild('dataTable', {static: true}) table;
  dataTable: any;
  dtOptions: any;
  tableData = [];

  constructor(private router: Router,private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => {
          this.data = params['data'];
          //this.vertice = params['data_vertice']
          this.data_columns = params['data_columns']
          console.log(this.data)
          //console.log(this.vertice)
          console.log(this.data_columns)
      }
      
  );
   }

  ngOnInit() {
    //console.log(this.data['filteredData'])
    console.log(this.data)
    this.getDataFromSource()
  }
  getDataFromSource() {
    //let tableData_columns=["Observation unit ID","Observation Unit factor value","Observation unit type", "External ID","Spatial distribution"]
    console.log(this.data)
    this.tableData = this.data['Data'];
    var columns = []
    //var tableData_columns = Object.keys(this.tableData[0]);
    this.data_columns.forEach(key => {
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