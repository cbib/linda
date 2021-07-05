import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { User } from '../models/user';
import {Constants} from "../constants";
//import * as nodemailer from 'nodemailer'; 

@Injectable()
export class UserService {
    private APIUrl:string;
    //private apiUrl='http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml'
    constructor(private http: HttpClient) { 
    this.APIUrl = Constants.APIConfig.APIUrl;}


//    register {
//        return this.http.get<User[]>(this.apiUrl);
//    }
    
    /* getUserInfo() {
        return this.http.get<User>(`${this.APIUrl}/users` + user._id);
    } */
    getAll() {
        return this.http.get<User[]>(`${this.APIUrl}/users`);
    }

//    getByUsername_password(_id: string) {
//        return this.http.get(`${this.apiUrl}` + _id);
//    }
    private extractData(res: Response) {
        let body = res;
        return body || {};
    }


    get_user(username: string, password: string){
        return this.http.get(this.APIUrl + "get_user/" + username + "/" + password).pipe(map(this.extractData));
    }

    register(user: User) {
        console.log(user)
        return this.http.post(`${this.APIUrl}/register`, user);
    }


//    update(user: User) {
//        return this.http.put(`${this.apiUrl}/users/` + user._id, user);
//    }
//
//    delete(_id: string) {
//        return this.http.delete(`${this.apiUrl}/users/` + _id);
//    }
}




 
//export class GMailService { 
//    private _transporter: nodemailer.Transporter; 
//    
//    constructor() { 
//        this._transporter = nodemailer.createTransport( 
//          `smtps://<username>%40gmail.com:<password>@smtp.gmail.com` 
//        ); 
//      } 
//      sendMail(to: string, subject: string, content: string) { 
//        let options = { 
//          from: 'bdartigues@gmail.com', 
//          to: to, 
//          subject: subject, 
//          text: content 
//        } 
// 
//        this._transporter.sendMail(  
//          options, (error, info) => { 
//            if (error) { 
//              return console.log(`error: ${error}`); 
//            } 
//            console.log(`Message Sent ${info.response}`); 
//          }); 
//      } 
//    } 