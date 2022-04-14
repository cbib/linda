export interface EnvironmentInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Environment parameter':string;
    'Environment parameter value': string;
    'Environment parameter accession number':string;
}

export class Environment implements EnvironmentInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Environment parameter':string;
    'Environment parameter value': string;
    'Environment parameter accession number':string;
    constructor(){
        this['Environment parameter']=""
        this['Environment parameter value']=""
        this['Environment parameter accession number']=""
        // date is still to define
    }
}