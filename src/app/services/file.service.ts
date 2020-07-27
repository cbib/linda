import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Constants } from "../constants";
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as fs from 'fs';



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
        return this.httpClient.post(`${this.APIUrl + "upload"}`, obj2send).pipe(map(this.extractData));
    }



    public upload(filename: string, data, headers, associated_headers, parent_id: string): Observable<any> {
        let uploadURL = `${this.APIUrl}upload`;
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
        var paths: any = []
        var paths2 = { 'filepath': [], 'data': [], 'parent_id': [] }
        //console.log(models)

        models['models_data'].forEach(
            result => {
                var _id: string = result["v"]["_id"]
                var model_type = result["v"]["_id"].split('/')[0]
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

                                //path = _to.replace('/','_') +'/'+ _to_bis.replace('/','_')
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _to.replace('/', '_') + '/' + _to_bis.replace('/', '_') + formats[i]
                                        if (!paths2['filepath'].includes(path)) {
                                            paths2['filepath'].push(path)
                                            paths2['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths2['parent_id'].push(path.split('/')[0])

                                            }
                                            else {
                                                paths2['parent_id'].push(root_id)
                                                //console.log(path.split('/'))
                                                //console.log(path.split('/').length)

                                            }
                                        }
                                        //                                        if (!paths.includes(path + formats[i])){
                                        //                                            //paths.push(path + formats[i])
                                        //                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        //                                        }
                                    }
                                }
                            }
                            else {
                                //path = _to.replace('/','_') +'/'+_to.replace('/','_')
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths2['filepath'].includes(path)) {
                                            paths2['filepath'].push(path)
                                            paths2['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths2['parent_id'].push(path.split('/')[0])

                                            }
                                            else {
                                                paths2['parent_id'].push(root_id)
                                                console.log(path.split('/'))
                                                console.log(path.split('/').length)

                                            }
                                        }
                                        //                                        if (!paths.includes(path + formats[i])){
                                        //                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        //                                        }
                                    }
                                }
                            }
                        }
                    )
                    if (path == '') {
                        //path = _to.replace('/','_') +'/'+_to.replace('/','_')
                        for (var i = 0; i < formats.length; i++) {
                            if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                path = _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                if (!paths2['filepath'].includes(path)) {
                                    paths2['filepath'].push(path)
                                    paths2['data'].push(result["v"])
                                    if (path.split('/').length > 2) {
                                        paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                    }
                                    else if (path.split('/').length == 2) {
                                        paths2['parent_id'].push(path.split('/')[0])

                                    }
                                    else {
                                        paths2['parent_id'].push(root_id)
                                        console.log(path.split('/'))
                                        console.log(path.split('/').length)

                                    }
                                }
                                //                                        if (!paths.includes(path + formats[i])){
                                //                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                //                                        }
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
                                //path = _from.replace('/','_') +'/'+ _to.replace('/','_') +'/'+ _to_bis.replace('/','_') +'/'+ _to_bis.replace('/','_')
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to_bis.replace('/', '_') + '/' + _to_bis.replace('/', '_') + formats[i]
                                        if (!paths2['filepath'].includes(path)) {
                                            paths2['filepath'].push(path)
                                            paths2['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths2['parent_id'].push(path.split('/')[0])

                                            }
                                            else {
                                                paths2['parent_id'].push(root_id)
                                                console.log(path.split('/'))
                                                console.log(path.split('/').length)

                                            }
                                        }
                                        //                                        if (!paths.includes(path)){
                                        //                                            paths.push({'path':path,'data':result["v"]})
                                        //                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis != root_id)) {
                                //path = _from_bis.replace('/','_') + '/' + _from.replace('/','_') + '/' + _to.replace('/','_') +'/'+ _to.replace('/','_')
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from_bis.replace('/', '_') + '/' + _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths2['filepath'].includes(path)) {
                                            paths2['filepath'].push(path)
                                            paths2['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths2['parent_id'].push(path.split('/')[0])

                                            }
                                            else {
                                                paths2['parent_id'].push(root_id)
                                                console.log(path.split('/'))
                                                console.log(path.split('/').length)

                                            }
                                        }
                                        //                                        if (!paths.includes(path+ formats[i])){
                                        //                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        //                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis == root_id)) {
                                //path = _from.replace('/','_') + '/' + _to.replace('/','_') + '/' + _to.replace('/','_')
                                for (var i = 0; i < formats.length; i++) {
                                    if (selected_format[formats[i]]['selected'] && formats[i] != "isa_tab (.txt)") {
                                        path = _from.replace('/', '_') + '/' + _to.replace('/', '_') + '/' + _to.replace('/', '_') + formats[i]
                                        if (!paths2['filepath'].includes(path)) {
                                            paths2['filepath'].push(path)
                                            paths2['data'].push(result["v"])
                                            if (path.split('/').length > 2) {
                                                paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                            }
                                            else if (path.split('/').length == 2) {
                                                paths2['parent_id'].push(path.split('/')[0])

                                            }
                                            else {
                                                paths2['parent_id'].push(root_id)
                                                console.log(path.split('/'))
                                                console.log(path.split('/').length)

                                            }
                                        }
                                        //                                        if (!paths.includes(path+ formats[i])){
                                        //                                            paths.push({'path':path,'data':result["v"]})
                                        //                                        }
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
                                if (!paths2['filepath'].includes(path)) {
                                    paths2['filepath'].push(path)
                                    paths2['data'].push(result["v"])
                                    if (path.split('/').length > 2) {
                                        paths2['parent_id'].push(path.split('/')[path.split('/').length - 3])
                                    }
                                    else if (path.split('/').length == 2) {
                                        paths2['parent_id'].push(path.split('/')[0])

                                    }
                                    else {
                                        paths2['parent_id'].push(root_id)
                                        //console.log(path.split('/'))
                                        //console.log(path.split('/').length)

                                    }
                                }
                                //                                 if (!paths.includes(path + formats[i])){
                                //                                     
                                //                                     paths.push({'path':path + formats[i],'data':result["v"]})
                                //                                 }
                            }
                        }
                    }
                }
            }
        );
        //console.log(paths2)
        return paths2
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


        console.log(dict)
        let blob_json = new Blob([JSON.stringify(dict)], { type: 'application/json' });
        zipFile.file('hierarchy.json', blob_json);


        return zipFile
    }

    public loadMultipleFiles() {

        // read a zip file
        //        fs.readFile("test.zip", function(err, data) {
        //        if (err) throw err;
        //            JSZip.loadAsync(data).then(function (zip) {
        //            // ...
        //            });
        //        });
    }


    public build_isa_model(data, model, isa_model, return_data, model_type) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                var mapping_data = this.get_mapping_data_by_key(model, keys[i])
                var isa_files=[]
                if (typeof  mapping_data["ISA-Tab File"]==="string"){
                    isa_files = [mapping_data["ISA-Tab File"]]
                }
                else{
                    isa_files = mapping_data["ISA-Tab File"]
                }
                for (var j = 0; j < isa_files.length; j++) {
                    console.log("write in ", isa_files[j], "ISA file")
                    var isa_file = isa_files[j]
                    var isa_section = mapping_data["ISA-Tab Section (for Investigation file)"]
                    console.log("write in section: ", isa_section)
                    var isa_field: string = mapping_data["ISA-Tab Field"]
                    console.log("write for isa field: ", isa_field)
                    var is_ontology_key = this.is_ontology_key(model, keys[i])
                    console.log("write for miappe model key ", keys[i])
                    //console.log(return_data)
                    //console.log(return_data[isa_file])
                    if (Object.keys(return_data[isa_file]).length === 0){
                        return_data[isa_file]=isa_model
                    }
                    //console.log(return_data[isa_file])
                    // specific model to write in investigation
                    if (isa_file == 'Investigation') {
                        if (return_data[isa_file][isa_section][isa_field]) {
                            if (isa_field.includes("Type")) {
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
                            return_data[isa_file][isa_section][isa_field] = data[keys[i]]
                        }
                        //return_data.push({'Investigation':isa_model})
                        //return_data['isa_model']=isa_model
                    }
                    else if (isa_file == 'Study') {

                        if (return_data[isa_file][isa_field]) {
                            //console.log(isa_field, "exists in", isa_model)
                            if (isa_field.includes("Characteristics")) {
                                var term_source_ref = ""
                                var term_accession_number = ""
                                if (is_ontology_key) {
                                    term_source_ref = data[keys[i]].split(":")[0]
                                    term_accession_number = data[keys[i]]
                                }
                                var tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                return_data[isa_file][isa_field].push(tmp_array)
                            }
                            else {
                                return_data[isa_file][isa_field].push(data[keys[i]])
                            }
                        }
                        else {
                            return_data[isa_file][isa_field] = data[keys[i]]
                        }
                        //return_data.push({'Study':isa_model})
                    }
                    else if (isa_file == 'Assay') { 
                        if (return_data[isa_file][isa_field]) {
                            //console.log(isa_field, "exists in", isa_model)
                            if (isa_field.includes("Characteristics")) {
                                var term_source_ref = ""
                                var term_accession_number = ""
                                if (is_ontology_key) {
                                    term_source_ref = data[keys[i]].split(":")[0]
                                    term_accession_number = data[keys[i]]
                                }
                                var tmp_array = [data[keys[i]], { "Term Source REF": term_source_ref }, { "Term Accession Number": term_accession_number }]
                                return_data[isa_file][isa_field].push(tmp_array)
                            }
                            else {
                                return_data[isa_file][isa_field].push(data[keys[i]])
                            }
                        }
                        else {
                            return_data[isa_file][isa_field] = data[keys[i]]
                        }

                    }
                    else if (isa_file == 'Event') {
                        //Create event file and add reference in Investigation isa
                    }
                    else if (isa_file == 'Trait Definition File') {
                        if (return_data[isa_file][isa_field]) {
                            return_data[isa_file][isa_field].push(data[keys[i]])
                        }
                        else {
                            return_data[isa_file][isa_field] = data[keys[i]]
                        }
                    }
                    else { 

                    }
                }
            }
        }
        console.log(return_data)
        return return_data
    }

    public saveMultipleFiles(model_data, submodels, model_type: string, collection_name = 'data', model_id = "", isa_model, model, selected_format = { '.csv': { 'selected': false, separator: ',', type: 'text/csv;charset=utf-8;' } }) {
        console.log(submodels)
        var model_key = model_id.split("/")[1];
        var root_model_type = model_type
        //Build path to inject in zip
        //var paths:any=[]
        var paths = { 'filepath': [], 'data': [], 'parent_id': [] }
        var root_id = collection_name + '/' + model_key
        paths = this.build_path(root_id, submodels, selected_format)
        let zipFile: JSZip = new JSZip();
        // write the data for the selected root node
        var formats = Object.keys(selected_format);
        for (var i = 0; i < formats.length; i++) {
            //console.log(selected_format)
            //console.log("format to treat: ", formats[i])
            //console.log(selected_format[formats[i]])
            if ((selected_format[formats[i]]['selected']) && (formats[i] != "isa_tab (.txt)")) {
                var dir_root_path = collection_name + '_' + model_key + formats[i]
                //paths.push({'path':dir_root_path,'data':model_data})
                paths['filepath'].push(dir_root_path)
                paths['data'].push(model_data)
                paths['parent_id'].push('root')
                //console.log(dir_root_path)
                //zipFile = this.build_zip(dir_root_path, zipFile)
            }
            else if ((selected_format[formats[i]]['selected']) && (formats[i] == "isa_tab (.txt)"))  {
                //build isa model root
                var return_data={"Investigation":{}, "Study":{}, "Trait Definition File":{}, "Event":{}, "Assay":{}}
                //return_data[model_type]=isa_model
                return_data = this.build_isa_model(model_data, model, isa_model, return_data, model_type)
                submodels['models_data'].forEach(
                    submodel => {
                        console.log(submodel)
                        var model_type = submodel["v"]["_id"].split('/')[0]
                        var _id: string = submodel["v"]["_id"]
                        var _from: string = submodel["e"]["_from"]
                        var _to: string = submodel["e"]["_to"]
                        return_data = this.build_isa_model(submodel["v"], submodel["model"], submodel["isa_model"], return_data, model_type) 
                    }
                )
                var elements = Object.keys(return_data);
                for (var j = 0; j < elements.length; j++) {
                    if (elements[j] == 'Investigation') {
                        let tsvData = this.ConvertInvestigationModelTo(return_data[elements[j]], "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = 'ISA/' + "i_" + model_id.replace('/', '_') + '.txt'
                        zipFile.file(path, blob_tsv);
                    }
                    else if (elements[j] == 'Study') {
                        let tsvData = this.ConvertStudyModelTo(return_data[elements[j]], "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        //Here need to add study identifier
                        let path = 'ISA/' + 's_' + model_id.replace('/', '_') + '.txt'
                        zipFile.file(path, blob_tsv);
                    }
                    else if (elements[j] == 'Trait Definition File') {
                        let tsvData = this.ConvertTraitModelTo(return_data[elements[j]], "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = 'ISA/' + 'tdf.txt'
                        zipFile.file(path, blob_tsv);
                    }                  
                }
            }
            else{}
        }

        //build zipfilez with differents paths
        let dir_root_id = collection_name + '_' + model_key
        console.log(paths)
        zipFile = this.build_zip(paths, zipFile)
        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, dir_root_id +".zip");});    

    }
    public get_mapping_data_by_key(model: {}, key: string) {
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

    

    public saveFile(data, model_id: string, model_type: string, model, isa_model, selected_format = { '.csv': { 'selected': false, separator: ',', type: 'text/csv;charset=utf-8;' } }) {
        console.log(model)
        console.log(isa_model)
        var return_data={}
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
                    else if (formats[i] == "isa_tab (.txt)") {
                        return_data[model_type]=isa_model
                        return_data = this.build_isa_model(data, model, isa_model, return_data, model_type)

                        
                        //isa_model = this.build_isa_model(data, model, isa_model)
                        console.log(isa_model)
                        //write isa model
                        //console.log(trait_dict)
                        if (model_type == 'observed_variable') {
                            let tsvData = this.ConvertTraitModelTo(return_data[model_type], "\t");
                            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                            let path = model_id.replace('/', '_') + '/' + 'tdf.txt'
                            console.log(path)
                            zipFile.file(path, blob_tsv);
                        }
                        else if (model_type == 'biological_material') {
                            let tsvData = this.ConvertStudyModelTo(return_data[model_type], "\t");
                            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                            let path = model_id.replace('/', '_') + '/' + 's_' + model_id.replace('/', '_') + '.txt'
                            console.log(path)
                            zipFile.file(path, blob_tsv);
                        }
                        else if (model_type == 'sample') {
                            let tsvData = this.ConvertStudyModelTo(return_data[model_type], "\t");
                            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                            let path = model_id.replace('/', '_') + '/' + 'a_' + model_id.replace('/', '_') + '.txt'
                            console.log(path)
                            zipFile.file(path, blob_tsv);
                        }
                        else {
                            let tsvData = this.ConvertInvestigationModelTo(return_data[model_type], "\t");
                            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                            let path = model_id.replace('/', '_') + '/' + "i_" + model_id.replace('/', '_') + '.txt'
                            zipFile.file(path, blob_tsv);
                            console.log(path)


                        }


                    }

                    else {
                        let blob_json = new Blob([JSON.stringify(data)], { type: 'application/json' });
                        let path = model_id.replace('/', '_') + '/' + model_id.replace('/', '_') + formats[i]
                        zipFile.file(path, blob_json);

                    }

                }
            }
        }

        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, model_id.replace('/','_') +".zip");});



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
    public ConvertInvestigationModelTo(objArray, sep = ',') {
        //console.log(objArray)
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        for (var i = 0; i < keys.length; i++) {
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
        return str;
    }



    public ConvertTraitModelTo(objArray, sep = ',') {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                str += keys[i] + sep;
            }

        }
        str = str.slice(0, -1);
        str += '\r\n';
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                str += array[keys[i]] + sep;
            }

        }
        str = str.slice(0, -1);
        str += '\r\n';
        return str;
    }


    public ConvertStudyModelTo(objArray, sep = ',') {
        console.log(objArray)
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys = Object.keys(array);
        for (var i = 0; i < keys.length; i++) {
            var key_data = array[keys[i]]
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                if (key_data[0]){
                    console.log(typeof key_data[0])
                    if (typeof key_data[0]!="string"){
                        console.log(keys[i], "=>", key_data)
                        str +=keys[i]+ sep;
                        for (var j = 1; j < key_data[0].length; j++) {
                            console.log(key_data[0][j])
                            var extra_keys = Object.keys(key_data[0][j]);
                            for (var k = 0; k < extra_keys.length; k++) {
                                str +=extra_keys[k]+ sep;
                            }
                        }
                    }
                    else{
                        console.log(keys[i], "=>", key_data)
                        str +=keys[i]+ sep;
                    }
                }
                else{
                    str +=keys[i]+ sep;
                }
            }
        }
        
        console.log(str)
        str = str.slice(0, -1);
        str += '\r\n';
        var keys = Object.keys(array);
        for (var i = 0; i < keys.length; i++) {
            var key_data = array[keys[i]]
            if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1);
                i--;
            }
            else {
                console.log(keys[i], array[keys[i]])
                if (key_data[0]){
                    console.log(typeof key_data[0])
                    if (typeof key_data[0]!="string"){
                        console.log(keys[i], "=>", key_data)
                        str +=key_data[0][0]+ sep;
                        for (var j = 1; j < key_data[0].length; j++) {
                            console.log(key_data[0][j])
                            var extra_keys = Object.keys(key_data[0][j]);
                            for (var k = 0; k < extra_keys.length; k++) {
                                str +=key_data[0][j][extra_keys[k]]+ sep;
                            }
                        }
                    }
                    //source name, protocol ref, 
                    else{
                        console.log(keys[i], "=>", key_data)
                        str +=key_data[0]+ sep;
                    }
                }
                else{
                    str +=""+ sep;
                }
            }
        }
        console.log(str)
        str = str.slice(0, -1);
        str += '\r\n';
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

}
