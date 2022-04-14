export interface EventInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Event type':string;
    'Event date': Date;
    'Event accession number':string;
    'Event description':string;
}

export class LindaEvent implements EventInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Event type':string;
    'Event date': Date;
    'Event accession number':string;
    'Event description':string;
    constructor(){
        this["Event type"]=""
        this["Event accession number"]=""
        this["Event description"]=""
        // date is still to define
    }
}