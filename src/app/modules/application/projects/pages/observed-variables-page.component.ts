import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservedVariableInterface, ObservedVariable } from 'src/app/models/linda/observed-variable';
import { UserInterface } from 'src/app/models/linda/person';
import { first } from 'rxjs/operators';
import { FormGenericComponent } from 'src/app/modules/application/dialogs/form-generic.component'
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TemplateSelectionComponent } from '../../dialogs/template-selection.component';

@Component({
  selector: 'app-observed-variables-page',
  templateUrl: './observed-variables-page.component.html',
  styleUrls: ['./observed-variables-page.component.css']
})
export class ObservedVariablesPageComponent implements OnInit, AfterViewInit {
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
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
  private dataSource: MatTableDataSource<ObservedVariableInterface>;
  private displayedColumns: string[] = ['Trait', 'Method', 'Variable ID', 'edit'];
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
    public dialog: MatDialog,
    private _cdr: ChangeDetectorRef) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
        this.grand_parent_id = params['grand_parent_id']
        this.role = params['role']
        this.group_key = params['group_key']
      }
    );
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._cdr.detectChanges()
  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.parent_id)
    //await this.get_vertices()
    await this.get_all_observed_variables()
    this.loaded = true

  }

  async get_all_observed_variables() {
    await this.globalService.get_all_observed_variables(this.parent_id.split('/')[1]).toPromise().then(
      data => {
        this.dataSource = new MatTableDataSource(data);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });


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
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "obsvar", role: this.role, group_key: this.group_key } });
  }
  add(template: boolean = false) {
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
    if (template) {
      const dialogRef = this.dialog.open(TemplateSelectionComponent, { disableClose: true, width: '90%', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: 'observed_variable', values: {}, parent_id: this.parent_id } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result)
          /* var keys = Object.keys(result);
          for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
              keys.splice(i, 1);
              //var k=this.keys[i]
              i--;
            }
          }
          var new_values = {}
          keys.forEach(attr => { new_values[attr] = result[attr] })
          ////////console.log(new_values)
           */
          result = Object.keys(result).filter(key => !key.startsWith("_")).reduce((obj, key) => {obj[key] = result[key];return obj;}, {});
          let exp_factor: ObservedVariable= result
          this.globalService.add(exp_factor, this.model_type, this.parent_id, false, "").pipe(first()).toPromise().then(
            data => {
              if (data["success"]) { 

                this.reloadComponent() 
                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " based on " + result['_id'] + " has been successfully integrated in your history !!"
                this.alertService.success(message)
              }
              else { this.alertService.error("this form contains errors! " + data["message"]);}
            }
          );


          /* this.globalService.add(result, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
              if (data["success"]) {
                //////////console.log(data["message"])
                //this.model_id=data["_id"];
                this.ngOnInit();
                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " based on " + result['_id'] + " has been successfully integrated in your history !!"
                this.alertService.success(message)
                return true;
              }
              else {
                //////////console.log(data["message"])
                this.alertService.error("this form contains errors! " + data["message"]);

                return false;
                //this.router.navigate(['/studies']);
              }
            }
          ); */
        }
      });
    }
    else {
      const formDialogRef = this.dialog.open(FormGenericComponent, { disableClose: true, width: '1400px', data: { model_type: this.model_type, parent_id: this.parent_id, formData: {}, mode: "preprocess" } });
      formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.event == 'Confirmed') {
            console.log(result)
            let obs_variable: ObservedVariable = result["formData"]["form"]
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
  }
  onEdit(element: ObservedVariableInterface) {
    console.warn("a study has been selected")
    console.warn(element)
    //this.notify.emit(elem)
    //let role = this.roles.filter(inv => inv.study_id == elem._id)[0]['role']
    this.router.navigate(['/observed_variable_page'], { queryParams: { level: "1", grand_parent_id: this.grand_parent_id, parent_id: this.parent_id, model_key: element['_key'], model_id: element['_id'], model_type: this.model_type, mode: "edit", activeTab: "obs_var_info", role: this.role, group_key: this.group_key } });


  }
}
