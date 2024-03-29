import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-biological-material-table',
  templateUrl: './biological-material-table.component.html',
  styleUrls: ['./biological-material-table.component.css']
})
export class BiologicalMaterialTableComponent implements OnInit {
  dataTable: any;
  dtOptions: any;
  tableData = [];
  @Input('data') data:{};
  private bm_datasources:{} = {}
  @ViewChild('dataTable', {static: true}) table;

  constructor(private router: Router,private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => {
          this.data = params['data'];
          console.log(this.data)
      }
  );
   }

  ngOnInit() {
    //console.log(this.data['filteredData'])
    this.getDataFromSource()
  }
  getDataFromSource() {
    let tableData_columns=["Genus","Species","Organism","Biological material ID","Material source ID (Holding institute/stock centre, accession)","Infraspecific name","Biological material preprocessing","Material source DOI"]
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
