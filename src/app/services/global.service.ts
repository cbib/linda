import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { throwError, Observable } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';
import {Constants} from "../constants";
@Injectable({
  providedIn: 'root'
})

export class GlobalService {
    //private headers:any;
    //private auth = ('guest:guest');
    //private data  = {};
    //private datas:any  = [];
    private APIUrl:string;// = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/';
    //private FAIRDOM='https://fairdomhub.org/investigations/56';
    //private httpOptions = {
    //    headers: new HttpHeaders({'Content-Type':  'application/json','Access-Control-Allow-Origin': '*','Authorization': 'Bearer ' + btoa(this.auth),'Accept': '*/*'})    
    //};
    constructor(private http: HttpClient) { 
        this.APIUrl = Constants.APIConfig.APIUrl;
        //console.log(Constants.APIConfig.get_api())
    };
    
    private extractData(res: Response) {
        let body = res;
        //console.log(body);
        return body || { };
    }
    
    get_model(model_type:string): Observable<any> {
        
        return this.http.get(this.APIUrl+"get_model/"+model_type).pipe(map(this.extractData));
       
    }
    get_parent(model_id:string): Observable<any> {
        console.log(model_id)
        var model_type=model_id.split("/")[0]
        var model_key=model_id.split("/")[1]
        return this.http.get(this.APIUrl+"get_parent/"+model_type+"/"+model_key).pipe(map(this.extractData));
    }
    
    get_model_type(model_id:string){
        console.log(model_id)
        var model_type=""
        if (model_id.split("/")[0]==="investigations"){
            model_type="investigation" 
        }
        else if (model_id.split("/")[0]==="studies"){
            model_type="study" 

        }
        else if (model_id.split("/")[0]==="observation_units"){
            model_type="observation_unit" 

        }
        else if (model_id.split("/")[0]==="biological_materials"){
            model_type="biological_material" 

        }
        else if (model_id.split("/")[0]==="data_files"){
            model_type="data_file"             
        }
        else if (model_id.split("/")[0]==="environments"){
            model_type="environment"             
        }
        else if (model_id.split("/")[0]==="events"){
            model_type="event"             
        }
        else if (model_id.split("/")[0]==="experimental_factors"){
            model_type="experimental_factor"             
        }
        else if (model_id.split("/")[0]==="observed_variables"){
            model_type="observed_variable"             
        }
        else if (model_id.split("/")[0]==="samples"){
            model_type="sample"             
        }
        else{
            model_type="unknown" 
        }
        return model_type
    }
    
    get_childs(model_type:string,model_key:string): Observable<any> {
        
        return this.http.get(this.APIUrl+"get_childs/"+model_type+"/"+model_key).pipe(map(this.extractData));
       
    }
    get_model_child(model_type:string): Observable<any> {
        
        return this.http.get(this.APIUrl+"get_model_child/"+model_type).pipe(map(this.extractData));
       
    }
    
    get_max_level(model_type:string): Observable<any> {
        return this.http.get(this.APIUrl+"get_max_level/"+model_type).pipe(map(this.extractData));
    }
    is_exist(field:string, value:string, model_type:string):Observable<any>{
        
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(field)
        let obj2send={
            'username': user.username,
            'password': user.password,
            'field':field,
            'value': value,
            'model_type':model_type            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl+"check"}`, obj2send).pipe(map(this.extractData));
    }
    
    update_field(value:string, key:string, field:string, model_type:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        //console.log(field);
        let obj2send={
            'username': user.username,
            'password': user.password,
            '_key':key,
            'field':field,
            'value': value,
            'model_type':model_type
            
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl+"update_field"}`, obj2send);
    }
    
    
    update(key:string, values:{}, model_type:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(localStorage.getItem('currentUser'));
        //console.log(field);
        let obj2send={
            'username': user.username,
            'password': user.password,
            '_key':key,
            'values': values,
            'model_type':model_type
            
            
        };
        console.log(obj2send);
        return this.http.post(`${this.APIUrl+"update"}`, obj2send);
    }
    remove(id){
        let user=JSON.parse(localStorage.getItem('currentUser'));
        let obj2send={
            'username': user.username,
            'password': user.password,
            'id':id
        };
        console.log(obj2send);

        return this.http.post(`${this.APIUrl+"remove"}`, obj2send);
        
    }
    add(values:{}, model_type:string, parent_id:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        let obj2send={
            'username': user.username,
            'password': user.password,
            'parent_id':parent_id,
            'values': values,
            'model_type':model_type
        };

        return this.http.post(`${this.APIUrl+"add"}`, obj2send);
    }
    
    get_all_vertices(user_key:string){
        return this.http.get(this.APIUrl+"get_vertices/"+user_key).pipe(map(this.extractData));

    }
    
    saveTemplate(values:{}, model_type:string) {
        let user=JSON.parse(localStorage.getItem('currentUser'));
        let obj2send={
            'username': user.username,
            'password': user.password,
            'values': values,
            'model_type':model_type
        };
        
        return this.http.post(`${this.APIUrl+"saveTemplate"}`, obj2send);
    }
    
    get_templates(user_key:string,model_coll:string): Observable<any>{
        return this.http.get(this.APIUrl+"get_templates/"+user_key+"/"+model_coll).pipe(map(this.extractData));
        
    }
    
    
//    show_investigations(){
//        this.http.get(this.investigationUrl).subscribe((res)=>{
//            alert(res);
//        });
//    }
    //get investigation by key
    get_by_key(key:string, model_type:string ){
        //return this.http.get(this.investigationGetUrl+'/'+ key).pipe(map(this.extractData));
        return this.http.get(this.APIUrl+'/get_by_key/'+ model_type+'/'+key).pipe(map(this.extractData));

    }
    
    
    get_elem(collection:string ,key:string){
        //return this.http.get(this.investigationGetUrl+'/'+ key).pipe(map(this.extractData));
        return this.http.get(this.APIUrl+'/get_elem/'+ collection+'/'+key).pipe(map(this.extractData));

    }
    
    
    //get all investigations for a given user
    get_by_parent_key(parent_key:string, model_type:string ) {
        //let user=JSON.parse(localStorage.getItem('currentUser'));
        //console.log(user_key)
        //return this.http.get(this.investigationsUrl+'/'+user_key).pipe(map(this.extractData));
        return this.http.get(this.APIUrl+'/get_by_parent_key/'+ model_type+'/'+ parent_key).pipe(map(this.extractData));

    }
    
    
    // Implement a method to handle errors if any
    private handleError(err: HttpErrorResponse | any) {
     alert(err)
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }
}
