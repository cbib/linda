import { Injectable } from '@angular/core';
import {OntologyTerm} from '../ontology/ontology-term'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class OntologiesService {
    //private _term:OntologyTerm;
    private APIUrl:string;
    public term:OntologyTerm;
//    private ontologyTerms:OntologyTerm[];
//    private ontologyDatatype:OntologyTerm[];
//    private ontologyContext:OntologyTerm[];
//    private ontologyTerms2:OntologyTerm[];    
//    private ontologies:any = {};
      
    constructor(private http:HttpClient) {
       
        this.APIUrl = Constants.APIConfig.APIUrl;
//      this.term=new OntologyTerm("eee","dddd",true,"rrr")
//      console.log(this.term)
      //console.log(Constants.APIConfig.get_api())
      
      
      //this._term=new OntologyTerm("XEO2333","QEZFDAQZE",true, "SRGDZER");
      //console.log(this._term.get_id())
  }
  private extractData(res: Response) {
        let body = res;
        //console.log(body);
        return body || { };
    }
  get_ontology(ontology_id:string){
    return this.http.get(this.APIUrl+"get_ontology/"+ontology_id).pipe(map(this.extractData));

  }
  
  get_crop_ontologies(ontology_id:string){
    return this.http.get(this.APIUrl+"get_crop_ontology/"+ontology_id).pipe(map(this.extractData));

  }
  
  
}
