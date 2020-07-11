import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import {Constants} from "../constants";
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
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
    
    public saveFile(data, filename='data', format='.csv') {
        console.log(format)
        if (format==".csv"){
            let csvData = this.ConvertJsonModelTo(data, ",");
            let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
            //saveAs(blob, filename + format)
            
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
        else if (format==".tsv"){
            let tsvData = this.ConvertJsonModelTo(data, "\t");
            let blob_tsv = new Blob(['\ufeff' + tsvData], { type: 'text/tsv;charset=utf-8;' });
            //saveAs(blob_tsv,filename + format);
            
            let dwldLink = document.createElement("a");
            let url = URL.createObjectURL(blob_tsv);
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
            //saveAs(blob_json,filename + format);
            
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
