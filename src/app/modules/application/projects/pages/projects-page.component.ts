import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { MiappeNode, User } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { MediaObserver } from "@angular/flex-layout";
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort'
import { MatTableDataSource} from '@angular/material/table';
import { TemplateSelectionComponent } from '../../dialogs/template-selection.component';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { first } from 'rxjs/operators';
import { Investigation } from 'src/app/models/miappe/investigation';
import { InvestigationInterface } from 'src/app/models/miappe/investigation'
import { animate, state, style, transition, trigger} from '@angular/animations';
import { ExportComponent } from '../../dialogs/export.component';

@Component({
    selector: 'app-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class ProjectsPageComponent implements OnInit {

    @Input() search_string: string;
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

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
    private currentUser:User
    private multiple_selection: boolean = false;
    private parent_id: string;
    private model_key: string;
    private model_selected: string
    public vertices: InvestigationInterface[] = []
    public projects: any = []
    //private dataSource
    private dataSource: MatTableDataSource<InvestigationInterface>;
    expandedElement: InvestigationInterface | null;
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    dataTable: any;
    dtOptions: DataTables.Settings = {};
    tableData = [];
    private model_type: string = 'investigation'
    private displayedColumns: string[] = ['Investigation unique ID', 'Investigation description', 'edit'];

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
        public dialog: MatDialog
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
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

    async ngOnInit() {

        //await this.get_vertices()
        this.get_all_projects()
        this.loaded = true


        this.searchService.getData().subscribe(data => {
            ////console.log(data);
            this.search_string=data
        })
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.parent_id = this.currentUser['_id']
        console.log(this.currentUser)

    }
    async get_all_projects() {
        return this.globalService.get_all_projects(this.currentUser._key).toPromise().then(
            data => {
                console.log(data)
                this.dataSource = new MatTableDataSource(data);
                console.log(this.dataSource)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        )
    }
    
    get get_displayedColumns(){
        return this.displayedColumns
      }  
    get get_dataSource(){
        return this.dataSource
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
    onClickTour(replay: boolean, level: string) {
         this.wizardService.onClickTour(this.vertices, this.currentUser, replay, level)
    }

    onExplore(element:InvestigationInterface){
        ////console.log("you are gonna explore your data !!")
        this.router.navigate(['/explore'], { queryParams: {parent_id: element._id} })
    }
    onExportIsa(element:InvestigationInterface) {
        var model_type = this.globalService.get_model_type(element._id)
        var model_key = element._id.split("/")[1];
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
    onExport(element:InvestigationInterface) {
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
    onEdit(elem:InvestigationInterface) {
        console.log("on Edit")
        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser['_id'] ,model_type: "investigation", model_key: elem._key, model_id: elem._id , mode: "edit", activeTab: 'identifiers'  } });
    }
    activate_multiple_selection(val: boolean) {
        this.multiple_selection = val;
        var selected_set = this.checklistSelection.selected
    }
    onNext(node: string) {
        ////console.log(node)
    }
    start() {
        this.startTime = new Date();
    };
    end() {
        this.endTime = new Date();
        this.timeDiff = this.endTime.valueOf() - this.startTime.valueOf();
        this.timeDiff = this.timeDiff / 1000.0;
        ////console.log("Elapsed time :" + this.timeDiff+ " seconds")
        // get seconds 
        var seconds = Math.round(this.timeDiff);
        ////console.log(seconds + " seconds");
    }
    onExperimental_design() {
        this.router.navigate(['/design'])
    }
    reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/projects_tree', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
    reloadComponent(path: [string]) {
        let currentUrl = this.router.url;
        ////console.log(currentUrl)
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(path);
    }

    onRemove(element:InvestigationInterface) {
        const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    // Remove only childs from the seleccted node
                    if (result.all_childs) {
                        this.globalService.remove_childs(this.model_key).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]) {
                                    ////console.log(data["message"])
                                    var message = "child nodes of " + element._id+ " have been removed from your history !!"
                                    this.alertService.success(message)
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                        window.location.reload();
                    }
                    //Remove only observed variable or experimental factors
                    // TODO add handler for observation units, biological materials, etc.
                    else if (result.only != "") {
                        ////console.log(result.only)
                        this.globalService.remove_childs_by_type(element._id, result.only).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]) {
                                    ////console.log(data["message"])
                                    var message = "child nodes of " + element._id + " have been removed from your history !!"
                                    //this.alertService.success(message)
                                    var datafile_ids = data["datafile_ids"]
                                    var removed_ids = data["removed_ids"]
                                    // datafile_ids.forEach(datafile_id => {
                                    //     this.globalService.remove_associated_headers_linda_id(datafile_id, removed_ids, 'data_files').pipe(first()).toPromise().then(
                                    //         data => { ////console.log(data); }
                                    //       )
                                    // //     this.globalService.update_associated_headers(element, this.update_associated_headers[filename], 'data_files').pipe(first()).toPromise().then(data => {////console.log(data);})
                                    // });
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                        // this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                        this.reloadComponent(['/projects_page'])
                        //window.location.reload();

                    }
                    else {
                        ////console.log(this.active_node.id)
                        this.globalService.remove(element._id).pipe(first()).toPromise().then(
                            data => {
                                ////console.log(data)
                                if (data["success"]) {
                                    ////console.log(data["message"])
                                    var message = element._id + " has been removed from your history !!"
                                    this.alertService.success(message)
                                    this.reloadComponent(['/projects_page'])
                                    //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                                    //window.location.reload();
                                    ///this.router.navigate(['/projects_tree']);
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    }
                }
            }
            //this.reloadComponent(['/projects'])
        });

    }

    add(template: boolean = false) {

        let user = JSON.parse(localStorage.getItem('currentUser'));
        if (template) {
            const dialogRef = this.dialog.open(TemplateSelectionComponent, { width: '500px', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: this.model_type, values: {}, parent_id: this.parent_id } });
            dialogRef.afterClosed().subscribe(result => {

                if (result) {
                    var keys = Object.keys(result.values);

                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(i, 1);
                            //var k=this.keys[i]
                            i--;
                        }
                    }
                    var new_values = {}
                    keys.forEach(attr => { new_values[attr] = result.values[attr] })
                    ////console.log(new_values)
                    this.globalService.add(new_values, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]) {
                                //////console.log(data["message"])
                                //this.model_id=data["_id"];
                                this.ngOnInit();
                                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " based on " + result.values['_id'] + " has been successfully integrated in your history !!"

                                this.alertService.success(message)
                                this.reloadComponent(['/projects_tree'])
                                // here probably mode edit to open project template page
                                //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });
                                return true;
                            }
                            else {
                                //////console.log(data["message"])
                                this.alertService.error("this form contains errors! " + data["message"]);

                                return false;
                                //this.router.navigate(['/studies']);
                            }
                        }
                    );
                }
            });
        }
        else {
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
            let new_investigation:Investigation=new Investigation()
            console.log(new_investigation)
            this.globalService.add(new_investigation, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
                data => {
                    if (data["success"]) {
                        console.log(data)
                        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type:'investigation', model_id: data['_id'], mode: "edit", activeTab: 'identifiers'  } });
                        //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });

                    }
                });;
        }

    }
    identify() {
        ////console.log('Hello, Im user tree!');
    }
    isArray(obj: any) {
        return Array.isArray(obj)
    }

    show_info() {
        this.displayed = true
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
    getStyle(node: MiappeNode): Object {

        if (node.id.includes('Investigations tree')) {

            return { backgroundColor: 'white', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (node.id.includes('studies')) {

            return { backgroundColor: '#b6b6b6', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (node.id.includes('investigations')) {

            return { backgroundColor: 'lightblue', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }

        else if (node.id.includes('events')) {

            return { backgroundColor: 'lightcoral', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (node.id.includes('metadata')) {

            return { backgroundColor: 'OldLace', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (node.id.includes('observed')) {

            return { backgroundColor: '#2E8B57', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }

        else if (node.id.includes('biological_materials')) {

            return { backgroundColor: '#72bcd4', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (node.id.includes('observation_units')) {

            return { backgroundColor: '#FF7F50', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else {
            return { backgroundColor: 'LightSteelBlue', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
    }

    getIconStyle(key: string): Object {
        if (key.includes('study')) {

            return { backgroundColor: '#b6b6b6', 'border-radius': '4px', 'float': 'left' }
        }
        else if (key.includes('event')) {

            return { backgroundColor: 'lightcoral', 'border-radius': '4px', 'float': 'left' }
        }
        else if (key.includes('observed_variable')) {

            return { backgroundColor: '#2E8B57', 'border-radius': '4px', 'float': 'left' }
        }
        else if (key.includes('material')) {

            return { backgroundColor: '#72bcd4', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
        }
        else if (key.includes('biological_material')) {

            return { backgroundColor: 'LightBlue', 'border-radius': '4px', 'float': 'left' }
        }
        else if (key.includes('observation_unit')) {

            return { backgroundColor: '#FF7F50', 'border-radius': '4px', 'float': 'left' }
        }
        else {
            return { backgroundColor: 'LightSteelBlue', 'border-radius': '4px', 'float': 'left' }
        }
    }
}