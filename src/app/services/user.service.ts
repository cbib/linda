import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { UserInterface } from '../models/linda/person';
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
        //return this.http.get<UserInterface[]>(`${this.APIUrl}users`);
        return this.http.get<PersonInterface[]>(this.APIUrl + "persons/").pipe(catchError(this.handleError));
        
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

    register(user: UserInterface) {
        console.log(user)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/register`, user);
    }
    update_personal_infos(user: UserInterface) {
        console.log(user)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/update_personal_infos`, user);
    }
    update_person_infos(person: PersonInterface) {
        console.log(person)
        //user['password']=Md5.hashStr(user.password)
        //return null
        return this.http.post(`${this.APIUrl}/update_person_infos`, person);
    }
    get_persons(model_key:string, collection_type:string): Observable<PersonInterface[]>{
        return this.http.get<PersonInterface[]>(this.APIUrl + "get_persons/" + model_key+ "/"+collection_type).pipe(catchError(this.handleError))
    }


    get_person_id(user_key:string): Observable<string>{
        return this.http.get<string>(this.APIUrl + "get_person_id/" + user_key).pipe(catchError(this.handleError));
    }
    get_person_id2(user_key:string){
        let promise = new Promise((resolve, reject) => {
            let apiURL = this.APIUrl + "get_person_id/" + user_key;
            this.http.get(apiURL)
              .toPromise()
              .then(
                res => { // Success
                    //let results = res.json().results;
                    resolve("OK it's good");
                },
                msg => { // Error
                reject(msg);
                }
              );
          });
        return promise
    }
    get_person(person_id:string): Observable<PersonInterface>{
        return this.http.get<PersonInterface>(this.APIUrl + "get_person/" + person_id).pipe(catchError(this.handleError));
    }
    get_groups(user_key:string): Observable<any>{
        return this.http.get<any>(this.APIUrl + "get_groups/" + user_key).pipe(catchError(this.handleError));
    }

    register_person(person: UserInterface, group_id:string) {
        console.log(person)
        //user['password']=Md5.hashStr(user.password)
        //return null
        let obj2send = {
            'person': person,
            'group_id': group_id
        };
        return this.http.post(`${this.APIUrl}register_person`, obj2send);
    }


//    update(user: UserInterface) {
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