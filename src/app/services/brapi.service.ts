import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map} from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable({
  providedIn: 'root'
})
export class BrapiService {
    private APIUrl:string;
    private BraPIUrl:string;

    constructor(private http: HttpClient) { 
        this.APIUrl = Constants.APIConfig.APIUrl;
        this.BraPIUrl = Constants.APIConfig.BraPIUrl;
    };
    
    private extractData(res: Response) {
        let body = res;
        return body || { };
    }
    get_germplasm(){
        return this.http.get(this.BraPIUrl+"germplasm").pipe(map(this.extractData));
    }






}
