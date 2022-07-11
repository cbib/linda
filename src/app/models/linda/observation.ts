export interface ObservationInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Observation ID':string;
    'Observation description':string;
    'Observation date':Date;
    'Destructive':boolean
    'obsUUID':string;
    'sampleUUID':string;
    'Observed variable ID':string;
    'Observed variable measure':string|number;
    'Observed variable unit':string;
    'Observed trait':string;
}

export class Observation implements ObservationInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Observation ID':string;
    'Observation description':string;
    'Observation date':Date;
    'Destructive':boolean
    'obsUUID':string;
    'sampleUUID':string;
    'Observed variable ID':string
    'Observed variable measure':string|number;
    'Observed variable unit':string;
    'Observed trait':string;
    constructor(obs_id:string,obs_desc:string,obs_date:Date,destructive:boolean,sampleuuid:string, obsuuid:string, obs_var_id:string, observed_variable_unit:string, observed_trait:string){
        this["Observation ID"]=obs_id
        this["Observation description"]=obs_desc
        this["Observation date"]=obs_date
        this["Destructive"]=destructive
        this["sampleUUID"]=sampleuuid
        this["obsUUID"]=obsuuid
        this["Observed variable ID"]=obs_var_id
        this["Observed variable measure"]=0
        this["Observed variable unit"]=observed_variable_unit
        this["Observed trait"]=observed_trait
    }
    set observed_variable_measure(_observed_variable_measure:string|number){
        this["Observed variable measure"]=_observed_variable_measure
    }
    set observed_variable_unit(_observed_variable_unit:string){
        this["Observed variable unit"]=_observed_variable_unit
    }
}