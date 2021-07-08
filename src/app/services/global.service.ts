import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import {ResDataModal} from '../models/datatable_model';
import { Constants } from "../constants";
@Injectable({
    providedIn: 'root'
})

    
export class GlobalService {

    private APIUrl: string;
    //private FAIRDOM='https://fairdomhub.org/investigations/56';

    constructor(private http: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
    };

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }


    get_model(model_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_model/" + model_type).pipe(map(this.extractData));
    }

    get_parent(model_id: string): Observable<any> {
        var model_type = model_id.split("/")[0]
        var model_key = model_id.split("/")[1]
        return this.http.get(this.APIUrl + "get_parent/" + model_type + "/" + model_key).pipe(map(this.extractData));
    }

    get_model_type(model_id: string) {
        var model_type = ""
        if (model_id.split("/")[0] === "studies") {
            model_type = "study"
        }
        else if(model_id === "Investigations tree"){
            model_type = 'Root'
        }
        else {
            model_type = model_id.split("/")[0].slice(0, -1)
        }

        // if (model_id.split("/")[0]==="investigations"){
        //     model_type="investigation" 
        // }
        // else if (model_id.split("/")[0]==="studies"){
        //     model_type="study" 

        // }
        // else if (model_id.split("/")[0]==="observation_units"){
        //     model_type="observation_unit" 

        // }
        // else if (model_id.split("/")[0]==="biological_materials"){
        //     model_type="biological_material" 

        // }
        // else if (model_id.split("/")[0]==="data_files"){
        //     model_type="data_file"             
        // }
        // else if (model_id.split("/")[0]==="environments"){
        //     model_type="environment"             
        // }
        // else if (model_id.split("/")[0]==="events"){
        //     model_type="event"             
        // }
        // else if (model_id.split("/")[0]==="experimental_factors"){
        //     model_type="experimental_factor"             
        // }
        // else if (model_id.split("/")[0]==="observed_variables"){
        //     model_type="observed_variable"             
        // }
        // else if (model_id.split("/")[0]==="samples"){
        //     model_type="sample"             
        // }
        // else{
        //     model_type="unknown" 
        // }
        return model_type
    }

    get_childs(model_type: string, model_key: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_childs/" + model_type + "/" + model_key).pipe(map(this.extractData));
    }

    get_model_child(model_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_model_child/" + model_type).pipe(map(this.extractData));
    }

    get_max_level(model_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_max_level/" + model_type).pipe(map(this.extractData));
    }

    get_all_data_files(model_key:string): Observable<any> {
        return this.http.get(this.APIUrl + "get_all_data_files/" + model_key).pipe(map(this.extractData));
    }
    get_data_filename(parent_key:string, model_type:string): Observable<any> {
        return this.http.get(this.APIUrl + "get_data_filename/" + parent_key + "/" + model_type).pipe(map(this.extractData));
    }

    get_data_from_datafiles(datafile_key:string, header:string){
        return this.http.get(this.APIUrl + "get_data_from_datafiles/" + datafile_key + "/" + header).pipe(map(this.extractData));
    }


    is_exist(field: string, value: string, model_type: string): Observable<any> {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'field': field,
            'value': value,
            'model_type': model_type
        };
        //console.log('field: ', field,' value: ', value)
        return this.http.post(`${this.APIUrl + "check"}`, obj2send).pipe(map(this.extractData));
    }


    update_associated_headers(id: string, values: {}, collection:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_id': id,
            'values': values,
            'collection': collection
        };
        return this.http.post(`${this.APIUrl + "update_associated_headers"}`, obj2send);
    }
    update_associated_headers_linda_id(datafile_id: string, value: string, header:string, collection:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'datafile_id': datafile_id,
            'header': header,
            'value': value,
            'collection': collection
        };
        return this.http.post(`${this.APIUrl + "update_associated_headers_linda_id"}`, obj2send);
    }
    remove_associated_headers_linda_id(id: string, removed_ids: [], collection:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_id': id,
            'removed_ids': removed_ids,
            'collection': collection
        };
        return this.http.post(`${this.APIUrl + "remove_associated_headers_linda_id"}`, obj2send);
    }
    update_field(value: string, key: string, field: string, model_type: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value,
            'model_type': model_type

        };
        return this.http.post(`${this.APIUrl + "update_user"}`, obj2send);
    }
    update_user(value: boolean, key: string, field: string, model_type: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value,
            'model_type': model_type

        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "update_user"}`, obj2send);
    }
    update_step(value: string, key: string, field: string, model_type: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value,
            'model_type': model_type

        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "update_step"}`, obj2send);
    }

    update(key: string, values: {}, model_type: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "update"}`, obj2send);
    }


    remove(id) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove"}`, obj2send);
    }
    
    remove_childs(id) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove_childs"}`, obj2send);
    }

    remove_childs_by_type(id:string, model_type:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id,
            'model_type':model_type
        };
        return this.http.post(`${this.APIUrl + "remove_childs_by_type"}`, obj2send);
    }
    check_one_exists(field:string, value:string, model_type:string){
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'field': field,
            'value':value,
            'model_type':model_type
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "check_one_exists"}`, obj2send);
    }
    remove_association(id:string, datafile_id:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id,
            'datafile_id':datafile_id
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "remove_association"}`, obj2send);
    }

    remove_childs_by_type_and_id(id:string, model_type:string, model_id:string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id,
            'model_type':model_type,
            'model_id': model_id
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "remove_childs_by_type_and_id"}`, obj2send);
    }
    
    add(values: {}, model_type: string, parent_id: string, as_template:boolean) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type,
            'as_template': as_template
        };
        return this.http.post(`${this.APIUrl + "add"}`, obj2send);
    }
    add_parent_and_childs(parent_model: {}, child_values: {}, model_type_parent: string, parent_id: string, model_type_child: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': parent_model,
            'child_values':child_values,
            'model_type': model_type_parent,
            'child_model_type': model_type_child,
        };
        return this.http.post(`${this.APIUrl + "add_parent_and_child"}`, obj2send);
    }
    add_multi(values: [], model_type: string, parent_id: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "add_multi"}`, obj2send);
    }
    remove_observation_unit(id) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove_observation_unit"}`, obj2send);
    }

    update_observation_units(values: {}, key: string, model_type: string, parent_id: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        var observation_unit_doc = { "External ID": [], "Observation Unit factor value": [], "Observation unit ID": [], "Observation unit type": [], "Spatial distribution": [], "obsUUID": [] }
        //var return_data = {"observation_units":[],"biological_materials":[],"samples":[], "experimental_factor":[] }
        var observation_units_data = values['observation_units'];
        for (var i = 0; i < observation_units_data.length; i++) {
            observation_unit_doc["External ID"].push(observation_units_data[i]['External ID']);
            observation_unit_doc["Observation unit ID"].push(observation_units_data[i]['Observation unit ID']);
            observation_unit_doc["Observation Unit factor value"].push(observation_units_data[i]['Observation Unit factor value']);
            observation_unit_doc["Observation unit type"].push(observation_units_data[i]['Observation unit type']);
            observation_unit_doc["Spatial distribution"].push(observation_units_data[i]['Spatial distribution']);
            observation_unit_doc["obsUUID"].push(observation_units_data[i]['obsUUID']);

            var biological_material_data = values['biological_materials'][i];
            var unique_linda_id = [...new Set(biological_material_data.map(item => item.lindaID))];
            // //add biological_material link to observation unit edge 
            // var mat_ids=[ 
            //     { 
            //       "to" : "biological_materials/9401111", 
            //       "key" : "9499023" 
            //     }, 
            //     { 
            //       "to" : "biological_materials/9400239", 
            //       "key" : "9471327" 
            //     } 
            //   ]
            // var bm_db_id = ''
            // var bm_obj = {}
            // var bm_id_detected = []
            // for (var j = 0; j < biological_material_data.length; j++) {
            //     console.log(biological_material_data[j]['lindaID'])
            //     if (biological_material_data[j]['lindaID'] !== bm_db_id) {

            //         if (bm_db_id !== '') {
            //             console.log("new term , update previous one", bm_obj, bm_db_id)
            //             bm_db_id = biological_material_data[j]['lindaID']
            //             bm_id_detected.push(bm_db_id)
            //             bm_obj = {
            //                 "_from": "observation_units/" + key,
            //                 "_to": bm_db_id,
            //                 "biological_materials": []
            //             }
            //             bm_obj["biological_materials"].push(biological_material_data[j])
            //             console.log("second term created", bm_obj , " add: ", biological_material_data[j]['bmUUID'])

            //             //db._query(aql`UPSERT ${bm_obj.biological_materials} INSERT ${bm_obj.biological_materials} UPDATE ${bm_obj.biological_materials}  IN ${observation_unit_edge} RETURN NEW `);
            //         }
            //         else {
            //             bm_db_id = biological_material_data[j]['lindaID']

            //             bm_id_detected.push(bm_db_id)
            //             console.log("new term , for id", bm_db_id)

            //             bm_obj = {
            //                 "_from": "observation_units/" + key,
            //                 "_to": bm_db_id,
            //                 "biological_materials": []
            //             }
            //             bm_obj["biological_materials"].push(biological_material_data[j])
            //             console.log("first term created: ",bm_obj, " add: ", biological_material_data[j]['bmUUID'])

            //         }



            //     }
            //     else {
            //         console.log("same term add ",biological_material_data[j]['bmUUID'])
            //         bm_obj["biological_materials"].push(biological_material_data[j])



            //     }

            // }
            // if ("_from" in bm_obj) {
            //     console.log(bm_db_id)
            //     console.log("observation_units/" + key)
            //     console.log(bm_obj)

            //     //db._query(aql`UPSERT ${bm_obj.biological_materials} INSERT ${bm_obj.biological_materials} UPDATE ${bm_obj.biological_materials} IN ${observation_unit_edge} RETURN NEW `);
            // }
            // for (var k = 0; k < mat_ids.length; k++) {
            //     if (!bm_id_detected.includes(mat_ids[k]['to'])) {
            //             var key = mat_ids[k]['key']
            //             console.log(key)
                    
            //     }
            // }

        }
        return this.http.post(`${this.APIUrl + "update_observation_units"}`, obj2send);
    }

    add_observation_units(values: {}, model_type: string, parent_id: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_observation_units"}`, obj2send);
    }

    get_all_vertices(user_key: string) {
        return this.http.get(this.APIUrl + "get_vertices/" + user_key).pipe(map(this.extractData));
    }

    get_all_observation_unit_childs(observation_unit_key: string) {
        return this.http.get<[]>(this.APIUrl + "get_observation_unit_childs/" + observation_unit_key);
    }

    get_all_vertices_by_model(model_type: string, model_key: string) {
        return this.http.get(this.APIUrl + "get_vertices_by_model/" + model_type + "/" + model_key).pipe(map(this.extractData));
    }

    get_all_childs_by_model(model_type: string, model_key: string) {
        return this.http.get(this.APIUrl + "get_childs_by_model/" + model_type + "/" + model_key).pipe(map(this.extractData));
    }

    saveTemplate(values: {}, model_type: string) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "saveTemplate"}`, obj2send);
    }

    get_templates(user_key: string, model_coll: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_templates/" + user_key + "/" + model_coll).pipe(map(this.extractData));
    }
    get_all_templates(user_key: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_all_templates/" + user_key).pipe(map(this.extractData));
    }

    get_type_child_from_parent(parent_name: string, parent_key: string, child_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_data_from_child_model/" + parent_name + "/" + parent_key + "/" + child_type).pipe(map(this.extractData));
    }

    get_parent_id(model_name: string, model_key: string) {
        console.log(model_name, model_key)
        return this.http.get(this.APIUrl + "get_parent_id/" + model_name + "/" + model_key).pipe(map(this.extractData));
    }


    //    show_investigations(){
    //        this.http.get(this.investigationUrl).subscribe((res)=>{
    //            alert(res);
    //        });
    //    }

    get_by_key(key: string, model_type: string) {
        return this.http.get(this.APIUrl + '/get_by_key/' + model_type + '/' + key).pipe(map(this.extractData));
    }


    get_elem(collection: string, key: string) {
        return this.http.get(this.APIUrl + '/get_elem/' + collection + '/' + key).pipe(map(this.extractData));
    }

    get_data_file(key: string): Observable<ResDataModal>{
        return this.http.get<ResDataModal>(this.APIUrl + '/get_data_file/' + key);
    }

    get_study_by_ID(study_id: string, parent_key:string){
        return this.http.get(this.APIUrl + '/get_study_by_ID/' + study_id+ '/' + parent_key).pipe(map(this.extractData));
    }


    //get all investigations for a given user
    get_by_parent_key(parent_key: string, model_type: string) {
        return this.http.get(this.APIUrl + '/get_by_parent_key/' + model_type + '/' + parent_key).pipe(map(this.extractData));
    }

    // Implement a method to handle errors if any
    private handleError(err: HttpErrorResponse | any) {
        alert(err)
        console.error('An error occurred', err);
        return throwError(err.message || err);
    }
}
