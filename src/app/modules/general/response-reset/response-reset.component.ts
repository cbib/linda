import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5'

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',

})
export class ResponseResetComponent implements OnInit {
  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: string;
  CurrentState: any;
  IsResetFormValid = true;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder ) {

    this.CurrentState = 'Wait';
    this.route.queryParams.subscribe(
      params => {
        console.log(params)
        this.resetToken = params.token;
        console.log(this.resetToken);
        this.VerifyToken();
      }
      
    );
  }


  ngOnInit() {
    this.Init();
  }

  VerifyToken() {
    this.authService.ValidPasswordToken({ 'resettoken': this.resetToken }).toPromise().then(
      data => {
        console.log(data)
        if (data['success']){
            this.CurrentState = 'Verified';
        }
        else{
          this.CurrentState = 'NotVerified';
        }
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  Init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


  ResetPassword(form) {
    console.log(form.get('confirmPassword'));
    if (form.valid) {
      this.IsResetFormValid = true;
      console.log(this.ResponseResetForm.value)
      this.ResponseResetForm.get('newPassword').setValue(Md5.hashStr(this.ResponseResetForm.value.newPassword))
      this.ResponseResetForm.get('confirmPassword').setValue(Md5.hashStr(this.ResponseResetForm.value.confirmPassword))
      this.authService.resetPassword(this.ResponseResetForm.value).subscribe(
        data => {
          this.ResponseResetForm.reset();
          this.successMessage = data.message;
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
      );
    } 
    else { this.IsResetFormValid = false; }
  }
}