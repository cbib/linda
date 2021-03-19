import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileService, GlobalService, AlertService } from '../services';

interface DialogData {
  expandable:boolean;
  is_investigation:boolean;
}

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit {
//    @ViewChild('file') file
//    public files: Set<File> = new Set()
    public file_format = []
    is_investigation:boolean;
    public selected_format = {'.csv': {'selected':false, separator:',',type: 'text/csv;charset=utf-8;'}, '.tsv':{'selected':false, separator:'\t',type: 'text/tsv;charset=utf-8;'}, '.json':{'selected':false, separator:':', type: 'application/json'}}
    private recursive_check:boolean =false
    private is_checked:boolean=false
    is_expandable_node:boolean=false;
    constructor(private fileService: FileService,
                private globalService: GlobalService,
                private alertService: AlertService,
                public dialogRef: MatDialogRef<ExportDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {

         this.is_expandable_node=this.data.expandable
         this.is_investigation=this.data.is_investigation
         //console.log(this.data.is_investigation)
         this.file_format = ['.csv', '.tsv', '.json']
        
         
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
        this.dialogRef.close({event:"Cancelled"});
        this.alertService.clear();
    }
    
    onOkClick(): void {

        if (this.is_checked){
            this.dialogRef.close({event:"Confirmed",selected_format:this.selected_format, recursive_check:this.recursive_check});
            this.alertService.clear();
        }
        else{
            this.alertService.error("you need to select a format");
        }  
    }
    
    
    
    
     


}
