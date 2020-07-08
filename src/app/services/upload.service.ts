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
 
    
    
    ConvertMetadataJsonToCSV(objArray) {
        let data = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        
        var headers= data["headers"];
        var associated_headers= data["associated_headers"];
        var lines= data["data"]
        console.log(headers)
        console.log(associated_headers)


        let row = '';
        let str = '';
        for (let index in headers) {
            row += headers[index] + ',';
            console.log(headers[index])
            console.log(associated_headers[headers[index]]['associated_term_id'])
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        row = '';
        for (let index in headers) {
            row += associated_headers[headers[index]]['associated_term_id'] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        
        row = '';   
        for (let index_data in lines) {
            console.log(lines[index_data])
            row = ''; 
            for (let i = 0; i < lines[index_data].length; i++) {
                row += lines[index_data][i] + ',';
   
            }
            row = row.slice(0, -1);
            str += row + '\r\n';
//            for (let index_headers in headers) {
//                console.log(data[index_data][index_headers])
//                
//            }
        }
        console.log(str) 
//        let row = 'S.No,';
//        for (let index in headerList) {
//            row += headerList[index] + ',';
//        }
//        row = row.slice(0, -1);
//        str += row + '\r\n';
//        for (let i = 0; i < array.length; i++) {
//            let line = (i+1)+'';
//            for (let index in headerList) {
//                let head = headerList[index];
//                line += ',' + array[i][head];
//            }
//            str += line + '\r\n';
//        }
        return str;
    }   
    
    ConvertJsonModelToCSV(objArray) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        console.log(array)
        let str = '';
        var keys=Object.keys(array['model_data']);
        for( var i = 0; i < keys.length; i++){     
            if ( keys[i].startsWith("_") || keys[i].startsWith("Definition")){// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                keys.splice(i, 1); 
                i--;
            }
            else{
                str +=keys[i]+ ',' + array['model_data'][keys[i]] + '\r\n';
            }

        }
        console.log(str)
        
//        let row = 'S.No,';
//        for (let index in headerList) {
//            row += headerList[index] + ',';
//        }
//        row = row.slice(0, -1);
//        str += row + '\r\n';
//        for (let i = 0; i < array.length; i++) {
//            let line = (i+1)+'';
//            for (let index in headerList) {
//                let head = headerList[index];
//                line += ',' + array[i][head];
//            }
//            str += line + '\r\n';
//        }
        return str;
    }
    
    
    
    downloadFile(data, filename='data') {
        console.log(data)
        let csvData = this.ConvertJsonModelToCSV(data);
        console.log(csvData)
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }
    
    downloadMetadataFile(data, filename='data') {
        console.log(data)
        
        let csvData = this.ConvertMetadataJsonToCSV(data.model_data);
console.log(csvData)
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
        
        
        
        //let csvData = this.ConvertToCSV(data);
//        console.log(csvData)
//        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
//        let dwldLink = document.createElement("a");
//        let url = URL.createObjectURL(blob);
//        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
//        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
//            dwldLink.setAttribute("target", "_blank");
//        }
//        dwldLink.setAttribute("href", url);
//        dwldLink.setAttribute("download", filename + ".csv");
//        dwldLink.style.visibility = "hidden";
//        document.body.appendChild(dwldLink);
//        dwldLink.click();
//        document.body.removeChild(dwldLink);
    }
}
