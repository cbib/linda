import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { throwError, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import {Constants} from "../constants";

@Injectable()
export class AuthenticationService {
    private APIUrl:string;
    
    constructor(
        private http: HttpClient) 
    {
        this.APIUrl = Constants.APIConfig.APIUrl; 
    }
    private extractData(res: Response) {
        let user = res;
        if (user[0]){
            //store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user[0]));
        }
        //console.log(body);
        return user || { };
    }
    login(username: string, password: string):Observable<any> {
        return this.http.post<any>(this.APIUrl+'authenticate/', { username: username, password: password }).pipe(map(this.extractData));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}