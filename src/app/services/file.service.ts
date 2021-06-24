import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Constants } from "../constants";
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import { element } from 'protractor';



@Injectable({
    providedIn: 'root'
})
export class FileService {
    private APIUrl: string;

    constructor(private httpClient: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
    }

    private extractData(res: Response) {
        
        let body = res;
        return body || {};
    }
    public upload4(data:{}, parent_id: string): Observable<any> {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'data': data
        };
        console.log(obj2send)
        return this.httpClient.post(`${this.APIUrl + "upload_data"}`, obj2send).pipe(map(this.extractData));
    }
    
    public upload3(filename: string, data, headers, associated_headers, parent_id: string): Observable<any> {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'obj': {
                'headers': headers,
                'associated_headers': associated_headers,
                'data': data,
                'filename': filename
            }

        };
        return this.httpClient.post(`${this.APIUrl + "upload_data"}`, obj2send).pipe(map(this.extractData));
    }
    public upload2(filename: string, data, headers, associated_headers, parent_id: string): Observable<any> {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'obj': {
                'headers': headers,
                'associated_headers': associated_headers,
                'data': data,
                'filename': filename
            }

        };
        console.log(obj2send)
        return this.httpClient.post(`${this.APIUrl + "upload"}`, obj2send).pipe(map(this.extractData));
    }

    public upload(filename: string, data, headers, associated_headers, parent_id: string): Observable<any> {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let obj2send = {
            'username': user.username,
            'password': user.password,
            'parent_id': parent_id,
            'obj': {
                'headers': headers,
                'associated_headers': associated_headers,
                'data': data,
                'filename': filename
            }

        };
        return this.httpClient.post<any>(`${this.APIUrl + "upload"}`, obj2send, { reportProgress: true, observe: 'events' }).pipe(map((event) => {
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

    public build_path(root_id, models, selected_format) {
        var paths = { 'filepath': [], 'data': [], 'parent_id': [] }
        models['models_data'].forEach(
            result => {
                var _from: string = result["e"]["_from"]
                var _to: string = result["e"]["_to"]
                let formats = Object.keys(selected_format);
                let path = ''
                if (_from == root_id) {
                    models['models_data'].forEach(
                        result_bis => {
                            var _from_bis: string = result_bis["e"]["_from"]
                            var _to_bis: string = result_bis["e"]["_to"]
                            if ((_to == _from_bis) && (_to == _to_bis)) {
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _to.replace('/', '_') + '/' + _to_bis.replace('/', '_') + formats[i]
                                        if (!paths['filepath'].includes(path)) {
                                            paths['filepath'].push(path)
                                            paths['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths['parent_id'].push(path.split('/')[0])
                                            }
                                            else {
                                                paths['parent_id'].push(root_id)
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths['filepath'].includes(path)) {
                                            paths['filepath'].push(path)
                                            paths['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths['parent_id'].push(path.split('/')[0])
                                            }
                                            else {
                                                paths['parent_id'].push(root_id)
                                                console.log(path.split('/'))
                                                console.log(path.split('/').length)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    )
                    if (path == '') {
                        for (var i = 0; i < formats.length; i++) {
                            if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                path = _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                if (!paths['filepath'].includes(path)) {
                                    paths['filepath'].push(path)
                                    paths['data'].push(result["v"])
                                    if (path.split('/').length > 2) {
                                        paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                    }
                                    else if (path.split('/').length == 2) {
                                        paths['parent_id'].push(path.split('/')[0])
                                    }
                                    else {
                                        paths['parent_id'].push(root_id)
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    models['models_data'].forEach(
                        result_bis => {
                            var _from_bis: string = result_bis["e"]["_from"]
                            var _to_bis: string = result_bis["e"]["_to"]
                            if ((_to == _from_bis) && (_from != root_id)) {
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to_bis.replace('/', '_') + '/' + _to_bis.replace('/', '_') + formats[i]
                                        if (!paths['filepath'].includes(path)) {
                                            paths['filepath'].push(path)
                                            paths['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths['parent_id'].push(path.split('/')[0])
                                            }
                                            else {
                                                paths['parent_id'].push(root_id)
                                            }
                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis != root_id)) {
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from_bis.replace('/', '_') + '/' + _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths['filepath'].includes(path)) {
                                            paths['filepath'].push(path)
                                            paths['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths['parent_id'].push(path.split('/')[0])
                                            }
                                            else {
                                                paths['parent_id'].push(root_id)
                                            }
                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis == root_id)) {
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths['filepath'].includes(path)) {
                                            paths['filepath'].push(path)
                                            paths['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths['parent_id'].push(path.split('/')[0])
                                            }
                                            else {
                                                paths['parent_id'].push(root_id)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    )
                    if (path == '') {
                        //path = _from.replace('/','_') + '/' + _to.replace('/','_') + '/' + _to.replace('/','_')
                        for (var i = 0; i < formats.length; i++) {
                            if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                let path = _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                if (!paths['filepath'].includes(path)) {
                                    paths['filepath'].push(path)
                                    paths['data'].push(result["v"])
                                    if (path.split('/').length > 2) {
                                        paths['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                    }
                                    else if (path.split('/').length == 2) {
                                        paths['parent_id'].push(path.split('/')[0])
                                    }
                                    else {
                                        paths['parent_id'].push(root_id)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
        return paths
    }

    public build_zip(paths, zipFile: JSZip) {
        //let zipFile: JSZip = new JSZip();
        //save a config file to reload
        var dict = { 'filepath': [], 'model_type': [], 'parent_id': [] }
        for (var i = 0; i < paths['filepath'].length; i++) {
            let model_type = paths['data'][i]["_id"].split('/')[0]
            if (model_type == "metadata_files") {

                if (paths['filepath'][i].includes(".csv")) {
                    let csvData = this.ConvertMetadataJsonTo(paths['data'][i], ",");
                    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                    zipFile.file(paths['filepath'][i], blob);
                    dict['filepath'].push(paths['filepath'][i])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])
                }
                else if (paths['filepath'][i].includes(".tsv")) {
                    let tsvData = this.ConvertMetadataJsonTo(paths['data'][i], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    zipFile.file(paths['filepath'][i], blob_tsv);
                    dict['filepath'].push(paths['filepath'][i])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])
                }
                else {
                    var keys = Object.keys(paths['data'][i]);
                    for (var j = 0; j < keys.length; j++) {
                        if (keys[j].startsWith("_") || keys[j].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(j, 1);
                            j--;
                        }
                    }
                    var clean_modeldata = {}
                    keys.forEach(attr => { clean_modeldata[attr] = paths['data'][i][attr] })

                    //keys.forEach(attr => {clean_modeldata[attr]=paths[i]['data'][attr]})
                    let blob_json = new Blob([JSON.stringify(clean_modeldata)], { type: 'application/json' });
                    zipFile.file(paths['filepath'][i], blob_json);
                    dict['filepath'].push(paths['filepath'][i])
                    //zipFile.file(paths[i]['path'], blob_json);
                    //dict['filepath'].push(paths[i]['path'])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])

                }
            }
            else {
                if ((paths['filepath'][i].includes(".csv"))) {
                    let csvData = this.ConvertJsonModelTo(paths['data'][i], ",");
                    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                    zipFile.file(paths['filepath'][i], blob);
                    dict['filepath'].push(paths['filepath'][i])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])
                }
                else if ((paths['filepath'][i].includes(".tsv"))) {
                    let tsvData = this.ConvertJsonModelTo(paths['data'][i], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    zipFile.file(paths['filepath'][i], blob_tsv);
                    dict['filepath'].push(paths['filepath'][i])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])
                }
                else {
                    var keys = Object.keys(paths['data'][i]);
                    for (var j = 0; j < keys.length; j++) {
                        if (keys[j].startsWith("_") || keys[j].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(j, 1);
                            j--;
                        }
                    }
                    var clean_modeldata = {}
                    keys.forEach(attr => { clean_modeldata[attr] = paths['data'][i][attr] })
                    let blob_json = new Blob([JSON.stringify(clean_modeldata)], { type: 'application/json' });
                    zipFile.file(paths['filepath'][i], blob_json);
                    dict['filepath'].push(paths['filepath'][i])
                    dict['model_type'].push(model_type)
                    dict['parent_id'].push(paths['parent_id'][i])
                }
            }
        }

        let blob_json = new Blob([JSON.stringify(dict)], { type: 'application/json' });
        zipFile.file('hierarchy.json', blob_json);
        return zipFile
    }

    // public loadMultipleFiles() {
    //     // read a zip file
    //     fs.readFile("test.zip", function(err, data) {
    //         if (err) throw err;
    //             JSZip.loadAsync(data).then(function (zip) {
    //             // ...
    //             });
    //         });
    // }

    public saveISA(model_data, submodels, model_type: string, collection_name = 'data', model_id = "", isa_model, model) {
        console.log(submodels)
        var model_key = model_id.split("/")[1];
        var paths = { 'filepath': [], 'data': [], 'parent_id': [] }
        var root_id = collection_name + '/' + model_key
        //paths = this.build_path(root_id, submodels, selected_format)
        let zipFile: JSZip = new JSZip();
        //build isa model root
        console.log("entering isa conversion")
        var return_data = { "Investigation": {}, "Study": [], "Trait Definition File": [], "Event": {}, "Assay": [] }

        //Always an investigation
        var filename = "i_investigation_" + model_key + ".txt"
        var parent_id = ""
        var parent_data = {}
        var study_data = {}
        var study_id = ""
        var study_unique_id = ""

        console.log(model_data)
        console.log(model)
        console.log(isa_model)
        return_data = this.build_isa_model2(model_data, model, isa_model, return_data, model_type, filename, parent_id, parent_data)

        submodels['models_data'].forEach(
            submodel => {
                console.log(submodel)
                var filename = ""
                parent_id = submodel["e"]["_from"]
                if (submodel["v"]["_id"].split('/')[0] === "studies") {
                    console.log(submodel["v"]["_id"])
                    model_type = "study"
                    filename = filename
                    parent_data = model_data
                    study_data = submodel
                    study_id = submodel["v"]["_id"]
                    study_unique_id = submodel["v"]["Study unique ID"]
                    return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data)


                }
                else if (submodel["v"]["_id"].split('/')[0] === "observation_units") {
                    //console.log(submodel["v"]["_id"])
                    //model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)
                    //filename="s_study_"+submodel["v"]["_id"].split('/')[1]+".txt"
                    parent_data = submodel
                    // return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id) 
                }
                else if (submodel["v"]["_id"].split('/')[0] === "biological_materials") {
                    //console.log(submodel["v"]["_id"])
                    model_type = submodel["v"]["_id"].split('/')[0].slice(0, -1)
                    filename = "s_study_" + study_id.split('/')[1] + ".txt"
                    if (parent_id.includes("observation_units")) {
                        return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data, submodel["e"])
                        // Here write the environment variable ???? 
                    }
                }
                else if (submodel["v"]["_id"].split('/')[0]==="experimental_factors"){
                    model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)                
                    filename="s_study_"+study_id.split('/')[1]+".txt"

                    if (!parent_id.includes("observation_units")){
                        return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, study_unique_id, study_data) 
                    }
                }
                else if (submodel["v"]["_id"].split('/')[0]==="samples"){
                    model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)
                    filename="a_assay_"+study_id.split('/')[1]+".txt"
                    if (parent_id.includes("observation_units")){
                        return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data) 
                    }
                }
                else if (submodel["v"]["_id"].split('/')[0] === "observed_variables") {
                    //console.log(submodel["v"]["_id"])
                    model_type = submodel["v"]["_id"].split('/')[0].slice(0, -1)
                    filename = "tdf_" + study_id.split('/')[1] + ".txt"
                    if (parent_id.includes("observation_units")) {
                        return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data)
                    }
                }
                else {
                    console.log(submodel["v"]["_id"])
                }
            }
        )
        submodels['models_data'].forEach(
            submodel => {
                parent_id = submodel["e"]["_from"]
                //console.log(parent_id)
                if (submodel["v"]["_id"].split('/')[0] === "studies") {
                    study_data = submodel
                    study_id = submodel["v"]["_id"]
                    study_unique_id = submodel["v"]["Study unique ID"]
                    console.log(study_id)
                }
                else if (submodel["v"]["_id"].split('/')[0] === "environments") {
                    console.log(study_id)
                    model_type = submodel["v"]["_id"].split('/')[0].slice(0, -1)
                    filename = "s_study_" + study_id.split('/')[1] + ".txt"
                    return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, study_unique_id, study_data)

                }
                else if (submodel["v"]["_id"].split('/')[0] === "observation_units") {
                    parent_data = submodel
                }
                else if (submodel["v"]["_id"].split('/')[0]==="experimental_factors"){
                    model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)                
                    filename="s_study_"+study_id.split('/')[1]+".txt"
                    if (parent_id.includes("observation_units")){
                        return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data) 
                    }
                }

                // else if (submodel["v"]["_id"].split('/')[0]==="events"){
                //     model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)                
                //     filename="e_event_"+submodel["v"]["_id"].split('/')[1]+".txt"
                //     if (parent_id.includes("observation_units")){
                //         return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data) 
                //     }
                //     else{
                //     }
                // }
                // else if (submodel["v"]["_id"].split('/')[0]==="experimental_factors"){
                //     model_type=submodel["v"]["_id"].split('/')[0].slice(0, -1)                
                //     filename="e_event_"+submodel["v"]["_id"].split('/')[1]+".txt"
                //     if (parent_id.includes("observation_units")){
                //         return_data = this.build_isa_model2(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type, filename, parent_id, parent_data) 
                //     }
                //     else{
                //     }
                // }

                else {
                    console.log(submodel["v"]["_id"])
                }
            }
        )
        console.log(return_data)
        var elements = Object.keys(return_data);
        for (var j = 0; j < elements.length; j++) {
            if (elements[j] == 'Investigation') {
                let tsvData = this.ConvertInvestigationModelTo(return_data[elements[j]], "\t");
                let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                let path = 'ISA/' + "i_" + model_id.replace('/', '_') + '.txt'
                zipFile.file(path, blob_tsv);
            }
            else if (elements[j] == 'Study') {
                for (var elem in return_data[elements[j]]) {
                    let tsvData = this.ConvertStudyModelTo(return_data[elements[j]][elem]["study_data"], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //Here need to add study identifier
                    let path = 'ISA/' + return_data[elements[j]][elem]["filename"]

                    zipFile.file(path, blob_tsv);
                }
            }
            else if (elements[j] == 'Assay') {
                for (var elem in return_data[elements[j]]) {
                    let tsvData = this.ConvertAssayModelTo(return_data[elements[j]][elem]["assay_data"], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //Here need to add study identifier
                    let path = 'ISA/' + return_data[elements[j]][elem]["filename"]
                    zipFile.file(path, blob_tsv);
                }
            }
            else if (elements[j] == 'Trait Definition File') {
                for (var elem in return_data[elements[j]]) {
                    let tsvData = this.ConvertTraitModelTo(return_data[elements[j]][elem]["tdf_data"], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    let path = 'ISA/' + return_data[elements[j]][elem]["filename"]
                    zipFile.file(path, blob_tsv);
                }
            }
            else {

            }
        }

        //build zipfilez with differents paths
        let dir_root_id = collection_name + '_' + model_key
        zipFile = this.build_zip(paths, zipFile)
        zipFile.generateAsync({ type: "blob" }).then(function (blob) { saveAs(blob, dir_root_id + ".zip"); });
    }

    public build_isa_model2(data, model, isa_model, return_data, model_type, filename, parent_id, parent_data, edge={}) {


        var environment_obj = {}
        
        var keys = Object.keys(data);

        if (model_type === "investigation") {
            var isa_file = "Investigation"
            //add the model
            if (Object.keys(return_data[isa_file]).length === 0) {
                return_data[isa_file] = isa_model
            }
            console.log("-----------building isa ", model_type)
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {

                    var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                    var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                    var isa_field: string = mapping_data["ISA-Tab Field"]
                    console.log("----------------------write field ", isa_field, " in section ", isa_section, " for ", isa_file)
                    if (return_data[isa_file][isa_section][isa_field]) {
                        if ((isa_field.includes("Type")) && (!isa_field.includes("Comment"))) {
                            data[keys[i]].split("/").forEach(element => {

                                return_data[isa_file][isa_section][isa_field].push(element)
                                let tmp_isa_field: string = isa_field + ' Term Accession Number'
                                return_data[isa_file][isa_section][tmp_isa_field].push(element)
                                tmp_isa_field = isa_field + ' Term Source REF'
                                return_data[isa_file][isa_section][tmp_isa_field].push(element.split(":")[0])
                            });
                        }
                        else {
                            return_data[isa_file][isa_section][isa_field].push(data[keys[i]])
                        }
                    }
                    else {
                        return_data[isa_file][isa_section][isa_field] = [data[keys[i]]]
                    }
                }
            }
        }
        else if (model_type === "study") {
            var isa_file = "Investigation"
            console.log("-----------building isa ", model_type)
            //add the model

            var investigation_isa_sections = Object.keys(return_data[isa_file])
            for (var i = 0; i < investigation_isa_sections.length; i++) {

                if (investigation_isa_sections[i].includes("STUDY")) {
                    //console.log(return_data[isa_file][investigation_isa_sections[i]])
                    var study_isa_keys = Object.keys(return_data[isa_file][investigation_isa_sections[i]])
                    for (var j = 0; j < study_isa_keys.length; j++) {
                        return_data[isa_file][investigation_isa_sections[i]][study_isa_keys[j]].push([])
                        //console.log(return_data[isa_file][investigation_isa_sections[i]])
                    }
                }
            }
            //console.log(return_data[isa_file])
            //return_data[isa_file]["STUDY"]["Study File Name"].push("")


            
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {

                    var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                    var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                    var isa_field: string = mapping_data["ISA-Tab Field"]
                    //console.log(isa_field)

                    console.log("----------------------write field ", isa_field, " in section ", isa_section, " for ", isa_file)
                    if (return_data[isa_file][isa_section][isa_field]) {
                        //console.log("write field ", isa_field, " in section ", isa_section, " for ", isa_file)
                        var study_index = return_data[isa_file][isa_section][isa_field].length - 1
                        if ((isa_field.includes("Type")) && (!isa_field.includes("Comment"))) {
                            data[keys[i]].split("/").forEach(element => {
                                //console.log("studies index",study_index)
                                return_data[isa_file][isa_section][isa_field][study_index].push(element)
                                let tmp_isa_field: string = isa_field + ' Term Accession Number'
                                return_data[isa_file][isa_section][tmp_isa_field][study_index].push(element)
                                tmp_isa_field = isa_field + ' Term Source REF'
                                return_data[isa_file][isa_section][tmp_isa_field][study_index].push(element.split(":")[0])
                            });
                        }
                        else {
                            //console.log("study index",study_index)
                            //console.log("study index",return_data[isa_file][isa_section][isa_field])
                            return_data[isa_file][isa_section][isa_field][study_index].push(data[keys[i]])
                            //console.log("study index",return_data[isa_file][isa_section][isa_field])
                        }
                    }
                    else {
                        //console.log("studys index",study_index)
                        return_data[isa_file][isa_section][isa_field] = []
                        return_data[isa_file][isa_section][isa_field].push([data[keys[i]]])
                        //return_data[isa_file][isa_section][isa_field][study_index] = [data[keys[i]]]
                    }
                }
            }
        }
        else if (model_type === "biological_material") {
            var factor_obj = {}
            console.log("#############################################################model type", model_type)

            console.log("----data", data)
            console.log("----parent id", parent_id)
            console.log("----return data", return_data)
            console.log("----parent data", parent_data)
            console.log("----edge data", edge)
            console.log("-----------building isa ", model_type)
            var isa_file = "Study"
            
            var parent_model = parent_data["model"];
            var index = 0

            //Write in return data in this isa model is not exists
            if (return_data[isa_file].length === 0) {
                return_data[isa_file].push({ "filename": filename, "study_data": isa_model })
            }
            else {
                var found: boolean = false
                for (var i = 0; i < return_data[isa_file].length; i++) {
                    if (return_data[isa_file][i]["filename"] === filename) {
                        found = true
                        index = i
                    }
                }
                if (!found) {
                    return_data[isa_file].push({ "filename": filename, "study_data": isa_model })
                    index = return_data[isa_file].length - 1
                }
            }

            var already_exist = false
            for (var i = 0; i < return_data['Study'][index]["study_data"]['Source Name']["data"].length; i++) {
                if ((return_data['Study'][index]["study_data"]['Source Name']["data"][i] === data['Biological material ID']) && (return_data['Study'][index]["study_data"]['Sample Name']["data"][i] === parent_data['v']['Observation unit ID'])) {
                    already_exist = true
                }
            }
            if (!already_exist) {
                //console.log('----------------not exist')
                //Add in investigation file
                if (!return_data['Investigation']['STUDY']['Study File Name'][index].includes(filename)) {
                    return_data['Investigation']['STUDY']['Study File Name'][index].push(filename)
                }
                // console.log(parent_data['v']["obsUUID"])
                var parent_index = parent_data['v']["obsUUID"].indexOf(data["obsUUID"])
                // console.log(data)
                // console.log(parent_data)
                // console.log(parent_index)
                // console.log(keys)
                var bm_data=[]
                var bm_data=edge['biological_materials']
                for (var bm_index = 0; bm_index < bm_data.length; bm_index++) {
                    var data_index = data["Material source ID (Holding institute/stock centre, accession)"].indexOf(bm_data[bm_index]["materialId"])
                    var bm_data_index=data["Biological material ID"][data_index].indexOf(bm_data[bm_index]["biologicalMaterialId"])
                    var parent_index = parent_data['v']["obsUUID"].indexOf(bm_data[bm_index]["obsUUID"])
                    // console.log(bm_data[bm_index])
                    // console.log(data_index)
                    // console.log(bm_data_index)
                    // console.log(data["Material source ID (Holding institute/stock centre, accession)"][data_index])
                    // console.log(parent_index)
                    // console.log(parent_data['v']["obsUUID"][parent_index])
                    // console.log(data["Biological material ID"][data_index][bm_data_index])
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].startsWith("_") || keys[i].startsWith("Definition") || keys[i].includes("UUID")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(i, 1);
                            i--;
                        }
                        else {
                            var is_ontology_key = this.is_ontology_key(model, keys[i])
                            var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                            var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                            var isa_field: string = mapping_data["ISA-Tab Field"]
                            console.log("----------------------get key ", keys[i], " write field ", isa_field, " in section ", isa_section, " for ", isa_file)

                            if (return_data[isa_file][index]["study_data"][isa_field]) {
                                if (return_data[isa_file][index]["study_data"][isa_field]["data"]) {
                                    var data2;
                                    if (keys[i].includes("Material")){
                                        data2=data[keys[i]][data_index]
                                        
                                    }
                                    else if (keys[i].includes("Biological")){
                                        data2=data[keys[i]][data_index][bm_data_index]
                                    }
                                    else{
                                        data2=data[keys[i]]    
                                    }

                                    if (isa_field.includes("Characteristics")) {
                                        // console.log(keys[i])
                                        // console.log(data2)
                                        var term_source_ref = ""
                                        var term_accession_number = ""
                                        if (is_ontology_key) {
                                            term_source_ref = data2.split(":")[0]
                                            term_accession_number = data2
                                        }
                                        let tmp_array = [data2, { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                        // console.log(tmp_array)
                                        return_data[isa_file][index]["study_data"][isa_field]["data"].push(tmp_array)
                                    }
                                    else if (isa_field === "Factor Value[ ]") {
                                        environment_obj["value"] = data2
                                        // console.log(environment_obj)
                                        let tmp_array = [environment_obj, { "Term Source REF": "" }, { "Term Accession Number": "" }]
                                        // return_data[isa_file][index]["study_data"][isa_field]["data"].push(tmp_array)
                                    }
                                    else {
                                        return_data[isa_file][index]["study_data"][isa_field]["data"].push(data2)
                                    }
                                }
                            }
                            else {
                                return_data[isa_file][index]["study_data"][isa_field] = { "data": [data2] }
                            }

                        }
                    }
                    var parent_keys = Object.keys(parent_data["v"]);
                    //console.log(parent_keys)
                    for (var i = 0; i < parent_keys.length; i++) {
                        if (parent_keys[i].startsWith("_") || parent_keys[i].startsWith("Definition") || parent_keys[i].includes("UUID")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            parent_keys.splice(i, 1);
                            i--;
                        }
                        else {
                            // console.log(parent_index)
                            // console.log(parent_keys[i])
                            // console.log(parent_data["v"][parent_keys[i]][parent_index])
                            // console.log(parent_data["v"])
                    //         var is_ontology_key = this.is_ontology_key(parent_model, parent_keys[i][parent_index])
                            mapping_data = this.get_mapping_data_by_key(parent_model, parent_keys[i])
                            var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                            var isa_field: string = mapping_data["ISA-Tab Field"]
                            console.log("write observation unit field ", isa_field, " in section ", isa_section, " for ", isa_file)
                            if (return_data[isa_file][index]["study_data"][isa_field]) {
                                if (return_data[isa_file][index]["study_data"][isa_field]["data"]) {
    
                                    if (isa_field.includes("Characteristics")) {
                                        var term_source_ref = ""
                                        var term_accession_number = ""
                                        if (is_ontology_key) {
                                            term_source_ref = parent_data["v"][parent_keys[i]][parent_index].split(":")[0]
                                            term_accession_number = parent_data["v"][parent_keys[i]][parent_index]
                                        }
                                        let tmp_array = [parent_data["v"][parent_keys[i]][parent_index], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                        return_data[isa_file][index]["study_data"][isa_field]["data"].push(tmp_array)
                                    }
                                    else if (isa_field === "Factor Value[ ]") {
                                        //environment_obj["value"]=parent_data["v"][parent_keys[i]]
                                        //console.log(environment_obj)
                                        //let tmp_array = [environment_obj, { "Term Source REF":""}, { "Term Accession Number": "" }]
                                        //         factor_obj["factor"]=""
                                        //         factor_obj["value"]= ""
                                        //         let tmp_array = [factor_obj, { "Term Source REF":"", { "Term Accession Number": "" }]
                                        return_data[isa_file][index]["study_data"][isa_field]["data"].push([])
                                    }
                                    else {
                                        return_data[isa_file][index]["study_data"][isa_field]["data"].push(parent_data["v"][parent_keys[i]][parent_index])
                                    }
                                }
                            }
                            else {
                                return_data[isa_file][index]["study_data"][isa_field] = { "data": [parent_data["v"][parent_keys[i]][parent_index]] }
                            }
    
                        }
                    }
                }
                console.log(return_data)


                

            }

        }
        else if (model_type === "sample") {
            var isa_file = "Assay"
            console.log("#############################################################model type", model_type)

            console.log("----data", data)
            
            console.log("----parent id", parent_id)
            console.log("----return data", return_data)
            console.log("----parent data", parent_data)
            console.log("----edge data", edge)
            console.log("-----------building isa ", model_type)
            
            
            var parent_keys = Object.keys(parent_data["v"]);
            var parent_model = parent_data["model"];
            var index = 0
            if (return_data[isa_file].length === 0) {
                //if (Object.keys(return_data[isa_file]).length === 0){
                return_data[isa_file].push({ "filename": filename, "assay_data": isa_model })
                //return_data[isa_file]=isa_model
            }
            else {
                var found: boolean = false
                for (var i = 0; i < return_data[isa_file].length; i++) {
                    if (return_data[isa_file][i]["filename"] === filename) {
                        found = true
                        index = i
                    }
                }
                if (!found) {
                    return_data[isa_file].push({ "filename": filename, "assay_data": isa_model })
                    index = return_data[isa_file].length - 1
                }
            }
            var already_exist = false
            for (var i = 0; i < return_data['Assay'][index]["assay_data"]['Sample Name']["data"].length; i++) {
                if ((return_data['Assay'][index]["assay_data"]['Sample Name']["data"][i] === parent_data['v']['Observation unit ID']) && (return_data['Assay'][index]["assay_data"]['Extract Name']["data"][i] === data['Sample ID'])) {
                    already_exist = true
                }

            }
            if (!already_exist) {
                if (!return_data['Investigation']['STUDY ASSAYS']['Study Assay File Name'][index].includes(filename)) {
                    return_data['Investigation']['STUDY ASSAYS']['Study Assay File Name'][index].push(filename)
                }
                var parent_index = parent_data['v']["obsUUID"].indexOf(data["obsUUID"])
                console.log(data)
                console.log(return_data['Assay'])

                //get index of sample obsUUID in parent_data['v'] i.e observation unit data

                return_data['Assay'][index]["assay_data"]['Sample Name']["data"].push(parent_data['v']['Observation unit ID'][parent_index])
                console.log(return_data['Assay'])
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].startsWith("_") || keys[i].startsWith("Definition") || keys[i].includes("UUID")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                        keys.splice(i, 1);
                        i--;
                    }
                    else {
                        var is_ontology_key = this.is_ontology_key(model, keys[i])
                        var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                        var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                        var isa_field: string = mapping_data["ISA-Tab Field"]
                        console.log("----------------------get key ", keys[i], " write field ", isa_field, " in section ", isa_section, " for ", isa_file)
                        if (return_data[isa_file][index]["assay_data"][isa_field]) {
                            console.log("----------------------assay data ", return_data[isa_file][index]["assay_data"][isa_field], "for field ",isa_field )
                            if (return_data[isa_file][index]["assay_data"][isa_field]["data"]) {

                                if (isa_field.includes("Characteristics")) {
                                    var term_source_ref = ""
                                    var term_accession_number = ""
                                    if (is_ontology_key) {
                                        term_source_ref = data[keys[i]].split(":")[0]
                                        term_accession_number = data[keys[i]]
                                    }
                                    let tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                    return_data[isa_file][index]["assay_data"][isa_field]["data"].push(tmp_array)
                                }
                                

                                else {
                                    return_data[isa_file][index]["assay_data"][isa_field]["data"].push(data[keys[i]])
                                }
                            }
                            else {
                                if (isa_field.includes("Characteristics")) {
                                    var term_source_ref = ""
                                    var term_accession_number = ""
                                    if (is_ontology_key) {
                                        term_source_ref = data[keys[i]].split(":")[0]
                                        term_accession_number = data[keys[i]]
                                    }
                                    let tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                    return_data[isa_file][index]["assay_data"][isa_field]["data"] = [tmp_array]
                                }
                                else{
                                    return_data[isa_file][index]["assay_data"][isa_field]["data"] = [data[keys[i]]]
                                }
                            }
                        }
                        else {
                            if (isa_field.includes("Characteristics")) {
                                var term_source_ref = ""
                                var term_accession_number = ""
                                if (is_ontology_key) {
                                    term_source_ref = data[keys[i]].split(":")[0]
                                    term_accession_number = data[keys[i]]
                                }
                                let tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                return_data[isa_file][index]["assay_data"][isa_field] = { "data": [tmp_array] }
                            }
                            else{
                                return_data[isa_file][index]["assay_data"][isa_field] = { "data": [data[keys[i]]] }

                            }
                        }
                    }
                }
            }
        }
        else if (model_type === "experimental_factor") {
            //Investigation isa file part
            console.log("#############################################################model type", model_type)
            console.log("----data", data)
            //in this case it is study id
            console.log("----parent id", parent_id)
            console.log("----return data", return_data)
            //in this case it is observation unit data
            console.log("----parent data", parent_data)
            console.log("----edge data", edge)
            console.log("-----------building isa ", model_type)

            if (parent_data['v']['_id'].includes("studies")){
                var isa_file = "Investigation"
                for (var i = 0; i < return_data[isa_file]["STUDY"]["Study Identifier"].length; i++) {
                    console.log(return_data[isa_file]["STUDY"]["Study Identifier"])
                    if (return_data[isa_file]["STUDY"]["Study Identifier"][i][0] === parent_id) {
                        return_data[isa_file]["STUDY FACTORS"]["Study Factor Name"][i].push(data["Experimental Factor type"])
                        return_data[isa_file]["STUDY FACTORS"]["Study Factor Type Term Accession Number"][i].push(data["Experimental Factor accession number"])
                        if (return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"]) {
                            if (return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"].length === 0) {
                                for (var j = 0; j < return_data[isa_file]["STUDY"]["Study Identifier"].length; j++) {
                                    return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"].push([])
                                }
                            }
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"][i].push(data["Experimental Factor description"])
                        }
                        else {
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"] = []
                            for (var j = 0; j < return_data[isa_file]["STUDY"]["Study Identifier"].length; j++) {
                                return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"].push([])
                            }
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Description]"][i].push(data["Experimental Factor description"])


                        }

                        if (return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"]) {
                            if (return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"].length === 0) {
                                for (var j = 0; j < return_data[isa_file]["STUDY"]["Study Identifier"].length; j++) {
                                    return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"].push([])
                                }
                            }
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"][i].push(data["Experimental Factor values"])
                        }
                        else {
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"] = []
                            for (var j = 0; j < return_data[isa_file]["STUDY"]["Study Identifier"].length; j++) {
                                return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"].push([])
                            }
                            return_data[isa_file]["STUDY FACTORS"]["Comment[Study Factor Values]"][i].push(data["Experimental Factor values"])
                        }
                    }
                }
            }
            else{
                //Write Study isa part    
                isa_file = "Study"

                var parent_keys = Object.keys(parent_data["v"]);
                var parent_model = parent_data["model"];
                var index = 0
                //Write in return data in this isa model is not exists
                if (return_data[isa_file].length !== 0) {
                    for (var i = 0; i < return_data[isa_file].length; i++) {
                        if (return_data[isa_file][i]["filename"] === filename) {
                            found = true
                            index = i
                            console.log('found ', filename)
                            console.log(return_data[isa_file][i]["study_data"])
                            console.log(return_data[isa_file][i]["study_data"]["Factor Value[ ]"]["data"])
                            for (var j = 0; j < return_data[isa_file][i]["study_data"]["Characteristics[Material Source ID]"]['data'].length; j++) {
                                console.log(return_data['Study'][i]["study_data"]['Sample Name']["data"][j])
                                console.log(parent_data['v']['Observation unit ID'])
                                console.log(parent_data['v'])
                                var parent_index = parent_data['v']['Observation unit ID'].indexOf(return_data['Study'][i]["study_data"]['Sample Name']["data"][j])
                                console.log(parent_data['v']['Observation unit ID'][parent_index])
                                if (return_data['Study'][i]["study_data"]['Sample Name']["data"][j] === parent_data['v']['Observation unit ID'][parent_index]) {
                                    console.log(parent_data["v"]["Observation Unit factor value"][parent_index])
                                    var factor_obj={}
                                    factor_obj["factor"] = data["Experimental Factor type"]
                                    factor_obj["value"] = parent_data["v"]["Observation Unit factor value"][parent_index]
                                    let tmp_array = [factor_obj, { "Term Source REF": data["Experimental Factor accession number"].split(":")[0] }, { "Term Accession Number": data["Experimental Factor accession number"] }]
                                    return_data[isa_file][i]["study_data"]["Factor Value[ ]"]["data"][j] = tmp_array
                                }
                                // else{
                                //     if (!return_data['Study'][i]["study_data"]['Sample Name']["data"][j]){
                                //         factor_obj["factor"]=""
                                //         factor_obj["value"]= ""
                                //         let tmp_array = [factor_obj, { "Term Source REF":"", { "Term Accession Number": "" }]

                                //         return_data[isa_file][i]["study_data"]["Factor Value[ ]"]["data"].push(tmp_array)
                                //     }


                                // }

                            }

                        }
                    }
                }
            }



        }
        else if (model_type === "observed_variable") {

            var isa_file = "Trait Definition File"
            var parent_keys = Object.keys(parent_data["v"]);
            var parent_model = parent_data["model"];
            var index = 0
            if (return_data[isa_file].length === 0) {
                //if (Object.keys(return_data[isa_file]).length === 0){
                return_data[isa_file].push({ "filename": filename, "tdf_data": isa_model })
                //return_data[isa_file]=isa_model
            }
            else {
                var found: boolean = false
                for (var i = 0; i < return_data[isa_file].length; i++) {
                    if (return_data[isa_file][i]["filename"] === filename) {
                        found = true
                        index = i
                    }
                }
                if (!found) {
                    return_data[isa_file].push({ "filename": filename, "tdf_data": isa_model })
                    index = return_data[isa_file].length - 1
                }
            }

            var already_exist = false
            for (var i = 0; i < return_data[isa_file][index]["tdf_data"]['Variable ID'].length; i++) {
                if (return_data[isa_file][index]["tdf_data"]['Variable ID'][i] === data['Variable ID']) {
                    already_exist = true
                }

            }
            if (!already_exist) {
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                        keys.splice(i, 1);
                        i--;
                    }
                    else {
                        var is_ontology_key = this.is_ontology_key(model, keys[i])
                        var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                        var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                        var isa_field: string = mapping_data["ISA-Tab Field"]
                        console.log("write field ", isa_field, " in section ", isa_section, " for ", isa_file)
                        if (return_data[isa_file][index]["tdf_data"][isa_field]) {
                            return_data[isa_file][index]["tdf_data"][isa_field].push(data[keys[i]])
                        }
                        else {
                            return_data[isa_file][index]["tdf_data"][isa_field] = [data[keys[i]]]
                        }
                    }
                }
            }

        }
        else if (model_type === "observation_unit") {
        }
        else if (model_type === "environment") {
            var isa_file = "Investigation"
            for (var i = 0; i < return_data[isa_file]["STUDY"]["Study Identifier"].length; i++) {
                if (return_data[isa_file]["STUDY"]["Study Identifier"][i] === parent_id) {
                    return_data[isa_file]["STUDY PROTOCOLS"]["Study Protocol Parameters Name"][i].push(data["Environment parameter"])
                }
            }

            //var study_index=return_data[isa_file]["STUDY"]["Study Identifier"].length -1
            environment_obj["parameter"] = data["Environment parameter"]
            environment_obj["value"] = data["Environment parameter value"]
            let tmp_array = [environment_obj, { "Term Source REF": "" }, { "Term Accession Number": "" }]



            isa_file = "Study"
            console.log(parent_data)
            var parent_keys = Object.keys(parent_data["v"]);
            var parent_model = parent_data["model"];
            var index = 0
            //Write in return data in this isa model is not exists
            if (return_data[isa_file].length !== 0) {
                for (var i = 0; i < return_data[isa_file].length; i++) {
                    if (return_data[isa_file][i]["filename"] === filename) {
                        found = true
                        index = i
                        console.log('found ', filename)
                        console.log(return_data[isa_file][i]["study_data"])
                        for (var j = 0; j < return_data[isa_file][i]["study_data"]["Characteristics[Material Source ID]"]['data'].length; j++) {
                            return_data[isa_file][i]["study_data"]["Parameter Value[ ]"]["data"].push(tmp_array)
                        }

                    }
                }
            }


            // if (return_data[isa_file].length === 0){
            //     return_data[isa_file].push({"filename":filename,"study_data":isa_model})
            // }
            // else{
            //     var found:boolean=false
            //     for (var i = 0; i < return_data[isa_file].length; i++) {
            //         if (return_data[isa_file][i]["filename"]===filename){
            //             found=true
            //             index=i
            //         }
            //     }
            //     if (!found){
            //         return_data[isa_file].push({"filename":filename,"study_data":isa_model})
            //         index=return_data[isa_file].length-1
            //     }
            // }


            // return_data["Investigation"]["STUDY PROTOCOLS"]["Study Protocol Parameters Name"]=data["Environment parameter"]
            // return_data["Study"]["STUDY PROTOCOLS"]["Study Protocol Parameters Name"]=data["Environment parameter"]


            // for (var i = 0; i < keys.length; i++) {
            //     if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
            //         keys.splice(i, 1);
            //         i--;
            //     }
            //     else {
            //         var mapping_data = this.get_mapping_data_by_key(model, keys[i])
            //         var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
            //         var isa_field: string = mapping_data["ISA-Tab Field"]
            //         if (return_data[isa_file][index]["study_data"][isa_field]) {
            //             if (return_data[isa_file][index]["study_data"][isa_field]["data"]) {   
            //                 environment_obj["value"]=data[keys[i]]
            //                 let tmp_array = [environment_obj, { "Term Source REF":""}, { "Term Accession Number": "" }]
            //                 return_data[isa_file][index]["study_data"][isa_field]["data"].push(tmp_array)  
            //             }
            //         }
            //         else{
            //             return_data[isa_file][index]["study_data"][isa_field]={"data":[data[keys[i]]]}
            //         }

            //     }
            // }
        }
        else if (model_type === "event") {
        }
        else {
        }
        console.log(return_data)
        return return_data
    }

    public build_isa_model(data, model, isa_model, return_data, model_type) {
        console.log(return_data)
        var keys = Object.keys(data);
        console.log("@@@@@@@@@@@@@@@@@@@@@@#=>", isa_model)
        console.log("@@@@@@@@@@@@@@@@@@@@@@#=>", model_type)
        var environment_obj = {}
        var already_exist = false


        if (model_type === "biological_material") {
            //vérifier qu'il existe un modéle dans return data pour la study qui contient ce matériel biologique
            for (var elem in return_data['Study']['Source Name']["data"]) {
                if (return_data['Study']['Source Name']["data"][elem] === data['Biological material ID']) {
                    already_exist = true
                }
            }
        }
        if (!already_exist) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {
                    var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                    var isa_files = []
                    if (typeof mapping_data["ISA-Tab File"] === "string") {
                        isa_files = [mapping_data["ISA-Tab File"]]
                    }
                    else {
                        isa_files = mapping_data["ISA-Tab File"]
                    }
                    for (var j = 0; j < isa_files.length; j++) {
                        console.log("write in ", isa_files[j], "ISA file")
                        var isa_file = isa_files[j]
                        var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                        //console.log("write in section: ", isa_section)
                        var isa_field: string = mapping_data["ISA-Tab Field"]
                        //console.log("write for isa field: ", isa_field)
                        var is_ontology_key = this.is_ontology_key(model, keys[i])
                        //console.log("write for miappe model key ", keys[i])
                        //console.log(return_data)
                        //console.log(return_data[isa_file])

                        if (Object.keys(return_data[isa_file]).length === 0) {
                            //console.log ("change isa model for ", isa_file, isa_model)
                            return_data[isa_file] = isa_model
                        }

                        //console.log(return_data[isa_file])
                        // specific model to write in investigation
                        if (isa_file == 'Investigation') {

                            //console.log("Investigation")
                            if (return_data[isa_file][isa_section][isa_field]) {

                                //environment type
                                if (model_type === "environment") {
                                    //console.log("model type environments")
                                    environment_obj["parameter"] = data[keys[i]]
                                }
                                //observation unit type
                                else if (model_type === "observation_unit" && isa_field === "Factor Value[ ]") {
                                    environment_obj["parameter"] = data[keys[i]]
                                }
                                //experimental factor type
                                else if (model_type === "experimental_factor") {
                                    data[keys[i]].split("/").forEach(element => {

                                        if (isa_field.includes("Term Source REF")) {
                                            return_data[isa_file][isa_section][isa_field].push(element.split(":")[0])
                                        }
                                        else {
                                            return_data[isa_file][isa_section][isa_field].push(element)
                                        }

                                    });
                                }
                                //investigation and study type
                                else {
                                    if ((isa_field.includes("Type")) && (!isa_field.includes("Comment"))) {
                                        //console.log(isa_field)
                                        //console.log(data[keys[i]])
                                        data[keys[i]].split("/").forEach(element => {
                                            return_data[isa_file][isa_section][isa_field].push(element)
                                            let tmp_isa_field: string = isa_field + ' Term Accession Number'
                                            return_data[isa_file][isa_section][tmp_isa_field].push(element)
                                            tmp_isa_field = isa_field + ' Term Source REF'
                                            return_data[isa_file][isa_section][tmp_isa_field].push(element.split(":")[0])
                                        });
                                    }
                                    else {
                                        return_data[isa_file][isa_section][isa_field].push(data[keys[i]])
                                    }
                                }

                            }
                            else {
                                return_data[isa_file][isa_section][isa_field] = [data[keys[i]]]
                            }
                        }
                        else if (isa_file == 'Study') {

                            // Environment type
                            if (model_type === "environment") {
                                //console.log("environment model used => write in study isa file")
                                if (return_data[isa_file][isa_field]["data"]) {
                                    //console.log(return_data[isa_file][isa_field])
                                    //console.log("value => ", data[keys[i]])
                                    environment_obj["value"] = data[keys[i]]

                                    let tmp_array = [environment_obj, { "Term Source REF": "" }, { "Term Accession Number": "" }]

                                    return_data[isa_file][isa_field]["data"].push(tmp_array)
                                }
                                // else{
                                //     let tmp_array = [environment_obj, { "Term Source REF":""}, { "Term Accession Number": "" }]
                                //     return_data[isa_file][isa_field]["data"].push(tmp_array)
                                // }
                            }
                            // Observation_unit type
                            // else if (model_type==="observation_unit" && isa_field ==="Factor Value[ ]"){
                            //     if (return_data[isa_file][isa_field]["data"]) {
                            //         environment_obj["value"]=data[keys[i]]
                            //         let tmp_array = [environment_obj, { "Term Source REF":""}, { "Term Accession Number": "" }]
                            //         return_data[isa_file][isa_field]["data"].push(tmp_array)
                            //     }
                            // }

                            //Observation_unit and Biological material type
                            else {
                                //console.log("search for ", isa_field, " in isa model", isa_file)
                                if (return_data[isa_file][isa_field]) {
                                    //console.log(isa_field, "exists in", return_data[isa_file][isa_field]["data"])
                                    if (return_data[isa_file][isa_field]["data"]) {

                                        if (isa_field.includes("Characteristics")) {
                                            var term_source_ref = ""
                                            var term_accession_number = ""
                                            if (is_ontology_key) {
                                                term_source_ref = data[keys[i]].split(":")[0]
                                                term_accession_number = data[keys[i]]
                                            }
                                            let tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                            return_data[isa_file][isa_field]["data"].push(tmp_array)
                                        }
                                        else if (isa_field === "Factor Value[ ]") {
                                            environment_obj["value"] = data[keys[i]]
                                            let tmp_array = [environment_obj, { "Term Source REF": "" }, { "Term Accession Number": "" }]
                                            return_data[isa_file][isa_field]["data"].push(tmp_array)
                                        }

                                        else {
                                            return_data[isa_file][isa_field]["data"].push(data[keys[i]])
                                        }
                                    }
                                    // else {
                                    //     //console.log(return_data[isa_file][isa_field])
                                    //     return_data[isa_file][isa_field]["data"] = [data[keys[i]]]
                                    // }
                                }
                                else {
                                    return_data[isa_file][isa_field] = { "data": [data[keys[i]]] }
                                }
                            }
                            //return_data.push({'Study':isa_model})
                        }
                        //sample type
                        else if (isa_file == 'Assay') {
                            if (return_data[isa_file][isa_field]) {
                                //console.log(isa_field, "exists in", return_data[isa_file][isa_field]["data"])
                                if (return_data[isa_file][isa_field]["data"]) {

                                    if (isa_field.includes("Characteristics")) {
                                        var term_source_ref = ""
                                        var term_accession_number = ""
                                        if (is_ontology_key) {
                                            term_source_ref = data[keys[i]].split(":")[0]
                                            term_accession_number = data[keys[i]]
                                        }
                                        let tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                        return_data[isa_file][isa_field]["data"].push(tmp_array)
                                    }

                                    else {
                                        return_data[isa_file][isa_field]["data"].push(data[keys[i]])
                                    }
                                }
                                else {
                                    //console.log(return_data[isa_file][isa_field])
                                    return_data[isa_file][isa_field]["data"] = [data[keys[i]]]
                                }
                            }
                            else {
                                return_data[isa_file][isa_field] = { "data": [data[keys[i]]] }
                            }
                            //find a way to write in investigation file
                            //return_data['Investigation']['STUDY ASSAYS']['Study Assay File Name'].push('a_'+model+'.txt')

                        }
                        //Event type
                        else if (isa_file == 'Event') {
                            //Create event file and add reference in Investigation isa
                        }
                        //Observed variable type
                        else if (isa_file == 'Trait Definition File') {
                            if (return_data[isa_file][isa_field]) {
                                return_data[isa_file][isa_field].push(data[keys[i]])
                            }
                            else {
                                return_data[isa_file][isa_field] = [data[keys[i]]]
                            }
                        }
                        else {

                        }
                    }
                }
            }

        }
        console.log(return_data)
        return return_data
    }

    public saveFiles(model_data, submodels, collection_name = 'data', model_id = "", selected_format = { '.csv': { 'selected': false, separator: ',', type: 'text/csv;charset=utf-8;' } }) {
        console.log(submodels)
        var model_key = model_id.split("/")[1];
        var paths = { 'filepath': [], 'data': [], 'parent_id': [] }
        var root_id = collection_name + '/' + model_key
        paths = this.build_path(root_id, submodels, selected_format)
        let zipFile: JSZip = new JSZip();
        // write the data for the selected root node
        var formats = Object.keys(selected_format);
        for (var i = 0; i < formats.length; i++) {
            if (selected_format[formats[i]]['selected']) { // && (formats[i] != "isa_tab (.txt)")) {
                var dir_root_path = collection_name + '_' + model_key + formats[i]
                //paths.push({'path':dir_root_path,'data':model_data})
                paths['filepath'].push(dir_root_path)
                paths['data'].push(model_data)
                paths['parent_id'].push('root')
                //console.log(dir_root_path)
                //zipFile = this.build_zip(dir_root_path, zipFile)
            }
        }
        //build zipfilez with differents paths
        let dir_root_id = collection_name + '_' + model_key
        console.log(paths)
        zipFile = this.build_zip(paths, zipFile)
        zipFile.generateAsync({ type: "blob" }).then(function (blob) { saveAs(blob, dir_root_id + ".zip"); });
    }

    public saveFile(data, model_id: string, model_type: string, selected_format = { '.csv': { 'selected': false, separator: ',', type: 'text/csv;charset=utf-8;' } }) {
        let zipFile: JSZip = new JSZip();
        var formats = Object.keys(selected_format);
        for (var i = 0; i < formats.length; i++) {
            if (selected_format[formats[i]]['selected']) {
                console.log(model_type)
                if (model_type == "metadata_file") {
                    if (formats[i] == ".csv") {
                        let csvData = this.ConvertMetadataJsonTo(data, ",");
                        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob);
                    }
                    else if (formats[i] == ".tsv") {
                        let tsvData = this.ConvertMetadataJsonTo(data, "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob_tsv);
                    }
                    else {
                        let blob_json = new Blob([JSON.stringify(data)], { type: 'application/json' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob_json);
                    }
                }
                else {
                    if (formats[i] == ".csv") {
                        let csvData = this.ConvertJsonModelTo(data, ",");
                        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob);
                    }
                    else if (formats[i] == ".tsv") {
                        let tsvData = this.ConvertJsonModelTo(data, "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob_tsv);
                    }
                    // else if (formats[i] == "isa_tab (.txt)") {
                    //     return_data[model_type]=isa_model
                    //     return_data = this.build_isa_model(data, model, isa_model, return_data, model_type)
                    //     //isa_model = this.build_isa_model(data, model, isa_model)
                    //     console.log(isa_model)
                    //     //write isa model
                    //     //console.log(trait_dict)
                    //     if (model_type == 'observed_variable') {
                    //         let tsvData = this.ConvertTraitModelTo(return_data[model_type], "\t");
                    //         let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //         let path = model_id.replace('/', '_') + '/' + 'tdf.txt'
                    //         console.log(path)
                    //         zipFile.file(path, blob_tsv);
                    //     }
                    //     else if (model_type == 'biological_material') {
                    //         let tsvData = this.ConvertStudyModelTo(return_data[model_type], "\t");
                    //         let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //         let path = model_id.replace('/', '_') + '/' + 's_' + model_id.replace('/', '_') + '.txt'
                    //         console.log(path)
                    //         zipFile.file(path, blob_tsv);
                    //     }
                    //     else if (model_type == 'sample') {
                    //         let tsvData = this.ConvertStudyModelTo(return_data[model_type], "\t");
                    //         let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //         let path = model_id.replace('/', '_') + '/' + 'a_' + model_id.replace('/', '_') + '.txt'
                    //         console.log(path)
                    //         zipFile.file(path, blob_tsv);
                    //     }
                    //     else {
                    //         let tsvData = this.ConvertInvestigationModelTo(return_data[model_type], "\t");
                    //         let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    //         let path = model_id.replace('/', '_') + '/' + "i_" + model_id.replace('/', '_') + '.txt'
                    //         zipFile.file(path, blob_tsv);
                    //         console.log(path)


                    //     }


                    // }

                    else {
                        let blob_json = new Blob([JSON.stringify(data)], { type: 'application/json' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob_json);

                    }

                }
            }
        }

        zipFile.generateAsync({ type: "blob" }).then(function (blob) { saveAs(blob, model_id.replace('/', '_') + ".zip"); });



    }

    public ConvertJsonModelTo(objArray, sep = ',') {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                str += keys[i] + sep + array[keys[i]] + '\r\n';
            }
        }
        return str;
    }

    public ConvertInvestigationModelTo(objArray, sep = '\t') {
        //console.log(objArray)
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        var study_number = 0
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].includes("INVESTIGATION")) {
                //console.log(keys[i])
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {

                    str += keys[i] + '\r\n';
                    var subkeys = Object.keys(array[keys[i]]);
                    for (var j = 0; j < subkeys.length; j++) {
                        str += subkeys[j] + sep + array[keys[i]][subkeys[j]] + '\r\n';
                    }
                }
            }
            else {
                var subkeys = Object.keys(array[keys[i]]);
                for (var j = 0; j < subkeys.length; j++) {
                    if (subkeys[j] === 'Study Identifier') {
                        console.log(array[keys[i]][subkeys[j]])
                        study_number = array[keys[i]][subkeys[j]].length
                    }

                }

            }


        }
        for (var n = 0; n < study_number; n++) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].includes("STUDY")) {
                    //console.log(keys[i])
                    if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                        keys.splice(i, 1);
                        i--;
                    }
                    else {

                        str += keys[i] + '\r\n';
                        var subkeys = Object.keys(array[keys[i]]);
                        for (var j = 0; j < subkeys.length; j++) {
                            str += subkeys[j] + sep + array[keys[i]][subkeys[j]][n] + '\r\n';
                        }
                    }
                }



            }

        }


        //console.log(str)
        return str;
    }

    public ConvertTraitModelTo(objArray, sep = ',') {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        //write header
        var number_of_trait_observed = 0
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                number_of_trait_observed = array[keys[i]].length
                str += keys[i] + sep;
            }

        }
        //remove last separator
        str = str.slice(0, -1);
        str += '\r\n';
        for (var j = 0; j < number_of_trait_observed; j++) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {
                    str += array[keys[i]][j] + sep;
                }

            }
            str = str.slice(0, -1);
            str += '\r\n';
        }
        return str;
    }

    public ConvertStudyModelTo(objArray, sep = '\t') {
        console.log(objArray)

        let obj = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        //Write header in study isa file and count object
        var keys = Object.keys(obj);
        var biological_material_number = 0
        var headers = []
        for (var i = 0; i < keys.length; i++) {
            var key_data = obj[keys[i]]
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                key_data["data"].forEach(element => {
                    //console.log(element)
                    if (element) {
                        if (keys[i] === "Parameter Value[ ]") {
                            //console.log(element[0]["parameter"]+ sep)
                            //console.log(keys[i], "=>", key_data["data"])
                            if (!str.includes("Parameter Value[" + element[0]["parameter"] + "]")) {
                                str += "Parameter Value[" + element[0]["parameter"] + "]" + sep;
                                headers.push("Parameter Value[" + element[0]["parameter"] + "]")
                                for (var j = 1; j < element.length; j++) {
                                    var extra_keys = Object.keys(element[j]);
                                    for (var k = 0; k < extra_keys.length; k++) {
                                        str += extra_keys[k] + sep;
                                        headers.push(extra_keys[k])
                                    }
                                }
                            }
                        }
                        else if (keys[i] === "Factor Value[ ]") {
                            //console.log(element[0]["parameter"]+ sep)
                            //console.log(keys[i], "=>", key_data["data"])
                            if (element.length > 0) {
                                if (!str.includes("Factor Value[" + element[0]["factor"] + "]")) {
                                    str += "Factor Value[" + element[0]["factor"] + "]" + sep;
                                    headers.push("Factor Value[" + element[0]["factor"] + "]")
                                    for (var j = 1; j < element.length; j++) {
                                        var extra_keys = Object.keys(element[j]);
                                        for (var k = 0; k < extra_keys.length; k++) {
                                            str += extra_keys[k] + sep;
                                            headers.push(extra_keys[k])
                                        }
                                    }
                                }
                            }

                        }
                        else {
                            //Characteristics descriptors
                            //console.log(typeof element)
                            if (typeof element != "string") {
                                //console.log(keys[i], "=>", key_data["data"])
                                if (!str.includes(keys[i])) {
                                    str += keys[i] + sep;
                                    headers.push(keys[i])
                                    for (var j = 1; j < element.length; j++) {
                                        //console.log(element[j])
                                        var extra_keys = Object.keys(element[j]);
                                        for (var k = 0; k < extra_keys.length; k++) {
                                            str += extra_keys[k] + sep;
                                            headers.push(extra_keys[k])
                                        }
                                    }
                                }

                            }
                            //Source name or sample name
                            else {
                                //console.log(keys[i], "=>", key_data)
                                if (!str.includes(keys[i])) {
                                    str += keys[i] + sep;
                                    headers.push(keys[i])
                                    if (keys[i] === "Source Name") {
                                        biological_material_number = key_data["data"].length
                                    }
                                }

                            }
                        }

                    }
                    else {
                        str += keys[i] + sep;
                        headers.push(keys[i])
                    }

                });

            }
        }

        //console.log(headers)
        //console.log(biological_material_number)
        str = str.slice(0, -1);
        str += '\r\n';
        //write data
        var keys = Object.keys(obj);
        // for (var h in headers){
        //     if (h.includes)

        // }
        
        
        for (var n = 0; n < biological_material_number; n++) {
           // console.log("#############################=> write a new line")
            var row = '';
            for (var h = 0; h < headers.length; h++) {
                var header_found: boolean = false
                //console.log("searching for header: ", headers[h])
                
                for (var i = 0; i < keys.length; i++) {


                    //console.log(obj[keys[i]])
                    
                    if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                        keys.splice(i, 1);
                        i--;
                    }
                    else {
                        //console.log(keys[i])
                        var key_data = obj[keys[i]]
                        var element = key_data["data"][n]
                        // key_data["data"].forEach(element => {
                        //console.log(key_data["data"])
                        //console.log(element)
                        
                        //console.log(keys[i], obj[keys[i]])
                        if (element) {
                            if (keys[i] === "Parameter Value[ ]") {

                                //console.log("searching for key: ", keys[i])
                                //console.log(keys[i], "=>", key_data)
                                if (headers[h] === "Parameter Value[" + element[0]["parameter"] + "]") {
                                    //console.log("header found: ", headers[h])
                                    header_found = true
                                    str += element[0]['value'] + sep;
                                    row += element[0]['value'] + "_";
                                    for (var j = 1; j < element.length; j++) {
                                        //console.log(element[j])
                                        var extra_keys = Object.keys(element[j]);
                                        for (var k = 0; k < extra_keys.length; k++) {

                                            //console.log(element[j][extra_keys[k]])
                                            str += element[j][extra_keys[k]] + sep;
                                            row += element[j][extra_keys[k]] + "_";
                                        }
                                    }

                                    h += 2
                                    break;
                                }

                            }
                            else if (keys[i] === "Factor Value[ ]") {
                                //console.log(keys[i], "=>", key_data)
                                if (element.length > 0) {
                                    //for (elem in element){
                                    if (headers[h] === "Factor Value[" + element[0]["factor"] + "]") {
                                        //console.log("header found: ", headers[h])
                                        header_found = true
                                        str += element[0]['value'] + sep;
                                        row += element[0]['value'] + "_";
                                        for (var j = 1; j < element.length; j++) {
                                            //console.log(element[j])
                                            var extra_keys = Object.keys(element[j]);
                                            for (var k = 0; k < extra_keys.length; k++) {
                                                //console.log(element[j][extra_keys[k]])
                                                str += element[j][extra_keys[k]] + sep;
                                                row += element[j][extra_keys[k]] + "_";
                                            }
                                        }
                                        h += 2
                                        break;
                                    }

                                    //}
                                }
                                // else {
                                //     str += "" + sep + "" + sep + "" + sep
                                //     row +=  "" + "_" + "" + "_" + "" + "_"


                                // }
                            }
                            else {
                                //console.log(typeof element)
                                //Characteristics descriptors
                                if (typeof element != "string") {
                                    //element is an array
                                    //console.log(keys[i], "=>", key_data)
                                    //add first value (string value)
                                    if (headers[h] === keys[i]) {
                                        //console.log("header found: ", headers[h])
                                        header_found = true
                                        str += element[0] + sep;
                                        row += element[0] + "_";
                                        for (var j = 1; j < element.length; j++) {
                                            //console.log(element[j])
                                            var extra_keys = Object.keys(element[j]);
                                            for (var k = 0; k < extra_keys.length; k++) {
                                                //console.log(element[j][extra_keys[k]])
                                                str += element[j][extra_keys[k]] + sep;
                                                row += element[j][extra_keys[k]] + "_";
                                            }
                                        }
                                        h += 2
                                        break;
                                    }

                                }
                                //source name, protocol ref, 
                                else {
                                    //console.log(keys[i], "=>", key_data)
                                    if (headers[h] === keys[i]) {
                                        //console.log("header found: ", headers[h])
                                        header_found = true
                                        str += element + sep;
                                        row += element + "_";
                                        break;
                                    }

                                }
                            }
                        }

                        //});
                    }
                    //console.log("row after add a new value in line for header :" ,row)

                }
                //console.log(header_found)
                if (!header_found) {

                    if (headers[h].includes("Parameter Value")) {
                        str += "" + sep + "" + sep + "" + sep
                        row += "" + "_" + "" + "_" + "" + "_"
                        h += 2
                    }
                    else if (headers[h].includes("Factor Value")) {
                        str += "" + sep + "" + sep + "" + sep
                        row += "" + "_" + "" + "_" + "" + "_"
                        h += 2
                    }
                    else if (headers[h].includes("Characteristics")) {
                        str += "" + sep + "" + sep + "" + sep
                        row += "" + "_" + "" + "_" + "" + "_"
                        h += 2
                    }
                    else {
                        str += "" + sep;
                        row += "" + "_";
                    }

                }
                //console.log("row after add a new value in line for header :" ,row)



            }

            str = str.slice(0, -1);
            str += '\r\n';


        }
        console.log(str)
        //console.log(str)
        // str = str.slice(0, -1);
        // str += '\r\n';
        return str;
    }

    public ConvertAssayModelTo(objArray, sep = '\t') {
        console.log(objArray)

        let obj = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        //Write header in assay isa file and count object
        var keys = Object.keys(obj);
        var biological_material_number = 0
        var headers = []
        for (var i = 0; i < keys.length; i++) {
            var key_data = obj[keys[i]]
            console.log(key_data)
            console.log(keys[i])
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                key_data["data"].forEach(element => {
                    console.log(element)
                    if (element) {
                        if (keys[i] === "Parameter Value[ ]") {
                            //console.log(element[0]["parameter"]+ sep)
                            //console.log(keys[i], "=>", key_data["data"])
                            if (!str.includes("Parameter Value[" + element[0]["parameter"] + "]")) {
                                str += "Parameter Value[" + element[0]["parameter"] + "]" + sep;
                                headers.push(str)
                                for (var j = 1; j < element.length; j++) {
                                    var extra_keys = Object.keys(element[j]);
                                    for (var k = 0; k < extra_keys.length; k++) {
                                        str += extra_keys[k] + sep;
                                        headers.push(str)
                                    }
                                }
                            }
                        }
                        else if (keys[i] === "Factor Value[ ]") {
                            //console.log(element[0]["parameter"]+ sep)
                            //console.log(keys[i], "=>", key_data["data"])
                            if (!str.includes("Factor Value[" + element[0]["parameter"] + "]")) {
                                str += "Factor Value[" + element[0]["parameter"] + "]" + sep;
                                headers.push(str)
                                for (var j = 1; j < element.length; j++) {
                                    var extra_keys = Object.keys(element[j]);
                                    for (var k = 0; k < extra_keys.length; k++) {
                                        str += extra_keys[k] + sep;
                                        headers.push(str)
                                    }
                                }
                            }
                        }
                        else {
                            //Characteristics descriptors
                            //console.log(typeof element)
                            if (typeof element != "string") {
                                //console.log(keys[i], "=>", key_data["data"])
                                if (!str.includes(keys[i])) {
                                    str += keys[i] + sep;
                                    headers.push(str)
                                    for (var j = 1; j < element.length; j++) {
                                        //console.log(element[j])
                                        var extra_keys = Object.keys(element[j]);
                                        for (var k = 0; k < extra_keys.length; k++) {
                                            str += extra_keys[k] + sep;
                                            headers.push(str)
                                        }
                                    }
                                }

                            }
                            //Source name or sample name
                            else {
                                //console.log(keys[i], "=>", key_data)
                                if (!str.includes(keys[i])) {
                                    str += keys[i] + sep;
                                    headers.push(str)
                                    if (keys[i] === "Sample Name") {
                                        biological_material_number = key_data["data"].length
                                    }
                                }

                            }
                        }

                    }
                    else {
                        str += keys[i] + sep;
                        headers.push(str)
                    }

                });

            }
        }
        console.log(headers)

        //console.log(str)
        //console.log(biological_material_number)
        str = str.slice(0, -1);
        str += '\r\n';
        //write data
        var keys = Object.keys(obj);
        // for (var h in headers){
        //     if (h.includes)

        // }
        for (var n = 0; n < biological_material_number; n++) {
            var row = '';
            for (var i = 0; i < keys.length; i++) {

                //console.log(obj[keys[i]])
                //console.log(keys[i])
                if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                    keys.splice(i, 1);
                    i--;
                }
                else {
                    var key_data = obj[keys[i]]
                    var element = key_data["data"][n]
                    // key_data["data"].forEach(element => {
                    //console.log(element)
                    //console.log(keys[i], obj[keys[i]])
                    if (element) {
                        if (keys[i] === "Parameter Value[ ]") {
                            //console.log(keys[i], "=>", key_data)
                            str += element[0]['value'] + sep;
                            for (var j = 1; j < element.length; j++) {
                                //console.log(element[j])
                                var extra_keys = Object.keys(element[j]);
                                for (var k = 0; k < extra_keys.length; k++) {
                                    //console.log(element[j][extra_keys[k]])
                                    str += element[j][extra_keys[k]] + sep;
                                }
                            }
                        }
                        else if (keys[i] === "Factor Value[ ]") {
                            //console.log(keys[i], "=>", key_data)
                            str += element[0]['value'] + sep;
                            for (var j = 1; j < element.length; j++) {
                                //console.log(element[j])
                                var extra_keys = Object.keys(element[j]);
                                for (var k = 0; k < extra_keys.length; k++) {
                                    //console.log(element[j][extra_keys[k]])
                                    str += element[j][extra_keys[k]] + sep;
                                }
                            }
                        }
                        else {
                            //console.log(typeof element)
                            //Characteristics descriptors
                            if (typeof element != "string") {
                                //element is an array
                                //console.log(keys[i], "=>", key_data)
                                //add first value (string value)
                                str += element[0] + sep;
                                for (var j = 1; j < element.length; j++) {
                                    //console.log(element[j])
                                    var extra_keys = Object.keys(element[j]);
                                    for (var k = 0; k < extra_keys.length; k++) {
                                        //console.log(element[j][extra_keys[k]])
                                        str += element[j][extra_keys[k]] + sep;
                                    }
                                }
                            }
                            //source name, protocol ref, 
                            else {
                                //console.log(keys[i], "=>", key_data)
                                str += element + sep;
                            }
                        }
                    }

                    //});
                }
            }
            str = str.slice(0, -1);
            str += '\r\n';
        }
        //console.log(str)
        // str = str.slice(0, -1);
        // str += '\r\n';
        return str;
    }

    public ConvertMetadataJsonTo(objArray, sep = ',') {
        let data = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var headers = data["headers"];
        var associated_headers = data["associated_headers"];
        var lines = data["data"]

        let row = '';
        let str = '';
        for (let index in headers) {
            row += headers[index] + sep;
        }
        row = row.slice(0, -1);
        str += row + '\r\n';

        row = '';
        for (let index in headers) {
            row += associated_headers[headers[index]]['associated_term_id'] + sep;
        }
        row = row.slice(0, -1);
        str += row + '\r\n';

        row = '';
        for (let index_data in lines) {
            console.log(lines[index_data])
            row = '';
            for (let i = 0; i < lines[index_data].length; i++) {
                row += lines[index_data][i] + sep;
            }
            row = row.slice(0, -1);
            str += row + '\r\n';
        }

        return str;
    }

    public get_mapping_data_by_key(model: {}, key: string) {
        // console.log(key)
        // console.log(model)
        // console.log(model[key])
        var mapping_data = {}
        if (model[key]["Mapping"]) {
            mapping_data = model[key]["Mapping"]
        }
        return mapping_data
    }

    public is_ontology_key(model: {}, key: string) {

        if (model[key]["Associated ontologies"]) {
            return true
        }
        else {
            return false
        }

    }

}
