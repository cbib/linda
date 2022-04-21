
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
    constructor(){
        this["Column number"]={value:null,  "ID": "CO_715:0000151"}
        this["Plot size"]={value:null,  "ID": "CO_715:0000152"}
        this["Plot number"]={value:null,  "ID": "CO_715:0000155"}
        this["Plant stand number"]={value:null,  "ID": "CO_715:0000154"}
        this["Row design"]={value: [],  "ID": "CO_715:0000156"}
    }
    add_row_design(_row_design:RowDesign){
        this["Row design"].value.push(_row_design)
    }
    get_row_design(_row_number){
        return this["Row design"].value.filter(row_design=> row_design["Row number"].value===_row_number)
    }
    set_plot_number(_plot_number:number){
        this["Plot number"].value=_plot_number
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
        return this["Plot design"].value.filter(plot_design=> plot_design["Plot number"].value===_plot_number)
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
    constructor(){
        this["Definition"]="The process of planning a study to meet specified objectives or the allocation of treatments (inputs) to the experimental units (plots). Planning an experiment properly is very important in order to ensure that the right type of data and a sufficient sample size and power are available to answer the research questions of interest as clearly and efficiently as possible."
        this["Blocking"]={value: [], "ID":"CO_715:0000245"}
        this["Replication"]={value: null, "ID": "CO_715:0000149"}
        this["number of entries"]={value:null,"ID": "CO_715:0000148"}
    }
    get_block_design(_block_number){
        return this.Blocking.value.filter(block_design=> block_design["Block number"].value===_block_number)
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
}

