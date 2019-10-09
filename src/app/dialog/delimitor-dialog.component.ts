import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


interface DialogData {
  delimitor: string;
}

@Component({
  selector: 'app-delimitor-dialog',
  templateUrl: './delimitor-dialog.component.html',
  styleUrls: ['./delimitor-dialog.component.css']
})
export class DelimitorDialogComponent implements OnInit {
  private delimitor: string;
  private delimitors=[';',',','space','tab']
  constructor(public dialogRef: MatDialogRef<DelimitorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        
        this.delimitor=this.data.delimitor
        }

  ngOnInit() {
  }
  get_delimitors(){
      return this.delimitors
  }
  onSelect(values:string){
        
        this.data.delimitor=values
        
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        console.log()
        this.dialogRef.close(this.data);
    }

}
