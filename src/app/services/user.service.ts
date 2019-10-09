import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import {Constants} from "../constants";

@Injectable()
export class UserService {
    private APIUrl:string;
    constructor(private http: HttpClient) { 
    this.APIUrl = Constants.APIConfig.APIUrl;}


//    register {
//        return this.http.get<User[]>(this.apiUrl);
//    }
    getAll() {
        return this.http.get<User[]>(this.APIUrl+"users");
    }

//    getByUsername_password(_id: string) {
//        return this.http.get(`${this.apiUrl}` + _id);
//    }

    register(user: User) {
        //alert(this.http.post(`${this.apiUrl}/register`, user))
        return this.http.post(this.APIUrl+"register", user);
    }

//    update(user: User) {
//        return this.http.put(`${this.apiUrl}/users/` + user._id, user);
//    }
//
//    delete(_id: string) {
//        return this.http.delete(`${this.apiUrl}/users/` + _id);
//    }
}
