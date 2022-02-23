import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from "../constants";
import { User } from '../models';
import { UserInterface } from '../models/linda/person';

export interface AuthResponse {
    success: boolean;
    message: string,
    person: UserInterface;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private APIUrl: string;
    private currentUserSubject: BehaviorSubject<UserInterface>;
    public currentUser: Observable<UserInterface>;
    public user: UserInterface;
    public person: UserInterface

    constructor(private http: HttpClient, private router: Router) {
        //localStorage.removeItem('currentUser');
        console.log(localStorage)
        var tmp: any = localStorage.getItem('currentUser')
        this.currentUserSubject = new BehaviorSubject<UserInterface>(JSON.parse(tmp));
        this.currentUser = this.currentUserSubject.asObservable();
        this.APIUrl = Constants.APIConfig.APIUrl;
    }
    public get currentUserValue(): UserInterface {
        return this.currentUserSubject.value;
    }
    /* login(username: string, password: string):Observable<any> {
        return this.http.post<any>(this.APIUrl+'authenticate/', { username: username, password: password }).pipe(map(this.extractData));
    } */

    login(username:string, password:string) {
        console.log(username)
        console.log(password)
        return this.http.post<AuthResponse>(this.APIUrl + 'authenticate_person/', { username: username, password: password })
            .pipe(map(res => {
                console.log(res)
                this.person = res.person
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(this.person));
                //localStorage.setItem('token', 'JWT');
                this.currentUserSubject.next(this.person);
                return this.person;
            }));
    }

    group_login(username:string, password:string, roles:{},group_key:string, group_password:string) {
        console.log(username)
        console.log(password)
        console.log(group_key)
        console.log(group_password)
        return this.http.post(this.APIUrl + 'authenticate_group/', { username: username, password: password, roles:roles, group_key:group_key, group_password:group_password })
            .pipe(map(res => {
                console.log(res)
                let group = res['group']
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                //localStorage.setItem('token', 'JWT');
                return group;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        //this.router.navigate(['/login']); 

    }
    requestReset(body): Observable<any> {
        let obj2send = {
            'username': this.currentUserValue.username,
            'password': this.currentUserValue.password,
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "req-reset-password"}`, obj2send);

    }

    newPassword(body): Observable<any> {
        return this.http.post(`${this.APIUrl}new-password`, body);
    }
}