import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService, AlertService } from '../../../services';

interface DialogData {
  expandable:boolean;
  is_investigation:boolean;
}

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
//    @ViewChild('file') file
//    public files: Set<File> = new Set()
    public file_format = []
    is_investigation:boolean;
    public selected_format = {'.csv': {'selected':false, separator:',', type: 'text/csv;charset=utf-8;'}, '.tsv':{'selected':false, separator:'\t',type: 'text/tsv;charset=utf-8;'}, '.json':{'selected':false, separator:':', type: 'application/json'}}
    private recursive_check:boolean =false
    private formatSelected:boolean=false
    is_expandable_node:boolean=false;
    
    constructor(private globalService: GlobalService,
                private alertService: AlertService,
                public dialogRef: MatDialogRef<ExportComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {

         this.is_expandable_node=this.data.expandable
         this.is_investigation=this.data.is_investigation
         //console.log(this.data.is_investigation)
         this.file_format = ['.csv', '.tsv', '.json']
        
         
    }

    ngOnInit() {
        this.selected_format['.csv']['selected']=true 
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
                this.formatSelected=true
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
    get Checked(){
        return this.recursive_check
    }
    onFormatChange(_format:string){
        this.selected_format[_format]['selected']=true 
        Object.keys(this.selected_format).forEach(format => {
            if (format!==_format){
                this.selected_format[format]['selected']=false
            }
        });
    }    
    onNoClick(): void {
        this.dialogRef.close({event:"Cancelled"});
        this.alertService.clear();
    }
    
    onOkClick(): void {
        this.dialogRef.close({event:"Confirmed",selected_format:this.selected_format, recursive_check:this.recursive_check});
        this.alertService.clear();
    }
    
    
    
    
     


}
