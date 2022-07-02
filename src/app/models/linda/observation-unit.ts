export interface ObservationUnitInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Observation unit ID':string[];
    'Observation unit type':string[];
    'External ID':string[];
    'Spatial distribution':string[];
    'Observation Unit factor value':string[][];
    'obsUUID':string[];   
}
export class ObservationUnit implements ObservationUnitInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Observation unit ID':string[];
    'Observation unit type':string[];
    'External ID':string[];
    'Spatial distribution':string[];
    'Observation Unit factor value':string[][];
    'obsUUID':string[];

    constructor(){
        this['Observation unit ID']=[]
        this['Observation unit type']=[]
        this['External ID']=[]
        this['Spatial distribution']=[]
        this['Observation Unit factor value']=[]
        this['obsUUID']=[]
    }
}
export interface ObservationUnitCompactedInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Observation unit ID':string;
    'Observation unit type':string;
    'External ID':string;
    'Spatial distribution':string;
    'Observation Unit factor value':string[];
    'obsUUID':string;   
}
export class ObservationUnitCompacted implements ObservationUnitCompactedInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Observation unit ID':string;
    'Observation unit type':string;
    'External ID':string;
    'Spatial distribution':string;
    'Observation Unit factor value':string[];
    'obsUUID':string;

    constructor(){
        this['Observation unit ID']=""
        this['Observation unit type']=""
        this['External ID']=""
        this['Spatial distribution']=""
        this['Observation Unit factor value']=[]
        this['obsUUID']=""
    }
}