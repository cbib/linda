export interface StudyInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Study unique ID': string;
    'Study Name': string;
    'Study title':string;
    'Cultural practices': string;
    'Contact institution': string;
    'Geographic location (longitude)': string;
    'Geographic location (latitude)': string;
    'Geographic location (altitude)': string;
    'Geographic location (country)':string;
    'Start date of study': string;
    'End date of study': string;
    'Description of growth facility': string;
    'Map of experimental design':string;
    'Experimental site name':string;
    'Description of the experimental design':string;
    'Study description':string;
    'Observation unit description':string;
    'Observation unit level hierarchy':string;
    'Type of experimental design':string;
}

export function instanceOfStudy(object: any): object is StudyInterface {
    return object;
}

export class Study implements StudyInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Study unique ID': string;
    'Study Name': string;
    'Study title':string;
    'Cultural practices': string;
    'Contact institution': string;
    'Geographic location (longitude)': string;
    'Geographic location (latitude)': string;
    'Geographic location (altitude)': string;
    'Geographic location (country)':string;
    'Start date of study': string;
    'End date of study': string;
    'Description of growth facility': string;
    'Map of experimental design':string;
    'Experimental site name':string;
    'Description of the experimental design':string;
    'Study description':string;
    'Observation unit description':string;
    'Observation unit level hierarchy':string;
    'Type of experimental design':string;
    constructor(study_id:string=""){
        this["Definition"]=""
        this["Study unique ID"]=study_id
        this["Study Name"]=""
        this["Study title"]=""
        this["Cultural practices"]=""
        this["Contact institution"]=""
        this["Geographic location (longitude)"]=""
        this["Geographic location (latitude)"]=""
        this["Geographic location (altitude)"]=""
        this["Geographic location (country)"]=""
        this["Start date of study"]=""
        this["End date of study"]=""
        this["Description of growth facility"]=""
        this["Map of experimental design"]=""
        this["Experimental site name"]=""
        this["Description of the experimental design"]=""
        this["Study description"]=""
        this["Observation unit description"]=""
        this["Observation unit level hierarchy"]=""
        this["Type of experimental design"]=""
    }
}