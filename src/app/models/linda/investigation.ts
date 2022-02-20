
export interface InvestigationInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Investigation unique ID': string;
    'Investigation title': string;
    'Investigation description': string;
    'Submission date': string;
    'Public release date': string;
    'License': string;
    'Associated publication': string;
}

export class Investigation implements InvestigationInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Investigation unique ID': string;
    'Investigation title': string;
    'Investigation description': string;
    'Submission date': string;
    'Public release date': string;
    'License': string;
    'Associated publication': string;
    constructor(){

        this["Associated publication"]=""
        this["Definition"]=""
        this["Investigation description"]=""
        this["Investigation title"]=""
        this["Investigation unique ID"]=""
        this["License"]=""
        this["Public release date"]=""
        this["Submission date"]=""
    }
}
