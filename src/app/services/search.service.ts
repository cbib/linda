import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable({
  providedIn: 'root'
})
export class SearchService {
    private dataObs$ = new Subject<string>();
    private APIUrl:string;
    //private FAIRDOM='https://fairdomhub.org/investigations/56';

    constructor(private http: HttpClient) { 
        this.APIUrl = Constants.APIConfig.APIUrl;
    };
    
    private extractData(res: Response) {
        let body = res;
        return body || { };
    }

    getData() {
        return this.dataObs$;
    }

    updateData(data: string) {
        this.dataObs$.next(data);
    }

    startSearch(search_string:string){
      console.log("start searching;..")
      this.dataObs$.next(search_string);
      let user=JSON.parse(localStorage.getItem('currentUser'));
      let obj2send={
          'username': user.username,
          'password': user.password,
          'search_string':search_string            
      };
      return this.http.post(`${this.APIUrl+"search"}`, obj2send).pipe(map(this.extractData));

    }
  //   search(search_string:string):Observable<any>{
  //     let user=JSON.parse(localStorage.getItem('currentUser'));
  //     let obj2send={
  //         'username': user.username,
  //         'password': user.password,
  //         'search_string':search_string            
  //     };
  //     return this.http.post(`${this.APIUrl+"search"}`, obj2send).pipe(map(this.extractData));
  // }

}
