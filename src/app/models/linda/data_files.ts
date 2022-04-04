export interface AssociatedHeadersInterface{
      "header": string;
      "selected": boolean;
      "associated_term_id": string;
      "associated_component": string;
      "associated_component_field": string;
      "associated_linda_id": string[];
      "associated_parent_id": string[];
      "associated_values": string[];
      "is_time_values": boolean;
      "is_numeric_values": boolean;
    }


export interface DataFileInterface {
  "_id":string;
  "_key":string;
  "_rev":string;
  "Data file link": string;
  "Data file description": string;
  "Data file version": string;
  "Data":{}[];
  "associated_headers":AssociatedHeadersInterface[];
  "headers":string[];
}

export class DataFile implements DataFileInterface {
  '_id':string;
  '_key':string;
  '_rev':string;
  "Data file link": string;
  "Data file description": string;
  "Data file version": string;
  "Data":{}[];
  "associated_headers":AssociatedHeadersInterface[];
  "headers":string[];
  constructor(){
      this['Data file link']=""
      this['Data file description']=""
      this['Data file version']=""
      this['Data']=[]
      this['associated_headers']=[]
      this['headers']=[]
      // date is still to define
  }
}