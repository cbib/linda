import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../../../models';
import { UserInterface } from 'src/app/models/linda/person';

/* function instanceOfStudy(object: any): object is StudyInterface {
    return object;
} */

@Component({
    selector: 'app-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

    @Input('level') level: number;
    @Input('parent_id') parent_id:string;
    @Input('model_id') model_id: string;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('activeTab') activeTab: string;
    @Input('mode') mode: string;
    @Input('role') role: string;
    @Input('group_key') group_key: string;
    public vertices: any = []
    public studies: any = []
    private loaded: boolean = false
    private currentUser:UserInterface
    private collection:string;

    projectForm:FormGroup
    startTime: Date;
    endTime: Date;
    timeDiff: number;

    constructor(private globalService: GlobalService, 
        private alertService: AlertService,
        private searchService: SearchService,
        private route: ActivatedRoute, 
        private router: Router,
        private _cdr: ChangeDetectorRef){
            console.log("entering project page")
            
            this.route.queryParams.subscribe(
                params => {
                    this.level = params['level'];
                    this.model_id = params['model_id'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.model_key= params['model_key']
                    this.model_type=params['model_type']
                    this.role=params['role']
                    this.group_key=params['group_key']
                    this.collection="investigations"
                }
            );
            console.warn("group key in project page", this.group_key)

    }

    async ngOnInit() {
        this.collection="investigations"
        console.log(this.collection)
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.parent_id = this.currentUser['_id']
        //this.model_key=this.model_id.split("/")[1]
        //await this.get_vertices()
        this.loaded = true
        console.log(this.model_type)
        console.log(this.model_id)
        this.projectForm = new FormGroup({})
        this.searchService.getData().subscribe(data => {
            ////console.log(data);
            //this.search_string=data
        })
        //this.wizardService.onClickTour(this.vertices, this.currentUser)
    }

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

    async get_vertices() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        //////console.log(user)
        this.globalService.start()
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            //return this.globalService.get_all_vertices(user._key).subscribe(
            data => {
                console.log(data)   
                this.globalService.end()
                this.vertices = data;
            }
        )
    }
    
    get get_parent_id(){
        return this.parent_id
    }
    get get_model_type(){
        return this.model_type
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
    get get_collection(){
        return this.collection
    }
    get_output_from_child(val:any){
        if (val === 'cancel the form'){
          console.log("Cancel form")
        }
        else{
            console.log(val)
            this.alertService.success("Changes have been successfully saved")
            

        }
    }
    submit(){
        //Go back to project pages
        
    }
    cancel(){
        //this.notify.emit("close_study")
        this.router.navigate(['/projects_page']);

        // Same as delete project and all childs 
    }
}
