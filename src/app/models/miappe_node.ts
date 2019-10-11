
export class MiappeNode {
    
        private data;
        public children:MiappeNode[]
        private element_type:string
        public id:string;
        public def:string
        public name:string;
        public fill_percentage:number;
        //has_child = MiappeNode.has_child;

        public get_id(){
            return this.id;
        }
        
        public get_key(){
            return this.id.split("/")[1];
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

        constructor(id:string="", name:string="",def:string="",fill_percentage:number) {
            this.id=id;
            this.def=def
            this.name=name;
            this.children=[]
            this.fill_percentage=fill_percentage
            
        }
}