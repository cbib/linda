
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
  selected_set:OntologyTerm[]

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
    private selected_set:OntologyTerm[]
    private selected_term:OntologyTerm;
    
    private ontologyTerms:OntologyTerm[];
    private ontologyDatatype:OntologyTerm[];
    private ontologyEnum:OntologyTerm[];
    private ontologyContext:OntologyTerm[];
    private ontologyNode:OntologyTerm[];
    
    //model ontology    
    private ontology:any = {};
    
    
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
        @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    {
        
            this.selected_term=this.data.selected_term;
            console.log(this.data);
            this.ontology_type=this.data.ontology_type;
            this.selected_set=this.data.selected_set;
            //console.log(this.selected_set);
            this.ontology_tree=[];
            this.ontologyTerms=[];
            this.ontologyContext=[];
            this.ontologyDatatype=[];
            this.ontologyEnum=[];
            this.ontologyNode=[];

           
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
    
    private treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.children);
    private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    private initialSelection = []
    private checklistSelection = new SelectionModel<ExampleFlatNode>(true,this.initialSelection /* multiple */);
    
    get_ontology(){
        return this.ontologiesService.get_ontology(this.ontology_type).toPromise().then(data => {this.ontology=data;})
    }
    async load(){
        await this.get_ontology()
    }
  
    async ngOnInit() {
        await this.get_ontology()
        this.ontologyNode=[]        
        var ontologies_list=["EnvO","EO","PO_Structure","PO_Development","CO_20","EFO","CO_715", "CO_322"]
        
        if(this.ontology_type==="XEO"){
            this.ontologyNode=this.build_xeo_isa_hierarchy(this.ontology);
        }
        else if(ontologies_list.includes(this.ontology_type )){  
            this.ontologyNode=this.build_eo_isa_hierarchy(this.ontology);
        } 
        else{
            console.log("no ontology defined")  
        }
        console.log("after build hierarchy function")          
        this.dataSource.data = this.ontologyNode;  
    }


 
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
    onOkClick(){
        //console.log(this.selected_term)
        console.log(this.selected_set)
        
    }
    

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(term:OntologyTerm): void {
        this.checklistSelection.toggle(term);
        console.log(this.checklistSelection)
        console.log(this.checklistSelection.isSelected(term))
        if (this.checklistSelection.isSelected(term)){
            this.data.selected_set.push(term)
            this.displayed=true;
            this.context_term=term["term"].get_context()
        }
        else{
            for(var i = this.data.selected_set.length - 1; i >= 0; i--) {
                if(this.data.selected_set[i]['id'] === term.id) {
                    this.data.selected_set.splice(i, 1);
                }
            }
            this.displayed=false;
            //this.context_term=term["term"].get_context()
        }
        console.log(this.data.selected_set)
    }
    
    
    show_info(term:OntologyTerm){
        
        //this.selected_term=term
        //this.data.selected_term=this.selected_term
        //this.data.selected_set=this.selected_set
        this.active_node=term
        //this.displayed=true;
        //this.context_term=term["term"].get_context()

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

    
    build_eo_isa_hierarchy(ontology:{}):OntologyTerm[]{
        var cpt=0;
        ontology["term"].forEach(
            term=>{
                if (!term["is_obsolete"]){
                    this.ontologyTerms.push(new OntologyTerm(term.id,term.name,[],""))
                    cpt+=1;
                }

            }
        )
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
        var cpt=0
        this.ontologyTerms.forEach(
            term=>{
                if (term.is_a!=""){
                    var t=this.get_term(term.id)
                    var t_parent=this.get_term(term.is_a)
                    if (t_parent!=null){
                        t_parent.add_children(t)
                    }
                }
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

        var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
        this.ontologyNode.push(t);
        for (let t in head_term){
            this.ontologyNode[0].add_children(head_term[t])
        }
        return this.ontologyNode;
    }
    
    build_xeo_isa_hierarchy(ontology:{}):OntologyTerm[]{

        //premier passage pour créer tous les termes 
        var cpt=0;
        this.ontologyTerms.push(new OntologyTerm(this.ontology_type,"",[],""));
        ontology["term"].forEach(
            term=>{
                    this.ontologyTerms.push(new OntologyTerm(term.id,term.name,[],""))
                    cpt+=1;
            }
        )
        //second passage pour créer tous les termes 
        var cpt=0;    
        ontology["term"].forEach(
            term=>{
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
        //second traversal to build hierarchical relationship and node for tree
        //build context hierarchy
        var t=new OntologyTerm(this.ontology_type,this.ontology_type,[],"")
        this.ontologyNode.push(t);
        var cpt=0
        this.ontologyTerms.forEach(
            term=>{
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
                    if (term.is_a!=""){
                         if (this.searchTree(this.ontologyContext[0],term.is_a)!=null){
                                this.searchTree(this.ontologyContext[0],term.is_a).add_children(term)
                        }   
                    }
                    else{
                         this.ontologyContext.push(new OntologyTerm(term.id,term.name,[],""));
                    }
                }  
                if (term.is_datatype){
                    if (term.is_a!=""){
                         if (this.searchTree(this.ontologyDatatype[0],term.is_a)!=null){
                                this.searchTree(this.ontologyDatatype[0],term.is_a).add_children(term)
                        }   
                    }
                    else{
                         this.ontologyDatatype.push(new OntologyTerm(term.id,term.name,[],""));
                    }
                }  
                if (term.is_enumeration){
                    this.ontologyEnum.push(new OntologyTerm(term.id,term.name,[],""));

                }                        
            }
        )
        //Add instances for ontologyTerm
        if (this.ontology.instance){
            this.ontology.instance.forEach(
                instance=>{
                    if (Array.isArray(instance.instance_of)){
                        for (var elem in instance.instance_of){
                            if (this.searchTree(this.ontologyNode[0], instance.instance_of[elem])!=null){
                                if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                    symbole=instance.property_value.split("\"")[1]
                                }
                                this.searchTree(this.ontologyNode[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
                            }
                            if (this.searchTree(this.ontologyContext[0], instance.instance_of[elem])!=null){
                                if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                    symbole=instance.property_value.split("\"")[1]
                                }
                                this.searchTree(this.ontologyContext[0], instance.instance_of[elem]).add_instance(new Instance(instance.id,instance.name,symbole))
                            }
                            if (this.searchTree(this.ontologyEnum[0], instance.instance_of[elem])!=null){
                                var symbole=""
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
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                               symbole=instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyNode[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }
                        if (this.searchTree(this.ontologyContext[0], instance.instance_of)!=null){
                            var symbole=""
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                                symbole=instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyContext[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }
                        if (this.searchTree(this.ontologyEnum[0], instance.instance_of)!=null){
                            var symbole=""
                            if (instance.property_value!=null && instance.property_value.includes("has_symbol")){
                               symbole=instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyEnum[0], instance.instance_of).add_instance(new Instance(instance.id,instance.name,symbole))
                        }
                    }
                    cpt+=1;
                }
            )
        }
        delete this.ontologyTerms
        return this.ontologyNode;
    }

    get_term(term_id:string) : any{
        var term:OntologyTerm;
        this.ontologyTerms.forEach(
            t=>{
                if (t.id===term_id){
                    term=t
                }
            })
        return term
    }
  
    searchTerm(terms:OntologyTerm [],term_id:string) : any{
        var term:OntologyTerm;
        terms.forEach(
            t=>{  
                if(t.id == term_id){
                    term=t
                }
                else if (t.children != null){
                    var i;
                    var result = null;
                    for(i=0; result == null && i < t.children.length; i++){
                        result = this.searchTerm([t.children[i]], term_id);
                        term=this.searchTerm([t.children[i]], term_id);
                    }
                }
            }
        )
        return term
    }

    searchTree(term:OntologyTerm, term_id:string){
        if(term.id == term_id){
            return term;
        }
        else if (term.children != null){
            var i;
            var result = null;
            for(i=0; result == null && i < term.children.length; i++){
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
    getStyle(): Object {
        return {backgroundColor: 'LightSteelBlue',  width: '100%' , 'margin-bottom':'10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px'}
    }
}
