import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {GlobalService, AuthenticationService, AlertService } from '../../../services';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInterface } from 'src/app/models/linda/person';
import { first } from 'rxjs/operators';
import { Md5} from 'ts-md5/dist/md5';


interface DialogData {
  group_key: string;
  current_user:UserInterface

}

@Component({
  selector: 'app-group-login',
  templateUrl: './group-login.component.html',
  styleUrls: ['./group-login.component.css']
})
export class GroupLoginComponent implements OnInit {
  GroupLoginForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;
  logged:boolean= false
  groupKey:string=""
  currentUser:UserInterface
  constructor(private globalService: GlobalService, private alertService:AlertService, private authenticationService: AuthenticationService, public dialogRef: MatDialogRef<GroupLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.groupKey=this.data.group_key
      this.currentUser=this.data.current_user
      
     }

     ngOnInit() {
      this.GroupLoginForm = new FormGroup({
        'password': new FormControl(null, [Validators.required]),
      });
    }
    GroupLogin(form) {
      console.log(form)
      if (form.valid) {
        this.IsvalidForm = true;
        var roles={
          "admin":true,
          "owner":false,
          "user":true
        }
        

        this.authenticationService.group_login(this.currentUser.username,this.currentUser.password,roles,this.groupKey,Md5.hashStr(form.value.password)).pipe(first())
        .subscribe(( data )=> {
                console.log(data)
                this.logged=true
                this.alertService.success("login successfull !! Welcome in " + this.groupKey + " group")
                this.dialogRef.close({event:"Confirmed", logged:true});
            },
            error => {
                console.log("error")
                this.alertService.error("bad credentials. Access refused")
                this.dialogRef.close({event:"Confirmed", logged:true});
                //this.alertService.error(error);
                //this.authenticationService.logout()
                //this.loading = false;
            }
        );

        /* this.authService.requestReset(this.GroupLoginForm.value).subscribe(
          data => {
            this.GroupLoginForm.reset();
            this.successMessage = "Reset password link send to email sucessfully.";
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['login']);
            }, 3000);
          },
          err => {
  
            if (err.error.message) {
              this.errorMessage = err.error.message;
            }
          }
        ); */
      } else {
        this.IsvalidForm = false;
      }
    }
    onNoClick(): void {
      this.dialogRef.close({event:"Cancelled"});
    }
  
    onOkClick(): void {
    this.dialogRef.close({event:"Confirmed", logged:true});
  
    }

}
