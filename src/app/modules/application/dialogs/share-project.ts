import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService } from '../../../services';
import {UserService, AlertService } from '../../../services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PersonInterface } from '../../../models/linda/person'

interface DialogData {
  investigation_id: string;
}

@Component({
  selector: 'app-share-project',
  templateUrl: './share-project.html',
  styleUrls: ['./share-project.css']
})
export class ShareProject implements OnInit {
  investigation_id:string;
  person_id:string;
  person:PersonInterface;
  persons:PersonInterface[];
  isDisabled:boolean=true
  currentUser:PersonInterface

  constructor(
      private globalService: GlobalService, 
      private userService:UserService, 
      private router: Router, 
      private alertService:AlertService, 
      public dialogRef: MatDialogRef<ShareProject>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.investigation_id=this.data.investigation_id

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userService.getAll().toPromise().then(
        data => {
            this.persons=data.filter(person=>person._id!==this.currentUser._id)
            //this.alertService.success('Peoject has been shared successfully', true);
        }
    );
  }

  onUserChange(value){
      this.person_id=value
      this.isDisabled=false

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close({event:"Confirmed", person_id:this.person_id});
  }
}