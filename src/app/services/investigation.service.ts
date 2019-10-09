import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Investigation } from '../models/investigation';
import { User } from '../models/user';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable({
  providedIn: 'root'
})

export class InvestigationService {
    private APIUrl:string;
    private headers:any;
    private auth = ('guest:guest');
    private investigation  = {};
    private investigations:any  = [];
    //private investigationUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/get_investigation_model';
    //private investigationUpUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/update_investigation';
    //private investigationAddUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/add_investigation';
    //private investigationGetUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/get_investigation';
    //private investigationsUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/get_investigations';
    //private APIUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/';
    private FAIRDOM='https://fairdomhub.org/investigations/56';
    private httpOptions = {
        headers: new HttpHeaders({'Content-Type':  'application/json','Access-Control-Allow-Origin': '*','Authorization': 'Bearer ' + btoa(this.auth),'Accept': '*/*'})    
    };
    constructor(private http: HttpClient) { 
        this.APIUrl = Constants.APIConfig.APIUrl;
//    this.headers = new HttpHeaders({      
//      'Content-Type': 'application/json',
//      'Content-Encoding': 'utf8',
//      'Authorization': 'Basic' + btoa(this.auth)
//    });
    
//    this.headers= new HttpHeaders(
//        {
//          'Access-Control-Allow-Origin': '*',
//          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
//          'Access-Control-Allow-Credentials': 'true',
//          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
//          'Content-Type': 'application/json',
//          'Authorization': 'Bearer ' + btoa(this.auth),
//          'Accept': '*/*'
//        });
        //console.log(btoa(this.auth));
//        this.headers= new HttpHeaders(
//        {
//        'Access-Control-Allow-Origin': '*',
//        'Authorization': 'Basic' + btoa(this.auth),
//        'Content-Type': 'application/json'
//        
//        });
    
    };
    
    private extractData(res: Response) {
        let body = res;
        console.log(body);
        //alert(JSON.stringify(body))
        return body || { };
    }
    
    get_investigation_model(): Observable<any> {
        
        return this.http.get(this.APIUrl+"get_investigation_model").pipe(map(this.extractData));
       
    }
    is_exist(field:string, value:string):Observable<any>{
        let user=JSON.parse(localStorage.getItem('currentUser'));

        let obj2send={
            'username': user.username,
            'password': user.password,
            'field':field,
            'value': value
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl+"check_investigation"}`, obj2send).pipe(map(this.extractData));
    }
    
    update_field(field_value:string, investigation_key:string, field:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        console.log(field);
        let obj2send={
            'username': user.username,
            'password': user.password,
            'investigation_id':'investigations/'+investigation_key,
            'investigation_key':investigation_key,
            'field':field,
            'value': field_value
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl+"update_investigation"}`, obj2send);
    }
    add_investigations(investigation_values:{}) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        console.log(localStorage.getItem('currentUser'));
        console.log(user._id);
//        console.log(investigation_values);
        let obj2send={
        
        'username': user.username,
        'password': user.password,
        'user_id':user._id,
        'investigation_values': investigation_values
        };
        console.log(obj2send);
        //return this.http.post(`${this.investigationAddUrl}`, obj2send);   
        return this.http.post(`${this.APIUrl+"add_investigation"}`, obj2send);
    }
    
//    show_investigations(){
//        this.http.get(this.investigationUrl).subscribe((res)=>{
//            alert(res);
//        });
//    }
    //get investigation by key
    getInvestigation(key){
        //return this.http.get(this.investigationGetUrl+'/'+ key).pipe(map(this.extractData));
        return this.http.get(this.APIUrl+'/get_investigation/'+ key).pipe(map(this.extractData));

    }
    
    
    //get all investigations for a given user
    getInvestigations(user_key:string) {
        //let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(user_key)
        //return this.http.get(this.investigationsUrl+'/'+user_key).pipe(map(this.extractData));
        return this.http.get(this.APIUrl+'/get_investigations/'+ user_key).pipe(map(this.extractData));

    }
    
    
    // Implement a method to handle errors if any
    private handleError(err: HttpErrorResponse | any) {
     alert(err)
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }
}
