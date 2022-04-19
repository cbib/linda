import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { MiappeNode, User } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { MediaObserver } from "@angular/flex-layout";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { first } from 'rxjs/operators';
import { Investigation } from 'src/app/models/linda/investigation';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExportComponent } from '../../dialogs/export.component';
import { PersonInterface, UserInterface } from 'src/app/models/linda/person';
import { InvestigationInterface } from 'src/app/models/linda/investigation'
import { ShareProject } from '../../dialogs/share-project';
import { GroupLoginComponent } from '../../dialogs/group-login.component';
import { ProjectLoaderComponent } from '../../dialogs/project-loader.component';

@Component({
    selector: 'app-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

    @Input() search_string: string;
    @Input('activeTab') activeTab: string;
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    ///@ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    contextMenuPosition = { x: '0px', y: '0px' };
    userMenuPosition = { x: '0px', y: '0px' };
    userMenusecondPosition = { x: '0px', y: '0px' };
    investigationMenuPosition = { x: '0px', y: '0px' };
    helpMenuPosition = { x: '0px', y: '0px' };

    // public statistics: {};
    private displayed = false;
    loaded: boolean = false
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    dataTable: any;
    dtOptions: DataTables.Settings = {};
    tableData = [];
    expandedElement: InvestigationInterface | null;
    group_key: string;

    public vertices: InvestigationInterface[] = []
    private currentUser: UserInterface
    private multiple_selection: boolean = false;
    private parent_id: string;
    private model_key: string;
    private model_selected: string
    private roles: { project_id: string, role: string }[] = []
    private groups: { project_id: string, group_keys: string[] }[] = []

    //private dataSource
    //private dataSource: MatTableDataSource<InvestigationInterface>;
    private user_groups = []
    private model_type: string = 'investigation'
    private displayedColumns: string[] = ['Investigation unique ID', 'Investigation description', 'edit'];
    private dataSource: MatTableDataSource<InvestigationInterface>
    private projects: InvestigationInterface[] = []

    constructor(
        private globalService: GlobalService,
        private searchService: SearchService,
        private userService: UserService,
        private router: Router,
        private alertService: AlertService,
        private fileService: FileService,
        private wizardService: WizardService,
        private route: ActivatedRoute,
        public media: MediaObserver,
        public dialog: MatDialog,
        private _cdr: ChangeDetectorRef
    ) {
        this.route.queryParams.subscribe(
            params => {
                if (params['activeTab']){
                    this.activeTab = params['activeTab'];
                    this.group_key = params['activeTab'];
                }
                else{
                    this.activeTab = "Guests"
                    this.group_key = "Guests"
                }
            }
        );
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.dataSource = new MatTableDataSource([]);
        this.get_projects()
        this.get_user_groups()
        this.parent_id = this.currentUser['_id']
    }
    private initialSelection = []
    private checklistSelection = new SelectionModel<MatChip>(true, this.initialSelection /* multiple */);

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
    changeTab(tab: string) {
        this.activeTab = tab
        this.group_key = tab
        //console.log(this.activeTab)
        this.reloadComponent()

    }
    
    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/projects_page'], { queryParams: { activeTab: this.activeTab} });    
        //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: _model_id, model_key: this.model_key, model_type: 'study', activeTab: 'data_files', mode: "edit", role: this.role, group_key: this.group_key } });
      }
    async ngOnInit() { 
        this.searchService.getData().subscribe(data => {
            //////console.log(data);
            this.search_string = data
        })

    }
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._cdr.detectChanges()
    }
    
    async get_projects() {
        /* // get person linda db id 
        this.roles = data.map(project => project['roles']);
        this.groups = data.map(project_1 => project_1['groups']);
        const projects = data.map(project_2 => project_2['project']);
        let projects_groups = projects.map((item, i) => Object.assign({}, item, this.groups[i]));
        this.projects = projects_groups.filter((data_1) => data_1.group_keys.includes(this.group_key));
        this.dataSource = new MatTableDataSource(this.projects);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._cdr.detectChanges();
        this.loaded = true */

        return this.userService.get_person_id(this.currentUser._key).toPromise().then(
            async person_id => {
                //console.log(person_id)
                const data = await this.globalService.get_projects(person_id[0].split("/")[1]).toPromise();
                //console.log(data);
                this.roles = data.map(project => project['roles']);
                this.groups = data.map(project_1 => project_1['groups']);
                const projects = data.map(project_2 => project_2['project']);
                let projects_groups = projects.map((item, i) => Object.assign({}, item, this.groups[i]));
                this.projects = projects_groups.filter((data_1) => data_1.group_keys.includes(this.group_key));
                this.dataSource = new MatTableDataSource(this.projects);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this._cdr.detectChanges();
                this.loaded = true
            }
        );
    }
    

    async get_user_groups() {
        await this.userService.get_groups(this.currentUser._key).toPromise().then(
            grps => {
                ////console.log(grps)
                for (var g in grps) {
                    ////console.log(g)
                    this.user_groups.push(grps[g].split('/')[1])
                }
                /// //console.log(this.user_groups)
            }
        );
    }
    get person_id() {
        return this.userService.get_person_id2(this.currentUser._key);
    }
    get_role(element: InvestigationInterface): string {
        return this.roles.filter(inv => inv.project_id == element._id)[0]['role']
    }
    /* get_group_keys(element: InvestigationInterface):string{
        return this.group_keys.filter(inv=> inv.project_id==element._id)[0]['group_keys']
    } */
    get_user_group(group_key: string) {
        return this.user_groups.includes(group_key)
    }
    
    // play_again() {
    //     this.wizardService.play_again(this.vertices, this.currentUser)
    // }
    // turn_off() {
    //     this.wizardService.turn_off(this.currentUser)
    // }
    // onDone() {
    //     this.wizardService.onDone(false, this.currentUser, this.vertices)
    // }
    onAccessGroup(_group_key: string) {
        //console.log(this.currentUser)
        const dialogRef = this.dialog.open(GroupLoginComponent, { width: '500px', data: { group_key: _group_key, current_user: this.currentUser } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //console.log(result['logged'])
                this.user_groups.push(_group_key)
                this.router.navigate(['/projects_page'], { queryParams: { activeTab: _group_key } });

            }
        });

    }
    onClickTour(replay: boolean, level: string) {
        this.wizardService.onClickTour(this.vertices, this.currentUser, replay, level)
    }
    onExplore(element: InvestigationInterface) {
        //////console.log("you are gonna explore your data !!")
        this.router.navigate(['/explore'], { queryParams: { parent_id: element._id } })
    }
    onShare(element: InvestigationInterface) {
        //console.log(this.currentUser)
        const dialogRef = this.dialog.open(ShareProject, { width: '500px', data: { model_id: element._id } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                var guest_person: PersonInterface = result['person']
                //console.log(guest_person['_id'])
                //console.log(element._id)
                // create new edge doccument in users_edge

                this.globalService.add_edge(element._id, guest_person['_id'], "reader", this.group_key).pipe(first()).toPromise().then(
                    data => {
                        if (data["success"]) {
                            //console.log(data["_id"])
                            var message = "A new project " + data["_id"] + " has been successfully shared with " + guest_person['Person name'] + " !!"
                            this.alertService.success(message)
                            this.router.navigate(['/projects_page']);
                            return true;
                        }
                        else {
                            this.alertService.error("this form contains errors! " + data["message"]);
                            return false;
                        }
                    }
                );


            }
        });

    }
    onExportIsa(element: InvestigationInterface) {
        var model_type = this.globalService.get_model_type(element._id)
        var model_key = element._key;
        var model_id = element._id
        var collection_name = element._id.split("/")[0];
        this.globalService.get_by_key(model_key, model_type).toPromise().then(model_data => {
            //Parse in a recursive way all submodels
            var isa_model = "investigation_isa"
            this.globalService.get_model(model_type).toPromise().then(model => {
                this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                    this.globalService.get_model(isa_model).toPromise().then(isa_model => {
                        this.fileService.saveISA(model_data, submodel_data, model_type, collection_name, model_id, isa_model, model);
                    });
                });
            });
        });
    }
    onImport() {
        const dialogRef = this.dialog.open(ProjectLoaderComponent, { width: '1000px', data: { parent_id: this.parent_id, group_key: this.group_key } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.event == 'Confirmed') {


              /* let model_id = this.collection + '/' + this.model_key
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/projects_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: model_id, model_key: this.model_key, model_type: 'investigation', activeTab: 'project_data_files', mode: "edit", group_key: this.group_key } });
 */            }
            }
        });
    }
    onExport(element: InvestigationInterface) {
        //console.log(element)
        const dialogRef = this.dialog.open(ExportComponent, { width: '500px', data: { expandable: true, is_investigation: true } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.event == 'Confirmed') {
                    var collection_name = element._id.split("/")[0];
                    if ((result.recursive_check)) {
                        this.globalService.get_all_childs_by_model(collection_name, element._key).toPromise().then(submodel_data => {
                            this.fileService.saveFiles(element, submodel_data, collection_name, element._id, result.selected_format);
                        });
                    }
                    else {
                        this.fileService.saveFile(element, element._id, "investigation", result.selected_format);
                    }
                }
            }
        });
    }
    onExport_bak(element: InvestigationInterface) {
        var model_type = this.globalService.get_model_type(element._id)
        this.globalService.get_parent(element._id).toPromise().then(parent_data => {
            var is_investigation = parent_data["_from"].includes("users")
            const dialogRef = this.dialog.open(ExportComponent, { width: '500px', data: { expandable: true, is_investigation: true } });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.event == 'Confirmed') {
                        //var selected_format=result.selected_format
                        //var recursive_check=result.recursive_check
                        //var model_id=node.id
                        var collection_name = element._id.split("/")[0];
                        var model_key = element._id.split("/")[1];
                        this.globalService.get_by_key(model_key, model_type).toPromise().then(model_data => {
                            //Parse in a recursive way all submodels
                            if ((result.recursive_check)) {
                                this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                                    this.fileService.saveFiles(model_data, submodel_data, collection_name, element._id, result.selected_format);
                                });
                            }
                            else {
                                this.fileService.saveFile(model_data, element._id, model_type, result.selected_format);
                            }
                        });
                    }
                }
            })
        });
    }
    onEdit(elem: InvestigationInterface) {
        //console.log("on Edit")
        let role = this.roles.filter(inv => inv.project_id == elem._id)[0]['role']
        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser['_id'], model_type: "investigation", model_key: elem._key, model_id: elem._id, mode: "edit", activeTab: 'identifiers', role: role, group_key: this.group_key } });
    }
    onNext(node: string) {
        //////console.log(node)
    }
    onExperimental_design() {
        this.router.navigate(['/design'])
    }
    async onRemove(element: InvestigationInterface) {
        const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'remove_brief', model_type: this.model_type } });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    // Remove only childs from the seleccted node
                    const data = await this.globalService.remove(element._id).toPromise()
                    //////console.log(data)
                    if (data["success"]) {
                        //////console.log(data["message"])
                        var message = element._id + " has been removed from your history !!"
                        this.alertService.success(message)
                        this.reloadComponent()
                        //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                        //window.location.reload();
                        ///this.router.navigate(['/projects_tree']);
                    }
                    else {
                        this.alertService.error("this form contains errors! " + data["message"]);
                    }
                }
            }
            //this.reloadComponent(['/projects'])
        });

    }
    onAdd() {
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
        let new_investigation: Investigation = new Investigation()
        //console.log(new_investigation)
        this.globalService.add(new_investigation, this.model_type, this.parent_id, false, this.group_key).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    //console.log(data)
                    this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type: 'investigation', model_id: data['_id'], mode: "edit", activeTab: 'identifiers', role: "owner", group_key:this.group_key } });
                    //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });

                }
            });;
    }
    invitePerson(group_key) {
        //console.log(group_key)
    }
    reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/projects_tree', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
    
    activate_multiple_selection(val: boolean) {
        this.multiple_selection = val;
        var selected_set = this.checklistSelection.selected
    }
    identify() {
        //////console.log('Hello, Im user tree!');
    }
    isArray(obj: any) {
        return Array.isArray(obj)
    }
    show_info() {
        this.displayed = true
    }

    // Getters
    get get_displayedColumns() {
        return this.displayedColumns
    }
    get get_dataSource() {
        return this.dataSource
    }
    get get_currentUser(): UserInterface {
        return this.currentUser
    }
    get get_tutorial_done() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.currentUser['tutoriel_done']
    }
    get get_tutoriel_level() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.currentUser['tutoriel_step']
    }
    get get_model_selected() {
        if (this.model_selected === undefined) {
            return ""
        }
        else {
            return this.model_selected;

        }
    }
    get get_displayed() {
        return this.displayed
    }
    get get_multiple_selection() {
        return this.multiple_selection
    }
    get get_checklist_selection() {
        return this.checklistSelection
    }
    get get_model_type() {
        return this.model_type
    }
    get get_group_key() {
        return this.group_key
    }

}