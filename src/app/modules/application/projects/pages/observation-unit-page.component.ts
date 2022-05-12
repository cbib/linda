
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservationUnitInterface } from 'src/app/models/linda/observation-unit';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-observation-unit-page',
  templateUrl: './observation-unit-page.component.html',
  styleUrls: ['./observation-unit-page.component.css']
})
export class ObservationUnitPageComponent implements OnInit,AfterViewInit {
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @Input('level') level: number;
  @Input('parent_id') parent_id:string;
  @Input('model_key') model_key: string;
  @Input('design_id') design_id: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Input('role') role: string;
  @Input('grand_parent_id') grand_parent_id: string;
  @Input('group_key') group_key: string;
  
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  private dataSource: MatTableDataSource<ObservationUnitInterface>;
  //private displayedColumns: string[] = ['Observation unit ID','Observation unit type', 'edit'];
  private displayedColumns: string[] = ['Total Observation units','Observation units type', 'edit'];
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
    private _cdr: ChangeDetectorRef) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
          this.model_type = params['model_type'];
          this.model_key = params['model_key'];
          this.design_id=params['design_id'];
          this.mode = params['mode'];
          this.parent_id = params['parent_id']
          this.group_key = params['group_key']
          this.role=params['role']
          this.grand_parent_id=params['grand_parent_id']
      }
    );
  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    //await this.get_vertices()
    this.get_all_observation_units()
    this.loaded = true
    console.warn(this.level)
    console.warn(this.model_type)
    console.warn(this.model_key)
    console.warn(this.mode)
    console.warn(this.parent_id)
    console.warn(this.group_key)
    console.warn(this.role)
    console.warn(this.grand_parent_id)

  }
  async get_all_observation_units() {
    return this.globalService.get_all_observation_units(this.parent_id.split('/')[1]).toPromise().then(
      data => {
        console.log(data)
        data.forEach(obs_unit=>{
          obs_unit['Total Observation units']=obs_unit['Observation unit ID'].length
          obs_unit['Observation units type']=Array.from(new Set(obs_unit['Observation unit type']))[0]
        })

        this.dataSource = new MatTableDataSource(data);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._cdr.detectChanges()
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
  get get_role() {
    return this.role
  }
  get get_group_key() {
      return this.group_key
  }
  get get_model_type() {
      return this.model_type
  }
  get get_parent_id() {
      return this.parent_id
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "obs", role: this.role, group_key: this.group_key } });
    this.router.navigate(['/experimental_design_page'], { queryParams: { level: "1", parent_id:this.parent_id, grand_parent_id: this.grand_parent_id, model_key: this.model_key, model_id:  this.design_id, model_type: 'experimental_design', mode: "edit", activeTab: "exp_design_info", role: this.role, group_key: this.group_key } });

}
  onRemove(element: ObservationUnitInterface) {
    this.globalService.remove(element._id).pipe(first()).toPromise().then(
      data => {
          ////console.log(data)
          if (data["success"]) {
              console.log(data["message"])
              var message = element._id + " has been removed from your history !!"
              this.alertService.success(message)
              this.reloadComponent()
          }
          else {
              this.alertService.error("this form contains errors! " + data["message"]);
          }
      });
  }
  add(template:boolean=false) {
    this.router.navigate(['/Observationunitform'], { queryParams: { level: "1", parent_id: this.parent_id, design_id:this.design_id, model_key: "", model_type: this.model_type, mode: "create" , role:'owner', group_key:this.group_key, grand_parent_id:this.grand_parent_id} });
  }
  onEdit(element: ObservationUnitInterface) {
    this.router.navigate(['/Observationunitform'], { queryParams: { level: "1", parent_id: this.parent_id, design_id:this.design_id, model_key: element._key, model_type: this.model_type, mode: "edit", role:this.role, group_key:this.group_key, grand_parent_id:this.grand_parent_id } });
  }
}

