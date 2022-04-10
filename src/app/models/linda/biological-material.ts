export interface BiologicalMaterialInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Genus':string;
    'Species':string;
    'Organism':string;
    'Infraspecific name': string;
    'Material source ID (Holding institute/stock centre, accession)': string;
    'Material source description': string;
    'Material source longitude':string;
    'Material source altitude': string;
    'Material source latitude': string;
    'Material source DOI': string;
    'Material source coordinates uncertainty': string;
    'Biological material ID':string;
    'Biological material preprocessing': string;
    'Biological material coordinates uncertainty': string;
    'Biological material longitude':string;
    'Biological material latitude':string;
    'Biological material altitude':string;
    
}
export class BiologicalMaterial implements BiologicalMaterialInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Genus':string;
    'Species':string;
    'Organism':string;
    'Infraspecific name': string;
    'Material source ID (Holding institute/stock centre, accession)': string;
    'Material source description': string;
    'Material source longitude':string;
    'Material source altitude': string;
    'Material source latitude': string;
    'Material source DOI': string;
    'Material source coordinates uncertainty': string;
    'Biological material ID':string;
    'Biological material preprocessing': string;
    'Biological material coordinates uncertainty': string;
    'Biological material longitude':string;
    'Biological material latitude':string;
    'Biological material altitude':string;
    constructor(
       biological_material_id:string,
       genus:string="", 
       species:string="",
       organism:string="",
       infraspecific_name:string="",
       material_source_id:string="",
       material_source_description:string="",
       material_source_longitude:string="",
       material_source_altitude:string="",
       material_source_latitude:string="",
       material_source_doi:string="",
       material_source_coordinates_uncertainty:string="",
       biological_material_preprocessing:string="",
       biological_material_coordinates_uncertainty:string="",
       biological_material_longitude:string="",
       biological_material_latitude:string="",
       biological_material_altitude:string="",

    ){
        this['Genus']=genus
        this['Species']=species
        this['Organism']=organism
        this['Infraspecific name']=infraspecific_name
        this['Material source ID (Holding institute/stock centre, accession)']=material_source_id
        this['Material source description']=material_source_description
        this['Material source longitude']=material_source_longitude
        this['Material source altitude']=material_source_altitude
        this['Material source latitude']=material_source_latitude
        this['Material source DOI']=material_source_doi
        this['Material source coordinates uncertainty']=material_source_coordinates_uncertainty
        this['Biological material ID']=biological_material_id
        this['Biological material preprocessing']=biological_material_preprocessing
        this['Biological material coordinates uncertainty']=biological_material_coordinates_uncertainty
        this['Biological material longitude']=biological_material_longitude
        this['Biological material latitude']=biological_material_latitude
        this['Biological material altitude']=biological_material_altitude

        // date is still to define
    }
}
export interface BiologicalMaterialFullInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Genus':string;
    'Species':string;
    'Organism':string;
    'Infraspecific name': string;
    'Material source ID (Holding institute/stock centre, accession)': string[];
    'Material source description': string[];
    'Material source longitude':string[];
    'Material source altitude': string[];
    'Material source latitude': string[];
    'Material source DOI': string[];
    'Material source coordinates uncertainty': string[];
    'Biological material ID':string[][];
    'Biological material preprocessing': string[][];
    'Biological material coordinates uncertainty': string[][];
    'Biological material longitude':string[][];
    'Biological material latitude':string[][];
    'Biological material altitude':string[][];
    
}
