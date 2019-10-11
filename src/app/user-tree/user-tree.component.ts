import { FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { Component, Input, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { UserService, GlobalService, OntologiesService, AlertService } from '../services';
import { MiappeNode } from '../models';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatMenuTrigger } from '@angular/material';
import { first } from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog.component';
import { TemplateSelectionDialogComponent } from '../dialog/template-selection-dialog.component';
import { MediaObserver} from "@angular/flex-layout";
import { FormBuilder, FormGroup, Validators ,FormArray, FormControl} from '@angular/forms';



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
    @ViewChild('contextMenu',{static:false }) contextMenu: MatMenuTrigger;
    //@ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    
    
    disableSelect = new FormControl(false);
    panelOpenState = false;
    
    contextMenuPosition = { x: '0px', y: '0px' };

    private nodes:MiappeNode[]
    private statistics:{};
    private displayed=false;
    private vertices:any=[]
    private active_node: MiappeNode;
    private current_data=[]
    private current_data_array=[]
    private multiple_selection:boolean=false;
    private parent_key:string;
    private parent_id:string;
    private model_key:string;
    private model_selected:string
    nodekey:any;

    constructor(
        private globalService : GlobalService, 
        private ontologiesService: OntologiesService,
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
    
    
    
    async load(){
        await this.get_vertices()
    }

    async ngOnInit() {
          await this.get_vertices()
          this.nodes=[]
          this.nodes=this.build_hierarchy(this.vertices)
          this.dataSource.data = this.nodes; 
          this.tree.treeControl.expandAll();
    }
     
    onContextMenu(event: MouseEvent, node: MiappeNode) {
        this.active_node=node
        //console.log(node.id)
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        //console.log(this.contextMenu)
        this.contextMenu.menuData = { 'node': node };
        this.contextMenu.openMenu();
    //this.contextMenu.openMenu();
    }
    onDisplay(node:MiappeNode){
        
    }
    
    onEdit(node:MiappeNode) {
        //console.log(this.active_node.id);
        
        var model_key=this.active_node.id.split("/")[1];
        var model_coll=this.active_node.id.split("/")[0];
        var model_type=this.globalService.get_model_type(this.active_node.id)
        //console.log(model_type)
        if (model_type!="unknown"){
            //console.log(model_type)
            var parent_id=""
            this.globalService.get_parent(this.active_node.id).toPromise().then(
                    data => {
                        //parent_id=data
                        //console.log(data)
                        this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id:data._from, model_key:model_key,model_type:model_type,mode:"edit"}});

                    }
            )
        }
        else if(model_coll==="metadata_files") {
            this.globalService.get_parent(this.active_node.id).toPromise().then(
                    data => {
                        //parent_id=data
                        //console.log(data._from)
                            this.router.navigate(['/download'],{ queryParams: {parent_id: data._from, model_key:model_key,model_type:"metadata_file",mode:"edit"}});

                    }
            )
            
        }
        else{
            this.alertService.error("this node is not editable ");
        }
    
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
        this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false; 
        //this.router.navigate([this.router.url]);
        this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_key} });
  
    }

    onRemove(node: MiappeNode) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: {validated: false}});
        
                
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                
                if(confirmed){
                    this.globalService.remove(this.active_node.id).pipe(first()).toPromise().then(
                        data => {
                            if (data["success"]){
                                console.log(data["message"])
                            }
                            else{
                                this.alertService.error("this form contains errors! " + data["message"]);
                            }
                        }
                    );
                    this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false; 
                    this.router.navigate(['/tree'],{ queryParams: { key:  this.parent_key} });        
                }
                

            });
        }
 
     
    
    
    
    add(model_type:string,template:boolean ) {

        var parent_key=this.active_node.id.split("/")[1];
        var model_coll=this.active_node.id.split("/")[0];
        let user=JSON.parse(localStorage.getItem('currentUser'));
        if (template){
            
            //var model_type=this.globalService.get_model_type(this.active_node.id)
            console.log(model_type)
            
            
            const dialogRef = this.dialog.open(TemplateSelectionDialogComponent, {width: '500px', data: {template_id: "", user_key:user._key, model_type:model_type, values:{}}});
        
                
            dialogRef.afterClosed().subscribe(result => {
                    
                if (result){
                    console.log(result.values)
                    console.log(model_type)
                    console.log(this.active_node.id)
                    parent_id=""
                    if (this.active_node.id==='History'){
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
                                console.log(data["message"])
                                //this.model_id=data["_id"];
                                this.ngOnInit(); 
                                //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                //this.alertService.success("Your component has been successfully integrated in your history !!")

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
        else{
            
        
            //console.log(this.active_node.id);
            var parent_id=""
            if (this.active_node.id!='History'){
                parent_id= this.active_node.id
            }
            else{

                parent_id= user._id
            }

            if (model_type==="metadata_file"){
                 this.router.navigate(['/download'],{ queryParams: {parent_id: parent_id, model_key:parent_key,model_type:model_type,mode:"create"}});

            }
            else{
                 this.router.navigate(['/generic'],{ queryParams: {level:"1", parent_id: parent_id, model_key:"",model_type:model_type,mode:"create"}});

            }
        }

    }
  
    
  
  
    get_vertices(){
        let user=JSON.parse(localStorage.getItem('currentUser'));
        return this.globalService.get_all_vertices(user._key).toPromise().then(
            data => {
                this.vertices=data;
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
    

    
    show_info(term:MiappeNode){
        this.current_data=[]
        this.current_data_array=[]
        this.active_node=term
        this.displayed=true;
        if ((term["id"]==="History") ){            
            this.model_selected='History';
        }
        else if((term["id"].includes("metadata_files"))){
            //get value for a given node
            this.model_selected="metadata_files"
            this.model_key=term.id.split("/")[1]
            this.globalService.get_parent(term.id).toPromise().then(
                data => {
                    this.parent_id=data._from;
                    //console.log(data)
                }
            );
        }
        else{            
            this.model_selected=term["id"].split("/")[0]
            var key=term.id.split("/")[1]
            var collection=term.id.split("/")[0]
            
            //get value for a given node
            this.globalService.get_elem(collection,key).toPromise().then(
                data => {
                    this.current_data=Object.keys(data);
                    this.current_data_array.push(data);
                    for( var i = 0; i < this.current_data.length; i++){ 
                        if ( this.current_data[i].startsWith("_")) {
                            this.current_data.splice(i, 1);
                            i--;
                        }
                    }
                
                }
            );
            
        }
    }
    
    get_model_key(){
        return this.model_key;
    }
    
    get_parent_id(){
        return this.parent_id;
    }
    
    private ont_transformer = (node: MiappeNode, level: number) => {
          return {
        expandable: !!node.get_children() && node.get_children().length > 0,
        name: node.name ,
        def:node.def,
        id:node.id,
        fill_percentage:node.fill_percentage,
        term:node,
        level: level,
      };
    }
    private treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.get_children());
    private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    private initialSelection = []
    private checklistSelection = new SelectionModel<ExampleFlatNode>(true,this.initialSelection /* multiple */);


    get_dataSource(){
        return this.dataSource;
    }
    get_treeControl(){
        return this.treeControl;
    }
    get_model_selected(){
        return this.model_selected;
    }
    expandNode(){
        console.log(this.treeControl.dataNodes[3])
        this.treeControl.expand(this.treeControl.dataNodes[3]);
    }   
    build_hierarchy(edges:[]):MiappeNode[]{
        var cpt=0;
        var tmp_nodes=[]
        tmp_nodes.push(new MiappeNode("History","","",0))
        edges.forEach(
            e=>{
                var _from:string;
                var _to:string;
                
                _from=e["e"]["_from"]
                _to=e["e"]["_to"]
                var vertices:[]=e["s"]["vertices"]
                var percent=0.0
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
                        }
                    }
                )
                if (_from.includes("users")){
                    if (cpt===0){
                         tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"],"","",percent))
                    }
                    else{
                         tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"],"","",percent))
                    }
                   
                }
                else{
                    this.searchTerm(tmp_nodes,e["e"]["_from"]).add_children(new MiappeNode(e["e"]["_to"],"","",percent))
                }
                cpt+=1
            }
        )
        return tmp_nodes;
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
  
  

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    getLevel = (node: ExampleFlatNode) => node.level;

    isExpandable = (node: ExampleFlatNode) => node.expandable;

    getChildren = (node: MiappeNode): MiappeNode[] => node.children;
    @ViewChild('tree',{static:false}) tree;

}
