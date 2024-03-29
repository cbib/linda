import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { FormGenericComponent } from 'src/app/modules/application/dialogs/form-generic.component'
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from 'src/app/models/linda/person';
import { EnvironmentInterface, Environment } from 'src/app/models/linda/environment';

@Component({
  selector: 'app-environment-variables-page',
  templateUrl: './environment-variables-page.component.html',
  styleUrls: ['./environment-variables-page.component.css']
})
export class EnvironmentVariablesPageComponent implements OnInit {
  @Input('level') level: number;
  @Input('parent_id') parent_id:string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Input('grand_parent_id') grand_parent_id: string;
  @Input('role') role: string;
  @Input('group_key') group_key: string;


  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private dataSource: MatTableDataSource<EnvironmentInterface>;
  private displayedColumns: string[] = ['Environment parameter', 'Environment parameter value', 'Environment parameter accession number','edit'];
  loaded: boolean = false
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };
  private currentUser: UserInterface

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
          this.group_key = params['group_key']
          this.role=params['role']
          this.grand_parent_id=params['grand_parent_id']
          console.log(this.level)
          console.log(this.model_type)
          console.log(this.model_key)
          console.log(this.parent_id)
          console.log(this.grand_parent_id)
          console.log(this.mode)
          console.log(this.role)
          console.log(this.group_key)
      }
    );
  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.parent_id)
    //await this.get_vertices()
    await this.set_all_environments()
    this.loaded = true

  }
  async set_all_environments() {
    const data = await this.globalService.get_all_environments(this.parent_id.split('/')[1]).toPromise();
    console.log(data);
    this.dataSource = new MatTableDataSource(data);
    console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "env", role: this.role, group_key: this.group_key } });
  }

  onRemove(element: EnvironmentInterface) {
    this.globalService.remove(element._id).pipe(first()).toPromise().then(
      data => {
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
  add() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let new_step = 0
    if (!this.currentUser.tutoriel_done) {
        if (this.currentUser.tutoriel_step === "0") {
            new_step = 1
            this.currentUser.tutoriel_step = new_step.toString()
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
        else {
            this.alertService.error("You are not in the right form as requested by the tutorial")
        }
    }
    //let exp_factor: ExperimentalFactor = new ExperimentalFactor()
    console.log(this.model_type)
    console.log(this.parent_id)
    const formDialogRef = this.dialog.open(FormGenericComponent, {disableClose: true,  width: '1200px', data: { model_type: this.model_type,  parent_id:this.parent_id, formData: {} , mode: "preprocess"} });
    formDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'Confirmed') {
          console.log(result)
          let environment: Environment= result["formData"]["form"]
          this.globalService.add(environment, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
        data => {
            if (data["success"]) {
                console.log(data)
                this.ngOnInit()
            }
        });;
        }
      }
    });


  }

  onEdit(element:EnvironmentInterface){
    console.warn("a study has been selected")
    console.warn(element)
    //this.notify.emit(elem)
    //let role = this.roles.filter(inv => inv.study_id == elem._id)[0]['role']
    this.router.navigate(['/environmental_variable_page'], { queryParams: { level: "1", grand_parent_id:this.grand_parent_id, parent_id: this.parent_id, model_key: element['_key'], model_id: element['_id'], model_type: this.model_type, mode: "edit", activeTab: "env_info", role: this.role, group_key: this.group_key } });

  }
}

