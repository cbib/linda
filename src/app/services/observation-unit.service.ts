
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { Investigation } from '../models/observation_unit';
import { User } from '../models/user';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable({
  providedIn: 'root'
})

export class ObservationUnitService {
    private APIUrl:string;
    private headers:any;
    private auth = ('guest:guest');
    private observation_unit  = {};
    private observation_units:any  = [];
    //private observation_unitUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/observation_unit';
    //private observation_unitUpUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/update_observation_unit';
    //private observation_unitsUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/observation_units';
    private FAIRDOM='https://fairdomhub.org/observation_units/56';
    private httpOptions = {
        headers: new HttpHeaders({'Content-Type':  'application/json','Access-Control-Allow-Origin': '*','Authorization': 'Bearer ' + btoa(this.auth),'Accept': '*/*'})    
    };
    constructor(private http: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
    };
    
    private extractData(res: Response) {
        let body = res;
        //console.log(body);
        //alert(JSON.stringify(body))
        return body || { };
    }
    
    get_observation_unit_model(): Observable<any> {
        
        return this.http.get(`${this.APIUrl}/observation_unit`).pipe(map(this.extractData));
        
       
    }
//    get_observation_units_fairdom(): Observable<any> {
//        
//        return this.http.get(this.FAIRDOM).pipe(map(this.extractData));
//       
//    }
    
    update_field(field_value:string, observation_unit_key:string, field:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        console.log(field);
        let obj2send={
            'username': user.username,
            'password': user.password,
            'observation_unit_id':'observation_units/'+observation_unit_key,
            'observation_unit_key':observation_unit_key,
            'field':field,
            'value': field_value
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl}/update_observation_unit`, obj2send);
    }
    add_observation_units(observation_unit_values:{}) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        console.log(localStorage.getItem('currentUser'));
        console.log(user._id);
//        console.log(observation_unit_values);
        let obj2send={
        
        'username': user.username,
        'password': user.password,
        'user_id':user._id,
        'observation_unit_values': observation_unit_values
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl}/observation_units`, obj2send);
        
    }
    
    show_observation_units(){
        this.http.get(`${this.APIUrl}/observation_unit`).subscribe((res)=>{
            alert(res);
        });
    }
    //get observation_unit by key
    getInvestigation(key){
        return this.http.get(`${this.APIUrl}/observation_unit`+'/'+ key).pipe(map(this.extractData));
    }
    
    
    //get all observation_units for a given user
    getInvestigations(user_key:string) {
        //let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(user_key)
        return this.http.get(`${this.APIUrl}/observation_units`+'/'+user_key).pipe(map(this.extractData));
    }
    
    
    // Implement a method to handle errors if any
    private handleError(err: HttpErrorResponse | any) {
     alert(err)
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }
}

