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

export class StudyService {
    private study  = {};
    private studys:any  = [];
    private APIUrl:string;
    //private studyUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/study';
    //private studyUpUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/update_study';
    //private studiesUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/studies';
    
    private httpOptions = {
        headers: new HttpHeaders({'Content-Type':  'application/json'})    
    };
    constructor(private http: HttpClient) { 
    this.APIUrl = Constants.APIConfig.APIUrl;
    }
    
    
    private extractData(res: Response) {
        let body = res;
        //console.log(res)
        return body || { };
    }
    
    update_field(field_value:string, study_key:string, field:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        console.log(field);
        let obj2send={
            'username': user.username,
            'password': user.password,
            'study_id':'studies/'+study_key,
            'study_key':study_key,
            'field':field,
            'value': field_value
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl}/update_study`, obj2send);
        
    }
    
    get_study_model(): Observable<any> {
        
        return this.http.get(`${this.APIUrl}/study`).pipe(map(this.extractData));
        
       
    }
    add_studies(study_values:{},investigation_key:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        //console.log(user._id);
        let obj2send={
            'username': user.username,
            'password': user.password,
            'investigation_id':'investigations/'+investigation_key,
            'study_values': study_values
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl}/study`, obj2send);
        
        
    }
    
    show_studies(){
        this.http.get(`${this.APIUrl}/study`).subscribe((res)=>{
            alert(res);
        });
    }
    getStudy(key){
        return this.http.get(`${this.APIUrl}/study`+'/'+ key).pipe(map(this.extractData));
    }
    getStudies(inv_key:string) {
        //let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(this.studiesUrl+'/'+inv_key)
        return this.http.get(`${this.APIUrl}/studies`+'/'+inv_key).pipe(map(this.extractData));
        
    }
    // Implement a method to handle errors if any
    private handleError(err: HttpErrorResponse | any) {
     alert(err)
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }
}

