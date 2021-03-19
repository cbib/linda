import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface DialogData {
  search_type :string;
  model_id:string;
  parent_id:string;
  values:[];
}

@Component({
  selector: 'app-search-result-dialog',
  templateUrl: './search-result-dialog.component.html',
  styleUrls: ['./search-result-dialog.component.css']
})
export class SearchResultDialogComponent implements OnInit {


    private model_id: string;
    private parent_id: string;
    private result:[];
    search_type:string;
    private isSelected:boolean

    constructor(public dialogRef: MatDialogRef<SearchResultDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    { 
        this.search_type= this.data.search_type
        this.result= this.data.values
        this.model_id= this.data.model_id
        this.parent_id= this.data.parent_id
        this.isSelected=false
        //console.log(this.data.values)
    }

    ngOnInit() {
      
    }

    onSelect(model_id:string){

      this.data.model_id=model_id
        this.result.forEach(res=>{
          
          if (res['id']===model_id){
            this.data.parent_id=res['parent_id']
            //console.log(res['data'][res['found_as']])
            this.data.values=res
            this.isSelected=true

          }
        }

      )
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    onOkClick(): void {
        this.dialogRef.close(this.data);
    }

    get_result(){
        return this.result;
    }
  }