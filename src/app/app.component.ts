import { Component,ViewEncapsulation, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {GlobalService, SearchService } from './services';
import { UserTreeComponent } from './user-tree/user-tree.component';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { first } from 'rxjs/operators';
import { MatDialog} from '@angular/material/dialog';
import { SearchResultDialogComponent } from './dialog/search-result-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linda',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
  
})
export class AppComponent implements OnInit {
    //@ViewChild(RouterOutlet) outlet;
    //@ViewChild(RouterOutlet) outlet!: RouterOutlet;
    //@ViewChild(RouterOutlet, { static: false }) outlet;
    //@ViewChild('outlet', { static: false })
    //@ViewChild('outlet', { static: false }) outlet: RouterOutlet;
    title = 'LINDA';
    selected="Home";
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    public stats = {};
    public stats_advanced = {};
    public vertice_data:any=[];
    public search_string:string=""
  
    // ngAfterViewInit() {
    //     console.log("ngAfterViewInit parent with child = ", this.outlet);
    //   }
    constructor(private globalService : GlobalService,private searchService : SearchService, public dialog: MatDialog, private router: Router,){
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
    }
    async ngOnInit() {
          //await this.get_vertices()  
        /**
         * test modif
            * // TODO: here need to get same parameter as for edit fucntion in user tree
        */
     
    }
    onSearch(){
        this.searchService.startSearch(this.search_string).pipe(first()).toPromise().then(
            data=>{
                console.log(data)
                const dialogRef = this.dialog.open(SearchResultDialogComponent, {width: '500px', autoFocus: false, maxHeight: '90vh' , data: {search_type :this.search_string, model_id:"",values:data, parent_id:""}});
                dialogRef.afterClosed().subscribe(result => {
                    if (result){
                        console.log(result)
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
                            this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id:parent_id, model_key:model_key,model_type:model_type,mode:"edit"}});

                        }
                    }

                
                });

            } 
        );
    }
    updateData(value: string) {
        this.searchService.updateData(value);
    }

    searchStart(event){
        this.search_string=event.target.value;
        //console.log(this.search_string)
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
            
           return {backgroundColor: 'Gainsboro'}
        }
        else if(id.includes('investigations')){
            
            return {backgroundColor: 'lightblue'}
        }
        else if(id.includes('events')){
            
            return {backgroundColor: 'lightyellow'}
        }
        else if(id.includes('metadata')){
            
            return {backgroundColor: 'OldLace'}
        }
        else{
            return {backgroundColor: 'LightSteelBlue'}
        } 
    }
    onNotify(message:string):void{
        console.log(message)
    }
  
    onActivate(componentReference:any) {        
        if(componentReference instanceof UserTreeComponent){
            console.log("This is a message from the UserTreeComponent");
            this.get_vertices()
            return;
         }
         else{
            console.log("This is not the UserTreeComponent")
         }
    }

    
    
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
        let user=JSON.parse(localStorage.getItem('currentUser'));
        console.log(user)
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            data => {
                this.vertice_data=data;
//                this.stats={
//                      "investigations":0,
//                      "studies":0,
//                      "experimental_factors": 0,
//                      "environments": 0,
//                      "metadata_files": 0,
//                      "observation_units": 0,
//                      "samples": 0,
//                      "events": 0,
//                      "data_files":0,
//                      "biological_materials":0,
//                      "observed_variables":0 
//                }
                
                //console.log(this.vertice_data)
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
                console.log(this.stats_advanced)



            }
        )
    }

  
}
