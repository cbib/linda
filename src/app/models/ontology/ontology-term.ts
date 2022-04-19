import { Instance } from './instance';



export class OntologyTerm {
    
    
    
        public id:string;
        public level:number
        public is_a:string;
        public unit:string;
        public expandable: boolean;
        public def:string
        public freetext:string
        public response_range:number
        public value:number
        public name:string;
        public comment:string;
        public enumeration:string;
        public relationship:string;
        public relationships=[];
        public relationshipstype=[];
        public datatype:string;
        public namespace:string
        public is_enumeration:boolean;
        public is_datatype:boolean;
        public has_relationship:boolean;
        public is_environment:boolean;
        public is_context:boolean;
        public context:OntologyTerm [];
        public children:OntologyTerm [];
        public instances:Instance [];
        
        public get_id(){
            return this.id;
        }
        public get_name(){
            return this.name;
        }
        public set_isa(is_a:string){
            this.is_a=is_a.split(" !")[0];
        }
        public set_CO_relationship(relationship:string){
            //console.log(relationship)
            this.is_a=relationship;
            //this.relationship=relationship
        }
        public set_relationship(relationship:string){
            this.relationship=relationship;
        }
        public add_relationship(relationship:string){
            this.relationships.push(relationship);
        }
        public add_relationship_type(relationshiptype:string){
            this.relationshipstype.push(relationshiptype);
        }
//        public set_context(context:OntologyTerm){
//            this.context=context;
//        }
        public add_context(context:OntologyTerm){
            this.context.push(context);
        }
        public get_context(){
            return this.context;
        }
        public set_freetext(_freetext:string){
            this.freetext=_freetext;
        }
        public get_freetext(){
            return this.freetext;
        }
        public set_unit(_unit:string){
            this.unit=_unit;
        }
        public get_unit(){
            return this.unit;
        }
        public set_response_range(_response_range:number){
            this.response_range=_response_range;
        }
        public get_response_range(){
            return this.response_range;
        }
        public set_value(_value:number){
            this.value=_value;
        }
        public get_value(){
            return this.value;
        }
        public set_namespace(_namespace:string){
            this.namespace=_namespace;
        }
        public get_namespace(){
            return this.namespace;
        }
        
        public set_def(def:string){
            this.def=def;
        }
        public get_def(){
            return this.def;
        }
        public set_comment(comment:string){
            this.comment=comment;
        }
        public get_comment(){
            return this.comment;
        }
        public set_enum(enumeration:string){
            this.enumeration=enumeration;
        }
        public get_enum(){
            return this.enumeration;
        }
        public set_datatype(datatype:string){
            this.datatype=datatype;
        }
        
        public get_datatype(){
            return this.datatype;
        }
        public get_children(){
            return this.children;
        }
        public add_children(term:OntologyTerm ){
            //console.log("add child")
            this.children.push(term);
        }
        public add_instance(instance:Instance ){
            this.instances.push(instance);
        }
        public set_is_context(is_context:boolean){
            this.is_context=is_context;
        }
        public set_has_relationship(has_relationship:boolean){
            this.has_relationship=has_relationship;
        }
        public get_has_relationship():boolean{
            return this.has_relationship;
        }
        public set_is_enum(is_enumeration:boolean){
            this.is_enumeration=is_enumeration;
        }
        public set_is_datatype(is_datatype:boolean){
            this.is_datatype=is_datatype;
        }
        public set_is_environment(is_environment:boolean){
            this.is_environment=is_environment;
        }
        
        constructor(id:string, name:string, context:OntologyTerm [], is_a:string="", namespace:string="") {
            this.id=id;
            this.def="";
            this.enumeration="";
            this.name=name;
            this.datatype="";
            this.namespace=namespace;
            this.relationship="";
            this.relationships=[];
            this.relationshipstype=[];
            this.comment="";
            this.context=[];
            this.is_context=false;
            this.is_datatype=false;
            this.is_enumeration=false;
            this.is_environment=false;
            this.has_relationship=false;
            this.children=[];
            this.instances=[];
            this.is_a=is_a;
            this.value=null;
            this.response_range=null;
            this.freetext="";
            this.unit=""
        }
    
    
    
    
    
}




    





