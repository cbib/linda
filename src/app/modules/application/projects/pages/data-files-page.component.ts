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
import { FilesLoaderComponent } from 'src/app/modules/application/dialogs/files-loader.component'
import { first } from 'rxjs/operators';
import { UserInterface } from 'src/app/models/linda/person';
import { User } from 'src/app/models/user';
import { AssignComponent } from '../../dialogs/assign.component';
import { ConfirmationComponent } from '../../dialogs/confirmation.component';


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
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @Input('collection') collection: string;
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('role') role: string;
  @Input('group_key') group_key: string;
  
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();


  private dataSource: MatTableDataSource<DataFileInterface>;
  private displayedColumns: string[] = ['Data file link', 'Data file description', 'edit'];
  private data_files: DataFileInterface[] = []
  loaded: boolean = false
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };
  currentUser: User

  constructor(
    public globalService: GlobalService,
    public ontologiesService: OntologiesService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
      this.route.queryParams.subscribe(
        params => {
            this.collection = params['collection'];
            this.parent_id = params['parent_id'];
            this.model_key = params['model_key'];
            this.role == params['role'];
            this.group_key = params['group_key'];
            
            
            console.log(this.role)
            console.log(this.group_key)
            
        }
      );


  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.load_data_files()
    this.loaded = true
    console.log(this.parent_id)
  }

  async load_data_files() {
    /* console.log("model key get_data_files() in data-files.component", this.model_key )
    console.log("collection get_data_files() in data-files.component", this.collection ) */
    return await this.globalService.get_data_files(this.model_key, this.collection).toPromise().then(
      data => {
        //console.log(data)
        this.data_files = data
        this.dataSource = new MatTableDataSource(this.data_files);
        //console.log(this.dataSource)
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
  get get_data_files() {
    return this.data_files
  }

  reloadComponent(model_collection:string, _model_id:string) {
    let currentUrl = this.router.url;
    ////console.log(currentUrl)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    //this.router.navigate(path);
    if (model_collection === "investigations") {
        
      this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: _model_id, model_key: this.model_key, model_type: 'investigation', activeTab: 'project_data_files', mode: "edit", role: this.role, group_key: this.group_key } });
    }
    else {
      this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: _model_id, model_key: this.model_key, model_type: 'study', activeTab: 'data_files', mode: "edit", role: this.role, group_key: this.group_key } });

    }
  }
  async onRemove(element: DataFileInterface) {
    console.log(element._id)
    const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'remove_brief', model_type: "data_file" } });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                  ////console.log(this.active_node.id)
                  const data = await this.globalService.remove(element._id).toPromise()

                  console.log(data)
                  if (data["success"]) {
                    ////console.log(data["message"])
                    var message = element._id + " has been removed from your history !!"
                    this.alertService.success(message)
                    let model_id = this.collection + '/' + this.model_key
                    //this.reloadComponent(['/projects_page'])
                    //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                    //window.location.reload();
                    ///this.router.navigate(['/projects_tree']);
                    console.log(this.collection)
                    this.reloadComponent(this.collection, model_id)
                    if (this.collection === "investigations") {
                      
                      this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: model_id, model_key: this.model_key, model_type: 'investigation', activeTab: 'project_data_files', mode: "edit", role: this.role, group_key: this.group_key } });
                    }
                    else {
                      this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: model_id, model_key: this.model_key, model_type: 'study', activeTab: 'data_files', mode: "edit", role: this.role, group_key: this.group_key } });
                
                    }
                  }
                  else {
                    this.alertService.error("this form contains errors! " + data["message"]);
                  }

                  let model_id = this.collection + '/' + this.model_key
                }
              }
            });

    
    //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: model_id, model_key: this.model_key, model_type:'study', activeTab: 'assStud', mode: "edit" , role: this.role  , group_key: this.group_key} });
    //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type:'study', model_id: data['_id'], mode: "edit", activeTab: 'studyinfo' , role:"owner" } });


    // dependding on parent id, remove either in investigations_edge, studies_edeg
  }
  onAdd(mode:string) {
    const dialogRef = this.dialog.open(FilesLoaderComponent, { width: '1000px', data: { parent_id: this.parent_id, mode:mode } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == 'Confirmed') {
          ///let model_id="studies/"+this.model_key
          let model_id = this.collection + '/' + this.model_key
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          if (this.collection === "investigations") {
            this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: model_id, model_key: this.model_key, model_type: 'investigation', activeTab: 'project_data_files', mode: "edit", role: this.role, group_key: this.group_key } });
          }
          else {
            this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: model_id, model_key: this.model_key, model_type: 'study', activeTab: 'data_files', mode: "edit", role: this.role, group_key: this.group_key } });

          }
          //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: this.model_key, model_type:'study', model_id: model_id, mode: "edit", activeTab: 'data_files' , role:this.role, group_key:this.group_key} });


          ////console.log("hello")
        }
      }
    });

  }
  onShow(elem: DataFileInterface) {
    console.log(elem)
    const dialogRef = this.dialog.open(DatatableComponent, { width: '1000px', data: { model_key: elem._key, collection: this.collection } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == 'Confirmed') {
          let model_id = "studies/" + this.model_key

          ///this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: this.model_key, model_type:'study', model_id: model_id, mode: "edit", activeTab: 'data_files' , role:this.role, group_key:this.group_key} });

          ////console.log("hello")
        }
      }
    });
  }
  onAssign(elem: DataFileInterface) {
    this.router.navigate(['/data_file_page'], { queryParams: { parent_id: this.parent_id, model_key: elem['_key'], model_id: elem['_id'],  role: this.role, group_key: this.group_key } });

    /* console.log(elem)
    const dialogRef = this.dialog.open(AssignComponent, { width: '1000px', data: { collection: this.collection, data_file: elem, parent_id: this.parent_id, group_key: this.group_key } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load_data_files()
        if (result.event == 'Confirmed') {
          let model_id = "studies/" + this.model_key
          console.log(result.data_file)
          this.loaded = true
        }
      }
    }); */
  }
}
