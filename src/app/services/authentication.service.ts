import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable()
export class AuthenticationService {
    private APIUrl:string;
    constructor(private http: HttpClient) {
    this.APIUrl = Constants.APIConfig.APIUrl; }

    login(username: string, password: string) {
        
        
        
        return this.http.post<any>(this.APIUrl+'/authenticate/', { username: username, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                //alert(user[0].username)
                if (user[0]){// && user[0].token) {
                    //alert(JSON.stringify(user[0].username))
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user[0]));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}