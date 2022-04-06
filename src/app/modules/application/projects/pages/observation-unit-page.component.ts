
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservationUnitInterface } from 'src/app/models/linda/observation-unit';

@Component({
  selector: 'app-observation-unit-page',
  templateUrl: './observation-unit-page.component.html',
  styleUrls: ['./observation-unit-page.component.css']
})
export class ObservationUnitPageComponent implements OnInit {
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
  @Input('grand_parent_id') grand_parent_id: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  private dataSource: MatTableDataSource<ObservationUnitInterface>;
  private displayedColumns: string[] = ['Observation unit ID','Observation unit type', 'edit'];
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
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
        this.grand_parent_id = params['grand_parent_id']
      }
    );
  }

  async ngOnInit() {
    console.log(this.parent_id)
    //await this.get_vertices()
    this.get_all_observation_units()
    this.loaded = true

  }
  async get_all_observation_units() {
    return this.globalService.get_all_observation_units(this.parent_id.split('/')[1]).toPromise().then(
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

  onRemove(element: ObservationUnitInterface) {
  }
  add(element: ObservationUnitInterface) {

  }
  onEdit(element: ObservationUnitInterface) {

  }
}
