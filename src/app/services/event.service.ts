import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { Study } from '../models/study';
import { User } from '../models/user';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class EventService {
    private APIUrl:string;
    
    private event  = {};
    private events:any  = [];
    //private eventUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/event';
    //private eventsUrl = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/events';
    private httpOptions = {
        headers: new HttpHeaders({'Content-Type':  'application/json'})    
    };
  constructor(private http: HttpClient) {
  this.APIUrl = Constants.APIConfig.APIUrl; }

    private extractData(res: Response) {
        let body = res;
        return body || { };
    }
    
    get_event(): Observable<any> {
        
        return this.http.get(`${this.APIUrl}/event`).pipe(map(this.extractData));
       
    }  
    add_event(event_values:{},study_key:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        //console.log(user._id);
        let obj2send={
            'username': user.username,
            'password': user.password,
            'study_id':'studies/'+study_key,
            'event_values': event_values
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl}/event`, obj2send);
        
    }
  }