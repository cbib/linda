import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, catchError, retry} from 'rxjs/operators';
import { ResDataModal} from '../models/datatable_model';
import { Constants } from "../constants";
import { Investigation } from '../models/miappe/investigation';
import { InvestigationInterface } from '../models/linda/investigation'; 
import { StudyInterface} from '../models/linda/study'
import { BiologicalMaterialFullInterface, BiologicalMaterialInterface } from '../models/linda/biological-material'
import { ExperimentalFactorInterface } from '../models/linda/experimental_factor'; 
import { ObservationUnitInterface } from '../models/linda/observation-unit';
import { AssociatedHeadersInterface, DataFileInterface } from '../models/linda/data_files'
import { ObservedVariableInterface } from '../models/linda/observed-variable';
import { ExperimentalDesign, ExperimentalDesignInterface } from 'src/app/models/linda/experimental-design';
import { User } from '../models';
import { UserInterface } from '../models/linda/person';
import { PersonInterface } from '../models/linda/person';
import { EventInterface } from '../models/linda/event';
import { Md5 } from 'ts-md5/dist/md5'
import { EnvironmentInterface } from '../models/linda/environment';
import { GermPlasmInterface } from '../models/linda/germplasm';


@Injectable({
    providedIn: 'root'
})

    
export class GlobalService {

    private APIUrl: string;
    private user:UserInterface
    private startTime:Date;
    private endTime:Date;
    private timeDiff:number
    //private FAIRDOM='https://fairdomhub.org/investigations/56';

    constructor(private http: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
        //this.user = this.get_user();
    };

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    get_user() : UserInterface | undefined{
        let tmp_user:any=localStorage.getItem('currentUser')
        return JSON.parse(tmp_user)
    }
    start() {
        this.startTime = new Date();
    };
    end() {
        this.endTime = new Date();
        this.timeDiff = this.endTime.valueOf() - this.startTime.valueOf();
        this.timeDiff = this.timeDiff / 1000.0;
        console.log("Elapsed time :" + this.timeDiff+ " seconds")
        // get seconds 
        var seconds = Math.round(this.timeDiff);
        console.log(seconds + " seconds");
    }

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
        return model_type
    }
    //HTTP GET 
    public get_model(model_type: string): Observable<any> {
        //const options = model_type ?
        //{ params: new HttpParams().set('name', model_type) } : {};
        //console.log(options)
        if (model_type === 'investigation'){
            return this.http.get<Investigation>(this.APIUrl + "get_model/" + model_type).pipe(catchError(this.handleError));
        }
        else{
            return this.http.get(this.APIUrl + "get_model/" + model_type).pipe(catchError(this.handleError));
        }
    }

    get_parent(model_id: string): Observable<any> {
        var model_type = model_id.split("/")[0]
        var model_key = model_id.split("/")[1]
        return this.http.get(this.APIUrl + "get_parent/" + model_type + "/" + model_key).pipe(catchError(this.handleError));
    }
    get_childs(model_type: string, model_key: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_childs/" + model_type + "/" + model_key).pipe(catchError(this.handleError));
    }
    get_model_child(model_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_model_child/" + model_type).pipe(catchError(this.handleError));
    }
    get_max_level(model_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_max_level/" + model_type).pipe(catchError(this.handleError));
    }

    // Data file routines
    //Get all data files by investigation
    get_all_data_files(investigation_key:string): Observable<any> {
        return this.http.get(this.APIUrl + "get_all_data_files/" + investigation_key).pipe(catchError(this.handleError));
    }
    get_data_files(model_key: string, collection:string): Observable<DataFileInterface[]>{
        return this.http.get<DataFileInterface[]>(this.APIUrl + "get_data_files/" + model_key + "/" +  collection).pipe(catchError(this.handleError));
    }
    get_data_file_table(key: string): Observable<ResDataModal>{
        return this.http.get<ResDataModal>(this.APIUrl + 'get_data_file_table/' + key);
    }
    get_data_file(key: string): Observable<DataFileInterface>{
        return this.http.get<DataFileInterface>(this.APIUrl + 'get_data_file/' + key);
    }
    get_data_filename(parent_key:string, model_type:string): Observable<any> {
        return this.http.get(this.APIUrl + "get_data_filename/" + parent_key + "/" + model_type).pipe(catchError(this.handleError));
    }
    get_data_from_datafiles(datafile_key:string, header:string){
        return this.http.get(this.APIUrl + "get_data_from_datafiles/" + datafile_key + "/" + header).pipe(catchError(this.handleError));
    }
    get_ncbi_taxon_data():Observable<any>{
        return this.http.get(this.APIUrl + "get_ncbi_taxon_data/");
    }
    get_ncbi_taxon_data_by_species_regex(regex:string):Observable<any>{
        return this.http.get(this.APIUrl + "get_ncbi_taxon_data_by_species_regex/"+ regex);
    }
    get_ncbi_taxon_data_by_taxon_regex(regex:string):Observable<any>{
        return this.http.get(this.APIUrl + "get_ncbi_taxon_data_by_taxon_regex/"+ regex);
    }
    get_germplasm_taxon_group_accession_numbers(taxon_group:string):Observable<ResDataModal>{
        return this.http.get<ResDataModal>(this.APIUrl + "get_germplasm_taxon_group_accession_numbers/" + taxon_group);
    }
    get_germplasm_unique_taxon_groups():Observable<any>{
        return this.http.get(this.APIUrl + "get_germplasm_unique_taxon_groups/");
    }
    get_germplasmsdatamodal():Observable<ResDataModal>{
        return this.http.get<ResDataModal>(this.APIUrl + "get_germplasms/");
    }
    get_germplasms():Observable<any[]>{
        return this.http.get<any[]>(this.APIUrl + "get_germplasms/");
    }
    
    get_multidata_from_datafiles(datafile_key:string, headers_linked:string){
        return this.http.get(this.APIUrl + "get_multidata_from_datafiles/" + datafile_key + "/" + headers_linked).pipe(catchError(this.handleError));
    }
    get_associated_component_by_type_from_datafiles(datafile_key:string, type:string){
        return this.http.get(this.APIUrl + "get_associated_component_by_type_from_datafiles/" + datafile_key + "/" + type).pipe(catchError(this.handleError));
    }
    update_associated_headers(id: string, values: {}, collection:string) {
        let user = this.get_user();

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
        let user = this.get_user();
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

    get_lindaID_by_studyName(study_name:string, parent_key:string):Observable<Object>{
        return this.http.get(this.APIUrl + "get_lindaID_by_studyName/" + study_name+ "/" + parent_key).pipe(catchError(this.handleError));
    }

    get_all_vertices(user_key: string) {
        return this.http.get(this.APIUrl + "get_all_vertices/" + user_key).pipe(catchError(this.handleError));
    }
    get_vertice(person_key: string, investigation_key:string) {
        return this.http.get(this.APIUrl + "get_vertice/" + person_key+ "/" + investigation_key).pipe(catchError(this.handleError));
    }
    //used in header component 
    get_inv_stud_vertices(user_key: string){
        return this.http.get(this.APIUrl + "get_inv_stud_vertices/" + user_key).pipe(catchError(this.handleError));
    }
    get_projects(person_key: string) : Observable<InvestigationInterface[]>{
        return this.http.get<InvestigationInterface[]>(this.APIUrl + "get_projects/" + person_key).pipe(catchError(this.handleError));
    }
    /* get_project(person_key: string, investigation_key:string) : Observable<InvestigationInterface[]>{
        return this.http.get<InvestigationInterface[]>(this.APIUrl + "get_project/" + person_key + "/" + investigation_key).pipe(catchError(this.handleError));
    } */
    get_templates(person_key: string) : Observable<{}[]>{
        return this.http.get<{}[]>(this.APIUrl + "get_templates/" + person_key).pipe(catchError(this.handleError));
    }
    get_templates_by_user(user_key: string, model_coll: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_templates_by_user/" + user_key + "/" + model_coll).pipe(catchError(this.handleError));
    }
    /* get_all_templates(user_key: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_all_templates/" + user_key).pipe(catchError(this.handleError));
    } */
    get_template_by_key(key: string) {
        return this.http.get(this.APIUrl + 'get_template_by_key/' + key).pipe(catchError(this.handleError));
    }
    get_studies(investigation_key: string, person_key: string) : Observable<StudyInterface[]>{
        return this.http.get<StudyInterface[]>(this.APIUrl + "get_studies/" + investigation_key + "/" + person_key).pipe(catchError(this.handleError));
    }
    get_studies_and_persons(investigation_key: string): Observable<{"e":{},"s":{}}[]>{
        return this.http.get<{"e":{},"s":{}}[]>(this.APIUrl + "get_studies_and_persons/" + investigation_key).pipe(catchError(this.handleError));
    }
    get_all_project_persons(investigation_key: string) : Observable<PersonInterface[]>{
        return this.http.get<PersonInterface[]>(this.APIUrl + "get_project_persons/" + investigation_key).pipe(catchError(this.handleError));
    }
    get_all_study_persons(study_key: string) : Observable<PersonInterface[]>{
        return this.http.get<PersonInterface[]>(this.APIUrl + "get_study_persons/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_biological_materials(study_key: string) : Observable<BiologicalMaterialFullInterface[]>{
        return this.http.get<BiologicalMaterialFullInterface[]>(this.APIUrl + "get_all_biological_materials/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_experimental_designs(study_key: string) : Observable<ExperimentalDesignInterface[]>{
        return this.http.get<ExperimentalDesignInterface[]>(this.APIUrl + "get_all_experimental_designs/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_observed_variables(study_key: string) : Observable<ObservedVariableInterface[]>{
        return this.http.get<ObservedVariableInterface[]>(this.APIUrl + "get_all_observed_variables/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_experimental_factors(study_key: string) : Observable<ExperimentalFactorInterface[]>{
        return this.http.get<ExperimentalFactorInterface[]>(this.APIUrl + "get_all_experimental_factors/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_observation_units(study_key: string) : Observable<ObservationUnitInterface[]>{
        return this.http.get<ObservationUnitInterface[]>(this.APIUrl + "get_all_observation_units/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_events(study_key: string) : Observable<EventInterface[]>{
        return this.http.get<EventInterface[]>(this.APIUrl + "get_all_events/" + study_key).pipe(catchError(this.handleError));
    }
    get_all_environments(study_key: string) : Observable<EnvironmentInterface[]>{
        return this.http.get<EnvironmentInterface[]>(this.APIUrl + "get_all_environments/" + study_key).pipe(catchError(this.handleError));
    }
    
   
    get_all_observation_unit_childs(observation_unit_key: string) {
        return this.http.get<[]>(this.APIUrl + "get_observation_unit_childs/" + observation_unit_key);
    }
    get_all_observation_unit_childs_by_type(observation_unit_key: string, model_type:string) {
        return this.http.get<[]>(this.APIUrl + "get_observation_unit_childs_by_type/" + observation_unit_key+ "/" + model_type );
    }
    get_all_vertices_by_model(model_type: string, model_key: string) {
        return this.http.get(this.APIUrl + "get_vertices_by_model/" + model_type + "/" + model_key).pipe(catchError(this.handleError));
    }
    get_all_childs_by_model(model_type: string, model_key: string) {
        return this.http.get(this.APIUrl + "get_childs_by_model/" + model_type + "/" + model_key).pipe(catchError(this.handleError));
    }
    get_type_child_from_parent(parent_name: string, parent_key: string, child_type: string): Observable<any> {
        return this.http.get(this.APIUrl + "get_type_child_from_parent/" + parent_name + "/" + parent_key + "/" + child_type).pipe(catchError(this.handleError));
    }
    get_parent_id(model_name: string, model_key: string) {
        console.log(model_name, model_key)
        return this.http.get(this.APIUrl + "get_parent_id/" + model_name + "/" + model_key).pipe(catchError(this.handleError));
    }
    get_by_key(key: string, model_type: string) {
        console.log(key)
        console.log(model_type)
        return this.http.get(this.APIUrl + 'get_by_key/' + model_type + '/' + key).pipe(map(this.extractData));
        //return this.http.get(this.APIUrl + 'get_by_key/' + model_type + '/' + key).pipe(catchError(this.handleError));
    }
    get_experimental_design_by_key(key: string):Observable<{success:boolean,data:ExperimentalDesign}>{
        return this.http.get<{success:boolean,data:ExperimentalDesign}>(this.APIUrl + 'get_experimental_design_by_key/' + '/' + key).pipe(catchError(this.handleError));
    }  
    get_biological_material_by_key(key: string):Observable<{success:boolean,data:BiologicalMaterialFullInterface}>{
        return this.http.get<{success:boolean,data:BiologicalMaterialFullInterface}>(this.APIUrl + 'get_biological_material_by_key/' + '/' + key).pipe(catchError(this.handleError));
        //return this.http.get(this.APIUrl + 'get_by_key/' + model_type + '/' + key).pipe(catchError(this.handleError));
    } 
    get_observation_units_by_key(key: string):Observable<{success:boolean,data:ObservationUnitInterface}>{
        return this.http.get<{success:boolean,data:ObservationUnitInterface}>(this.APIUrl + 'get_observation_units_by_key/' + '/' + key).pipe(catchError(this.handleError));
        //return this.http.get(this.APIUrl + 'get_by_key/' + model_type + '/' + key).pipe(catchError(this.handleError));
    } 
    get_elem(collection: string, key: string) {
        return this.http.get(this.APIUrl + 'get_elem/' + collection + '/' + key).pipe(catchError(this.handleError));
    }
    get_study_by_ID(study_id: string, parent_key:string){
        return this.http.get(this.APIUrl + 'get_study_by_ID/' + study_id+ '/' + parent_key).pipe(catchError(this.handleError));
    }
    //get all investigations for a given user
    get_by_parent_key(parent_key: string, model_type: string) {
        return this.http.get(this.APIUrl + 'get_by_parent_key/' + model_type + '/' + parent_key).pipe(catchError(this.handleError));
    }



    // HTTP POST REQUEST
    is_exist(field: string, value: string, model_type: string, parent_id:string="", as_template:boolean=false): Observable<any> {
        if (model_type==="person"){
            console.log(field)
            console.log(value)
            if (field.includes("ID")){
                value= Md5.hashStr(value)
            }
            console.log(model_type)
            let obj2send = {
                'field': field,
                'value': value,
                'model_type': model_type
            };
            console.log(obj2send)
            return this.http.post(`${this.APIUrl + "checkID"}`, obj2send).pipe(catchError(this.handleError));
        }
        else{
            let user = this.get_user();
            let obj2send = {
                'username': user.username,
                'password': user.password,
                'parent_id':parent_id,
                'field': field,
                'value': value,
                'model_type': model_type,
                'as_template':as_template
            };
            return this.http.post(`${this.APIUrl + "check"}`, obj2send).pipe(catchError(this.handleError));
        }
        
    }
    check_one_exists(field:string, value:string, model_type:string){
        let user = this.get_user();
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
    update_field(value: string, key: string, field: string, model_type: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value,
            'model_type': model_type

        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "update_field"}`, obj2send);
    }
    update_multiple_field(values: string[], parent_id:string, _keys: string[], field: string, model_type: string, datafile_key:string="" ,datafile_header:string="" , model_field:string="") {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id':parent_id,
            '_keys': _keys,
            'field': field,
            'values': values,
            'model_type': model_type,
            'datafile_key':datafile_key,
            'datafile_header':datafile_header,          
            'model_field':model_field

        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "update_multiple_field"}`, obj2send);
    }
    test_script(name:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
        };
        return this.http.post(`${this.APIUrl + "/_api/foxx/scripts/test.js"}`, obj2send);
    }
    update_user(value: any, key: string, field: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value

        };
        return this.http.post(`${this.APIUrl + "update_user"}`, obj2send);
    }
    update_person(value: boolean, person_id: string, field: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'person_id': person_id,
            'field': field,
            'value': value

        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "update_person"}`, obj2send);
    }
    update_step(value: string, key: string, field: string, model_type: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'field': field,
            'value': value,
            'model_type': model_type

        };
        return this.http.post(`${this.APIUrl + "update_step"}`, obj2send);
    }
    update_document(key: string, values: {}, model_type: string, template:boolean=false) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        console.log(obj2send)
        if (template){
            return this.http.post(`${this.APIUrl + "update_template"}`, obj2send);
        }
        else{
            return this.http.post(`${this.APIUrl + "update_document"}`, obj2send);
        }
    }
    update_observation_units_with_bm(values: {}, key: string, model_type: string, parent_id: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "update_observation_units_with_bm"}`, obj2send);
    }
    update_observation_units_and_childs(values: {}, key: string, model_type: string, parent_id: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        /* var observation_unit_doc = { "External ID": [], "Observation Unit factor value": [], "Observation unit ID": [], "Observation unit type": [], "Spatial distribution": [], "obsUUID": [] }
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
            //var unique_linda_id = [...new Set(biological_material_data.map(item => item.lindaID))];
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
        } */
        return this.http.post(`${this.APIUrl + "update_observation_units_and_childs"}`, obj2send);
    }
    update_observation_units_and_childs2(values: {}, key: string, model_type: string, parent_id: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            '_key': key,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "update_observation_units_and_childs2"}`, obj2send);
    }

    //REMOVE REQUEST
    remove(id) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove"}`, obj2send);
    }
    //REMOVE REQUEST
    remove_multiple(ids:any[]) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'ids': ids
        };
        return this.http.post(`${this.APIUrl + "remove_multiple"}`, obj2send);
    }
    remove_template(id:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "remove_template"}`, obj2send);
    }
    remove_childs(id) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove_childs"}`, obj2send);
    }
    remove_childs_by_type(id:string, model_type:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id,
            'model_type':model_type
        };
        return this.http.post(`${this.APIUrl + "remove_childs_by_type"}`, obj2send);
    }
    remove_associated_headers_linda_id(id: string, removed_ids: [], collection:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            '_id': id,
            'removed_ids': removed_ids,
            'collection': collection
        };
        return this.http.post(`${this.APIUrl + "remove_associated_headers_linda_id"}`, obj2send);
    }
    remove_association(id:string, datafile_id:string) {
        let user = this.get_user();
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
        let user = this.get_user();
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
    remove_observation_unit(id:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'id': id
        };
        return this.http.post(`${this.APIUrl + "remove_observation_unit"}`, obj2send);
    }
    
    // ADD REQUESTS 
    // return object like that
    // {
    //     "success": true,
    //     "message": "Everything is good ",
    //     "res_obj": [
    //       {
    //         "success": true,
    //         "message": "Everything is good for adding false",
    //         "_id": "investigations/31262022"
    //       }
    //     ],
    //     "template_id": null,
    //     "_id": "investigations/31262022"
    //   }
    add_edge(parent_id:string,person_id:string, role:string, group_key:string=""){
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'role': role,
            'parent_id': parent_id,
            'person_id':person_id,
            'group_key':group_key
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_edge"}`, obj2send);
    }
    add_multiple(values: any[], model_type: string, parent_collections: string, as_template:boolean, group_key:string="",datafile_key:string="" ,datafile_header:string="" ,model_field:string="", parent_ids:string[]=[]) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'role': "owner",
            'parent_collections': parent_collections,
            'values': values,
            'model_type': model_type,
            'as_template': as_template,
            'group_key':group_key,
            'datafile_key':datafile_key,
            'datafile_header':datafile_header,          
            'model_field':model_field,
            'parent_ids':parent_ids
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_multiple"}`, obj2send);
    }
    change_datafile_header(value: string, datafile_key:string ,datafile_header:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'value': value,
            'datafile_key':datafile_key,
            'datafile_header':datafile_header,          
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "change_datafile_header"}`, obj2send);
    }
    add(values: {}, model_type: string, parent_id: string, as_template:boolean, group_key:string="") {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'role': "owner",
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type,
            'as_template': as_template,
            'group_key':group_key
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add"}`, obj2send);
    }
    extract(values: {}, model_type: string, parent_id: string, as_template:boolean, datafile_id:string , associated_headers:AssociatedHeadersInterface[], column_original_label:string,  group_key:string="") {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'role': "owner",
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type,
            'as_template': as_template,
            'datafile_id':datafile_id,
            'associated_headers':associated_headers,
            'column_original_label':column_original_label,
            'group_key':group_key
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "extract"}`, obj2send);
    }
    add_template(values: {}, model_type: string, role:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'values': values,
            'model_type': model_type,
            'role':role
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_template"}`, obj2send);
    }
    add_parent_and_childs(parent_model: {}, child_values: {}, model_type_parent: string, parent_id: string, model_type_child: string) {
        let user = this.get_user();
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
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "add_multi"}`, obj2send);
    }
    add_observation_units_observed_variables(values: {}, parent_id: string, obs_var_id:string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'observed_variable_id':obs_var_id
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_observation_units_observed_variables"}`, obj2send);
    }
    add_observation_units_samples(values: {}, parent_id: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_observation_units_samples"}`, obj2send);
    }

    add_observation_units(values: {}, model_type: string, parent_id: string) {
        let user = this.get_user();
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
    add_observation_units2(values: {}, model_type: string, parent_id: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'values': values,
            'model_type': model_type
        };
        console.log(obj2send)
        return this.http.post(`${this.APIUrl + "add_observation_units2"}`, obj2send);
    }
    saveTemplate(values: {}, model_type: string) {
        let user = this.get_user();
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'values': values,
            'model_type': model_type
        };
        return this.http.post(`${this.APIUrl + "saveTemplate"}`, obj2send);
    }
    // // Implement a method to handle errors if any
    // private handleError(err: HttpErrorResponse | any) {
    //     alert(err)
    //     console.error('An error occurred', err);
    //     return throwError(err.message || err);
    // }
}
