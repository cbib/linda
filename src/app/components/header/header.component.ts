import { Component , OnInit, Input} from '@angular/core';
import {GlobalService, SearchService, AuthenticationService } from '../../services';
import { MatDialog} from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SearchResultComponent } from '../../modules/application/dialogs/search-result.component';
import { Router } from '@angular/router';
import { User } from '../../models';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
    @Input() private _currentUser!: {};
  public get currentUser(): {} {
        return this._currentUser;
  }
  public set currentUser(value: {}) {
        this._currentUser = value;
  }
  title = 'LINDA';
  selected="Home";
  public stats = {};
  public stats_advanced = {};
  public vertice_data:any=[];
  public search_string:string=""
  constructor(private globalService : GlobalService, private searchService : SearchService,  public dialog: MatDialog,private authenticationService: AuthenticationService, private router: Router){
    console.log("Welcome in Header component")
    this.stats_advanced={
      "investigations":[],
      "studies":[],
      "experimental_factors":[],
      "environments": [],
      "metadata_files": [],
      "observation_units": [],
      "samples": [],
      "events": [],
      "data_files":[],
      "biological_materials":[],
      "observed_variables":[]
    }
    // this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    //     this.currentUser = user;
    // });
  }
  async ngOnInit() {
    console.log("Welcome in Header component")
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    await this.get_vertices()  
    /**
     * test modif
        * // TODO: here need to get same parameter as for edit fucntion in user tree
    */
     //let currentUser=JSON.parse(localStorage.getItem('currentUser'));
 
     
}
  onSearch(){
      this.searchService.startSearch(this.search_string).pipe(first()).toPromise().then(
          data=>{
              const dialogRef = this.dialog.open(SearchResultComponent, {width: '1000px', autoFocus: false, maxHeight: '90vh' , data: {search_type :this.search_string, model_id:"",values:data, parent_id:""}});
              dialogRef.afterClosed().subscribe(result => {
                  if (result){
                      var parent_id=result['parent_id']
                      var model_id=result['model_id']
                      var model_type=result['model_id'].split("/")[0]
                      var model_key=result['model_id'].split("/")[1]
                      if (model_type=="metadata_files"){
                          this.router.navigate(['/download'],{ queryParams: {parent_id: parent_id, model_key:model_key,model_type:"metadata_file",mode:"edit"}});
                      }
                      else{
                          if (model_type==='studies'){
                              model_type='study'
                          }
                          else{
                              model_type=model_type.slice(0, -1)
                          }    
                          this.router.navigate(['/generic_form'],{ queryParams: {level:"1", parent_id:parent_id, model_key:model_key,model_type:model_type,mode:"edit", inline:"false", asTemplate:false, onlyTemplate:false}, skipLocationChange: true});
                      }
                  }
              });
          } 
      );
  }
  user_page(){    
    this.router.navigate(['/profile']);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']); 
  }
  updateData(value: string) {
    this.searchService.updateData(value);
}

searchStart(event){
    this.search_string=event.target.value;
    //this.searchService.updateData(this.search_string);
}
set_percent_style(percent: any): Object {
    var percent_css=percent+"%"
    //style="width: 40%"
    return {width: percent_css}
}
//    identifyYourself() {
//        if (this.outslet && this.outlet.component) {
//            this.outlet.component.identify();
//        }
//    }

set_pending_task_background_color(id: any): Object {
    
    if (id.includes('Investigations tree')){
       
       return {backgroundColor: 'white'}
    }
    else if (id.includes('studies')){
        
       return {backgroundColor: 'white'}
    }
    else if(id.includes('investigations')){
        
        return {backgroundColor: 'white'}
    }
    else if(id.includes('events')){
        
        return {backgroundColor: 'white'}
    }
    else if(id.includes('metadata')){
        
        return {backgroundColor: 'white'}
    }
    else{
        return {backgroundColor: 'white'}
    } 
}

/* onActivate(componentReference:any) {        
    if(componentReference instanceof UserTreeComponent){
        console.log("This is a message from the UserTreeComponent");
        ///this.currentUser=JSON.parse(localStorage.getItem('currentUser'));
        this.get_vertices()
        return;
     }
     else{
        console.log("This is not the UserTreeComponent")
        //this.currentUser=JSON.parse(localStorage.getItem('currentUser'));
        ///console.log(this.currentUser)
        this.get_vertices()
        return;
     }
} */

get_vertices(){
    this.stats_advanced={
        "investigations":[],
        "studies":[],
        "experimental_factors":[],
        "environments": [],
        "metadata_files": [],
        "observation_units": [],
        "samples": [],
        "events": [],
        "data_files":[],
        "biological_materials":[],
        "observed_variables":[]
    }
    if (this.currentUser){
            return this.globalService.get_all_vertices(this.currentUser['_key']).toPromise().then(
                data => {
                    this.vertice_data=data;
                    this.vertice_data.forEach(
                        d => {
                            var stat_object={
                                'id':d["e"]["_to"],
                                'percent_fill':0,
                                'parent_id':d["e"]["_from"]
                            }
                            //this.stats[d["e"]["_to"].split("/")[0]]+=1
                            
                            var vertices:[]=d["s"]["vertices"]
                            vertices.forEach(
                                vertice => {
                                    var vertice_keys=Object.keys(vertice)
                                    var vertice_id=vertice["_id"]
                                    var total=0;
                                    for (var i = 0; i< vertice_keys.length; i++) {
                                        if (vertice[vertice_keys[i]]!==""){
                                            total+=1
                                        }                                
                                    } 
                                    var percent= Math.round(100 *((total-3)/(vertice_keys.length-3)))
                                    if (vertice_id===stat_object['id']){
                                        stat_object['percent_fill']=percent
                                    }
                                }
                            )
                            if (stat_object['percent_fill'] < 100){
                                this.stats_advanced[d["e"]["_to"].split("/")[0]].push(stat_object)
                            }

                        }
                    );
                }
            )
    }
}
}
