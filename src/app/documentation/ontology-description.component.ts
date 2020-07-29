import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';

@Component({
  selector: 'app-ontology-description',
  templateUrl: './ontology-description.component.html',
  styleUrls: ['./ontology-description.component.css']
})
export class OntologyDescriptionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  onSelect(values:string) {
        const dialogRef = this.dialog.open(OntologyTreeComponent, {width: '1000px', autoFocus: false, maxHeight: '90vh', data: {ontology_type: values,selected_term: null,selected_set:[], uncheckable: true}});
        dialogRef.afterClosed().subscribe(result => {
            if (result!==undefined){
                console.log(result)
            }
            });            
    }
  
}
