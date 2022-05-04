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
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort'
import { MatTableDataSource} from '@angular/material/table';
import { first } from 'rxjs/operators';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { UserInterface } from 'src/app/models/linda/person';
import { PersonInterface } from 'src/app/models/linda/person';

@Component({
    selector: 'app-persons-page',
    templateUrl: './persons-page.component.html',
    styleUrls: ['./persons-page.component.css'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class PersonsPageComponent implements OnInit {

    @Input() search_string: string;
    @Input('parent_id') parent_id: string;
    @Input('model_id') model_id: string;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('activeTab') activeTab: string;
    @Input('role') role: string;
    @Input('group_key') group_key: string;
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    contextMenuPosition = { x: '0px', y: '0px' };
    userMenuPosition = { x: '0px', y: '0px' };
    userMenusecondPosition = { x: '0px', y: '0px' };
    investigationMenuPosition = { x: '0px', y: '0px' };
    helpMenuPosition = { x: '0px', y: '0px' };

    // public statistics: {};
    private displayed = false;
    loaded: boolean = false
    private currentUser:UserInterface
    private multiple_selection: boolean = false;
    //private model_key: string;
    private model_selected: string
    public vertices: PersonInterface[] = []
    public projects: any = []
    //private dataSource
    private dataSource: MatTableDataSource<PersonInterface>;
    expandedElement: PersonInterface | null;
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    dataTable: any;
    dtOptions: DataTables.Settings = {};
    tableData = [];
    //private model_type: string = 'investigation'
    private displayedColumns: string[] = ['Person name', 'Person email', 'Person role', 'Person affiliation'];

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
              this.model_id = params['model_id'];
              this.parent_id = params['parent_id']
              this.model_key = params['model_key']
              this.model_type = params['model_type']
              this.role = params['role']
              this.group_key = params['group_key']
      
            }
          );
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.dataSource = new MatTableDataSource([]);
        //console.log(this.model_id)
        //await this.get_vertices()
        this.get_all_persons()
        this.loaded = true
        
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
       
        this.searchService.getData().subscribe(data => {
            //////console.log(data);
            this.search_string=data
        })
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._cdr.detectChanges()
    }
    onRoleChanged(event){
        event.target.value

    }
    async get_all_persons() {
        //console.log(this.model_id.split('/')[1])
        if(this.model_id.split('/')[0]==="investigations"){
            return this.globalService.get_all_project_persons(this.model_id.split('/')[1]).toPromise().then(
                data => {
                    //console.log(data)
                    this.dataSource = new MatTableDataSource(data);
                    console.log(this.dataSource.data)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._cdr.detectChanges();
                    this.loaded = true
                }
            )
        }
        else{
            return this.globalService.get_all_study_persons(this.model_id.split('/')[1]).toPromise().then(
                data => {
                    //console.log(data)
                    this.dataSource = new MatTableDataSource(data);
                    //console.log(this.dataSource)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._cdr.detectChanges();
                    this.loaded = true
                }
            )
        }
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

    

    
    onEdit(elem:PersonInterface) {
        //console.log("on Edit")
    }
    activate_multiple_selection(val: boolean) {
        this.multiple_selection = val;
        var selected_set = this.checklistSelection.selected
    }
    onNext(node: string) {
        //////console.log(node)
    }
    reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/projects_tree', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
    reloadComponent(path: [string]) {
        let currentUrl = this.router.url;
        //////console.log(currentUrl)
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(path);
    }
    onRemove(element:PersonInterface) {

        
    }


    add(template: boolean = false) {

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
    get get_currentUser():UserInterface{
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