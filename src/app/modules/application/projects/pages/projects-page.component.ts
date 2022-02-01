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
import { TemplateSelectionComponent } from '../../dialogs/template-selection.component';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {

    @Input() search_string: string;
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
    private parent_key: string;
    private parent_id: string;
    private model_key: string;
    private model_selected: string
    public vertices: any = []
    public projects: any = []
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    dataTable: any;
    dtOptions: DataTables.Settings = {};
    tableData = [];
    private model_type: string = 'Investigation'

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
        // this.route.queryParams.subscribe(
        //     params => {
        //         this.parent_key = params['key'];
        //     }
        // );
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    private initialSelection = []
    private checklistSelection = new SelectionModel<MatChip>(true, this.initialSelection /* multiple */);

    public handlePageBottom(event: PageEvent) {
        this.paginator.pageSize = event.pageSize;
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.page.emit(event);
    }
    async ngOnInit() {

        await this.get_vertices()
        this.get_projects()

        this.loaded = true


        this.searchService.getData().subscribe(data => {
            ////console.log(data);
            //this.search_string=data
        })
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.parent_id = this.currentUser['_id']
        console.log(this.currentUser)
        //this.wizardService.onClickTour(this.vertices, this.currentUser)

    }
    async get_vertices() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        //////console.log(user)
        this.start();
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            //return this.globalService.get_all_vertices(user._key).subscribe(
            data => {
                console.log(data)
                this.end()
                this.vertices = data;
            }
        )
    }
    play_again() {
        this.wizardService.play_again(this.vertices, this.currentUser)
    }
    turn_off() {
        this.wizardService.turn_off(this.currentUser)
    }
    onDone() {
        this.wizardService.onDone(false, this.currentUser, this.vertices)
    }
    onClickTour(replay: boolean, level: string) {
        this.wizardService.onClickTour(this.vertices, this.currentUser, replay, level)
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
    selectedProjectChip(elem) {
        console.warn("a project has been selected")
        console.warn(elem)
    }
    get_projects() {
        var cpt = 0;
        console.log(this.vertices)
        let selected = [this.currentUser['_id']];
        let res = this.vertices.filter(({
            e
        }) => selected.includes(e['_from'])
        );

        console.log(res)
        res.forEach(
            r => {
                let project_id = r['s']['vertices'][1]["Investigation unique ID"]
                let short_name = r['s']['vertices'][1]["Short title"]
                this.projects.push({ "project_short_name": short_name, "project_id": project_id, "project_parent_id": this.currentUser['_id'] })
            }
        );
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
    onExperimental_design(node) {
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
    onEdit(elm: any) {
        console.log(elm)

    }
    onRemove() {
        // const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result) {
        //         if (result.event == 'Confirmed') {
        //             // Remove only childs from the seleccted node
        //             if (result.all_childs) {
        //                 this.globalService.remove_childs(this.active_node.id).pipe(first()).toPromise().then(
        //                     data => {
        //                         if (data["success"]) {
        //                             ////console.log(data["message"])
        //                             var message = "child nodes of " + this.active_node.id + " have been removed from your history !!"
        //                             this.alertService.success(message)
        //                         }
        //                         else {
        //                             this.alertService.error("this form contains errors! " + data["message"]);
        //                         }
        //                     }
        //                 );
        //                 window.location.reload();
        //             }
        //             //Remove only observed variable or experimental factors
        //             // TODO add handler for observation units, biological materials, etc.
        //             else if (result.only != "") {
        //                 ////console.log(result.only)
        //                 this.globalService.remove_childs_by_type(this.active_node.id, result.only).pipe(first()).toPromise().then(
        //                     data => {
        //                         if (data["success"]) {
        //                             ////console.log(data["message"])
        //                             var message = "child nodes of " + this.active_node.id + " have been removed from your history !!"
        //                             //this.alertService.success(message)
        //                             var datafile_ids = data["datafile_ids"]
        //                             var removed_ids = data["removed_ids"]
        //                             // datafile_ids.forEach(datafile_id => {
        //                             //     this.globalService.remove_associated_headers_linda_id(datafile_id, removed_ids, 'data_files').pipe(first()).toPromise().then(
        //                             //         data => { ////console.log(data); }
        //                             //       )
        //                             // //     this.globalService.update_associated_headers(element, this.update_associated_headers[filename], 'data_files').pipe(first()).toPromise().then(data => {////console.log(data);})
        //                             // });
        //                         }
        //                         else {
        //                             this.alertService.error("this form contains errors! " + data["message"]);
        //                         }
        //                     }
        //                 );
        //                 // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        //                 // this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
        //                 this.reloadComponent(['/projects_tree'])
        //                 //window.location.reload();

        //             }
        //             else {
        //                 ////console.log(this.active_node.id)
        //                 this.globalService.remove(this.active_node.id).pipe(first()).toPromise().then(
        //                     data => {
        //                         ////console.log(data)
        //                         if (data["success"]) {
        //                             ////console.log(data["message"])
        //                             var message = this.active_node.id + " has been removed from your history !!"
        //                             this.alertService.success(message)
        //                             let new_step = 0
        //                             if (!this.currentUser.tutoriel_done) {
        //                                 if (this.active_node.id.split("/")[0] === "investigations") {
        //                                     new_step = 0
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "studies") {
        //                                     new_step = 2
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "experimental_factors") {
        //                                     new_step = 4
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "observed_variables") {
        //                                     new_step = 6
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "biological_materials") {
        //                                     new_step = 8
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "biological_materials") {
        //                                     new_step = 10
        //                                 }
        //                                 else if (this.active_node.id.split("/")[0] === "data_files") {
        //                                     new_step = 12
        //                                 }
        //                                 else {
        //                                     new_step = 0
        //                                 }
        //                                 this.currentUser.tutoriel_step = new_step.toString()
        //                                 localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        //                             }
        //                             this.reloadComponent(['/projects_tree'])
        //                             //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
        //                             //window.location.reload();
        //                             ///this.router.navigate(['/projects_tree']);

        //                         }
        //                         else {
        //                             this.alertService.error("this form contains errors! " + data["message"]);
        //                         }
        //                     }
        //                 );
        //                 // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        //             }
        //         }
        //     }
        //     //this.reloadComponent(['/projects'])
        // });

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
            this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: this.model_type, mode: "create" } });
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