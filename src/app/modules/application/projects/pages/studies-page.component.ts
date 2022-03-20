import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
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
import { UserInterface } from 'src/app/models/linda/person';
import { PersonInterface } from 'src/app/models/linda/person';
import { Study } from 'src/app/models/linda/study';
import { StudyInterface } from 'src/app/models/linda/study';
import { instanceOfStudy } from 'src/app/models/linda/study';
import { ExperimentalDesign } from 'src/app/models/linda/experimental-design';
import { BlockDesign } from 'src/app/models/linda/experimental-design';
import { Replication } from 'src/app/models/linda/experimental-design';
import { PlotDesign } from 'src/app/models/linda/experimental-design';
import { RowDesign } from 'src/app/models/linda/experimental-design';
import { ShareProject } from '../../dialogs/share-project';




@Component({
    selector: 'app-studies-page',
    templateUrl: './studies-page.component.html',
    styleUrls: ['./studies-page.component.css']
})
export class StudiesPageComponent implements OnInit {

    @Input() search_string: string;
    @Input('parent_id') parent_id: string;
    @Input('group_key') group_key: string;
    @Input('role') role: string;
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    contextMenuPosition = { x: '0px', y: '0px' };
    userMenuPosition = { x: '0px', y: '0px' };
    userMenusecondPosition = { x: '0px', y: '0px' };
    investigationMenuPosition = { x: '0px', y: '0px' };
    helpMenuPosition = { x: '0px', y: '0px' };

    // public statistics: {};
    private displayed = false;
    loaded: boolean = false
    private currentUser: UserInterface
    private multiple_selection: boolean = false;
    private parent_key: string;
    private model_selected: string
    public vertices: any = []
    public studies: any = []
    private roles: { study_id: string, role: string }[] = []


    startTime: Date;
    endTime: Date;
    timeDiff: number;
    dataTable: any;
    dtOptions: DataTables.Settings = {};
    tableData = [];
    private model_type: string = 'study'
    private dataSource: MatTableDataSource<StudyInterface>;
    private displayedColumns: string[] = ['Study unique ID', 'Study description', 'edit'];


    constructor(
        private globalService: GlobalService,
        private searchService: SearchService,
        private userService: UserService,
        private router: Router,
        private alertService: AlertService,
        private wizardService: WizardService,
        private route: ActivatedRoute,
        public media: MediaObserver,
        public dialog: MatDialog
    ) {
        this.route.queryParams.subscribe(
            params => {
                this.parent_id = params['parent_id'];
                this.group_key = params['group_key'];
                this.role == params['role'];
            }
        );
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.warn("group key in studies page", this.group_key)
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
        this.get_studies()
        this.loaded = true
        this.searchService.getData().subscribe(data => {
            ////console.log(data);
            //this.search_string=data
        })
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //console.log(this.currentUser)
        console.log(this.parent_id)
        //this.extract_design(36,7,3)
        //this.wizardService.onClickTour(this.vertices, this.currentUser)

    }
    async get_vertices() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        //////console.log(user)
        this.globalService.start();
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            //return this.globalService.get_all_vertices(user._key).subscribe(
            data => {
                console.log(data)
                this.globalService.end()
                this.vertices = data;
            }
        )
    }
    get_user_role(element: StudyInterface): string {
        return this.roles.filter(inv => inv.study_id == element._id)[0]['role']
    }
    get get_role() {
        return this.role
    }
    get get_group_key() {
        return this.group_key
    }
    async get_studies() {
        //return this.globalService.get_childs('investigations',this.parent_id.split('/')[1]).toPromise().then(
        return this.userService.get_person_id(this.currentUser._key).toPromise().then(
            async person_id => {
                console.log(person_id)
                const data = await this.globalService.get_studies(this.parent_id.split('/')[1], person_id[0].split("/")[1]).toPromise();
                console.log(data);
                this.roles = data.map(study => study['roles']);
                const studies = data.map(study_1 => study_1['study']);
                this.dataSource = new MatTableDataSource(studies);
                console.log(this.dataSource);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        )
    }

    // Event handler
    onEdit(elem) {
        console.warn("a study has been selected")
        console.warn(elem)
        //this.notify.emit(elem)
        let role = this.roles.filter(inv => inv.study_id == elem._id)[0]['role']
        this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: elem['_key'], model_id: elem['_id'], model_type: this.model_type, mode: "edit", activeTab: "studyinfo", role: role, group_key: this.group_key } });

    }
    onNext(node: string) {
        ////console.log(node)
    }
    onRemove(element: StudyInterface) {
        const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    // Remove only childs from the seleccted node
                    if (result.all_childs) {
                        this.globalService.remove_childs(element._key).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]) {
                                    ////console.log(data["message"])
                                    var message = "child nodes of " + element._id + " have been removed from your history !!"
                                    this.alertService.success(message)
                                    //this.reloadComponent()
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', activeTab: 'assStud', mode: "edit", role: this.role, group_key: this.group_key } });

                        //window.location.reload();

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
                                    //this.reloadComponent()

                                    //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: this.parent_id.split("/")[1], model_type:'investigation', model_id: this.parent_id, mode: "edit" , activeTab: 'assStud' } });
                                    //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: this.parent_id.split("/")[1], model_type:'investigation', model_id: this.parent_id, mode: "edit" , activeTab: 'assStud' } });
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
                        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', activeTab: 'assStud', mode: "edit", role: this.role, group_key: this.group_key } });

                        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                        //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                        ///window.location.reload();
                        ///this.reloadComponent(['/studies_page'])
                        //window.location.reload();

                    }
                    else {
                        ////console.log(this.active_node.id)
                        this.globalService.remove(element._id).pipe(first()).toPromise().then(
                            data => {
                                ////console.log(data)
                                if (data["success"]) {
                                    console.log(data["message"])
                                    var message = element._id + " has been removed from your history !!"
                                    this.alertService.success(message)

                                    //window.location.reload();
                                    this.reloadComponent()
                                    //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type:'investigation', activeTab: 'assStud', mode: "edit" , role: this.role  , group_key: this.group_key} });

                                    //this.router.navigate(['/projects_page'], { queryParams: { key: this.parent_key } });
                                    //window.location.reload();
                                    ///this.router.navigate(['/projects_tree']);
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', activeTab: 'assStud', mode: "edit", role: this.role, group_key: this.group_key } });

                        //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: this.parent_id.split("/")[1], model_type:'investigation', model_id: this.parent_id, mode: "edit" , activeTab: 'assStud' } });

                        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    }

                }
            }
            //this.reloadComponent(['/projects'])
        });

    }
    onAdd(template: boolean = false) {

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
        let new_study: Study = new Study()
        console.log(new_study)
        console.log(this.model_type)
        console.log(this.parent_id)
        this.globalService.add(new_study, this.model_type, this.parent_id, false, this.group_key).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    console.log(data)

                    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: data['_id'].split("/")[1], model_type: 'study', model_id: data['_id'], mode: "edit", activeTab: 'studyinfo', role: "owner", group_key: this.group_key } });
                    //this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });
                }
            });;
    }

    onShare(element: StudyInterface) {
        console.log(this.currentUser)
        console.log("Add dialog for share project with authentified users - or same group users")
        const dialogRef = this.dialog.open(ShareProject, { width: '500px', data: { model_id: element._id } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                var guest_person: PersonInterface = result['person']
                console.log(guest_person['_id'])
                console.log(element._id)
                // create new edge doccument in users_edge

                this.globalService.add_edge(element._id, guest_person['_id'], "reader").pipe(first()).toPromise().then(
                    data => {
                        if (data["success"]) {
                            console.log(data["_id"])
                            var message = "A new study " + data["_id"] + " has been successfully shared with " + guest_person['Person name'] + " !!"
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

    identify() {
        ////console.log('Hello, Im user tree!');
    }
    isArray(obj: any) {
        return Array.isArray(obj)
    }
    get_output_from_child(val: any) {
        if (val === 'cancel the form') {
            console.log("Cancel form")
        }
        /* else if (val === 'close_study'){
            delete this.selected_study
        }
        else if (instanceOfStudy(val)){
            this.selected_study=val
            console.log(this.selected_study)
        } */
        else {
            console.log(val)
            this.alertService.success("Changes have been successfully saved")
        }
    }
    activate_multiple_selection(val: boolean) {
        this.multiple_selection = val;
        var selected_set = this.checklistSelection.selected
    }
    show_info() {
        this.displayed = true
    }
    reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/projects_tree', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
    reloadComponent() {
        let currentUrl = this.router.url;
        ////console.log(currentUrl)
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        //this.router.navigate(path);
        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: this.parent_id.split("/")[1], model_type: 'investigation', model_id: this.parent_id, mode: "edit", activeTab: 'assStud', role: this.role, group_key: this.group_key } });
    }
    extract_design(_blocks: number, _columns: number, _rows: number) {
        let blocks = _blocks
        let columns = _columns
        let rows = _rows
        let new_design: ExperimentalDesign = new ExperimentalDesign()
        var replication: Replication = new Replication()
        replication.set_replicate_number(3)
        new_design.set_replication(replication)
        new_design.set_number_of_entries(blocks * columns * rows)

        var plot = 1
        for (let block = 1; block < blocks + 1; block++) {
            var block_design: BlockDesign = new BlockDesign(block, 36)
            for (let column = 1; column < columns + 1; column++) {
                var plot_design: PlotDesign = new PlotDesign()
                plot_design.set_column_number(column)
                for (let row = 1; row < rows + 1; row++) {
                    plot++
                    plot_design.set_plot_number(plot)
                    var row_design: RowDesign = new RowDesign()
                    row_design.set_row_number(row)
                    row_design.set_row_per_plot(rows)
                    plot_design.add_row_design(row_design)
                }
                block_design.add_plot_design(plot_design)
            }
            console.log(block_design)
            new_design.add_block_design(block_design)
        }
        console.log(new_design)
        console.log(new_design.get_block_design(4))
    }
    /* get_studies() {
        var cpt = 0;
        console.log(this.vertices)
        let selected = [this.parent_id];
        let res = this.vertices.filter(({
            e
        }) => selected.includes(e['_from'])
        );
        res.forEach(
            r => {
                console.log(r['e']['_to'])
                console.log(r['s']['vertices'])
                
                let found_vertices=r['s']['vertices']
                let res2= found_vertices.filter(vertice => vertice['_id']===r['e']['_to'])[0];
                console.log(res2)
                let study_linda_id = res2["_id"]
                let study_id = res2["Study unique ID"]
                let short_name = res2["Study Name"]
                console.log(study_id)
                console.log(short_name)
                this.studies.push({ "study_short_name": short_name, "study_id": study_id, "_id":study_linda_id,"study_parent_id": this.parent_id })
                console.log(this.studies)
            }
        );
    } */
    // Getters
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
    get get_parent_id() {
        return this.parent_id
    }
    get get_displayedColumns() {
        return this.displayedColumns
    }
    get get_dataSource() {
        return this.dataSource
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
    get get_currentUser(): UserInterface {
        return this.currentUser
    }
    /*     play_again() {
        this.wizardService.play_again(this.vertices, this.currentUser)
    }
    turn_off() {
        this.wizardService.turn_off(this.currentUser)
    }
    onDone() {
        this.wizardService.onDone(false, this.currentUser, this.vertices)
    } */
    /* onClickTour(replay: boolean, level: string) {
        this.wizardService.onClickTour(this.vertices, this.currentUser, replay, level)
    } */
}