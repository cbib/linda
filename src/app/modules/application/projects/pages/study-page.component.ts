import { Component, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {  User } from '../../../../models';
import { DataFileInterface } from 'src/app/models/linda/data_files';
import { UserInterface } from 'src/app/models/linda/person';

@Component({
    selector: 'app-study-page',
    templateUrl: './study-page.component.html',
    styleUrls: ['./study-page.component.css']
})
export class StudyPageComponent implements OnInit {

    @Input('level') level: number;
    @Input('parent_id') parent_id:string;
    @Input('model_id') model_id: string;
    @Input('model_type') model_type: string;
    @Input('model_key') model_key: string;
    @Input('activeTab') activeTab: string;
    @Input('mode') mode: string;
    @Input('role') role: string;
    @Input('group_key') group_key: string;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    public vertices: any = []
    public studies: any = []
    private loaded: boolean = false
    private currentUser:UserInterface
    projectForm:FormGroup
    startTime: Date;
    endTime: Date;
    timeDiff: number;

    constructor(private globalService: GlobalService,
        private searchService: SearchService,
        private userService: UserService,
        private router: Router,
        private alertService: AlertService,
        private wizardService: WizardService,
        private route: ActivatedRoute,
        private _cdr: ChangeDetectorRef){
            this.route.queryParams.subscribe(
                params => {
                    this.level = params['level'];
                    this.parent_id = params['parent_id']
                    this.model_id = params['model_id'];
                    this.model_type = params['model_type'];
                    this.model_key= params['model_key']
                    this.activeTab= params['activeTab']
                    this.mode = params['mode'];
                    this.role=params['role']
                    this.group_key=params['group_key']
                }
            );
            console.log(this.role)
            console.warn(this.role)
            console.log(this.role)
            console.warn("group key in study page", this.group_key)
            

    }
    async ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        ///this.parent_id = this.currentUser['_id']
        //this.model_key=this.model_id.split("/")[1]
        console.warn(this.level)
        console.warn(this.model_id)
        console.warn(this.mode)
        console.warn(this.parent_id)
        console.warn(this.model_type)
        console.warn(this.model_key)
        console.warn(this.role)
        console.warn(this.group_key)
        //await this.get_vertices()
        this.loaded = true
        //this.projectForm = new FormGroup({})
        /* this.searchService.getData().subscribe(data => {
            ////console.log(data);
            //this.search_string=data
        }) */

        //this.wizardService.onClickTour(this.vertices, this.currentUser)

    }
    /* async get_vertices() {
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
    } */

    ngAfterViewInit() {
        this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
            this._cdr.detectChanges()
        });
    }
    changeTab(tab:string){
        this.activeTab=tab
        console.log(this.activeTab)
    }
    get get_parent_id(){
        return this.parent_id
    }
    get get_mode(){
        return this.mode
    }
    get get_model_id(){
        return this.model_id
    }
    get get_model_key(){
        return this.model_key
    }
    get get_role(){
        return this.role
    }
    get get_group_key(){
        return this.group_key
    }
    get_output_from_child(val:any){
        if (val === 'cancel the form'){
          console.log("Cancel form")
        }
        else{
            console.log("Cancel form")
        }
    }
    
    submit(){
        
    }
    cancel(){
        //this.notify.emit("close_study")
        this.router.navigate(['/project_page'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type:'investigation', activeTab: 'assStud', mode: "edit" , role: this.get_role, group_key: this.group_key} });
        // Same as delete project and all childs 
    }
}