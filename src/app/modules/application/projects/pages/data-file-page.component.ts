import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService } from '../../../../services';
import { AssociatedHeadersInterface, DataFile, DataFileInterface } from '../../../../models/linda/data_files'
import { DefineComponent } from '../../dialogs/define.component'
import { AddColumnComponent } from '../../dialogs/add-column.component'
import { DataTableDirective } from 'angular-datatables'
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ResDataModal } from 'src/app/models/datatable_model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/models/linda/person';

@Component({
  selector: 'app-data-file-page',
  templateUrl: './data-file-page.component.html',
  styleUrls: ['./data-file-page.component.css']
})
export class DataFilePageComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('model_id') model_id: string;
  @Input('group_key') group_key: string;
  @Input('role') role: string;
  private data_file: DataFileInterface;
  private tableData_columns: string[] = []
  private currentUser: UserInterface
  myEventSubscription: any;
  loaded: boolean = false
  dataTable: any;
  //dtOptions: any;
  dtOptions: any = {};
  tableData: {}[] = [];
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  //@ViewChild('dataTable', { static: true }) table: { nativeElement: any; };
  dtTrigger: Subject<any> = new Subject<any>();
  columns = []
  constructor(
    private globalService: GlobalService,
    private alertService: AlertService,
    public definedialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,) {
    //this.loaded = false
    //this.tableData = []
    //this.data_file=new DataFile()
    //console.log(this.data_file)
    this.route.queryParams.subscribe(
      params => {
        this.parent_id = params['parent_id'];
        this.group_key = params['group_key'];
        this.model_key = params['model_key'];
        this.model_id = params['model_id'];
        this.role = params['role'];
        console.log(this.role)
        console.log(this.group_key)

      }
    );
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    await this.load_data_file()
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.myEventSubscription.unsubscribe();
  }
  async load_data_file() {
    this.loaded = false
    //this.globalService.start()
    this.myEventSubscription = this.globalService.get_data_file(this.model_key).subscribe(
      data => {
        console.log(data)
        this.data_file = Object.assign(data)
        this.tableData = this.data_file.Data
        this.columns = []
        this.tableData_columns = Object.keys(this.data_file.Data[0]);
        for (let index = 0; index < this.data_file.headers.length; index++) {
          if (this.data_file.headers[index] !== "Study linda ID") {
            this.columns.push({ title: this.data_file.headers[index], data: this.data_file.headers[index] });
          }
        }
        this.dtOptions = {
          data: this.data_file.Data,
          pageLength: 5,
          scrollX: true,
          dom: 'Bfrtip',
          buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
          columns: this.columns
        };
        this.loaded = true
        setTimeout(() => {
          this.dtTrigger.next();
          //this.globalService.end()
        });
      })
  }
  async refresh() {
    //this.loaded=false
    // delete this.data_file
    this.alertService.clear()
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/data_file_page'], { queryParams: { parent_id: this.parent_id, model_key: this.model_key, model_id: this.model_id, role: this.role, group_key: this.group_key } });

   /*  await this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      await this.load_data_file()
      this.dtTrigger.next();
    }); */
  }
  clean_associated_header(_associated_header: AssociatedHeadersInterface, _parent_id: string, _component_id: string, _component_value, _extraction_component_field) {
    console.log(_associated_header)

    if (_extraction_component_field === 'Study unique ID') {
      _associated_header.associated_values = _associated_header.associated_values.filter(associated_value => associated_value !== _component_value);
    }
    else {
      _associated_header.associated_values.splice(_associated_header.associated_linda_id.indexOf(_component_id), 1)
    }
    _associated_header.associated_parent_id = _associated_header.associated_parent_id.filter(parent_id => parent_id !== _parent_id);
    _associated_header.associated_linda_id = _associated_header.associated_linda_id.filter(linda_id => linda_id !== _component_id);

    if (_associated_header.associated_values.length === 0) {
      _associated_header.associated_component = ""
      _associated_header.associated_component_field = ""
      _associated_header.associated_term_id = ""
      _associated_header.is_time_values = false
      _associated_header.selected = false
      _associated_header.is_numeric_values = false
    }
    console.log(_associated_header)
  }
  async onRemove(column: string) {
    console.log(column)
    this.alertService.clear()
    this.loaded = false
    var data_model = { ...this.data_file };
    for (let index = 0; index < data_model.Data.length; index++) {
      const element = data_model.Data[index];
      delete element[column]

    }
    for (let index = 0; index < data_model.headers.length; index++) {
      const element = data_model.headers[index];
      if (element === column) {
        data_model.headers.splice(index, 1)
      }
    }
    let unique_field = ['Study unique ID', 'Event accession number', 'Experimental Factor accession number', "Environment parameter accession number"]
    // check if associated_component_field is in [Study unique ID, Event accession number, Experimental Factor accession number]
    // clean all childs 
    // if Study id column, clean all others associate headers
    // If Event accession number, search all assocciated headers with this event_id and clean these headers
    if (unique_field.includes(data_model.associated_headers.filter(associated_header => associated_header.header === column)[0].associated_component_field)) {
      
          console.log(data_model.associated_headers.filter(associated_header => associated_header.header === column)[0].associated_component_field)
          if (data_model.associated_headers.filter(associated_header => associated_header.header === column)[0].associated_linda_id.length > 0) {
            let linda_ids = data_model.associated_headers.filter(associated_header => associated_header.header === column)[0].associated_linda_id
            console.log(linda_ids)
            for (let index = 0; index < linda_ids.length; index++) {
              const linda_id = linda_ids[index];
              console.log(linda_id)
              this.globalService.remove(linda_id).pipe(first()).toPromise().then(
                async remove_result => {
                  if (remove_result["success"]) {
                    //this.detected_studies.filter(detected_study => detected_study !== component_value)
                    console.log(remove_result)
                    let ass_headers_to_clean=data_model.associated_headers.filter(prop => prop.associated_linda_id.includes(linda_id) && !unique_field.includes(prop.associated_component_field))
                    for (let index = 0; index < ass_headers_to_clean.length; index++) {
                      const associated_header = ass_headers_to_clean[index];

                      for (let subindex = 0; subindex < associated_header.associated_linda_id.length; subindex++) {
                        this.clean_associated_header(associated_header, associated_header.associated_parent_id[subindex], associated_header.associated_linda_id[subindex], associated_header.associated_values[subindex], associated_header.associated_component_field)
                      }
                    }
                  }
                }
              );
            }
          }
    }

    data_model.associated_headers = data_model.associated_headers.filter(associated_header => associated_header.header !== column)
    let data_update: {} = await this.globalService.update_document(data_model._key, data_model, 'data_file').toPromise()
    console.log(data_update);

    if (data_update['success']) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/data_file_page'], { queryParams: { parent_id: this.parent_id, model_key: this.model_key, model_id: this.model_id, role: this.role, group_key: this.group_key } });
    }
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
        //this.loaded=false
        console.log(data)
        this.data_file = data.data_file
        this.refresh()
        console.log(data)
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
    this.loaded = true
  }
  onDefine(column: string) {
    this.loaded=false
    console.log(column)
    const dialogRef = this.definedialog.open(DefineComponent, { width: '1000px', data: { column_original_label: column, data_file: this.data_file, parent_id: this.parent_id, group_key: this.group_key } });
    dialogRef.afterClosed().subscribe(async data => {
      if (data !== undefined) {
        //console.log(data)
        /* this.data_file = data.data_file
        await this.refresh() */
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/data_file_page'], { queryParams: { parent_id: this.parent_id, model_key: this.model_key, model_id: this.model_id, role: this.role, group_key: this.group_key } });
  
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
  get_cell_style(column: string) {
    let ass_headers = this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0]
    if (ass_headers.associated_component === "event") {
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
    else if (ass_headers.associated_component === "study") {
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
    else if (ass_headers.associated_component === "experimental_factor") {
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
    else {
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
    if (this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column).length > 0) {
      return this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0].selected
    }
    else {
      return false
    }
    //return this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0].selected
  }
  get get_columns() {
    return this.columns.map(column => column['data'])
  }
  get_column_extracted(column: string): AssociatedHeadersInterface {
    return this.get_data_file.associated_headers.filter(associated_header => associated_header.header === column)[0]
  }
  get get_data_file(): DataFileInterface {
    return this.data_file
  }
  get get_loaded() {
    return this.loaded
  }
  onNoClick(): void {
  }
  onOkClick(): void {
  }
  close() {
    //this.notify.emit("close_study")
    this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', activeTab: 'project_data_files', mode: "edit", role: this.role, group_key: this.group_key } });
    // Same as delete project and all childs 
  }

}

