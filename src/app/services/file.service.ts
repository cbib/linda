import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import {Constants} from "../constants";
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
    private APIUrl:string;

    constructor(private httpClient: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
    }
    
    private extractData(res: Response) {
        let body = res;
        return body || { };
    }
    public upload2(filename:string,data,headers,associated_headers,parent_id:string):Observable<any>{
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
        return this.httpClient.post(`${this.APIUrl+"upload"}`, obj2send).pipe(map(this.extractData));
    }    
    
    
      
    public upload(filename:string,data,headers,associated_headers,parent_id:string) :Observable<any>{
        let uploadURL = `${this.APIUrl}upload`;
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
    
    
        return this.httpClient.post<any>(`${this.APIUrl+"upload"}`, obj2send, {reportProgress: true, observe: 'events'}).pipe(map((event) => 
            {

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
 

    
    
    public build_path(root_id, models, selected_format){
        var paths:any=[]
        models.forEach(
            result=>{
                var _id:string=result["v"]["_id"]
                var model_type= result["v"]["_id"].split('/')[0]
                var _from:string=result["e"]["_from"]
                var _to:string=result["e"]["_to"]
                let formats=Object.keys(selected_format);

                let path = ''


                if (_from == root_id){
                    models.forEach(
                        result_bis=>{

                            var _from_bis:string=result_bis["e"]["_from"]
                            var _to_bis:string=result_bis["e"]["_to"]

                            if ((_to == _from_bis) && (_to == _to_bis)){

                                path = _to.replace('/','_') +'/'+ _to_bis.replace('/','_')
                                for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path + formats[i])){
                                            //paths.push(path + formats[i])
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }                               
                            }
                            else{
                                path = _to.replace('/','_') +'/'+_to.replace('/','_')
                                for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path + formats[i])){
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }
                            }
                        }
                    )
                    if (path ==''){
                         path = _to.replace('/','_') +'/'+_to.replace('/','_')
                         for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path + formats[i])){
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }
                    }
                }
                else{
                    models.forEach(
                        result_bis=>{
                            var _from_bis:string=result_bis["e"]["_from"]
                            var _to_bis:string=result_bis["e"]["_to"]
                            if ((_to == _from_bis) && (_from != root_id)){
                                path = _from.replace('/','_') +'/'+ _to.replace('/','_') +'/'+ _to_bis.replace('/','_') +'/'+ _to_bis.replace('/','_')
                                for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path+ formats[i])){
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis != root_id)){
                                path = _from_bis.replace('/','_') + '/' + _from.replace('/','_') + '/' + _to.replace('/','_') +'/'+ _to.replace('/','_')
                                for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path+ formats[i])){
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }
                            }
                            if ((_from == _to_bis) && (_from_bis == root_id)){
                                path = _from.replace('/','_') + '/' + _to.replace('/','_') + '/' + _to.replace('/','_')
                                for( var i = 0; i < formats.length; i++){
                                    if (selected_format[formats[i]]['selected']){
                                        if (!paths.includes(path+ formats[i])){
                                            paths.push({'path':path + formats[i],'data':result["v"]})
                                        }
                                    }
                                }
                            }

                        }
                    )
                    if (path ==''){
                        path = _from.replace('/','_') + '/' + _to.replace('/','_') + '/' + _to.replace('/','_')
                        for( var i = 0; i < formats.length; i++){
                             if (selected_format[formats[i]]['selected']){
                                 if (!paths.includes(path + formats[i])){
                                     paths.push({'path':path + formats[i],'data':result["v"]})
                                 }
                             }
                         }
                    }
                }
            }
        );
        return paths
    }
    
    public build_zip(paths){
        let zipFile: JSZip = new JSZip();
        for ( var i = 0; i < paths.length; i++){
            let model_type= paths[i]['data']["_id"].split('/')[0]
            if (model_type == "metadata_files"){

                if (paths[i]['path'].includes(".csv")){

                    let csvData = this.ConvertMetadataJsonTo(paths[i]['data'], ",");
                    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                    zipFile.file(paths[i]['path'], blob);
                }
                else if (paths[i]['path'].includes(".tsv")){
                    let tsvData = this.ConvertMetadataJsonTo(paths[i]['data'], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    zipFile.file(paths[i]['path'], blob_tsv);
                }
                else{
                    var keys=Object.keys(paths[i]['data']);
                    for( var j = 0; j < keys.length; j++){     
                       if ( keys[j].startsWith("_") || keys[j].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                           keys.splice(j, 1); 
                           j--;
                       }
                    }
                    var clean_modeldata={}
                    keys.forEach(attr => {clean_modeldata[attr]=paths[i]['data'][attr]})
                    let blob_json = new Blob([JSON.stringify(clean_modeldata)], {type : 'application/json'});
                    zipFile.file(paths[i]['path'], blob_json);

                }
            }
            else{

                if ((paths[i]['path'].includes(".csv"))){

                    let csvData = this.ConvertJsonModelTo(paths[i]['data'], ",");
                    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                    zipFile.file(paths[i]['path'], blob);
                }
                else if ((paths[i]['path'].includes(".tsv"))){
                    let tsvData = this.ConvertJsonModelTo(paths[i]['data'], "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    zipFile.file(paths[i]['path'], blob_tsv);
                }
                else{
                    var keys=Object.keys(paths[i]['data']);
                    for( var j = 0; j < keys.length; j++){     
                        if ( keys[j].startsWith("_") || keys[j].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(j, 1); 
                            j--;
                        }
                    }
                    var clean_modeldata={}
                    keys.forEach(attr => {clean_modeldata[attr]=paths[i]['data'][attr]})
                    let blob_json = new Blob([JSON.stringify(clean_modeldata)], {type : 'application/json'});
                    zipFile.file(paths[i]['path'], blob_json);
                }
            }
        }
        return zipFile
    }
    
    
    public loadMultipleFiles(){
        
        // read a zip file
//        fs.readFile("test.zip", function(err, data) {
//        if (err) throw err;
//            JSZip.loadAsync(data).then(function (zip) {
//            // ...
//            });
//        });
    }
    
    public saveMultipleFiles(model_data, models, collection_name='data', model_key = "", selected_format={'.csv': {'selected':false, separator:',', type: 'text/csv;charset=utf-8;'}}) {
        
       
        //Build path to inject in zip
        var paths:any=[]
        var root_id=collection_name + '/' + model_key
        paths=this.build_path(root_id, models, selected_format)
        
        // write the data for the selected root node
        var formats=Object.keys(selected_format);
        for( var i = 0; i < formats.length; i++){
            if (selected_format[formats[i]]['selected']){
                var dir_root_path=collection_name + '_' + model_key + formats[i]
                paths.push({'path':dir_root_path,'data':model_data})
            }
        }
        //build zipfilez with differents paths
        let dir_root_id=collection_name + '_' + model_key
        let zipFile: JSZip = new JSZip();
        zipFile = this.build_zip(paths)    
        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, dir_root_id +".zip");});    
        
    }
    
    public saveFile(data, model_id:string, model_type:string, selected_format={'.csv': {'selected':false, separator:',', type: 'text/csv;charset=utf-8;'}}) {
        let zipFile: JSZip = new JSZip();
        var formats=Object.keys(selected_format);
        for( var i = 0; i < formats.length; i++){
            if (selected_format[formats[i]]['selected']){
                console.log(model_type)
                if (model_type == "metadata_file"){
                    if (formats[i]==".csv"){

                        let csvData = this.ConvertMetadataJsonTo(data, ",");
                        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob);
                    }
                    else if(formats[i]==".tsv"){
                        let tsvData = this.ConvertMetadataJsonTo(data, "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob_tsv);
                    }
                    else{
                        let blob_json = new Blob([JSON.stringify(data)], {type : 'application/json'});
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob_json);  
                    }
                }
                else{
                    if (formats[i]==".csv"){
                        let csvData = this.ConvertJsonModelTo(data, ",");
                        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob);

                    }
                    else if (formats[i]==".tsv"){
                        let tsvData = this.ConvertJsonModelTo(data, "\t");
                        let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob_tsv);
                    }

                    else{
                        let blob_json = new Blob([JSON.stringify(data)], {type : 'application/json'});
                        let path = model_id.replace('/','_') + '/' + model_id.replace('/','_') + formats[i]
                        zipFile.file(path, blob_json);

                    }

                }
            }
        }
        
        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, model_id.replace('/','_') +".zip");});


        
    }
    
    public ConvertJsonModelTo(objArray, sep=',') {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        var keys=Object.keys(array);
        for( var i = 0; i < keys.length; i++){     
            if ( keys[i].startsWith("_") || keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1); 
                i--;
            }
            else{
                str +=keys[i]+ sep + array[keys[i]] + '\r\n';
            }
        }
        return str;
    }
    
    public ConvertMetadataJsonTo(objArray, sep=',') {
        let data = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        
        var headers= data["headers"];
        var associated_headers= data["associated_headers"];
        var lines= data["data"]
        
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
