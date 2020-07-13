import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileService, GlobalService, AlertService } from '../services';


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
    public selected_format = {'.csv': {'selected':false, separator:',',type: 'text/csv;charset=utf-8;'}, '.tsv':{'selected':false, separator:'\t',type: 'text/tsv;charset=utf-8;'}, '.json':{'selected':false, separator:':', type: 'application/json'}}
    private recursive_check:boolean =false
    private is_checked:boolean=false
    private is_expandable_node:boolean=false;
    constructor(private fileService: FileService,
                private globalService: GlobalService,
                private alertService: AlertService,
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
        this.selected_format[format]['selected']=completed
        console.log(this.selected_format)
        var keys=Object.keys(this.selected_format);
        for( var i = 0; i < keys.length; i++){
            console.log(this.selected_format[keys[i]]['selected'])
            if (this.selected_format[keys[i]]['selected']){
                this.is_checked=true
            }
        }
    }
//    is_checked(){
//        var keys=Object.keys(this.selected_format);
//        for( var i = 0; i < keys.length; i++){
//            if (this.selected_format[keys[i]]){
//                this.is_checked=true
//            }
//        }
//    }
    
    onNoClick(): void {
        this.dialogRef.close();
        this.alertService.clear();
    }
    
    onOkClick(): void {
        
        
        if (this.is_checked){
        
            console.log(this.selected_format)
            var model_key=this.data.model_id.split("/")[1];
            var collection_name=this.data.model_id.split("/")[0];
            var parent_collection_name=this.data.parent_id.split("/")[0];
            var vertice_list=[]
            var model_data=this.globalService.get_by_key(model_key,this.data.model_type).toPromise().then(model_data => {    

                //Parse in a recursive way all submodels
                if ((this.is_expandable_node) && (this.recursive_check)){
                    var models:any=[]
                    console.log("node is expandable and recursive is checked")
                    var submodel_data=this.globalService.get_all_vertices_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                        console.log(submodel_data)
                        models=submodel_data;
                        var to_reject=[]
        //                models.forEach(
        //                    result=>{
        //                        //var _from:string=result["e"]["_from"]
        //                        //var _to:string=result["e"]["_to"]
        //                        var _id:string=result["v"]["_id"]
        //                        
        //                        var formats=Object.keys(this.selected_format);
        //                        for( var i = 0; i < formats.length; i++){
        //                            if (this.selected_format[formats[i]]){
        //                                if (this.globalService.get_model_type(_id) == "unknown"){
        //                                    this.fileService.saveMetadataFile(result["v"],'metadata_file', _id,formats[i]);
        //                                }
        //                                else{
        //                                    this.fileService.saveFile(result["v"],this.globalService.get_model_type(_id), _id,formats[i]);
        //                                }                            
        //                            }
        //                        }
        //                    }
        //                );
                        var formats=Object.keys(this.selected_format);
                        this.fileService.saveMultipleFiles(model_data, models,collection_name, model_key, this.selected_format);

                    });
                }
                else{
                    console.log(model_data)
                    if (this.data.model_type == "metadata_file"){
                        var formats=Object.keys(this.selected_format);
                        for( var i = 0; i < formats.length; i++){
                            console.log(this.selected_format[formats[i]])
                            if (this.selected_format[formats[i]]){
                                this.fileService.saveMetadataFile(model_data,this.data.model_type,formats[i]);
                            }
                        }
                    }
                    else{
                        var formats=Object.keys(this.selected_format);
                        for( var i = 0; i < formats.length; i++){
                            console.log(this.selected_format[formats[i]])
                            if (this.selected_format[formats[i]]){
                                this.fileService.saveFile(model_data,this.data.model_type,this.data.model_id,formats[i]);
                            } 
                        }
                    }
                }
            }); 
            this.dialogRef.close(this.data);
            this.alertService.clear();
        }
        else{
            this.alertService.error("you need to select a format");
        }  
        
        console.log(this.is_checked)
        
        

        //add check box and check if you need to download one or several models
        
//        if (this.data.model_type == "metadata_file"){
//            
//            this.fileService.saveCSVMetadataFile(this.data,this.data.model_type);
//            this.fileService.saveJSONMetadataFile(this.data,this.data.model_type);
//        }
//        else{
//            this.fileService.saveCSVFile(this.data,this.data.model_type);
//            this.fileService.saveJSONFile(this.data,this.data.model_type);
//        }
//        this.dialogRef.close(this.data);
        //this.fileService.upload2(this.data).pipe(first()).toPromise().then(data => {console.log(data);})

    }
    
    
    
    
     


}
