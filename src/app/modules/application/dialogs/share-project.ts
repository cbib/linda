import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';
import {UserService, AlertService } from '../../../services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserInterface } from '../../../models/linda/person'
import { PersonInterface } from '../../../models/linda/person'
interface DialogData {
  model_id: string;
}

@Component({
  selector: 'app-share-project',
  templateUrl: './share-project.html',
  styleUrls: ['./share-project.css']
})
export class ShareProject implements OnInit {
  model_id:string;
  person_id:string;
  user:UserInterface;
  person:PersonInterface
  persons:PersonInterface[];
  isDisabled:boolean=true
  currentUser:UserInterface

  constructor(
      private globalService: GlobalService, 
      private userService:UserService, 
      private router: Router, 
      private alertService:AlertService, 
      public dialogRef: MatDialogRef<ShareProject>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.model_id=this.data.model_id

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // get current person ID
    this.userService.getAll().toPromise().then(
        data => {
            console.log(data)
            this.persons=data.filter(_person=>_person['Person ID']!==this.currentUser['Person ID'])
            //this.alertService.success('Peoject has been shared successfully', true);
        }
    );
  }

  onUserChange(value){
      this.person=this.persons.filter(_person=>_person['Person ID']===value)[0]
      console.log(this.person)
      this.isDisabled=false

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close({event:"Confirmed", person:this.person});
  }
}