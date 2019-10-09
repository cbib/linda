import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import {Constants} from "../constants";


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private APIUrl:string;
  //SERVER_URL: string = "http://localhost:4200";
  //private APIUrl = 'http://localhost:8529/_db/MIAPPE_GRAPH/xeml/';

  constructor(private httpClient: HttpClient) {
  this.APIUrl = Constants.APIConfig.APIUrl;
   }
    
  private extractData(res: Response) {
        let body = res;
        console.log(body);
        //alert(JSON.stringify(body))
        return body || { };
//        switch (res.type) {
//
//            case HttpEventType.UploadProgress:
//              const progress = Math.round(100 * res.loaded / res.total);
//              console.log(progress);
//              return { status: 'progress', message: progress };
//
//            case HttpEventType.Response:
//                console.log(res);
//              return res.body;
//
//            default:
//              return `Unhandled event: ${res.type}`;
//        }
    }
  public upload2(filename:string,data,headers,associated_headers,parent_id:string):Observable<any>{
        console.log(data)
        console.log(headers)
        console.log(associated_headers)
        let user=JSON.parse(localStorage.getItem('currentUser'));
        let obj2send={
            'username': user.username,
            'password': user.password,
            'parent_id':parent_id,
            'obj':{'headers':headers,
                    'associated_headers':associated_headers,
                    'data':data,
                    'filename':filename
            }
            
        };
        console.log(obj2send);
        return this.httpClient.post(`${this.APIUrl+"upload"}`, obj2send).pipe(map(this.extractData));
    }    
    
    
      
  public upload(filename:string,data,headers,associated_headers,parent_id:string) :Observable<any>{
    let uploadURL = `${this.APIUrl}upload`;
   //let user=JSON.parse(localStorage.getItem('currentUser'));
    console.log(data)
    //return this.httpClient.post<any>(uploadURL, data).pipe(map(this.extractData));
    let user=JSON.parse(localStorage.getItem('currentUser'));
        let obj2send={
            'username': user.username,
            'password': user.password,
            'parent_id':parent_id,
            'obj':{'headers':headers,
                    'associated_headers':associated_headers,
                    'data':data,
                    'filename':filename
            }
            
        };
    
    
    return this.httpClient.post<any>(`${this.APIUrl+"upload"}`, obj2send, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          console.log(progress);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
            console.log(event);
          return event.body;
          
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }
}
