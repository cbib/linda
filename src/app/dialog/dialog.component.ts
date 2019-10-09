import {Component, Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';





//export interface DialogData {
//  animal: string;
//  name: string;
//}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css'],
})
export class DialogComponent {

  ontology_type: string;


  constructor(public dialog: MatDialog) {}

  onSelect(values:string) {
    const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', data: {ontology_type: values}});
    dialogRef.afterClosed().subscribe(result => {console.log('The dialog was closed');this.ontology_type = result;});
  }
//  openDialog(): void {
//    const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', data: {ontology_type: "XEO"}});
//    
//   // dialogRef.componentInstance.ontology_type="XEO"
//    dialogRef.afterClosed().subscribe(result => {console.log('The dialog was closed');this.ontology_type = result;});
//    
//  }

}

//@Component({
//  selector: 'dialog-overview-example-dialog',
//  templateUrl: 'dialog-overview-example-dialog.html',
//})
//export class DialogOverviewExampleDialog {
//  
//  constructor(
//    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
//  
//  onNoClick(): void {
//    console.log("closed")
//    this.dialogRef.close();
//  }
//
//}

