import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Constants} from "../constants";
import { User } from '../models';

export interface AuthResponse{
    success: boolean;
    message: string,
    user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    
    private APIUrl:string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public user:User;
    
    constructor(private http: HttpClient, private router: Router) 
    {
        //localStorage.removeItem('currentUser');
        console.log(localStorage)
        var tmp:any=localStorage.getItem('currentUser')
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(tmp));
        this.currentUser = this.currentUserSubject.asObservable();
        this.APIUrl = Constants.APIConfig.APIUrl; 
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    /* login(username: string, password: string):Observable<any> {
        return this.http.post<any>(this.APIUrl+'authenticate/', { username: username, password: password }).pipe(map(this.extractData));
    } */

    login(username, password){
        return this.http.post<AuthResponse>(this.APIUrl+'authenticate/', { username:username, password :password})
            .pipe(map(res => {
                console.log(res)
                this.user=res.user
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(res.user));
                //localStorage.setItem('token', 'JWT');
                this.currentUserSubject.next(res.user);
                return res.user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        //this.router.navigate(['/login']); 

    }
}