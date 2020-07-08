import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UploadService } from '../services';


interface DialogData {
  model_data: {};
  model_type:string
}

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit {
//    @ViewChild('file') file
//    public files: Set<File> = new Set()
    
    constructor(private uploadService: UploadService,
                public dialogRef: MatDialogRef<ExportDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        
         console.log(this.data.model_data)
         console.log(this.data.model_type)
    }

    ngOnInit() {
        
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        //add check box and check if you need to download one or several models

        if (this.data.model_type == "metadata_file"){
            this.uploadService.downloadMetadataFile(this.data,'jsontocsv');
        }
        else{
            this.uploadService.downloadFile(this.data,'jsontocsv');
        }
        this.dialogRef.close(this.data);
        //this.uploadService.upload2(this.data).pipe(first()).toPromise().then(data => {console.log(data);})

    }
    
    
     


}
