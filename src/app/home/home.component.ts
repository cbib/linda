import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    keys:any = [];
    
    investigations:any = [];

    constructor(

        private router: Router) 
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
    }

    ngOnInit() {
        //this.loadAllUsers();
        //this.loadAllInvestigations();
        //this.load_keys();
    }
//    addInvestigationOnClick(){
//        let user=JSON.parse(localStorage.getItem('currentUser'));
//        //this.router.navigate(['/investigations'],{ queryParams: {level:"1"}});
//        this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id:user._id, model_type:"investigation"}});
//        
//    }
//    
//    showInvestigation(key : string){
//
//        this.router.navigate(['/investigation/'],{ queryParams: { key:  key} });
//    }
//    deleteInvestigation(key : string){
//        //this.globalService
//
//        this.router.navigate(['/investigation/'],{ queryParams: { key:  key} });
//    }

//    deleteUser(id: string) {
//        this.userService.delete(id).pipe(first()).subscribe(() => { 
//            this.loadAllUsers() 
//        });
//    }
//    private loadAllInvestigations(){
//        this.investigations=[];
//        console.log("loading")
//        let user=JSON.parse(localStorage.getItem('currentUser'));
//        console.log(user._key)
//        this.investigationService.getInvestigations(user._key).toPromise().then(
//            data => {
//                //console.log(data);
//                this.investigations=data;
//                for( var i = 0; i < this.investigations.length; i++){ 
//                    //console.log(this.investigations[i])
//                    var keys=Object.keys(this.investigations[i]);
//                    keys.forEach(attr => {
//                        //console.log(this.investigations[i][attr].length)
//                        if (attr.includes("description") || attr.includes("title")){
//                            //console.log(this.investigations[i][attr].substring(0,8))
//                            this.investigations[i][attr]=this.investigations[i][attr].substring(0,20)+"[.....]"//+this.investigations[i][attr].substring(this.investigations[i][attr].length-10,this.investigations[i][attr].length)
//                        }
//                    });
//                    //this.investigations[i]=JSON.parse(JSON.stringify(this.investigations[i], ["Investigation unique ID","Investigation description","Investigation title","Submission date","Public release date"]))
//                    //console.log(this.investigations[i])
//
//                    
//                }
//                
//                
//                
//            }
//        );  
//    }
//    
//    private load_keys(){
//        this.keys=["Investigation unique ID","Investigation description","Investigation title","Submission date","Public release date"]
////        this.globalService.get_model('investigation').toPromise().then(data => {
////            this.keys=Object.keys(data);
////            for( var i = 0; i < this.keys.length; i++){ 
//////                if (this.keys[i].startsWith("Investigation unique")){
//////                    this.keys.push(this.keys[i])
//////                }
////                if ( this.keys[i].startsWith("_") || this.keys[i].startsWith("Definition") || this.keys[i].startsWith("License") || this.keys[i].startsWith("MIAPPE")|| this.keys[i].startsWith("Associated")) {
////                    this.keys.splice(i, 1);
////                    i--;
////                }
////                
////                
////            }
////            
////            this.keys=JSON.parse(JSON.stringify(this.keys, ["Investigation unique ID","Investigation description","Investigation title","Submission date","Public release date"]))
////            console.log(this.keys)
////        });
//    }
//    
//    private loadAllUsers() {
//        this.userService.getAll().pipe(first()).subscribe(users => { 
//            this.users = users; 
//        });
//    }
}