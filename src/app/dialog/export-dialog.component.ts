import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UploadService } from '../services';


interface DialogData {
  model_data: {};
  model_type:string
  expandable:boolean
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
    private is_expandable_node:boolean=false;
    constructor(private uploadService: UploadService,
                public dialogRef: MatDialogRef<ExportDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        
         console.log(this.data.model_data)
         console.log(this.data.model_type)
         console.log(this.data.expandable)
         this.is_expandable_node=this.data.expandable
    }

    ngOnInit() {
        
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        //add check box and check if you need to download one or several models
        
        if (this.data.model_type == "metadata_file"){
            
            this.uploadService.saveCSVMetadataFile(this.data,this.data.model_type);
            this.uploadService.saveJSONMetadataFile(this.data,this.data.model_type);
        }
        else{
            this.uploadService.saveCSVFile(this.data,this.data.model_type);
            this.uploadService.saveJSONFile(this.data,this.data.model_type);
        }
        this.dialogRef.close(this.data);
        //this.uploadService.upload2(this.data).pipe(first()).toPromise().then(data => {console.log(data);})

    }
    
    
    
    
     


}
