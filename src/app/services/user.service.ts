import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { PersonInterface } from '../models/linda/person';
import {Constants} from "../constants";
//import * as nodemailer from 'nodemailer';
import { map, catchError, retry} from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5'; 
import { throwError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    private APIUrl:string;
    constructor(private http: HttpClient) { 
    this.APIUrl = Constants.APIConfig.APIUrl;}


//    register {
//        return this.http.get<User[]>(this.apiUrl);
//    }
    
    /* getUserInfo() {
        return this.http.get<User>(`${this.APIUrl}/users` + user._id);
    } */
    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.

        return throwError(() => new Error('Something bad happened; please try again later.'))

      }
    getAll() : Observable<PersonInterface[]> {
        //return this.http.get<PersonInterface[]>(`${this.APIUrl}users`);
        return this.http.get<PersonInterface[]>(this.APIUrl + "users/").pipe(catchError(this.handleError));
        
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

    register(user: PersonInterface) {
        console.log(user)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/register`, user);
    }
    update_personal_infos(user: PersonInterface) {
        console.log(user)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/update_personal_infos`, user);
    }
    register_person(user: PersonInterface) {
        console.log(user)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/register_person`, user);
    }


//    update(user: PersonInterface) {
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