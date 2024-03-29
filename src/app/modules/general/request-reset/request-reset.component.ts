import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {

  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
   ) {

  }

  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser(form) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      console.log(this.RequestResetForm.value)
      this.authService.requestReset(this.RequestResetForm.value).toPromise().then(
        data => {
          if (data['success']){
            console.log(data)
            console.log("need to write routine service")
          }
          /* this.RequestResetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['login']);
          }, 3000); */
        }
        /* ,
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        } */
      );
    } else {
      this.IsvalidForm = false;
    }
  }

}
