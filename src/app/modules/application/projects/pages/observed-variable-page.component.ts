import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservedVariableInterface, ObservedVariable} from 'src/app/models/linda/observed-variable';
import { UserInterface } from 'src/app/models/linda/person';
import { first } from 'rxjs/operators';
import { FormGenericComponent } from 'src/app/modules/application/dialogs/form-generic.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-observed-variable-page',
  templateUrl: './observed-variable-page.component.html',
  styleUrls: ['./observed-variable-page.component.css']
})
export class ObservedVariablePageComponent implements OnInit {
  @Input('level') level: number;
  @Input('parent_id') parent_id:string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private dataSource: MatTableDataSource<ObservedVariableInterface>;
  private displayedColumns: string[] = ['Variable name', 'Variable accession number', 'edit'];
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
      }
    );
  }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.parent_id)
    //await this.get_vertices()
    this.get_all_observed_variables()
    this.loaded = true

  }
  async get_all_observed_variables() {
    return this.globalService.get_all_observed_variables(this.parent_id.split('/')[1]).toPromise().then(
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

  onRemove(element: ObservedVariableInterface) {
    this.globalService.remove(element._id).pipe(first()).toPromise().then(
      data => {
          ////console.log(data)
          if (data["success"]) {
              console.log(data["message"])
              var message = element._id + " has been removed from your history !!"
              this.alertService.success(message)
              this.ngOnInit()
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
    const formDialogRef = this.dialog.open(FormGenericComponent, { width: '1200px', data: { model_type: this.model_type, formData: {} , mode: "preprocess" } });
    formDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'Confirmed') {
          console.log(result)
          let obs_variable: ObservedVariable= result["formData"]["form"]
          this.globalService.add(obs_variable, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
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
  onEdit(element: ObservedVariableInterface) {

  }
}
