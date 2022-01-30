import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';


interface DialogData {
  material_type: string;
  data_filename:string;
}

@Component({
  selector: 'app-biological-material',
  templateUrl: './biological-material.component.html',
  styleUrls: ['./biological-material.component.css']
})
export class BiologicalMaterialComponent implements OnInit {
  material_type:string;
  data_filename:string;
  biological_material_n:number;
  numbers:number[];
  constructor(private globalService: GlobalService, public dialogRef: MatDialogRef<BiologicalMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.material_type=this.data.material_type
      this.data_filename=this.data.data_filename
      this.numbers=[];
      this.biological_material_n=1
  }

  onNumChange(value: number) {
    this.biological_material_n = value
  }

  ngOnInit() {
    for (var i=1;i<101;i++){
      this.numbers.push(i)
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    console.log(this.biological_material_n)
    this.dialogRef.close({event:"Confirmed", biological_material_n:this.biological_material_n  });
  }
}