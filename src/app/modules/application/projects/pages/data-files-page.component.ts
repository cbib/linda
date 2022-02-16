import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DataFileInterface } from 'src/app/models/linda/data_files'
import { MatDialog } from '@angular/material/dialog';
import { DatatableComponent } from '../../dialogs/datatable.component';

@Component({
  selector: 'app-data-files-page',
  templateUrl: './data-files-page.component.html',
  styleUrls: ['./data-files-page.component.css']
})
export class DataFilesPageComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  private dataSource: MatTableDataSource<DataFileInterface>;
  private displayedColumns: string[] = ['Data file link', 'Data file description', 'edit'];
  loaded: boolean = false
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public globalService: GlobalService,
    public ontologiesService: OntologiesService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
      }
    );
  }

  async ngOnInit() {
    console.log(this.parent_id)
    //await this.get_vertices()
    this.get_all_data_files()
    this.loaded = true

  }
  async get_all_data_files() {
    return this.globalService.get_data_files(this.parent_id.split('/')[1]).toPromise().then(
      data => {
        console.log(data)
        this.dataSource = new MatTableDataSource(data);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
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
    return this.dataSource
  }

  onRemove(elem: DataFileInterface) {
  }
  
  add(elem: DataFileInterface) {

  }
  onEdit(elem: DataFileInterface) {

  }
  show_datatable(elem: DataFileInterface){
    this.model_key = elem._id.split("/")[1]
    var collection = elem._id.split("/")[0]
    const dialogRef = this.dialog.open(DatatableComponent, { width: '1000px', data: { collection: collection, model_key: this.model_key } });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            if (result.event == 'Confirmed') {
                ////console.log("hello")
            }
        }
    });
}
}
