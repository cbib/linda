import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models';
import { Subscription } from 'rxjs';
import { AdService, AuthenticationService,GlobalService } from '../../../services';
import {AdItem } from '../../../banners/ad-item'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JoyrideService} from 'ngx-joyride';
import {MatChipsModule} from '@angular/material/chips'
import { MatChipList } from '@angular/material/chips';
import { UserInterface } from 'src/app/models/linda/person';

@Component({templateUrl: './home.component.html',
styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
    @ViewChild(MatChipList, { static: false }) chipsList: MatChipList;
    currentUserSubscription: Subscription;
    ads: AdItem[];
    step3 = false;
    step4 = false;
    currentUser: UserInterface;
    selected = "";
    startTime: Date;
    endTime: Date;
    timeDiff: number;
    public vertices: any = []
    public projects: any  = []

    constructor(private router: Router, private authenticationService: AuthenticationService,private globalService: GlobalService, private adService: AdService, private readonly joyrideService: JoyrideService) {
        //this.currentUser = this.authenticationService.currentUserValue;
        //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("Hello from home page")
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
             this.currentUser = user;
        });
        if (this.currentUser['tutoriel_checked'] === false){
            this.onClick()
            // this.joyrideService.startTour(
            //     { steps: ['step6@tree', 'step8@tree', 'step8_1@tree'], stepDefaultPosition: 'bottom'} // Your steps order
            //     );
        }  
    }
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }
    
    async ngOnInit() {
        // var image_path=window.location.href+'assets/images/cbib.jpg'
        this.ads = this.adService.getAds();
        await this.get_vertices()
        this.get_projects()

    }
    async get_vertices() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        this.start();
        return this.globalService.get_all_vertices(user._key).toPromise().then(
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
        console.log("Elapsed time :" + this.timeDiff+ " seconds")
        // get seconds 
        var seconds = Math.round(this.timeDiff);
        console.log(seconds + " seconds");
    } 
    // public onClick(): void {
    //     this.guidedTourService.startTour(this.LindaTour);
    // }
    onClick() {
         this.joyrideService.startTour(
            { steps: ['StepZero', 'firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep'], stepDefaultPosition: 'center'} // Your steps order
         );
     }
     onDone(){
         this.router.navigate(['/projects_tree'])
     }
     selectedUserChip(event) {
        this.selected = event;
      }

    selectedProjectChip(event) {
        this.selected = event;
    }
    start_linda(){
         this.router.navigate(['/projects_tree']);
    }

    get_projects(){
        var cpt = 0;
        this.vertices.forEach(
            e => {
                var _from: string;
                var _to: string;

                _from = e["e"]["_from"]
                _to = e["e"]["_to"]
                
                var vertices: [] = e["s"]["vertices"]
                
                var parent_id:string = e["e"]["_from"]
                var percent = 0.0
                var short_name = ""
                vertices.forEach(
                    vertice => {
                        if (vertice['_id'] === _to) {
                            var vertice_keys = Object.keys(vertice)
                            var total = 0
                            for (var i = 0; i < vertice_keys.length; i++) {
                                if (vertice[vertice_keys[i]] !== "") {
                                    total += 1
                                }
                            }
                            percent = Math.round(100 * ((total - 3) / (vertice_keys.length - 3)))
                            if (parent_id.includes('investigation')){
                                short_name = vertice['Project Name']
                            }
                            else{
                                short_name = vertice['Study Name']
                            }
                        }
                    }
                )
                if (short_name === "" || short_name === undefined) {
                    short_name = _to
                }

                var vertice_data= vertices.filter(component => component['_id'] == _to)[0]
                var vertice_data_keys = Object.keys(vertice_data).filter(component => !component.startsWith("_"))
                
                if (parent_id.includes("users")) {
                        this.projects.push({"project_short_name":short_name,"project_id":_to,"project_parent_id":parent_id, "vertice_data":vertice_data})
                }
                cpt += 1
            }
        )
    }
}