import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
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
        console.log(values)
        const dialogRef = this.dialog.open(OntologyTreeComponent, { disableClose: true, width: '1000px', autoFocus: false, maxHeight: '90vh', data: { ontology_id: values, selected_term: null, selected_key:"", selected_set: [], multiple: false, uncheckable: true, observed: true, mode_simplified:true } });
        //const dialogRef = this.dialog.open(OntologyTreeComponent, { width: '1000px', autoFocus: false, maxHeight: '90vh', data: { ontology_id: values, selected_term: null, selected_set:[], uncheckable: true, multiple:false}});
        dialogRef.afterClosed().subscribe(result => {
            if (result!==undefined){
                console.log(result)
            }
            });            
    }
  
}
