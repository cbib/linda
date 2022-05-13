
//Replication interface and class
export interface ReplicationInterface {
    "Replicate number": number;
    'Replication ID': "CO_715:0000149";
}
export class Replication implements ReplicationInterface{
    "Replicate number": number;
    'Replication ID': "CO_715:0000149";
    constructor(){
        this["Replicate number"]=0
    }
    set_replicate_number(_replicate_number:number){
        this["Replicate number"]=_replicate_number
    }
    get_replicate_number(){
        return this["Replicate number"]
    }
}
//Row Design interface and class
export interface RowDesignInterface {
    'PlotDesign ID': string;
    "Row length": {
        "value": number;
        "ID": string;
    };
    "Row number": {
        "value": number;
        "ID": string;
    };
    "Row per plot": {
        "value": number;
        "ID": string;
    };
}
export class RowDesign implements RowDesignInterface{
    'PlotDesign ID': "CO_715:0000156";
    "Row length": {
        "value": number;
        "ID": "CO_715:0000157";
    };
    "Row number": {
        "value": number;
        "ID": "CO_715:0000158";
    };
    "Row per plot": {
        "value": number;
        "ID": "CO_715:0000161";
    };
    constructor(){
        this["Row length"]={value:null,  "ID": "CO_715:0000157"}
        this["Row number"]={value:null,  "ID": "CO_715:0000158"}
        this["Row per plot"]={value:null,  "ID": "CO_715:0000161"}
    }
    set_row_number(_row_number:number){
        this["Row number"].value=_row_number
    }
    set_row_length(_row_length:number){
        this["Row length"].value=_row_length
    }
    set_row_per_plot(_row_per_plot:number){
        this["Row per plot"].value=_row_per_plot
    }
    static create_row_design(obj) {
        var field = new RowDesign();
        for (var prop in obj) {
            if (field.hasOwnProperty(prop)) {
                field[prop] = obj[prop];
            }
        }
    
        return field;
    }
}

//Plot Design interface and class
export interface PlotDesignInterface {
    'PlotDesign ID': string;
    "Column number": {
        "value": number;
        "ID": string;
    };
    "Plot size": {
        "value": number;
        "ID": string;
    };
    "Plot number": {
        "value": number;
        "ID": string;
    };
    "Plant stand number": {
        "value": number;
        "ID": string;
    };
    "Row design": {
        "value": RowDesign[];
        "ID": string;
    };
    "Associate_material_source": {
        "value": string;
        "ID": string;
    };
    "Associated_biological_material": {
        "value": string[];
        "ID": string;
    };
    "Associated samples": {
        "value": string[];
        "ID": "ASSOCIATEDSAMPLES";
    };
    "Replicate number": {
        "value": number;
        "ID": string;
    };
    "Observation uuid": {
        "value": string;
        "ID": string;
    };
}
export class PlotDesign implements PlotDesignInterface{
    'PlotDesign ID': "CO_715:0000150";
    "Column number": {
        "value": number;
        "ID": "CO_715:0000151";
    };
    "Plot size": {
        "value": number;
        "ID": "CO_715:0000152";
    };
    "Plot number": {
        "value": number;
        "ID": "CO_715:0000155";
    };
    "Plant stand number": {
        "value": number;
        "ID": "CO_715:0000154";
    };
    "Row design": {
        "value": RowDesign[];
        "ID": "CO_715:0000156";
    };
    "Associate_material_source": {
        "value": string;
        "ID": "ASSOCIATEDMAT";
    };
    "Associated_biological_material": {
        "value": string[];
        "ID": "ASSOCIATEDBIOMAT";
    };
    "Associated samples": {
        "value": string[];
        "ID": "ASSOCIATEDSAMPLES";
    };
    "Replicate number": {
        "value": number;
        "ID": "REPLICATENUMBER";
    };
    "Observation uuid": {
        "value": string;
        "ID": "OBSERVATIONUUID";
    };
    constructor(column_num:number=null, plot_num:number=null,associate_material_source:string=null, associated_biological_material:string[]=[], replicate_num:number=null, obs_uuid:string=null, associated_samples:string[]=[] ){
        this["Column number"]={value:column_num,  "ID": "CO_715:0000151"}
        this["Plot size"]={value:null,  "ID": "CO_715:0000152"}
        this["Plot number"]={value:plot_num,  "ID": "CO_715:0000155"}
        this["Replicate number"]={value:replicate_num,  "ID": "REPLICATENUMBER"}
        this["Plant stand number"]={value:null,  "ID": "CO_715:0000154"}
        this["Row design"]={value: [],  "ID": "CO_715:0000156"}
        this.Associate_material_source={value: associate_material_source,  "ID": "ASSOCIATEDMAT"}
        this["Associated_biological_material"]={value:associated_biological_material,  "ID": "ASSOCIATEDBIOMAT"}
        this["Observation uuid"]={value:obs_uuid,  "ID": "OBSERVATIONUUID"}
        this["Associated samples"]={value:associated_samples,  "ID": "ASSOCIATEDSAMPLES"}

    }
    add_row_design(_row_design:RowDesign){
        this["Row design"].value.push(_row_design)
    }
    get_row_design(_row_number){
        return this["Row design"].value.filter(row_design=> row_design["Row number"].value===_row_number)[0]
    }
    set_observation_uuid(_obs_uuid:string){
        this["Observation uuid"].value=_obs_uuid
    }
    get_observation_uuid(){
        return this["Observation uuid"].value
    }
    set_plot_number(_plot_number:number){
        this["Plot number"].value=_plot_number
    }
    get_plot_number(){
        return this["Plot number"].value
    }
    set_replicate_number(_plot_number:number){
        this["Replicate number"].value=_plot_number
    }
    get_replicate_number(){
        return this["Replicate number"].value
    }
    set_plant_stand_number(_plant_stand_number:number){
        this["Plant stand number"].value=_plant_stand_number
    }
    set_plot_size(_plot_size:number){
        this["Plot size"].value=_plot_size
    }
    set_column_number(_column_number:number){
        this["Column number"].value=_column_number
    }
    add_material(_material_id:string){
        this["Associate_material_source"].value=_material_id
    }
    get_material(){
        return this["Associate_material_source"].value
    }
    add_biological_material(_associate_material_id:string){
        this["Associated_biological_material"].value.push(_associate_material_id)
    }
    get_biological_material(){
        return this["Associated_biological_material"].value
    }
    add_sample(_associate_sample_id:string){
        this["Associated samples"].value.push(_associate_sample_id)
    }
    get_sample_id(index:number){
        return this["Associated samples"].value[index]
    }
    set_samples(_samples:string[]){
        this["Associated samples"].value=_samples
    }
    add_samples(_samples:string[]){
        this["Associated samples"].value=this["Associated samples"].value.concat(_samples)
    }
    get_samples():{}[]{
        return this["Associated samples"].value
    }
    static create_plot_design(obj) {
        var field = new PlotDesign();
        for (var prop in obj) {
            if (field.hasOwnProperty(prop)) {
                field[prop] = obj[prop];
            }
        }
    
        return field;
    }
}

//Block Design interface and class
export interface CompleteBlockDesignInterface {
    'CompleteBlockDesign ID': string;
    "completely randomized design": {
        "value": boolean;
        "ID": string;
    };
    "Randomized complete block design": {
        "value": boolean;
        "ID": string;
    };
    "Latin square": {
        "value": boolean;
        "ID": string;
    };
}
export class CompleteBlockDesign implements CompleteBlockDesignInterface{
    'CompleteBlockDesign ID': "CO_715:0000145";
    "completely randomized design": {
        "value": boolean;
        "ID": "CO_715:0000146";
    };
    "Randomized complete block design": {
        "value": boolean;
        "ID": "CO_715:0000147";
    };
    "Latin square": {
        "value": boolean;
        "ID": "CO_715:0000241";
    };
    constructor(_completely_randomized_design:boolean=false, _randomized_complete_block_design:boolean=false, _latin_square:boolean=false){
        this["completely randomized design"]={value:_completely_randomized_design,  "ID": "CO_715:0000146"}
        this["Randomized complete block design"]={value:_randomized_complete_block_design,  "ID": "CO_715:0000147"}
        this["Latin square"]={value:_latin_square,  "ID": "CO_715:0000241"}
    }
}

//Block Design interface and class
export interface IncompleteBlockDesignInterface {
    'IncompleteBlockDesign ID': string;
    "Balanced incomplete design": {
        "value": boolean;
        "ID": string;
    };
    "Partially balanced design": {
        "value": boolean;
        "ID": string;
    };
}
export class IncompleteBlockDesign implements IncompleteBlockDesignInterface{
    'IncompleteBlockDesign ID': "CO_715:0000242";
    "Balanced incomplete design": {
        "value": boolean;
        "ID": "CO_715:0000243";
    };
    "Partially balanced design": {
        "value": boolean;
        "ID": "CO_715:0000244";
    };
    constructor(_balanced_incomplete_design:boolean=false, _partially_balanced_design:boolean=false){
        this["Balanced incomplete design"]={value:_balanced_incomplete_design,  "ID": "CO_715:0000243"}
        this["Partially balanced design"]={value:_partially_balanced_design,  "ID": "CO_715:0000244"}
    }
}

//Block Design interface and class
export interface BlockDesignInterface {
    'BlockDesign ID': string;
    "Block number": {
        "value": number;
        "ID": string;
    };
    "Blocks per trial": {
        "value": number;
        "ID": string;
    };
    /* "Plot design": {
        "value": PlotDesign[]| CompleteBlockDesign[] | IncompleteBlockDesign[];
        "ID": string;
    }; */
    "Plot design": {
        "value": PlotDesign[];
        "ID": "CO_715:0000150";
    };
    "Complete Block Design": {
        "value": CompleteBlockDesign[] ;
        "ID": "CO_715:0000145";
    };
    "Incomplete Block Design": {
        "value": IncompleteBlockDesign[];
        "ID": "CO_715:0000242";
    };

}
export class BlockDesign implements BlockDesignInterface{
    'BlockDesign ID': "CO_715:0000142";
    "Block number": {
        "value": number;
        "ID": "CO_715:0000143";
    };
    "Blocks per trial": {
        "value": number;
        "ID": "CO_715:0000144";
    };
    "Plot design": {
        "value": PlotDesign[];
        "ID": "CO_715:0000150";
    };
    "Complete Block Design": {
        "value": CompleteBlockDesign[] ;
        "ID": "CO_715:0000145";
    };
    "Incomplete Block Design": {
        "value": IncompleteBlockDesign[];
        "ID": "CO_715:0000242";
    };
    constructor(_block_number:number=0, _blocks_per_trial:number=0){
        this["Block number"]={value:_block_number,  "ID": "CO_715:0000143"}
        this["Blocks per trial"]={value:_blocks_per_trial,  "ID": "CO_715:0000144"}
        this["Plot design"]={value:[],  "ID": "CO_715:0000150"}
        this["Complete Block Design"]={value:[],  "ID": "CO_715:0000145"}
        this["Incomplete Block Design"]={value:[],  "ID": "CO_715:0000242"}
    }
    get_plot_design(_plot_number){
        return this["Plot design"].value.filter(plot_design=> plot_design["Plot number"].value===_plot_number)[0]
    }
    add_plot_design(_plot_design:PlotDesign){
        this["Plot design"].value.push(_plot_design)
    }
    clean_plot_design(){
        this["Plot design"].value=[]
    }
    add_complete_block_design(_complete_block_design:CompleteBlockDesign){
        this["Complete Block Design"].value.push(_complete_block_design)
    }
    add_incomplete_block_design(_incomplete_block_design:IncompleteBlockDesign){
        this["Incomplete Block Design"].value.push(_incomplete_block_design)
    }
    static create_block_design(obj) {
        var field = new BlockDesign();
        for (var prop in obj) {
            if (field.hasOwnProperty(prop)) {
                field[prop] = obj[prop];
            }
        }
    
        return field;
    }
}


//Experimental Design interface and class
export interface ExperimentalDesignInterface     {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'ExperimentalDesign ID': string;
    "number of entries": {
        "value": number;
        "ID": string;
    };
    "Blocking": {
        "value": BlockDesignInterface [];
        "ID": string;
    };
    "Replication": {
        "value":  Replication;
        "ID": string;
    };
    "Associated biological Materials": {
        "value":  string;
        "ID": string;
    };
    "Associated observation units": {
        "value":  string;
        "ID": string;
    };
    "Associated sample": {
        "value":  string[];
        "ID": "LindaSamples";
    };
    "Associated sample ID": {
        "value":  string;
        "ID": "LindaSampleDbIds";
    };
}
export class ExperimentalDesign implements ExperimentalDesignInterface {
    // arango keys
    '_id':string;
    '_key':string;
    '_rev':string;
    // 
    'Definition': string;
    'ExperimentalDesign ID': "CO_715:0000003";
    "number of entries": {
        "value": number;
        "ID": "CO_715:0000148";
    };
    "Blocking": {
        "value":  BlockDesign[];
        "ID": "CO_715:0000245";
    };
    "Replication": {
        "value":  Replication;
        "ID": "CO_715:0000149";
    };
    "Associated biological Materials": {
        "value":  string;
        "ID": "LindaDbId";
    };
    "Associated observation units": {
        "value":  string;
        "ID": "LindaObsUnitDbId";
    };
    "Associated sample": {
        "value":  string[];
        "ID": "LindaSamples";
    };
    "Associated sample ID": {
        "value":  string;
        "ID": "LindaSampleDbIds";
    };
    constructor(){
        this["Definition"]="The process of planning a study to meet specified objectives or the allocation of treatments (inputs) to the experimental units (plots). Planning an experiment properly is very important in order to ensure that the right type of data and a sufficient sample size and power are available to answer the research questions of interest as clearly and efficiently as possible."
        this["Blocking"]={value: [], "ID":"CO_715:0000245"}
        this["Replication"]={value: null, "ID": "CO_715:0000149"}
        this["number of entries"]={value:null,"ID": "CO_715:0000148"}
        this["Associated biological Materials"]={value:null,"ID": "LindaDbId"}
        this["Associated observation units"]={value:null,"ID": "LindaObsUnitDbId"}
        this["Associated sample"]={value:[],"ID": "LindaSamples"}
        this["Associated sample ID"]={value:null,"ID": "LindaSampleDbIds"}
    }
    get_block_design(_block_number:number){
        return this.Blocking.value.filter(block_design=> block_design["Block number"].value===_block_number)
    }

    get_block_plot_design(_plot_number:number):PlotDesign{
        let _plot_design:PlotDesign=null;
        this.Blocking.value.forEach(block_design=> {
            block_design["Plot design"].value.forEach(plot_design=>{
                if (plot_design["Plot number"].value===_plot_number){
                    _plot_design=plot_design
                }
            });
        });
        return _plot_design
    }

    add_block_design(_block_design:BlockDesign){
        this.Blocking.value.push(_block_design)
    }
    set_replication(_replication:Replication){
        this.Replication={value: _replication, "ID": "CO_715:0000149"}
    }
    set_number_of_entries(_number_of_entries:number){
        this["number of entries"].value=_number_of_entries
    }
    get_biological_material_id(){
        return this["Associated biological Materials"].value
    }
    set_biological_material_id(biological_material_id:string){
        this["Associated biological Materials"].value=biological_material_id
    }
    set_observation_unit_id(observation_unit_id:string){
        this["Associated observation units"].value=observation_unit_id
    }
    
    get_observation_unit_id(){
        return this["Associated observation units"].value
    }
    add_sample_ids(sample_id:string){
        this["Associated sample"].value.push(sample_id)
    }
    set_sample_id(sample_id:string){
        this["Associated sample ID"].value=sample_id
    }
    get_sample_id(){
        return this["Associated sample ID"].value
    }
    get_sample_ids(index:number){
        return this["Associated sample"].value[index]
    }
    set_associated_samples(sample_data:string[]){
        this["Associated sample"].value=sample_data
    }
    add_associated_samples(sample_data:string[]){
        this["Associated sample"].value=this["Associated sample"].value.concat(sample_data)
    }
    get_associated_samples(){
        return this["Associated sample"].value
    }
    static create_design(obj) {
        var field = new ExperimentalDesign();
        for (var prop in obj) {
            if (field.hasOwnProperty(prop)) {
                field[prop] = obj[prop];
            }
        }
    
        return field;
    }
}

