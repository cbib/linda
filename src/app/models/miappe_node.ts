
export class MiappeNode {
    
        private data;
        public children:MiappeNode[]
        private element_type:string
        public current_data=[]
        public current_data_array=[]
        public current_observation_unit_data:{"observation_units":[],"biological_materials":[],"samples":[], "experimental_factors":[] }={"observation_units":[],"biological_materials":[],"samples":[], "experimental_factors":[] }
        public id:string;
        public expandable:boolean;
        public def:string
        public model_type:string
        public model_key:string
        public name:string;
        public fill_percentage:number;
        public parent_id:string;
        //has_child = MiappeNode.has_child;

        public get_id(){
            return this.id;
        }
        public get_parent_id(){
            return this.parent_id;
        }

        public set_current_observation_unit_data(current_observation_unit_data:{"observation_units":[],"biological_materials":[],"samples":[], "experimental_factors":[] }){
            return this.current_observation_unit_data=current_observation_unit_data
        }
        public get_current_observation_unit_data(){
            return this.current_observation_unit_data
        }

        public set_current_data_array(current_data_array:[]){
            return this.current_data_array=current_data_array
        }
        public get_current_data_array(){
            return this.current_data_array
        }
        public get_current_data(){
            return this.current_data
        }
        public set_current_data(current_data:[]){
            this.current_data=current_data
        }
        
        public get_model_key(){
            
            return this.model_key
        }
        public set_model_key(_model_key){
            
            this.model_key=_model_key
        }
        public get_model_type(){
            return this.model_type
        }
        public get_name(){
            return this.name;
        }
        
        public set_def(def:string){
            this.def=def;
        }
        public get_def(def:string){
            return this.def;
        }
        public has_child(){
            console.log(this.children.length)
            return true

        }
        public get_children(){
            return this.children;
        }
        public add_children(term:MiappeNode ){
            //console.log("add child")
            this.children.push(term);
        }

        constructor(id:string="", name:string="",def:string="",fill_percentage:number, parent_id:string="") {
            this.id=id;
            this.parent_id=parent_id
            this.def=def
            this.name=name;
            this.children=[]
            this.fill_percentage=fill_percentage
            this.current_data=[]
            this.current_data_array=[]
            this.current_observation_unit_data={"observation_units":[],"biological_materials":[],"samples":[], "experimental_factors":[] }
            this.model_key=this.id.split("/")[1]
            
        }
}