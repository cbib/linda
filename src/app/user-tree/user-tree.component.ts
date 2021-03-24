import { FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { GlobalService, OntologiesService, AlertService, FileService, SearchService } from '../services';
import { MiappeNode } from '../models';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material';
import { first } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog.component';
import { TemplateSelectionDialogComponent } from '../dialog/template-selection-dialog.component';
import { ExportDialogComponent } from '../dialog/export-dialog.component';
import * as JSZip from 'jszip';
import { MediaObserver} from "@angular/flex-layout";
import { FormControl} from '@angular/forms';
import { JoyrideModule } from 'ngx-joyride';


/** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: 'app-user-tree',
    templateUrl: './user-tree.component.html',
    styleUrls: ['./user-tree.component.css']
})
export class UserTreeComponent implements OnInit{
    //@ViewChild(MatMenuTrigger) 
    //@ViewChild(MatMenuTrigger,{static:true })
    @Input() search_string:string;
    @ViewChild(MatMenuTrigger,{static:false }) contextMenu: MatMenuTrigger;
    //@ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    disableSelect = new FormControl(false);
    panelOpenState = false;
    contextMenuPosition = { x: '0px', y: '0px' };
    private nodes:MiappeNode[]
    public statistics:{};
    private displayed=false;
    public vertices:any=[]
    private active_node: MiappeNode;
    private current_data_keys=[]
    private current_data_array=[]
    private multiple_selection:boolean=false;
    private parent_key:string;
    private parent_id:string;
    private model_key:string;
    private model_selected:string
    nodekey:any;
    private biological_materials=[]
    private experimental_factors=[]
    private samples=[]
    private obs_unit_data=[]
    private observation_id=""
    private biological_material_id=""

    constructor(
        private globalService : GlobalService, 
        private ontologiesService: OntologiesService,
        private fileService: FileService,
        private searchService : SearchService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        public media: MediaObserver,
        public dialog: MatDialog
        ) 
        {
        this.route.queryParams.subscribe(
            params => {        
                this.parent_key=params['key'];
            }
        );   
    }
    private ont_transformer = (node: MiappeNode, level: number) => {
        return {
            expandable: !!node.get_children() && node.get_children().length > 0,
            name: node.name ,
            def: node.def,
            id: node.id,
            fill_percentage: node.fill_percentage,
            term: node,
            level: level,
        };
    }
    private treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.get_children());
    private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    private initialSelection = []
    private checklistSelection = new SelectionModel<ExampleFlatNode>(true,this.initialSelection /* multiple */);
    
    // async load(){
    //     await this.get_vertices()
    // }

    async ngOnInit() {
          await this.get_vertices()
          this.nodes=[]
          this.nodes=this.build_hierarchy(this.vertices)
        

          //this.nodes[0].get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
          this.sort_nodes(this.nodes[0])
          this.dataSource.data = this.nodes
          //this.treeControl.expand()
          //this.tree.treeControl.expandAll();
          
          //console.log(this.treeControl.dataNodes[4])
          //console.log(this.treeControl.getLevel(this.treeControl.dataNodes[4]))
          //console.log(this.treeControl.dataNodes)
          //this.treeControl.expandDescendants(this.treeControl.dataNodes[4])
          var descendants=  this.treeControl.getDescendants(this.treeControl.dataNodes[0])
          //this.treeControl.expandDescendants(this.treeControl.dataNodes[0])
          this.treeControl.expand(this.treeControl.dataNodes[0])
          //console.log("searching for ", this.treeControl.dataNodes[12].name)
          for (var d in descendants){
              //console.log(this.treeControl.getLevel(descendants[d]))


              if (this.treeControl.getLevel(descendants[d])===1){
                //console.log(descendants[d].name)
                this.treeControl.expand(descendants[d])
                //this.treeControl.expandDescendants(descendants[d])
              }
            //   if (this.treeControl.getLevel(descendants[d])===2){
            //     //console.log(descendants[d]['term']['children'])
            //     this.treeControl.expand(descendants[d])
            //     //descendants[d]['term']['children'].sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]));
            //     //console.log(test)
            //   }
              

          }
          //this.treeControl.expand(this.treeControl.dataNodes[0]);

          this.searchService.getData().subscribe(data => {
            console.log(data);
            //this.search_string=data
          })      
    }

    sort_nodes(node:MiappeNode){
        if (node.has_child){
            node.get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
            node.get_children().forEach(node=>{
                if (node.has_child){
                    this.sort_nodes(node)
                    //node.get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
                }
            })
        }
        
    }

  build_hierarchy(edges:[]):MiappeNode[]{
      //console.log(edges)
      var cpt=0;
      var tmp_nodes=[]
      tmp_nodes.push(new MiappeNode("Investigations tree","Investigations tree","",0))
      edges.forEach(
          e=>{
              var _from:string;
              var _to:string;
              
              _from=e["e"]["_from"]
              _to=e["e"]["_to"]
              var vertices:[]=e["s"]["vertices"]
              var parent_id=e["e"]["_from"]
              var percent=0.0
              var short_name = ""
              vertices.forEach(
                  vertice=>{
                      if (vertice['_id']===e["e"]["_to"]){
                          var vertice_keys=Object.keys(vertice)
                          var total=0
                          for (var i = 0; i< vertice_keys.length; i++) {
                              if (vertice[vertice_keys[i]]!==""){
                                  total+=1
                              }                                
                          }      
                          percent=Math.round(100 *((total-3)/(vertice_keys.length-3)))
                          short_name=vertice['Short title']
                      }
                  }
              )
              if (short_name==="" || short_name===undefined ){
                 short_name = e["e"]["_to"]
              }
              if (_from.includes("users")){
                  
                  if (cpt===0){
                       tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
                  }
                  else{
                       tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
                  }
              }
              else{
                  this.searchTerm(tmp_nodes,e["e"]["_from"]).add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
              }
              cpt+=1
            }
        )
        return tmp_nodes;
    }
    public get_dataSource(){
        return this.dataSource;
    }
    get_treeControl(){
        return this.treeControl;
    }
    get_model_selected(){
        if (this.model_selected===undefined){
            return ""
        }
        else{
            return this.model_selected;

        }
    }
    expandNode(){
        console.log(this.treeControl.dataNodes[3])
        this.treeControl.expand(this.treeControl.dataNodes[3]);
    }   

     
    onContextMenu(event: MouseEvent, node: MiappeNode) {
        this.active_node=node
        event.preventDefault();
//        this.contextMenuPosition.x = event.clientX + 'px';
//        this.contextMenuPosition.y = event.clientY + 'px';
//        this.contextMenu.menuData = { 'node': node };
//        this.contextMenu.openMenu();
    //this.contextMenu.openMenu();
    }
    
    onClick(node:MiappeNode){
        console.log(node.id)
        this.active_node=node
       
        //this.contextMenu.openMenu();
    }
   
    onExport(node:MiappeNode){
        var model_type=this.globalService.get_model_type(node.id)
        this.globalService.get_parent(node.id).toPromise().then(parent_data => {
            var is_investigation=parent_data["_from"].includes("users")
            const dialogRef = this.dialog.open(ExportDialogComponent, {width: '500px', data: {expandable:node.expandable, is_investigation:is_investigation}});
            dialogRef.afterClosed().subscribe(result=> {
                if (result){
                    if (result.event=='Confirmed'){
                        //var selected_format=result.selected_format
                        //var recursive_check=result.recursive_check
                        //var model_id=node.id
                        var collection_name=node.id.split("/")[0];
                        var model_key=node.id.split("/")[1];
                        this.globalService.get_by_key(model_key,model_type).toPromise().then(model_data => {   
                            //Parse in a recursive way all submodels
                            if ((node.expandable) && (result.recursive_check)){
                                this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                                    this.fileService.saveFiles(model_data, submodel_data, collection_name, node.id, result.selected_format);
                                });
                            }
                            else{
                                this.fileService.saveFile(model_data, node.id, model_type, result.selected_format);
                            }
                        });
                    }
                } 
            })  
        });        
    }

    onExportIsa(node:MiappeNode){
        var model_type=this.globalService.get_model_type(node.id)
        var model_key=node.id.split("/")[1];
        var model_id=node.id
        var collection_name=node.id.split("/")[0];
        this.globalService.get_by_key(model_key,model_type).toPromise().then(model_data => {   
            //Parse in a recursive way all submodels
            var isa_model="investigation_isa"
            this.globalService.get_model(model_type).toPromise().then(model => { 
                this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                    this.globalService.get_model(isa_model).toPromise().then(isa_model => { 
                        this.fileService.saveISA(model_data, submodel_data, model_type, collection_name, model_id, isa_model, model);
                    });
                });
            });           
        });
    }
    
    
    onEdit(node:MiappeNode) {
        //console.log(this.active_node.id);
        this.active_node=node
        var model_key=this.active_node.id.split("/")[1];
        var model_coll=this.active_node.id.split("/")[0];
        var model_type=this.globalService.get_model_type(this.active_node.id)
        //console.log(model_type)
        if (model_type!=""){
            this.globalService.get_parent(this.active_node.id).toPromise().then(
                    data => {
                        if (model_type=="metadata_file"){
                            this.router.navigate(['/download'],{ queryParams: {parent_id: data._from, model_key:model_key,model_type:"metadata_file",mode:"edit"}});
                        }
                        else{
                            if (model_type==="biological_material"){
                                this.router.navigate(['/generic2'],{ queryParams: {level:"1", parent_id:data._from, model_key:model_key,model_type:model_type,mode:"edit"}});
                            }
                            else if (model_type==="observation_unit"){
                                this.router.navigate(['/generic3'],{ queryParams: {level:"1", parent_id:data._from, model_key:model_key,model_type:model_type,mode:"edit"}});
                            }
                            else{
                                this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id:data._from, model_key:model_key,model_type:model_type,mode:"edit"}});

                            }
                        }

                    }
            )
        }
        else{
            this.alertService.error("this node is not editable ");
        }
        


        // if (model_type!="unknown"){
        //     //console.log(model_type)
        //     var parent_id=""
        //     this.globalService.get_parent(this.active_node.id).toPromise().then(
        //             data => {
        //                 //parent_id=data
        //                 //console.log(data)
        //                 this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id:data._from, model_key:model_key,model_type:model_type,mode:"edit"}});


        //             }
        //     )
        // }
        // else if(model_coll==="metadata_files") {
        //     this.globalService.get_parent(this.active_node.id).toPromise().then(
        //             data => {
        //                 //parent_id=data
        //                 //console.log(data._from)
        //                     this.router.navigate(['/download'],{ queryParams: {parent_id: data._from, model_key:model_key,model_type:"metadata_file",mode:"edit"}});

        //             }
        //     )
            
        // }
        // else{
        //     this.alertService.error("this node is not editable ");
        // }
    
    }
    
    activate_multiple_selection(val:boolean){
        this.multiple_selection=val;
        var selected_set=this.checklistSelection.selected
    }
    
    
    
    remove_selected(node:ExampleFlatNode){
        //console.log(node)
        //var descendants = this.treeControl.getDescendants(node);
        //var descAllSelected = descendants.every(child =>this.checklistSelection.isSelected(child));                                
        //var selected_set=this.checklistSelection._selection
        var selected_set=this.checklistSelection.selected
        console.log(selected_set)
//        console.log(set.entries())
        var to_be_remove=[]
        selected_set.forEach(function(value) {
            
            var test:MiappeNode=value["term"];
            //this.onRemove(test)
            console.log(test)
            to_be_remove.push(test.id)
            
        }); 
        console.log(to_be_remove)
        for (var i = 0; i < to_be_remove.length; i++) {
            console.log(to_be_remove[i].split("/")[0])
            if (to_be_remove[i].split("/")[0]==="observation_units"){
                this.globalService.remove_observation_unit(to_be_remove[i]).pipe(first()).toPromise().then(
                    data => {
                    if (data["success"]){
                        console.log(data["message"])
                    }
                    else{
                        this.alertService.error("this form contains errors! " + data["message"]);
                    }
                }
            );
            }
            else{
                this.globalService.remove(to_be_remove[i]).pipe(first()).toPromise().then(
                        data => {
                        if (data["success"]){
                            console.log(data["message"])
                        }
                        else{
                            this.alertService.error("this form contains errors! " + data["message"]);
                        }
                    }
                ); 
            }
        }
        this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false; 
        //this.router.navigate([this.router.url]);
        this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_key} });
  
    }
    
 
    onRemove(node: MiappeNode) {
        this.active_node=node
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: {validated: false}});
        
                
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                
                if(confirmed){

                    console.log(this.active_node.id.split("/")[0])
                    if (this.active_node.id.split("/")[0]==="observation_units"){

                        this.globalService.remove_observation_unit(this.active_node.id).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]){
                                    console.log(data["message"])
                                    var message =  this.active_node.id + " has been removed from your history !!"

                                    this.alertService.success(message)

                                }
                                else{
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                    }
                    else{
                        this.globalService.remove(this.active_node.id).pipe(first()).toPromise().then(
                            data => {
                                if (data["success"]){
                                    console.log(data["message"])
                                    var message =  this.active_node.id + " has been removed from your history !!"

                                    this.alertService.success(message)

                                }
                                else{
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                    }

                    this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false; 
                    this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_key} });        
                }
                

            });
        }
     
    onFileChange(event) {
        console.log(this.active_node)

        //this.fileUploaded = <File>event.target.files[0];
        let uploadResponse = { status: '', message: 0, filePath: '' };
        
        if (event.target.files.length > 0) {
            
            uploadResponse.status='progress'
            let fileUploaded = event.target.files[0];
            let fileReader = new FileReader();
            let fileName=fileUploaded.name   
            
            this.add_multiple_model(fileReader)            
            fileReader.readAsArrayBuffer( fileUploaded );              

            

        }
    }
    add_multiple_model(fileReader:FileReader){
        let user=JSON.parse(localStorage.getItem('currentUser'));
        var parent_id=''
        if (this.active_node.id==='Investigations tree'){
            parent_id=user["_id"]
        }
        else{
            parent_id=this.active_node.id
        }
        fileReader.onload = function ( e )
        {
            var archive = new JSZip().loadAsync(e.target['result']).then(function (zip) {
                var files= zip['files'];
                 Object.keys(zip.files).forEach(function (filename) {
                     console.log(zip.files)
                     
                     console.log(zip.files[filename]['dir'])
                    if (!zip.files[filename]['dir']){
                        zip.files[filename].async('string').then(function (fileData) {
                            console.log(filename)
                            console.log(fileData) // These are your file contents      
                        })
                        
                    }
                })

                zip.forEach(function (relativePath, zipEntry) {
                    console.log(zipEntry.name)
                    console.log(zipEntry.dir)
                    //console.log(zipEntry[relativePath]['dir'])
                    console.log(relativePath)
                    //for each filepath build the corresponding hierarchy in user tree
                });
            });
        }
    }
    
    
    add(model_type:string,template:string) {

        var parent_key=this.active_node.id.split("/")[1]
        console.log(parent_key)
        console.log(template)
        var model_coll=this.active_node.id.split("/")[0];
        let user=JSON.parse(localStorage.getItem('currentUser'));
        if (template=='saved'){
            
            //var model_type=this.globalService.get_model_type(this.active_node.id)
            console.log(model_type)
            
            
            const dialogRef = this.dialog.open(TemplateSelectionDialogComponent, {width: '500px', data: {search_type :"Template" ,model_id: "", user_key:user._key, model_type:model_type, values:{}, parent_id:this.active_node.id} });
        
                
            dialogRef.afterClosed().subscribe(result => {
                    
                if (result){
                    console.log(result.values)
                    //console.log(model_type)
                    //console.log(this.active_node.id)
                    parent_id=""
                    if (this.active_node.id==='Investigations tree'){
                        parent_id=user["_id"]
                    }
                    else{
                        parent_id=this.active_node.id
                    }
                    var keys=Object.keys(result.values);

                    for( var i = 0; i < keys.length; i++){ 
                    if ( keys[i].startsWith("_") || keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                        keys.splice(i, 1); 
                        //var k=this.keys[i]
                        i--;
                        }
                    }
                    var new_values={}
                    keys.forEach(attr => {new_values[attr]=result.values[attr]})
                    
                    this.globalService.add(new_values,model_type, parent_id).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]){
                                //console.log(data["message"])
                                //this.model_id=data["_id"];
                                this.ngOnInit(); 
                                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                var message = "A new "+ model_type[0].toUpperCase() +  model_type.slice(1).replace("_"," ") + " based on " + result.values['_id']+ " has been successfully integrated in your history !!"

                                this.alertService.success(message)

                                return true;
                            }
                            else{
                                //console.log(data["message"])
                                this.alertService.error("this form contains errors! " + data["message"]);
                                return false;
                                //this.router.navigate(['/studies']);
                            }
                        }
                    );

                }

            }); 
            
            
            
            
//            this.router.navigateByUrl(['/tree'], { skipLocationChange: true }).then(() => 
//            {
//                this.router.navigate(['/tree']);
//            }); 
            //this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false;                              
            //this.router.navigate(['/tree'],{ queryParams: { key: user["_id"].split('/')[1]} });
            
            
        }
        else if (template=='zip'){
            console.log('add zip file');
            
            
        }
        else if (template=='parent'){
            //Here it is a special case for observation unit when you want to add
            //search for all biological_material in the parent study
            console.log('add zip file');
            var model_name=this.active_node.id.split("/")[0]
            var model_key=this.active_node.id.split("/")[1]
            var search_type=""
            this.globalService.get_parent_id(model_name, model_key).toPromise().then(
                data => {
                    var parent_id=data[0]["v_id"]
                    console.log(parent_id)
                    // if (model_type==='observed_variable'){
                    //     search_type="Observed variable"
                    // }
                    // else if (model_type==='experimental_factor'){
                    //     search_type="Experimental factor"
                    // }
                    // else{
                    //     search_type="Biological material"
                    // }
                    
                    const dialogRef = this.dialog.open(TemplateSelectionDialogComponent, {width: '500px', data: {search_type :model_type ,model_id: "", parent_id:parent_id, user_key:user._key, model_type:model_type, values:{}} });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result){
                            console.log(result.values)
                            var keys=Object.keys(result.values);

                            for( var i = 0; i < keys.length; i++){ 
                            if ( keys[i].startsWith("_") || keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                                keys.splice(i, 1); 
                                //var k=this.keys[i]
                                i--;
                                }
                            }
                            var new_values={}
                            keys.forEach(attr => {new_values[attr]=result.values[attr]})
                            this.globalService.add(new_values,model_type, this.active_node.id).pipe(first()).toPromise().then(
                                data => {
                                    if (data["success"]){
                                        //console.log(data["message"])
                                        //this.model_id=data["_id"];
                                        this.ngOnInit(); 
                                        //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                        var message = "A "+ model_type[0].toUpperCase() +  model_type.slice(1).replace("_"," ") + " from "+ parent_id +" using " + result.values['_id']+ " has been successfully integrated in your history !!"
        
                                        this.alertService.success(message)
        
                                        return true;
                                    }
                                    else{
                                        //console.log(data["message"])
                                        this.alertService.error("this form contains errors! " + data["message"]);
                                        return false;
                                        //this.router.navigate(['/studies']);
                                    }
                                }
                            );
                        }
                    }); 
                }
            )  
        }
        else{
            var parent_id=""
            if (this.active_node.id!='Investigations tree'){
                parent_id= this.active_node.id
            }
            else{
                parent_id= user._id
            }
            if (model_type==="metadata_file"){
                 this.router.navigate(['/download'],{ queryParams: {parent_id: parent_id, model_key:parent_key,model_type:model_type,mode:"create"}});
            }
            else if (model_type==="biological_material"){
                this.router.navigate(['/generic2'],{ queryParams: {level:"1", parent_id: parent_id, model_key:"",model_type:model_type,mode:"create"}});
            }
            else if (model_type==="observation_unit"){
                this.router.navigate(['/generic3'],{ queryParams: {level:"1", parent_id: parent_id, model_key:"",model_type:model_type,mode:"create"}});
            }
            else{
                 this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id: parent_id, model_key:"",model_type:model_type,mode:"create"}});
            }
        }

    }
    
    public get_statistics(){
        console.log(this.statistics)
        //return this.statistics
    }
    identify(){
        console.log('Hello, Im user tree!');
    }
  
    get_vertices(){
        let user=JSON.parse(localStorage.getItem('currentUser'));
        console.log(user)
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            data => {
                this.vertices=data;
                console.log(data)
                this.statistics={
                    "investigations":0,
                    "studies":0,
                    "experimental_factors": 0,
                    "environments": 0,
                    "metadata_files": 0,
                    "observation_units": 0,
                    "samples": 0,
                    "events": 0,
                    "data_files":0,
                    "biological_materials":0,
                    "observed_variables":0 
                }
        
                this.vertices.forEach(
                    attr => {
                        this.statistics[attr["e"]["_to"].split("/")[0]]+=1

                    }
                );
                //console.log(this.statistics)
                

                
            }
        )
    }
    

//     onExpand(node:MiappeNode){
//        this.active_node=node
//        var model_key=this.active_node.id.split("/")[1];
//        var model_coll=this.active_node.id.split("/")[0];
//        var model_type=this.globalService.get_model_type(this.active_node.id)
//        this.model_selected=this.globalService.get_model_type(this.active_node.id)
//        console.log(this.model_selected)
//    }

    ObservationTableRowSelected(i:number) {
        this.observation_id = this.obs_unit_data[i]['obsUUID']
        console.log(this.observation_id)

    }
    MaterialTableRowSelected(i) {
        this.biological_material_id=this.biological_materials[i]['bmUUID']
        console.log(this.biological_material_id)
      }
    get get_bm_field(){
        return Object.keys(this.biological_materials[0]);
    }
    // get get_bm_data(){
    //     return this.biological_materials
    // }
    get get_ef_field(){
      return Object.keys(this.experimental_factors[0]);
    }

    get get_sample_field(){
        return Object.keys(this.samples[0]);
    }
    get get_ou_field(){
        return Object.keys(this.obs_unit_data[0]);
    }
    get_ou_data(node:MiappeNode){ 
        console.log(node["term"].get_current_observation_unit_data()['observation_units'])
        return node["term"].get_current_observation_unit_data()['observation_units']

    }
    get_bm_data(node:MiappeNode):[]{ 
        console.log(node["term"].get_current_observation_unit_data()['biological_materials'])
        return node["term"].get_current_observation_unit_data()['biological_materials']

    }
    get_ef_data(node:MiappeNode){ 
        
        return node["term"].get_current_observation_unit_data()['experimental_factors']

    }
    get_sample_data(node:MiappeNode){ 
        
        return node["term"].get_current_observation_unit_data()['samples']

    }

    show_info(node:MiappeNode){
        
        this.current_data_keys=[]
        this.current_data_array=[]
        this.active_node=node
        this.notify.emit("hello");
        this.displayed=true;
        if ((node["id"]==="Investigations tree") ){            
            this.model_selected='Investigations tree';
        }
        else if((node["id"].includes("metadata_files"))){
            //get value for a given node
            this.model_selected="metadata_files"
            this.model_key=node.id.split("/")[1]
            this.globalService.get_parent(node.id).toPromise().then(
                data => {
                    this.parent_id=data._from;
                }
            );
        }
        else if((node["id"].includes("observation_units"))){
            this.model_selected=node["id"].split("/")[0]
            var key=node.id.split("/")[1]
            this.model_key=node.id.split("/")[1]
            var collection=node.id.split("/")[0]
            // //get value for a given node
            var return_data = {"observation_units":[],"biological_materials":[],"samples":[], "experimental_factors":[] }
            this.globalService.get_elem(collection,key).toPromise().then(
                data => {
                    //console.log(data)
                    var obs_linda_id=data['_id']
                    

                    var obs_keys = Object.keys(data);
                    this.obs_unit_data=[]
                    for (var i=0; i<data["Observation unit ID"].length;i++ ){
                        var obs_unit={}
                        obs_keys.forEach(key => {
                            if (!key.startsWith("_") && !key.startsWith("Definition")) {
                                obs_unit[key]=data[key][i]
                            }
                        });
                        this.obs_unit_data.push(obs_unit)
                    }
                    this.observation_id=data["obsUUID"][0]
                    //console.log(obs_linda_id)
                    //console.log(this.obs_unit_data)
                    this.biological_materials=[]
                    this.experimental_factors=[]
                    this.samples=[]
                    this.globalService.get_all_observation_unit_childs(obs_linda_id.split("/")[1]).toPromise().then(
                        observation_unit_childs_data => {
                            //console.log(observation_unit_childs_data)
                            //get all biological materials
                            
                            for (var i=0; i<observation_unit_childs_data.length;i++ ){
                                var child_id:string=observation_unit_childs_data[i]['e']['_to']
                                //console.log(observation_unit_childs_data[i])
                                
                                if (child_id.includes("biological_materials")){
                                    //console.log(child_id)
                                    //console.log(observation_unit_childs_data[i]['e']['biological_materials'])
                                    var tmp_bm:[]=observation_unit_childs_data[i]['e']['biological_materials']
                                    this.biological_materials=this.biological_materials.concat(tmp_bm)
                                    
                                }
                                else if (child_id.includes("experimental_factors")){
                                    //console.log(child_id)
                                    //console.log(observation_unit_childs_data[i]['e']['experimental_factors'])
                                    var tmp_ef:[]=observation_unit_childs_data[i]['e']['experimental_factors']
                                    this.experimental_factors=this.experimental_factors.concat(tmp_ef)
                                }
                                //type sample childs
                                else{
                                    //console.log(child_id)
                                    
                                    var sample_data=observation_unit_childs_data[i]['s']['vertices'][1]
                                    //console.log(sample_data)
                                    var sample_keys = Object.keys(sample_data);
                                    var sample={}
                                    sample_keys.forEach(key => {
                                        if (!key.startsWith("_") && !key.startsWith("Definition")) {
                                            sample[key]=sample_data[key]
                                        }
                                    });
                                    this.samples.push(sample)
                                    // var tmp_samples:[]=observation_unit_childs_data[i]['e']['samples']
                                    // samples=samples.concat(tmp_samples)

                                }
                            }
                            return_data["biological_materials"]=this.biological_materials
                            return_data["samples"]=this.samples
                            return_data["experimental_factors"]=this.experimental_factors
                            //console.log(this.obs_unit_data)
                            //console.log(this.biological_materials)
                            //console.log(this.experimental_factors)
                            //console.log(this.samples)
                            
                            
                        }
                    );
                    return_data["observation_units"]=this.obs_unit_data



                    // this.current_data_keys=Object.keys(data);
                    // this.current_data_array.push(data);
                    node["term"].set_current_observation_unit_data(return_data)
                    //node["term"].set_current_data_array(this.current_data_array)
                    node["term"].set_model_key(node.id.split("/")[1])

                    // for( var i = 0; i < this.current_data_keys.length; i++){ 
                    //     if ( this.current_data_keys[i].startsWith("_")) {
                    //         this.current_data_keys.splice(i, 1);
                    //         i--;
                    //     }
                    // }
                    // //console.log(this.current_data)
                    // node["term"].set_current_data(this.current_data_keys)
                    // node["term"].set_model_key(node.id.split("/")[1])
                }
            );
        }
        else if((node["id"].includes("biological_materials"))){
            this.model_selected=node["id"].split("/")[0]
            var key=node.id.split("/")[1]
            this.model_key=node.id.split("/")[1]
            var collection=node.id.split("/")[0]
            //get value for a given node
            this.globalService.get_elem(collection,key).toPromise().then(
                data => {
                    this.current_data_keys=Object.keys(data);
                    this.current_data_array.push(data);
                    node["term"].set_current_data_array(this.current_data_array)

                    for( var i = 0; i < this.current_data_keys.length; i++){ 
                        if ( this.current_data_keys[i].startsWith("_")) {
                            this.current_data_keys.splice(i, 1);
                            i--;
                        }
                    }
                    //console.log(this.current_data)
                    node["term"].set_current_data(this.current_data_keys)
                    node["term"].set_model_key(node.id.split("/")[1])
                }
            );
        }
        else{            
            this.model_selected=node["id"].split("/")[0]
            var key=node.id.split("/")[1]
            this.model_key=node.id.split("/")[1]
            var collection=node.id.split("/")[0]
            //get value for a given node
            this.globalService.get_elem(collection,key).toPromise().then(
                data => {
                    this.current_data_keys=Object.keys(data);
                    this.current_data_array.push(data);
                    node["term"].set_current_data_array(this.current_data_array)

                    for( var i = 0; i < this.current_data_keys.length; i++){ 
                        if ( this.current_data_keys[i].startsWith("_")) {
                            this.current_data_keys.splice(i, 1);
                            i--;
                        }
                    }
                    //console.log(this.current_data)
                    node["term"].set_current_data(this.current_data_keys)
                    node["term"].set_model_key(node.id.split("/")[1])
                }
            );
        }
    }
    get_current_data(node:MiappeNode){
        return node["term"].get_current_data()
    }
    get_current_data_array(node:MiappeNode){
        return node["term"].get_current_data_array()
    }
    
    get_model_key(node:MiappeNode){
//        return this.model_key;
        //console.log(node)
        return node["term"].get_model_key()
    }
    
    get_parent_id(node:MiappeNode){
//        console.log(node["term"].get_parent_id())
        return node["term"].get_parent_id()
    }
    get_model_type(node:MiappeNode){
        return this.globalService.get_model_type(node.id)
    }
    
    
    get_term(term_id:string) : any{
        var term:MiappeNode;
        this.nodes.forEach(
            t=>{
                if (t.id===term_id){
                  term=t
                }
            })
        return term
    }
  
  
    searchTerm(terms:MiappeNode [],term_id:string) : any{
        var term:MiappeNode;
        terms.forEach(
            t=>{  
                  if(t.id == term_id){
                      term=t
                  }
                  else if (t.get_children() != null){
                      var i;
                      for(i=0; i < t.get_children().length; i++){
                          term = this.searchTerm([t.get_children()[i]], term_id);
                      }
                  }
            }
      )
      return term
    }
     /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: ExampleFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: ExampleFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: ExampleFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node) ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: ExampleFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: ExampleFlatNode): void {
        let parent: ExampleFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: ExampleFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } 
        else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }
  
    /* Get the parent node of a node */
    getParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
  
    searchTree(term:MiappeNode, term_id:string){
        if(term.id == term_id){
            return term;
        }
        else if (term.get_children() != null){
            var i;
            var result = null;
            for(i=0; result == null && i < term.get_children().length; i++){
                //console.log(term.children[i])
                 result = this.searchTree(term.get_children()[i], term_id);
            }
            return result;
       }
       return null;
    }
  
    get_term2(term_id:string) : any{
        var term:MiappeNode;
        this.nodes.forEach(
            t=>{
                if (t.id===term_id){
                  term=t
                  //console.log(term_id)
                }

            })
        return term
    }
  
//  get_node(term_id:string) : MiappeNode{
//      var term:MiappeNode;
//      this.ontology_tree.forEach(
//          t=>{
//              if (t.id===term_id){
//                term=t
//                //console.log(term_id)
//              }
//
//          })
//      return term
//  }
    get_termchild(term_id:string) : MiappeNode[]{
        var term:MiappeNode[];
        this.nodes.forEach(
            t=>{
                if (t.id===term_id){
                  term=t.get_children()
                  //console.log(term_id)
                }

            })
        return term
    }

    getStyle(node: MiappeNode): Object {
        
        if (node.id.includes('Investigations tree')){
           
           return {backgroundColor: 'white',  width: '250px', 'margin-left':'10px'}
        }
        else if (node.id.includes('studies')){
            
           return {backgroundColor: 'Gainsboro',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else if(node.id.includes('investigations')){
            
            return {backgroundColor: 'lightblue',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else if(node.id.includes('events')){
            
            return {backgroundColor: 'lightcoral',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else if(node.id.includes('metadata')){
            
            return {backgroundColor: 'OldLace',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else if(node.id.includes('observed')){
            
            return {backgroundColor: 'LightGreen',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        
        else if(node.id.includes('biological_materials')){
            
            return {backgroundColor: 'LightBlue',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else if(node.id.includes('observation_units')){
            
            return {backgroundColor: 'Lightyellow3',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        }
        else{
            return {backgroundColor: 'LightSteelBlue',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
        } 
           
        
    
    }
  
  

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    getLevel = (node: ExampleFlatNode) => node.level;

    isExpandable = (node: ExampleFlatNode) => node.expandable;

    getChildren = (node: MiappeNode): MiappeNode[] => node.children;
    @ViewChild('tree',{static:false}) tree;

}
