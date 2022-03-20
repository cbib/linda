export interface ExperimentalFactorInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Experimental Factor description':string;
    'Experimental Factor values':string;
    'Experimental Factor accession number':string;
    'Experimental Factor type':string;
}

export class ExperimentalFactor implements ExperimentalFactorInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Experimental Factor description':string;
    'Experimental Factor values':string;
    'Experimental Factor accession number':string;
    'Experimental Factor type':string;
    constructor(){
        this["Experimental Factor description"]=""
        this["Experimental Factor values"]=""
        this["Experimental Factor accession number"]=""
        this["Experimental Factor type"]=""
    }
}
