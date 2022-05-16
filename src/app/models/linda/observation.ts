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
    'Observed variable ID':string
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
    constructor(obs_id:string,obs_desc:string,obs_date:Date,destructive:boolean,sampleuuid:string, obsuuid:string, obs_var_id:string){
        this["Observation ID"]=obs_id
        this["Observation description"]=obs_desc
        this["Observation date"]=obs_date
        this["Destructive"]=destructive
        this["sampleUUID"]=sampleuuid
        this["obsUUID"]=obsuuid
        this["Observed variable ID"]=obs_var_id
    }
}