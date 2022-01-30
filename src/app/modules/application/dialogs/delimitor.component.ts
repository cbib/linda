import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
interface DialogData {
  delimitor: string;
}

@Component({
  selector: 'app-delimitor',
  templateUrl: './delimitor.component.html',
  styleUrls: ['./delimitor.component.css']
})
export class DelimitorComponent implements OnInit {
  private delimitor: string;
  private delimitors=[';',',','space','tab']
  constructor(public dialogRef: MatDialogRef<DelimitorComponent>,
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
