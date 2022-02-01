import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import {  User } from '../../../../models';

@Component({
    selector: 'app-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

    @Input('level') level: number;
    @Input('parent_id') parent_id:string;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('mode') mode: string;
    public vertices: any = []
    public studies: any = []
    private loaded: boolean = false
    private currentUser:User
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    constructor(private globalService: GlobalService,
        private searchService: SearchService,
        private userService: UserService,
        private router: Router,
        private alertService: AlertService,
        private wizardService: WizardService,
        private route: ActivatedRoute){
            this.route.queryParams.subscribe(
                params => {
                    this.level = params['level'];
                    this.model_type = params['model_type'];
                    this.model_key = params['model_key'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                }
            );

    }
    async ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.parent_id = this.currentUser['_id']
        await this.get_vertices()
        this.get_studies()
        this.loaded = true
        this.searchService.getData().subscribe(data => {
            ////console.log(data);
            //this.search_string=data
        })

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
                this.studies.push({ "project_short_name": short_name, "project_id": project_id, "project_parent_id": this.currentUser['_id'] })
            }
        );
    }
    get get_mode(){
        return this.mode
    }
    get_output_from_child(val:any){
        if (val === 'cancel the form'){
          console.log("Cancel form")
        }
        else{
            console.log("Cancel form")

        }
      }
}
