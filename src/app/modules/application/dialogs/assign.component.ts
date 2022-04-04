import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../services';
import { AssociatedHeadersInterface, DataFileInterface } from '../../../models/linda/data_files'
import { DefineComponent } from './define.component'
import { AddColumnComponent } from './add-column.component'
import { DataTableDirective} from 'angular-datatables'
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ResDataModal } from 'src/app/models/datatable_model';

interface DialogData {
  collection: string;
  data_file: DataFileInterface;
  parent_id: string;
  group_key: string;
}

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements AfterViewInit, OnDestroy, OnInit {
  private data_file: DataFileInterface;
  private collection: string;
  
  private parent_id: string;
  private group_key: string;
  private tableData_columns: string[]
  loaded: boolean = false
  dataTable: any;
  //dtOptions: any;
  dtOptions: DataTables.Settings = {};
  tableData:{}[];
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  @ViewChild('dataTable', { static: true }) table: { nativeElement: any; };
  dtTrigger: Subject<any> = new Subject<any>();
  columns = []
  constructor(
    private globalService: GlobalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public definedialog: MatDialog) {
    this.collection = this.data.collection
    this.data_file = this.data.data_file
    this.parent_id = this.data.parent_id
    this.group_key = this.data.group_key
    this.loaded=false
  }

  ngAfterViewInit(): void {
    
    this.dtTrigger.next();
   //this.loaded=true
    //this.loaded=true
  }
  async get_data(){
    this.globalService.get_data_file_table(this.data_file._key).subscribe(
     data => {
       console.log(data)
       this.loaded=false
       //this.tableData = []
       this.tableData = data.data
       console.log(this.tableData);
       this.columns = []
       if (this.tableData.length > 0) {
        this.tableData_columns = Object.keys(this.tableData[0]);
        for (let index = 0; index < this.tableData_columns.length; index++) {
          const element = this.tableData_columns[index];
          if (element !== "Study linda ID") {
            this.columns.push({ title: element, data: element });
          }
        }
      }
      console.log(this.columns);
      this.dtOptions = {
        data: this.tableData,
        retrieve: true,
        pageLength: 5,
        columns: this.columns
      }; 
      this.dtTrigger.next();
      this.loaded = true;
      }
    );
  }
  async ngOnInit() {
    await this.get_data()
  }
  async refresh() {
    //this.loaded=false
    this.alertService.clear()
    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      await this.get_data()
    });
  }
  async onRemove(column: string) {
    this.alertService.clear()
    this.loaded=false
    for (let index = 0; index < this.data_file.Data.length; index++) {
      const element = this.data_file.Data[index];
      delete element[column]
      
    }
    for (let index = 0; index < this.data_file.headers.length; index++) {
      const element = this.data_file.headers[index];
      if (element===column){
        this.data_file.headers.splice(index,1)
      }
    }
    for (let index = 0; index < this.get_tableData_columns.length; index++) {
      const element = this.get_tableData_columns[index];
      if (element===column){
        this.get_tableData_columns.splice(index,1)
      }
    }
    for (let index = 0; index < this.columns.length; index++) {
      const element = this.columns[index];
      if (element===column){
        this.columns.splice(index,1)
      }
    }
    console.log(this.get_tableData_columns)
    this.data_file.associated_headers=this.data_file.associated_headers.filter(associated_header => associated_header.header !== column)
    //this.loaded=true
    await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      //var columns = []
      /* if (this.data_file.Data.length > 0) {
        this.tableData_columns = Object.keys(this.data_file.Data[0]);

        this.tableData_columns.forEach(key => {
          if (key !== "Study linda ID") {
            columns.push({ title: key, data: key })
          }
        });

      } */
      this.dtOptions = {
        data: this.data_file.Data,
        retrieve: true,
        pageLength:5,
        columns: this.columns
      };
      //this.dataTable = $(this.table.nativeElement);
      //this.dataTable.DataTable(this.dtOptions);
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      this.loaded=true
    }); 
    //this.refresh()
    
    /* this.data_file.Data.forEach(d=>{delete d[column]})
      this.tableData_columns.forEach(h=>{
        if (h===column){
          delete this.data_file.headers[h]
        }
      });
      this.data_file.headers.forEach((h,index)=>{
        console.log(h)
        console.log(column)
        if (h===column){
          delete this.data_file.headers[index]
        }
      });
      console.log( this.data_file.headers)
      this.data_file.associated_headers=this.data_file.associated_headers.filter(associated_header => associated_header.header !== column)
      console.log(this.data_file) */
    /* await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      
      var columns = []
      if (this.data_file.Data.length > 0) {
        this.tableData_columns = Object.keys(this.data_file.Data[0]);
        this.tableData_columns.forEach(key => {
          if (key !== "Study linda ID") {
            columns.push({ title: key, data: key })
          }
        });
      }
      this.dtOptions = {
        data: this.data_file.Data,
        retrieve: true,
        pageLength:5,
        columns: columns
      };

      this.dtTrigger.next();
      
      this.loaded=true
    }); */
  }  

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  add_composite() {
    const dialogRef = this.definedialog.open(AddColumnComponent, { width: '1000px', data: { data_file: this.data_file, parent_id: this.parent_id, group_key: this.group_key } });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        console.log(data)
        this.data_file = data.data_file
      };
    });
  }
  add_column() {
    const dialogRef = this.definedialog.open(AddColumnComponent, { width: '1000px', data: { data_file: this.data_file, parent_id: this.parent_id, group_key: this.group_key } });
    dialogRef.afterClosed().subscribe(async data => {
      if (data !== undefined) {
        console.log(data)
        this.data_file = data.data_file
        console.log(data)
        this.refresh()
      };
    });

  }
  
 
  getDataFromSource() {
    this.tableData = this.data_file.Data;
    console.log(this.tableData)
    var columns = []
    if (this.tableData.length > 0) {
      this.tableData_columns = Object.keys(this.tableData[0]);
      this.tableData_columns.forEach(key => {
        if (key !== "Study linda ID") {
          columns.push({ title: key, data: key })
        }
      });

    }
    this.loaded=true
    
    //console.log(this.dtOptions)
    
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);
    //this.loaded = true


    /* this.globalService.get_data_file(this.data_file._key).subscribe(data => {
      console.log(data)
      this.tableData = data.data;
      console.log(this.tableData)
      var columns = []
      if (this.tableData.length>0){
        this.tableData_columns = Object.keys(this.tableData[0]);
        this.tableData_columns.forEach(key => {
          if (key!=="Study linda ID"){
            columns.push({title: key, data: key})
          }
        });
        
      }
      this.dtOptions = {
        data: this.tableData,
        columns: columns
      };
      
    }, err => {
      console.log("errors")

    }, () => {
      console.log("no errors")
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOptions);
      this.loaded=true
    }); */
  }

  onDefine(column: string) {
    console.log(column)
    const dialogRef = this.definedialog.open(DefineComponent, { width: '1000px', data: { column_original_label: column, data_file: this.data_file, parent_id: this.parent_id, group_key: this.group_key } });
    dialogRef.afterClosed().subscribe(async data => {
      if (data !== undefined) {
        console.log(data)
        this.data_file = data.data_file
        await this.refresh()
      };
    });
  }
  
  get_style(column) {
    let ass_headers = this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0]
    if (!ass_headers.selected) {
      return "white"
    }
    else {
      if (ass_headers.associated_linda_id.length == 0) {
        return "lightgray"
      }
      else {
        return "Silver"
      }

    }

  }
  get_cell_style(column:string) {
    let ass_headers = this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0]
    if (ass_headers.associated_component==="event") {
      if (!ass_headers.selected) {
        return "white"
      }
      else {
        if (ass_headers.associated_linda_id.length == 0) {
          return "lightcoral"
        }
        else {
          return "coral"
        }

      }
    }
    else if(ass_headers.associated_component==="study"){
      if (!ass_headers.selected) {
        return "white"
      }
      else {
        if (ass_headers.associated_linda_id.length == 0) {
          return "LightSeaGreen"
        }
        else {
          return "DarkCyan"
        }

      }
    }
    else if(ass_headers.associated_component==="experimental_factor"){
      if (!ass_headers.selected) {
        return "white"
      }
      else {
        if (ass_headers.associated_linda_id.length == 0) {
          return "LightSteelBlue"
        }
        else {
          return "SteelBlue"
        }

      }
    }
    else{
      if (!ass_headers.selected) {
        return "#4ECDC4"
      }
      else {
        if (ass_headers.associated_linda_id.length == 0) {
          return "#4ECDC5"
        }
        else {
          return "#25995f"
        }

      }
    }
  }
  is_column_extracted(column: string): boolean {
    return this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0].selected
  }
  get_column_extracted(column: string): AssociatedHeadersInterface {
    return this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0]
  }
  get get_collection() {
    return this.collection
  }
  get get_data_file() {
    return this.data_file
  }
  get get_tableData_columns() :string[]{
    //console.log(Object.keys(this.data_file.Data[0]).filter(column => column !== "Study linda ID"))
    //console.log(this.tableData_columns.filter(column=>column!=="Study linda ID"))
    
    return this.tableData_columns.filter(column => column !== "Study linda ID")
  }
  get get_loaded() {
    return this.loaded
  }

  onNoClick(): void {
    this.dialogRef.close({ event: "Cancelled" });
  }


  onOkClick(): void {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  }
  /* ngOnDestroy() {
    this.dialogRef.close({ event: "Confirmed", data_file: this.data_file });
  } */





  reload_table(){
    this.tableData = this.data_file.Data;
    console.log(this.tableData)
    var columns = []
    if (this.tableData.length > 0) {
      //this.tableData_columns = Object.keys(this.tableData[0]);
      this.tableData_columns.forEach(key => {
        if (key !== "Study linda ID") {
          columns.push({ title: key, data: key })
        }
      });

    }
    this.dtOptions = {
      data: this.tableData,
      retrieve: true,
      pageLength: 5,
      columns: columns
    };
    console.log(this.dtOptions)
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);
    this.loaded = true
  }

}
