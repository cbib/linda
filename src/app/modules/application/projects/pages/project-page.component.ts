import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../../../models';

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
    public vertices: any = []
    public studies: any = []
    private loaded: boolean = false
    private currentUser:User

    projectForm:FormGroup
    startTime: Date;
    endTime: Date;
    timeDiff: number;

    constructor(private globalService: GlobalService, private alertService: AlertService,
        private searchService: SearchService,
        private route: ActivatedRoute, private _cdr: ChangeDetectorRef){
            console.log("entering project page")
            
            this.route.queryParams.subscribe(
                params => {
                    this.level = params['level'];
                    this.model_id = params['model_id'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.model_key= params['model_key']
                    this.model_type=params['model_type']
                }
            );

    }

    async ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.parent_id = this.currentUser['_id']
        //this.model_key=this.model_id.split("/")[1]
        
        //await this.get_vertices()
       // this.get_studies()
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
    get_studies() {
        var cpt = 0;
        console.log(this.vertices)
        let selected = [this.model_id];
        let res = this.vertices.filter(({
            e
        }) => selected.includes(e['_from'])
        );
        res.forEach(
            r => {           
                let found_vertices=r['s']['vertices']
                let res2= found_vertices.filter(vertice => vertice['_id']===r['e']['_to']
                );
                let study_id = res2["Study unique ID"]
                let short_name = res2["Study Name"]
                this.studies.push({ "study_short_name": short_name, "study_id": study_id, "study_parent_id": this.model_id })
            }
        );
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
        // Same as delete project and all childs 
    }
}
