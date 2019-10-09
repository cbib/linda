
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component,Input,Inject} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { UserService, GlobalService, OntologiesService, AlertService } from '../services';
import { OntologyTerm } from '../ontology/ontology-term';
import { Instance } from '../ontology/instance';
import { Router,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface DialogData {
  ontology_type: string;
  selected_term:OntologyTerm ;
  selected_set:[]

}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-ontology-tree',
  templateUrl: './ontology-tree.component.html',
  styleUrls: ['./ontology-tree.component.css']
})
export class OntologyTreeComponent {
  

    //@Input() ontology_type;
    private ontology_type:string;
    private selected_set:[]
    private selected_term:OntologyTerm;
    private ontologyTerms:OntologyTerm[];
    private ontologyDatatype:OntologyTerm[];
    private ontologyEnum:OntologyTerm[];
    private ontologyContext:OntologyTerm[];
    private ontologyNode:OntologyTerm[];    
    private ontologies:any = {};
    private investigations:any = [];
    private studies:any = [];
    private global_array:any=[]; 
    private displayed=false;
    private my_tree: FoodNode[]; 
    private ontology_tree: OntologyTerm[];
    private active_node: OntologyTerm;
    private context_term:OntologyTerm [];
    
    
    constructor(
        private globalService : GlobalService, 
        private ontologiesService: OntologiesService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        public dialogRef: MatDialogRef<OntologyTreeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        
        //this.dataSource.data = TREE_DATA;
      
        //console.log(data)
//        this.route.queryParams.subscribe(
//            params => {        
//            this.ontology_type=params['ontology_type'];
//            }
//        )
      
        //this.ontologyTerms=[]
//        this.ontologyContext=[]
//        this.ontologyDatatype=[]
//        this.ontologyNode=[]
//        console.log(this.ontology_type)
        //console.log("in constructor")
        //console.log(this.data)
        this.selected_term=this.data.selected_term
        console.log(this.data)
        this.ontology_type=this.data.ontology_type
        this.selected_set=this.data.selected_set
        console.log(this.selected_set)
        this.ontology_tree=[]
        this.ontologyTerms=[]
        this.ontologyContext=[]
        this.ontologyDatatype=[]
        this.ontologyEnum=[]
        this.ontologyNode=[]
        //var term=new OntologyTerm("eee","dddd",true,"rrr")
        //this.ontologyTerms.push(term)
        //console.log(this.ontologyTerms)
        //console.log(this.ontology_type)
        

           
  }
  get_ontology(){
      return this.ontologiesService.get_ontologies(this.ontology_type).toPromise().then(data => {this.ontologies=data;})
  }
  async load(){
      await this.get_ontology()
  }
  
  async ngOnInit() {
        await this.get_ontology()
        //await this.load();
        //console.log("after load function")
        this.ontologyNode=[]
        //console.log(JSON.stringify(this.ontologyTerms))
        
        var ontologies_list=["EnvO","EO","PO_Structure","PO_Development","CO_20","EFO","CO_715"]
        
        if(this.ontology_type==="XEO"){
            this.ontologyNode=this.build_xeo_isa_hierarchy(this.ontologies);
        }
        else if(ontologies_list.includes(this.ontology_type )){
            //console.log('ok')
            //console.log("before build hierarchy function")   
            this.ontologyNode=this.build_eo_isa_hierarchy(this.ontologies);
            //console.log("after build hierarchy function")  
        } 
//        else if(this.ontology_type==="EO" || this.ontology_type==="EnvO" || this.ontology_type==="PO_Structure"|| this.ontology_type==="PO_Development" || this.ontology_type==="CO_20"){
//            console.log("before build hierarchy function")   
//            this.ontologyNode=this.build_eo_isa_hierarchy(this.ontologies);
//            console.log("after build hierarchy function")   
//        }
        else{
            console.log("no ontology defined")  
        }
        console.log("after build hierarchy function")          
        this.dataSource.data = this.ontologyNode;  
  }


//    private transformer = (node: FoodNode, level: number) => {
//      return {
//        expandable: !!node.children && node.children.length > 0,
//        name: node.name,
//        level: level,
//      };
//    }


 
    onValueAdd(event){
        console.log(event.target.value)
        this.selected_term["term"].set_value(event.target.value)
    }
    onUnitSelect(value){
        this.selected_term["term"].set_unit(value)

    }
    onResponseRangeSelect(value){
        this.selected_term["term"].set_response_range(value)
    }
    onNoClick(): void {
        console.log("closed")
        this.dialogRef.close();
    }
    

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: ExampleFlatNode): void {
        this.checklistSelection.toggle(node);
    }
    show_info(term:OntologyTerm){
        //child node
        
        if (term["term"].children.length==0){
            ///this.selected_set=this.checklistSelection.selected
            console.log(this.selected_set)
            //var descendants = this.treeControl.getDescendants(node);
            //var descAllSelected = descendants.every(child =>this.checklistSelection.isSelected(child));
            //console.log(descAllSelected)
            
            
            this.selected_term=term
            this.data.selected_term=this.selected_term
            this.data.selected_set=this.selected_set
            console.log(this.selected_term)
            this.active_node=term
            this.displayed=true;
            //this.context_term=[];
            //console.log(this.displayed)
            //console.log(term)
            this.context_term=term["term"].get_context()
            
            
            //var context_term:OntologyTerm;
//            var datatype_term:OntologyTerm;
//            var enum_term:OntologyTerm;
////            if (term.def){
////                console.log(term.def)
////            }
//            
//            for (var c in term["term"].context){
//                console.log(term["term"].context[c])
//                this.context_term.push(term["term"].context[c])
//                
//            }
    //            if (context_term && context_term["datatype"]){
    //
    //                datatype_term=this.get_term(context_term["datatype"])
    //                console.log(datatype_term)
    //            }
    //            if (context_term && context_term["enumeration"]){
    //
    //                enum_term=this.get_term(context_term["enumeration"])
    //                console.log(enum_term)
    //            }
            
        }
        //Parent node
        else{
            
        }
        
        //if (Array.isArray(term.relationship)){
        
//        if (term["term"].context){
//
//            context_term=this.get_term(term["term"].context)
//            console.log(context_term)
//        }
//        if (context_term && context_term["datatype"]){
//
//            datatype_term=this.get_term(context_term["datatype"])
//            console.log(datatype_term)
//        }
  //      else{
  //          console.log(term.id)
  //      }

    }

    private ont_transformer = (node: OntologyTerm, level: number) => {
          return {
        expandable: !!node.children && node.children.length > 0,
        name: node.name ,
        def:node.def,
        id:node.id,
        term:node,
        level: level,
      };
    }
    get_dataSource(){
        return this.dataSource
    }
    get_treeControl(){
        return this.treeControl
    }
    get_displayed(){
        return this.displayed
    }
    private treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.children);
    private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    private initialSelection = []
    private checklistSelection = new SelectionModel<ExampleFlatNode>(true,this.initialSelection /* multiple */);
    
    
    
    build_eo_isa_hierarchy(ontology:{}):OntologyTerm[]{
        //console.log(ontology);
        var cpt=0;
        
        //console.log(this.ontologyTerms.length)
        //console.log(JSON.stringify(this.ontologyTerms))
        //t=new OntologyTerm(this.ontology_type,"",[],"")
        //console.log(t)
        //this.ontologyTerms.push(t);
        //console.log(this.ontologyTerms.length)
        //console.log(JSON.stringify(this.ontologyTerms))
        ontology["term"].forEach(
            term=>{
                if (!term["is_obsolete"]){
                    this.ontologyTerms.push(new OntologyTerm(term.id,term.name,[],""))
                    cpt+=1;
                }

            }
        )
        //console.log(JSON.stringify(this.ontologyTerms))
        //second passage pour créer tous les termes 
        var cpt=0;    
        
        ontology["term"].forEach(
            term=>{
                if (!term["is_obsolete"]){
                    if (term.is_a){ 
                        if (Array.isArray(term.is_a)){
                            
                            for (var isa in term.is_a){
                                this.get_term(term.id).set_isa(term.is_a[isa].split(" ! ")[0])
                                
                            }
                        }
                        else{
                            this.get_term(term.id).set_isa(term.is_a.split(" ! ")[0])
                            //console.log(term.is_a)
                        }
                    }
                    if (term.def){
                        this.get_term(term.id).set_def(term.def)
                    }
                    if (term.comment){
                        this.get_term(term.id).set_comment(term.comment)
                    }
                    if (term.relationship){
                        this.get_term(term.id).set_relationship(term.relationship)
                        if (term.relationship.includes("part_of")){
                            this.get_term(term.id).set_isa(term.relationship.split("part_of ")[1].split(" ! ")[0])
                            
                        }
                        this.get_term(term.id).set_has_relationship(true)
                    }
                    
                    cpt+=1;
                    
                }

            }
        )
        //console.log(JSON.stringify(this.ontologyTerms))
        //console.log(this.ontologyTerms.length)
        var cpt=0
       
        //console.log(this.ontologyNode.length)
        
        
        
        //build isa hierarchy
//        var cpt=0
//        this.ontologyTerms.forEach(
//            term=>{
//                if (term.id==="EO:0007359"){
//                    this.ontologyNode[0].add_children(term);
//                    console.log(this.ontologyNode.length)
//                }
//            }
//        )   
//        console.log(JSON.stringify(this.ontologyNode))
//        
        
        //console.log(angular.mock.dump(this.ontologyTerms ))
        
        this.ontologyTerms.forEach(
            term=>{
                
               
                    
                if (term.is_a!=""){
//                        if (this.get_term(term.is_a)!=null){
//                            this.get_term(term.is_a).add_children(term)
//                        }
                        var t=this.get_term(term.id)
                        var t_parent=this.get_term(term.is_a)
                        if (t_parent!=null){
                            t_parent.add_children(t)
                        }
                        
                        
                        
                        
                        
//                        if (this.searchTree(this.ontologyNode[0],term.is_a)!=null){
//                            this.searchTree(this.ontologyNode[0],term.is_a).add_children(term)
//                        } 
                    
//                        if (this.searchTree(this.ontologyNode[0],term.is_a)!=null){
//                            this.searchTree(this.ontologyNode[0],term.is_a).add_children(term)
//                        } 
//                        else{
//                            this.ontologyNode[0].add_children(this.get_term(term.is_a));
//                            console.log("not found")
//                        }  
                }
//                else{
//                    
//                }
//                else{
//                    //this.ontologyNode[0].add_children(term);
//                    this.get_term(term.is_a).add_children(term)
//                    //console.log(this.ontologyNode)
//                }
                
                
            }
        )
        
        var head_term:OntologyTerm []=[]
        this.ontologyTerms.forEach(
            term=>{
                if (term.is_a===""){
                    
                    if (!term.get_has_relationship()){
                    
                        head_term.push(term)
                    }
                }
              
                
            }
        )
        //console.log(head_term)
        
        
        //console.log(this.ontologyTerms[349])
        var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
        this.ontologyNode.push(t);
        //this.ontologyNode[0].add_children(head_term)
        for (let t in head_term){
            this.ontologyNode[0].add_children(head_term[t])
        }
            //this.ontologyNode[0].add_children(this.get_term("ENVO:00010483"))
        
//                if (term.is_context){
////                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
//                    //console.log(term.name)
//                    
//                   
//                
//                    
//                    if (term.is_a!=""){
//                         if (this.searchTree(this.ontologyContext[0],term.is_a)!=null){
//                                this.searchTree(this.ontologyContext[0],term.is_a).add_children(term)
//                        }   
//                    }
//                    else{
//                         this.ontologyContext.push(new OntologyTerm(term.id,term.name,[],""));
//                         //this.ontologyContext[0].add_children(term);
//                    }
//                }  
//                if (term.is_datatype){
////                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
//                    //console.log(term)
//                    
//                    if (term.is_a!=""){
//                         if (this.searchTree(this.ontologyDatatype[0],term.is_a)!=null){
//                                this.searchTree(this.ontologyDatatype[0],term.is_a).add_children(term)
//                        }   
//                    }
//                    else{
//                         this.ontologyDatatype.push(new OntologyTerm(term.id,term.name,[],""));
//                         //this.ontologyContext[0].add_children(term);
//                    }
//                }  
//                if (term.is_enumeration){
////                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
//                    //console.log(term)
//                    this.ontologyEnum.push(new OntologyTerm(term.id,term.name,[],""));
//                    
//
//            }  
//            } 
//        )
// 
//
//
//
//
        //delete this.ontologyTerms
        //delete this.ontologyNode
        return this.ontologyNode;
  }
    
    
    
    build_xeo_isa_hierarchy(ontology:{}):OntologyTerm[]{
        
        //console.log(ontology);
        //premier passage pour créer tous les termes 
        var cpt=0;
        //console.log(this.ontologyTerms.length)
        //console.log(this.ontologyNode)
        this.ontologyTerms.push(new OntologyTerm(this.ontology_type,"",[],""));
        //console.log(this.ontologyTerms)
        ontology["term"].forEach(
            term=>{
//                    if (cpt==0){
//                        console.log("cpt==0")
//                            this.ontologyTerms.push(new OntologyTerm(this.ontology_type,"",[],""));
//                            //this.ontologyTerms[0].add_children(new OntologyTerm(term.id,term.name,[],""));
//                    }
                    //console.log(this.ontologyTerms)
                    this.ontologyTerms.push(new OntologyTerm(term.id,term.name,[],""))
                    //console.log(cpt)
                    //console.log(this.ontologyTerms)
                    cpt+=1;

            }
        )
        
        
        
        //console.log(this.ontologyTerms);
        //second passage pour créer tous les termes 
        var cpt=0;    
        
        ontology["term"].forEach(
            term=>{
                    //console.log(term)
                    if (term.name=="Context" || term.name=="QuantityContext" ){
                        this.get_term(term.id).set_is_context(true)
                    }
                    if (term.name=="DataTypes"){
                        this.get_term(term.id).set_is_datatype(true)
                    }
                    if (term.name=="EnvironmentVariable"){
                        this.get_term(term.id).set_is_environment(true)
                    }
                    if (term.is_a){ 
                        if (this.get_term(term.is_a).is_datatype && this.get_term(term.id).is_enumeration===false){
                    
                            this.get_term(term.id).set_is_datatype(true)
                        }
                        if (this.get_term(term.is_a).is_environment){
                    
                            this.get_term(term.id).set_is_environment(true)
                        }
                    }
                    
                    if (term.is_a){
                        this.get_term(term.id).set_isa(term.is_a)
                    }
                    if (term.def){
                        this.get_term(term.id).set_def(term.def)
                    }
                    if (term.comment){
                        this.get_term(term.id).set_comment(term.comment)
                    }
                    if (term.relationship){
                        if (Array.isArray(term.relationship)){
                            //console.log(term.relationship)
                            for (var rel in term.relationship){
                                if (term.relationship[rel].includes("has_context")){
                                    this.get_term(term.relationship[rel].split(" ")[1]).set_is_context(true)
                                    this.get_term(term.id).add_context(this.get_term(term.relationship[rel].split(" ")[1]))
                                }
                                if (term.relationship[rel].includes("has_datatype")){
                                    this.get_term(term.relationship[rel].split(" ")[1]).set_is_datatype(true)
                                    this.get_term(term.id).set_datatype(term.relationship[rel].split(" ")[1])
                                }
                                if (term.relationship[rel].includes("has_enum")){
                                    this.get_term(term.relationship[rel].split(" ")[1]).set_is_enum(true)
                                    this.get_term(term.id).set_enum(term.relationship[rel].split(" ")[1])
                                }
                            }
                        }
                        else{
                            if (term.relationship.includes("has_context")){
                                    this.get_term(term.relationship.split(" ")[1]).set_is_context(true)
                                    this.get_term(term.id).add_context(this.get_term(term.relationship.split(" ")[1]))
                                }
                                if (term.relationship.includes("has_datatype")){
                                    this.get_term(term.relationship.split(" ")[1]).set_is_datatype(true)
                                    this.get_term(term.id).set_datatype(term.relationship.split(" ")[1])
                                }
                                if (term.relationship.includes("has_enum")){
                                    this.get_term(term.relationship.split(" ")[1]).set_is_enum(true)
                                    this.get_term(term.id).set_enum(term.relationship.split(" ")[1])
                                }
                        }
                    }
                    cpt+=1;

            }
        )
        //console.log(this.ontologyTerms)
        
        
        
        //Add instances for ontologyTerm
//        this.ontologies.instance.forEach(
//            instance=>{
//               // console.log(instance.instance_of)
//                //instance=
//                if (Array.isArray(instance.instance_of)){
//                    
//                    for (var elem in instance.instance_of){
//                         //console.log(instance.instance_of[elem])
//
//                        if (this.searchTree(this.ontologyTerms[0], instance.instance_of[elem])!=null){
//                            //console.log(this.searchTree(this.ontologyTerms[0], instance.instance_of[elem]))
//                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
//                                symbole=instance.property_value.split("\"")[1]
//                            }
//
//                            this.searchTree(this.ontologyTerms[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
//                        }
//                    }
//                }
//                else{
//                    console.log(instance.instance_of)
//                    if (this.searchTree(this.ontologyTerms[0], instance.instance_of)!=null){
//                        var symbole=""
//                        //console.log(this.searchTree(this.ontologyTerms[0], instance.instance_of))
//                        if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
//                           symbole=instance.property_value.split("\"")[1]
//                        }
//
//                        this.searchTree(this.ontologyTerms[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
//                    }
//                }
//
//                //console.log(this.searchTree(this.ontologyNode[0], instance.instance_of))
//                cpt+=1;
//
//            }
//        )
        //console.log(this.ontologyTerms)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        //second traversal to build hierarchical relationship and node for tree
        var cpt=0
        var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
        this.ontologyNode.push(t);
//        this.ontologyTerms.forEach(
//            term=>{
//                //console.log(term)
//                if (term.is_environment){
//                    
//                    if (term.is_a!=""){
//                            if (this.searchTree(this.ontologyNode[0],term.is_a)!=null){
//                                for (var c in this.searchTree(this.ontologyNode[0],term.is_a).context){
//                                    term.add_context(this.searchTree(this.ontologyNode[0],term.is_a).context[c])
//                                }
//                                this.searchTree(this.ontologyNode[0],term.is_a).add_children(term)
//                            }   
//                        }
//                        else{
//                            this.ontologyNode[0].add_children(term);
//                        }
//                }
//                if (!term.name.includes("Context") && !term.name.includes("DataTypes") ){
//                    if (cpt==0){
//                            var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
//                            this.ontologyNode.push(t);
//                    } 
//                    else{          
//                        if (term.is_a!=""){
//                            if (this.searchTree(this.ontologyNode[0],term.is_a)!=null){
//                                for (var c in this.searchTree(this.ontologyNode[0],term.is_a).context){
//                                    term.add_context(this.searchTree(this.ontologyNode[0],term.is_a).context[c])
//                                }
//                                this.searchTree(this.ontologyNode[0],term.is_a).add_children(term)
//                            }   
//                        }
//                        else{
//                            this.ontologyNode[0].add_children(term);
//                        }
//                    }
//                    //console.log(this.ontologyNode)
//                    cpt+=1
//                }
                
                //console.log(cpt)
//            }
//        )  
//        console.log(this.ontologyNode)
        
        
        //build context hierarchy
        var cpt=0
        this.ontologyTerms.forEach(
            term=>{
                //console.log(term)
                if (term.is_environment){
                    
                    if (term.is_a!=""){
                            if (this.searchTree(this.ontologyNode[0],term.is_a)!=null){
                                
                                //need to inherit context to node children 
                                for (var c in this.searchTree(this.ontologyNode[0],term.is_a).context){
                                    term.add_context(this.searchTree(this.ontologyNode[0],term.is_a).context[c])
                                }
                                
                                this.searchTree(this.ontologyNode[0],term.is_a).add_children(term)
                            }   
                    }
                    else{
                        this.ontologyNode[0].add_children(term);
                    }
                }
                if (term.is_context){
//                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
                    //console.log(term.name)
                    
                   
                
                    
                    if (term.is_a!=""){
                         if (this.searchTree(this.ontologyContext[0],term.is_a)!=null){
                                this.searchTree(this.ontologyContext[0],term.is_a).add_children(term)
                        }   
                    }
                    else{
                         this.ontologyContext.push(new OntologyTerm(term.id,term.name,[],""));
                         //this.ontologyContext[0].add_children(term);
                    }
                }  
                if (term.is_datatype){
//                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
                    //console.log(term)
                    
                    if (term.is_a!=""){
                         if (this.searchTree(this.ontologyDatatype[0],term.is_a)!=null){
                                this.searchTree(this.ontologyDatatype[0],term.is_a).add_children(term)
                        }   
                    }
                    else{
                         this.ontologyDatatype.push(new OntologyTerm(term.id,term.name,[],""));
                         //this.ontologyContext[0].add_children(term);
                    }
                }  
                if (term.is_enumeration){
//                if (term.name.includes("Context") || term.name.includes("Quantity") || term.name.includes("FreeText")|| term.name.includes("ResponseRange") ||term.name.includes("DataTypes")){
                    //console.log(term)
                    this.ontologyEnum.push(new OntologyTerm(term.id,term.name,[],""));
                    
//                    if (term.is_a!=""){
//                         if (this.searchTree(this.ontologyEnum[0],term.is_a)!=null){
//                                this.searchTree(this.ontologyEnum[0],term.is_a).add_children(term)
//                        }   
//                    }
//                    else{
//                         this.ontologyEnum.push(new OntologyTerm(term.id,term.name,[],""));
//                         //this.ontologyContext[0].add_children(term);
//                    }
                }                        
//                if (term.is_context){    
//                    if (cpt==0){
//                            var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
//                            this.ontologyContext.push(t);
//                            this.ontologyContext[0].add_children(term);
//                    } 
//                    else{          
//                        if (term.is_a!=""){
//                            if (this.searchTree(this.ontologyContext[0],term.is_a)!=null){
//                                this.searchTree(this.ontologyContext[0],term.is_a).add_children(term)
//                            }   
//                        }
//                        else{
//                            this.ontologyContext[0].add_children(term);
//                        }
//                    }
//                    //console.log(this.ontologyNode)
//                    cpt+=1
                //}
                
                
                //console.log(cpt)
            }
        )
//        console.log(this.searchTerm(this.ontologyEnum,'XEO:00171').name)
//        console.log(this.ontologyNode)  
//        console.log(this.ontologyContext)
//        console.log(this.ontologyDatatype)
//        console.log(this.ontologyEnum)

        //build datatype hierarchy
//        var cpt=0
//        this.ontologyTerms.forEach(
//            term=>{
//                //console.log(term)
//                if (term.name.includes("DataTypes")){
//                    console.log(term.name)
//                    if (cpt==0){
//                            var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
//                            this.ontologyDatatype.push(t);
//                            this.ontologyDatatype[0].add_children(term);
//                    } 
//                    else{          
//                        if (term.is_a!=""){
//                            if (this.searchTree(this.ontologyTerms[0],term.is_a)!=null){
//                                this.searchTree(this.ontologyTerms[0],term.is_a).add_children(term)
//                            }   
//                        }
//                        else{
//                            this.ontologyDatatype[0].add_children(term);
//                        }
//                    }
//                    //console.log(this.ontologyNode)
//                    cpt+=1
//                }
//                
//                //console.log(cpt)
//            }
//        )
//        console.log(this.ontologyDatatype)  






        //Add instances for ontologyTerm
        if (this.ontologies.instance){
            this.ontologies.instance.forEach(
                instance=>{
                   // console.log(instance.instance_of)
                    //instance=
                    if (Array.isArray(instance.instance_of)){

                        for (var elem in instance.instance_of){

                            if (this.searchTree(this.ontologyNode[0], instance.instance_of[elem])!=null){
                                //console.log(this.searchTree(this.ontologyNode[0], instance.instance_of[elem]))
                                if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                    symbole=instance.property_value.split("\"")[1]
                                }

                                this.searchTree(this.ontologyNode[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
                            }

                            if (this.searchTree(this.ontologyContext[0], instance.instance_of[elem])!=null){
                                //console.log(this.searchTree(this.ontologyContext[0], instance.instance_of[elem]))
                                if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                    symbole=instance.property_value.split("\"")[1]
                                }

                                this.searchTree(this.ontologyContext[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
                            }

                            if (this.searchTree(this.ontologyEnum[0], instance.instance_of[elem])!=null){
                                var symbole=""
                                //console.log(this.searchTree(this.ontologyEnum[0], instance.instance_of[elem]))
                                if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                    symbole=instance.property_value.split("\"")[1]
                                }

                                this.searchTree(this.ontologyEnum[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
                            }

                        }
                    }
                    else{

                        if (this.searchTree(this.ontologyNode[0], instance.instance_of)!=null){
                            var symbole=""
                            //console.log(this.searchTree(this.ontologyEnum[0], instance.instance_of))
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                               symbole=instance.property_value.split("\"")[1]
                            }

                            this.searchTree(this.ontologyNode[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }

                        if (this.searchTree(this.ontologyContext[0], instance.instance_of)!=null){
                            //console.log(instance.id);
                            //console.log(this.searchTree(this.ontologyContext[0], instance.instance_of));
                            //console.log(instance.property_value);
                            var symbole=""
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                symbole=instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyContext[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }

                        if (this.searchTree(this.ontologyEnum[0], instance.instance_of)!=null){
                            var symbole=""
                            //console.log(this.searchTree(this.ontologyEnum[0], instance.instance_of))
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                               symbole=instance.property_value.split("\"")[1]
                            }

                            this.searchTree(this.ontologyEnum[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }


                    }

                    //console.log(this.searchTree(this.ontologyNode[0], instance.instance_of))
                    cpt+=1;

                }
            )
        }
//        console.log(this.ontologyContext);
//        console.log(this.ontologyEnum);
        delete this.ontologyTerms
        return this.ontologyNode;
  }
  

  
  
  
  get_term(term_id:string) : any{
      var term:OntologyTerm;
      this.ontologyTerms.forEach(
          t=>{
              if (t.id===term_id){
                term=t
                //console.log(term_id)
              }

          })
      return term
  }
  
  
  searchTerm(terms:OntologyTerm [],term_id:string) : any{
      var term:OntologyTerm;
      terms.forEach(
          t=>{  
                //console.log(t)
                if(t.id == term_id){
                    //console.log(t)
                    //console.log(term_id)
                    term=t
                    //return t;
                }
                else if (t.children != null){
                    var i;
                    var result = null;
                    for(i=0; result == null && i < t.children.length; i++){
                        //console.log(t.children[i])
                        result = this.searchTerm([t.children[i]], term_id);
                        term=this.searchTerm([t.children[i]], term_id);
                    }
                    //return result;

                }
                
          }
    )
    return term
                
                
    //return null
  }
  

  
  searchTree(term:OntologyTerm, term_id:string){
     if(term.id == term_id){
          return term;
     }else if (term.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < term.children.length; i++){
              //console.log(term.children[i])
               result = this.searchTree(term.children[i], term_id);
          }
          return result;
     }
     return null;
    }
  
  get_term2(term_id:string) : any{
      var term:OntologyTerm;
      this.ontologyNode.forEach(
          t=>{
              if (t.id===term_id){
                term=t
                //console.log(term_id)
              }

          })
      return term
  }
  
  get_node(term_id:string) : OntologyTerm{
      var term:OntologyTerm;
      this.ontology_tree.forEach(
          t=>{
              if (t.id===term_id){
                term=t
                //console.log(term_id)
              }

          })
      return term
  }
  get_termchild(term_id:string) : OntologyTerm[]{
      var term:OntologyTerm[];
      this.ontologyTerms.forEach(
          t=>{
              if (t.id===term_id){
                term=t.children
                //console.log(term_id)
              }

          })
      return term
  }
  
  get_children(node_id:string,loc_tree: FoodNode[]): FoodNode[]{
      var chil:FoodNode[];
      loc_tree[0].children.forEach(
        stu=>{
                if (stu.name==node_id){
                    chil=stu.children;
                };
              }
        )
       return chil;
      
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
//  get_data(){
//      this.investigations=[];
//      let user=JSON.parse(localStorage.getItem('currentUser'));
//      console.log(user)
//      this.investigationService.getInvestigations(user._key).toPromise().then(
//            data => {
//                        this.global_array=['investigations']
//                        this.investigations=data;  
//                        //console.log(this.investigations)
//                        let inv_array=[];
//                        this.investigations.forEach(
//                            inv=>{
//                                //console.log(inv._key);
//                                inv_array.push(inv._key)
//                            }
//                        );
//                        this.global_array.push(inv_array);
//                        //console.log(this.global_array);
//                        
//                    }
//        ); 
//  }
}







//        //Display investigations tree
//        var term=new OntologyTerm("jjjj","hhhhh",true,"trree")     
//        let user=JSON.parse(localStorage.getItem('currentUser'));

//        this.globalService.get_by_parent_key(user._key,'investigation').toPromise().then(
//              data => {
//                          this.my_tree=[{name:'investigations',children:[]}]
//                          this.investigations=data;  
//                          //console.log(this.investigations)
//                          //let inv_array=[];
//                          this.investigations.forEach(
//                              inv=>{
//                                  //console.log(inv._key);
//                                  this.my_tree[0].children.push({name:"Investigation "+inv._key,children:[]})
//                                  this.studies=[];
//                                  this.globalService.get_by_parent_key(inv._key,'study').toPromise().then(
//                                    data => {
//                                                this.studies= data; 
//                                                this.studies.forEach(
//                                                    stu=>{
//                                                         this.get_children("Investigation "+inv._key,this.my_tree).push({name:'studies',children:[]})
//                                                         this.get_children("Investigation "+inv._key,this.my_tree)[0].children.push({name:"Study "+stu._key,children:[]})
//                                                         //onsole.log(this.my_tree);
//                                                          this.dataSource.data = this.my_tree;
//                                                         //console.log(this.my_tree[0].children[0].name['742824'])//.push({name:'study1',children:[]})); 
//    
//                                                    })
//                                             }
//                                  );
//        
//                                  //this.global_array[0]['children'].push(inv._key)
//                              }
//                          );
//                          //this.global_array.push(inv_array);
//                          
//
//                      }
//          );

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */