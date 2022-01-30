import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../services';
import {Md5} from 'ts-md5/dist/md5';



@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    encrypted_password:string=""

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        console.log("Hello from login page")
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        /* this.authenticationService.logout();
        console.log(localStorage);
        localStorage.removeItem('currentUser');
        console.log(localStorage); */

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl);

    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        console.log(Md5.hashStr(this.f.password.value))
        this.loginForm.get('password').setValue(Md5.hashStr(this.f.password.value))
        //const md5 = new Md5();
        //var encrypted_password=md5.appendStr(this.f.password.value).end();
        //this.loading = true;

        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
            //.toPromise().then(
                data => {
                    console.log(data)
                    console.log(this.returnUrl)
                    this.router.navigate([this.returnUrl]);
                    /* if (data.length===0){
                        console.log("incorrect password or username");
                        this.alertService.error("incorrect password or username");
                    } */
                  
                },
                error => {
                    console.log(this.f.username.value)
                    console.log(this.f.password.value)
                    console.log("incorrect password or username");
                    this.alertService.error(error);
                    this.loading = false;
                }
                );
    }
}