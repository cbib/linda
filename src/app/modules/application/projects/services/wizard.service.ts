import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Constants } from "../../../../constants";
import { GlobalService, AlertService } from '../../../../services';
import { User } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { PersonInterface } from 'src/app/models/linda/person';


@Injectable({
    providedIn: 'root'
})
export class WizardService {
    private APIUrl: string;
    private currentUser:PersonInterface
    constructor(private httpClient: HttpClient,
        private globalService: GlobalService,
        private alertService: AlertService,
        private readonly joyrideService: JoyrideService,
        private router: Router
        ) {
        this.APIUrl = Constants.APIConfig.APIUrl;
        //this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
        //console.log(this.currentUser)
    }
    turn_off(currentUser:PersonInterface){
        this.globalService.update_user(true, currentUser['_key'], 'tutoriel_done', 'person').toPromise().then(
            data => {
                ////console.log(data['user'])
                localStorage.setItem('currentUser', JSON.stringify(data['user']));
        });
    }
    play_again(vertices, currentUser:PersonInterface){
        console.log("Play tutorial again !! ")
        // delete all investigations
        this.globalService.check_one_exists("Investigation unique ID", "Maizes1", "investigation").pipe(first()).toPromise().then(
            result => {
                //console.log(result)
                if (!result["success"]){
                    this.globalService.remove(result["_id"]).pipe(first()).toPromise().then(
                        data => {
                            //console.log(data)
                            if (data["success"]) {
                                //console.log(data["message"])
                                var message = result["_id"] + " has been removed from your history !!"
                                this.alertService.success(message)
                                if (!currentUser.tutoriel_done){
                                    let new_step=0
                                    currentUser.tutoriel_step=new_step.toString()
                                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                                    
                                    this.reloadComponent(['/projects_tree'])
                                }
                                else{
                                    this.globalService.update_user(false, currentUser['_key'], 'tutoriel_done', 'person').toPromise().then(
                                        data => {
                                            //console.log(data['user'])
                                            localStorage.setItem('currentUser', JSON.stringify(data['user']));
                                            this.reloadComponent(['/projects_tree'])
                                    });
                                }
                                   
                                
                            }
                            else {
                                this.alertService.error("this form contains errors! " + data["message"]);
                                this.reloadComponent(['/projects_tree'])  
                                this.onDone(vertices,currentUser,  true)
                            }
                        }
                    );
                }
                else{
                    this.globalService.update_user(false, currentUser['_key'], 'tutoriel_done', 'person').toPromise().then(
                        user_data => {
                            this.globalService.update_step("0", currentUser['_key'], 'tutoriel_step', 'person').toPromise().then(
                                data => {
                                    //console.log(data['user'])
                                    localStorage.setItem('currentUser', JSON.stringify(data['user']));
                                    //let new_step=0
                                    //currentUser.tutoriel_step=new_step.toString()
                                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                                    this.reloadComponent(['/projects_tree'])
                                    this.onDone(vertices, currentUser, true)
                                }
                            );
                    });

                }
            }
        );
        //this.onClickTour()
    }
    reloadComponent(path:[string]) {
        let currentUrl = this.router.url;
        ////console.log(currentUrl)
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(path);
    }
    onDone(vertices, currentUser:PersonInterface, mode_replay=false ) {
        if (mode_replay){
            this.onClickTour(vertices,currentUser, true,"0")
        }
        else{
            if (currentUser['tutoriel_step'] === "16"){
                this.globalService.update_user(true, currentUser['_key'], 'tutoriel_done', 'person').toPromise().then(
                    data => {
                        ////console.log(data['user'])
                        localStorage.setItem('currentUser', JSON.stringify(data['user']));
                });
            }
        }
    }
    onClickTour(vertices, currentUser:PersonInterface, replay:boolean=false, level:string="0") {
     // //console.log(currentUser)
        if (!currentUser['tutoriel_done']){
            if (vertices.length===0){
                currentUser.tutoriel_step="0"
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            ////console.log(currentUser)
            if (currentUser['tutoriel_step'] === "0"){
                ////console.log('start tour part 1 : Add an investigation')
                this.joyrideService.startTour(
                    { steps: ['step_overview', 'node_Root', 'pl_Root', 'nextStep', 'plus_Root'], stepDefaultPosition: 'center'} // Your steps order
                    );
                // currentUser.tutoriel_step="1"
                // localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            //'stepButtonExportCSV', 'stepButtonEdit','stepButtonRemove', 'stepButtonAdd', 'stepButtonAssign',
            if (currentUser['tutoriel_step'] === "2"){
                this.joyrideService.startTour(
                    { steps: ['node_investigation','pl_investigation',  'nextStep', 'plus_investigation'], stepDefaultPosition: 'center'} // Your steps order
                );
                // currentUser.tutoriel_step="3"
                // localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "4"){
                this.joyrideService.startTour(
                    { steps: ['node_study','pl_study', 'nextStep', 'plus_study'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "6"){
                this.joyrideService.startTour(
                    { steps: ['node_experimental_factor','pl_experimental_factor', 'nextStep', 'plus_study'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "8"){
                this.joyrideService.startTour(
                    { steps: ['node_observed_variable','pl_observed_variable', 'nextStep', 'plus_study'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "10"){
                this.joyrideService.startTour(
                    { steps: ['node_biological_material','pl_biological_material','nextStep', 'plus_study'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "12"){
                this.joyrideService.startTour(
                    { steps: ['node_observation_unit','nextStep', 'plus_investigation'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "14"){
                this.joyrideService.startTour(
                    { steps: ['node_data_file','nextStep', 'plus_investigation'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            if (currentUser['tutoriel_step'] === "16"){
                this.joyrideService.startTour(
                    { steps: ['stepNode','nextStep'], stepDefaultPosition: 'center'} // Your steps order
                );
                //currentUser.tutoriel_step="3"
                //localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

        }
        else{
            if (replay){
                ////console.log(level)
                if ( level === "0"){
                    ////console.log('start tour part 1 : Add an investigation')
                    this.joyrideService.startTour(
                        { steps: ['node_Root', 'pl_Root'], stepDefaultPosition: 'center'} // Your steps order
                        );
                    // currentUser.tutoriel_step="1"
                    // localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                //'stepButtonExportCSV', 'stepButtonEdit','stepButtonRemove', 'stepButtonAdd', 'stepButtonAssign',
                if ( level === "2"){
                    this.joyrideService.startTour(
                        { steps: ['node_investigation','pl_investigation'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    // currentUser.tutoriel_step="3"
                    // localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "4"){
                    this.joyrideService.startTour(
                        { steps: ['node_study','pl_study'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "6"){
                    this.joyrideService.startTour(
                        { steps: ['node_experimental_factor','pl_experimental_factor'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "8"){
                    this.joyrideService.startTour(
                        { steps: ['node_observed_variable','pl_observed_variable'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "10"){
                    this.joyrideService.startTour(
                        { steps: ['node_biological_material','pl_biological_material'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "12"){
                    this.joyrideService.startTour(
                        { steps: ['node_observation_unit'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "14"){
                    this.joyrideService.startTour(
                        { steps: ['node_data_file'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                if ( level === "16"){
                    this.joyrideService.startTour(
                        { steps: ['stepNode','nextStep'], stepDefaultPosition: 'center'} // Your steps order
                    );
                    //currentUser.tutoriel_step="3"
                    //localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }
            ////console.log("you have already done the Tutorial")

        } 
            // if (this.vertices.length===0){
            //     this.joyrideService.startTour(
            //     { steps: ['step_add_first_investigation', 'step8', 'step8_1'], stepDefaultPosition: 'center'} // Your steps order
            //     );
            // }
            // else{
            //     ////console.log(this.vertices)
            //     let lowest_node_type=this.vertices[this.vertices.length -1]["e"]["_to"].split("/")[0]
            
            //     if(lowest_node_type==="experimental_factors" || lowest_node_type==="observed_variables"){
            //         this.joyrideService.startTour(
            //             { steps: ['step8','step8_1', 'step8_3', 'step8_4','step8_5', 'step8_6' ], stepDefaultPosition: 'center'} // Your steps order
            //         );
            //     }
            //     else if(lowest_node_type==="studies"){
            //         this.joyrideService.startTour(
            //             { steps: ['step8','step8_1', 'step8_3', 'step8_4','step8_5', 'step8_6'], stepDefaultPosition: 'center'} // Your steps order
            //         );
            //     }
            //     else{
            //         this.joyrideService.startTour(
            //             { steps: ['step8','step8_1', 'step8_2', 'step8_3', 'step8_4','step8_5', 'step8_6'], stepDefaultPosition: 'center'} // Your steps order
            //         );
            //     } 
            // }  
        
    }
}