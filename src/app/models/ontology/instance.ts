
export class Instance {
    
    
    
        public id:string;
        public name:string;
        public _symbol:string

        
        
        public get_id(){
            return this.id;
        }
        public get_name(){
            return this.name;
        }
        public get_symbol(){
            return this._symbol;
        }


        constructor(id:string, name:string, _symbol:string="") {
            this.id=id;
            this.name=name;
            this._symbol=_symbol;
        }
    
    
    
    
    
}





