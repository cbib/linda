export interface SampleInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Sample ID':string;
    'External ID':string;
    'Plant anatomical entity': string;
    'Plant structure development stage':string;
    'Sample description':string;
    'Collection date':Date;
    'bmUUID':string;
    'obsUUID':string;
    'sampleUUID':string;
}

export class Sample implements SampleInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Sample ID':string;
    'External ID':string;
    'Plant anatomical entity': string;
    'Plant structure development stage':string;
    'Sample description':string;
    'Collection date': Date;
    'bmUUID':string;
    'obsUUID':string;
    'sampleUUID':string;
    constructor(sample_id:string,sample_ext_id:string,pae:string,psds:string,sample_desc:string,coll_date:Date,bmuuid:string,obsuuid:string,sampleuuid:string){
        this["Sample ID"]=sample_id
        this["External ID"]=sample_ext_id
        this["Plant anatomical entity"]=pae
        this["Plant structure development stage"]=psds
        this["Sample description"]=sample_desc
        this["Collection date"]=coll_date
        this["bmUUID"]=bmuuid
        this["obsUUID"]=obsuuid
        this["sampleUUID"]=sampleuuid
    }
}


export interface SampleFullInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Sample ID':string[];
    'External ID':string[];
    'Plant anatomical entity': string[];
    'Plant structure development stage':string[];
    'Sample description':string[];
    'Collection date':Date[];
    'bmUUID':string[];
    'obsUUID':string[];
    'sampleUUID':string[];
}