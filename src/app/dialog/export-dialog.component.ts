import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UploadService, GlobalService } from '../services';


interface DialogData {
  model_data: {};
  model_type:string
  expandable:boolean
}

interface DialogData2 {
  model_id: "";
  model_type:string
  expandable:boolean
  parent_id:string
}

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit {
//    @ViewChild('file') file
//    public files: Set<File> = new Set()
    public file_format = ['.csv', '.tsv', '.json']
    public selected_format = {'.csv':true, '.tsv':false, '.json':false}
    private recursive_check:boolean =false
    private is_expandable_node:boolean=false;
    constructor(private uploadService: UploadService,
                private globalService: GlobalService,
                public dialogRef: MatDialogRef<ExportDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData2) {
        
         //console.log(this.data.model_data)
         console.log(this.data.model_id)
         console.log(this.data.model_type)
         console.log(this.data.expandable)
         console.log(this.data.parent_id)
         this.is_expandable_node=this.data.expandable
         
    }

    ngOnInit() {
        
    }
    
    set_check_recursive(completed: boolean) {
        this.recursive_check=completed
    }
    
    set_check_format(completed: boolean, format:string) {
        this.selected_format[format]=completed
        console.log(this.selected_format)
        var keys=Object.keys(this.selected_format);
        for( var i = 0; i < keys.length; i++){
            console.log(this.selected_format[keys[i]])
        }
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        console.log(this.selected_format)
        var model_key=this.data.model_id.split("/")[1];
        var collection_name=this.data.model_id.split("/")[0];
        var parent_collection_name=this.data.parent_id.split("/")[0];
        var vertice_list=[]
        //Parse in a recursive way all submodels
        if ((this.is_expandable_node) && (this.recursive_check)){
            var models:any=[]
            console.log("node is expandable and recursive is checked")
            var model_data=this.globalService.get_all_vertices_by_model(collection_name, model_key).toPromise().then(model_data => {
                console.log(model_data)
                models=model_data;
                var to_reject=[]
                models.forEach(
                    result=>{
                        //var _from:string=result["e"]["_from"]
                        //var _to:string=result["e"]["_to"]
                        var _id:string=result["v"]["_id"]
                        
                        var formats=Object.keys(this.selected_format);
                        for( var i = 0; i < formats.length; i++){
                            if (this.selected_format[formats[i]]){
                                if (this.globalService.get_model_type(_id) == "unknown"){
                                    this.uploadService.saveMetadataFile(result["v"],_id,formats[i]);
                                }
                                else{
                                    this.uploadService.saveFile(result["v"],_id,formats[i]);
                                }                            
                            }
                        }
                    }
                );                          
            });
        }
        else{
            var model_data=this.globalService.get_by_key(model_key,this.data.model_type).toPromise().then(model_data => {    
            console.log(model_data)
            if (this.data.model_type == "metadata_file"){
                var formats=Object.keys(this.selected_format);
                for( var i = 0; i < formats.length; i++){
                    console.log(this.selected_format[formats[i]])
                    if (this.selected_format[formats[i]]){
                        this.uploadService.saveMetadataFile(model_data,this.data.model_type,formats[i]);
                    }
                }
            }
            else{
                var formats=Object.keys(this.selected_format);
                for( var i = 0; i < formats.length; i++){
                    console.log(this.selected_format[formats[i]])
                    if (this.selected_format[formats[i]]){
                        this.uploadService.saveFile(model_data,this.data.model_type,formats[i]);
                    } 
                }
            }
        });
        }
        this.dialogRef.close(this.data);
        
        

        //add check box and check if you need to download one or several models
        
//        if (this.data.model_type == "metadata_file"){
//            
//            this.uploadService.saveCSVMetadataFile(this.data,this.data.model_type);
//            this.uploadService.saveJSONMetadataFile(this.data,this.data.model_type);
//        }
//        else{
//            this.uploadService.saveCSVFile(this.data,this.data.model_type);
//            this.uploadService.saveJSONFile(this.data,this.data.model_type);
//        }
//        this.dialogRef.close(this.data);
        //this.uploadService.upload2(this.data).pipe(first()).toPromise().then(data => {console.log(data);})

    }
    
    
    
    
     


}
