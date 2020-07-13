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
    
    public build_path(result, paths, root_id, models, selected_format ){
        var _id:string=result["v"]["_id"]
        var model_type= result["v"]["_id"].split('/')[0]
        var _from:string=result["e"]["_from"]
        var _to:string=result["e"]["_to"]
        var formats=Object.keys(selected_format);

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
                                    paths.push(path + formats[i])
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
        let zipFile: JSZip = new JSZip();
        var dir_root_id=collection_name + '_' + model_key
        var root_id=collection_name + '/' + model_key
        var formats=Object.keys(selected_format);
        var paths:any=[]

        // write the data for the selected root node
        for( var i = 0; i < formats.length; i++){
            if (selected_format[formats[i]]['selected']){
                var dir_root_path=collection_name + '_' + model_key + formats[i]
                
                //paths.push({'path':dir_root_path,'data':model_data})
                console.log(formats[i])
                if (formats[i]==".csv"){
                    
                    let csvData = this.ConvertJsonModelTo(model_data, ",");
                    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                    zipFile.file(dir_root_path, blob);
                }
                else if (formats[i]==".tsv"){
                    let tsvData = this.ConvertJsonModelTo(model_data, "\t");
                    let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
                    zipFile.file(dir_root_path, blob_tsv);
                }
                else{
                     var keys=Object.keys(model_data);
                     for( var i = 0; i < keys.length; i++){     
                        if ( keys[i].startsWith("_") || keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                            keys.splice(i, 1); 
                            i--;
                        }
                     }
                     var clean_modeldata={}
                     keys.forEach(attr => {clean_modeldata[attr]=model_data[attr]})
                     let blob_json = new Blob([JSON.stringify(clean_modeldata)], {type : 'application/json'});
                     zipFile.file(dir_root_path, blob_json);
                }
            }
        }
        //Build path to inject in zip
        models.forEach(
            result=>{
                var _id:string=result["v"]["_id"]
                var model_type= result["v"]["_id"].split('/')[0]
                var _from:string=result["e"]["_from"]
                var _to:string=result["e"]["_to"]
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
                                            paths.push(path + formats[i])
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
                
                for ( var i = 0; i < paths.length; i++){

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
                            console.log(clean_modeldata)
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
            }
        );
        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, dir_root_id+".zip");});    
        
    }
    
    public saveFile(data, model_type='data', model_id = "", format='.csv') {
        console.log(format)
        let zipFile: JSZip = new JSZip();
        if (format==".csv"){
            let csvData = this.ConvertJsonModelTo(data, ",");
            let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
            //saveAs(blob, filename + format)
            
//            let dwldLink = document.createElement("a");
//            let url = URL.createObjectURL(blob);
//            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
//
//            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
//                dwldLink.setAttribute("target", "_blank");
//            }
//            dwldLink.setAttribute("href", url);
//            dwldLink.setAttribute("download", filename + format);
//            dwldLink.style.visibility = "hidden";
//            document.body.appendChild(dwldLink);
//            dwldLink.click();
//            document.body.removeChild(dwldLink);
            
            
            
            console.log(model_type+"/"+ model_type + format)
            //let dir= model_type.split("_")[0]
            //let filename = model_type + 's_' + model_id
            var model_key=model_id.split("/")[1];
            var collection_name=model_id.split("/")[0];
            let another_folder = model_type + '/test/' + collection_name + '_' + model_key + format
            let path_with_folder = model_type + '/' + collection_name + '_' + model_key + format
            let path = collection_name + '_' + model_key + format
            //zipFile.file(path_with_folder, blob);
            //zipFile.file(another_folder, blob);
            zipFile.file(path, blob);
            
        }
        else if (format==".tsv"){
            let tsvData = this.ConvertJsonModelTo(data, "\t");
            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
            let path = collection_name + '_' + model_key + format
            //zipFile.file(path_with_folder, blob);
            //zipFile.file(another_folder, blob);
            zipFile.file(path, blob_tsv);

            
            //saveAs(blob_tsv,filename + format);
            
//            let dwldLink = document.createElement("a");
//            let url = URL.createObjectURL(blob_tsv);
//            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
//
//            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
//                dwldLink.setAttribute("target", "_blank");
//            }
//            dwldLink.setAttribute("href", url);
//            dwldLink.setAttribute("download", model_type + format);
//            dwldLink.style.visibility = "hidden";
//            document.body.appendChild(dwldLink);
//            dwldLink.click();
//            document.body.removeChild(dwldLink);
        }

        else{
            let blob_json = new Blob([JSON.stringify(data)], {type : 'application/json'});
            let path = collection_name + '_' + model_key + format
            //zipFile.file(path_with_folder, blob);
            //zipFile.file(another_folder, blob);
            zipFile.file(path, blob_json);
            //saveAs(blob_json,filename + format);
            
//            let dwldLink = document.createElement("a");
//            let url = URL.createObjectURL(blob_tsv);
//            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
//
//            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
//                dwldLink.setAttribute("target", "_blank");
//            }
//            dwldLink.setAttribute("href", url);
//            dwldLink.setAttribute("download", model_type + format);
//            dwldLink.style.visibility = "hidden";
//            document.body.appendChild(dwldLink);
//            dwldLink.click();
//            document.body.removeChild(dwldLink);
        }
        zipFile.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, model_id+".zip");});
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
    
    public saveMetadataFile(data, filename='data', format='.csv') {
        
        console.log(format)
        if (format==".csv"){
            
            let csvData = this.ConvertMetadataJsonTo(data, ",");
            console.log(csvData)
            let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
            //saveAs(blob,filename + format);
            let dwldLink = document.createElement("a");
            let url = URL.createObjectURL(blob);
            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
            }
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", filename + format);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
        }
        else if(format==".tsv"){
            let tsvData = this.ConvertMetadataJsonTo(data, "\t");
            console.log(tsvData)
            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
            //saveAs(blob_tsv,filename + format);
            
            let dwldLink = document.createElement("a");
            let url = URL.createObjectURL(tsvData);
            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
            }
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", filename + format);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
        }
        else{
            let blob_json = new Blob([JSON.stringify(data)], {type : 'application/json'});
            //saveAs(blob_json,filename+ '.json');
            
            let dwldLink = document.createElement("a");
            let url = URL.createObjectURL(blob_json);
            let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

            if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
            }
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", filename + format);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
        }
    }

}
