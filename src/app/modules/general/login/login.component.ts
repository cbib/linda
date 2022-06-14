import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../../../services';
import { Md5} from 'ts-md5/dist/md5';
import * as uuid from 'uuid';


@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    encrypted_password:string=""
    error = '';
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private userService:UserService,
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
    
    create_guest_profile(){
        
        let date_created=new Date()
        let guest_tmp_uuid=uuid.v4()
        let person_id=Md5.hashStr(guest_tmp_uuid)
        let username="Guest_"+guest_tmp_uuid
        let email="guests@guest_"+guest_tmp_uuid+".com"
        let pwd=Md5.hashStr('guest-anonymous')
        let guest_user:any={
        'dateCreated':date_created.toUTCString(),
        'Person name': "Guest",
        'username': username,
        'Person affiliation': "Guest-user",
        'Person role': ["beta-tester"],
        'Person ID': person_id,
        'Person email': email ,
        'password':pwd,
        'confirmpassword':pwd,
        }
        this.userService.register_person(guest_user, "groups/Guests")
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                //this.router.navigate(['/login']);
                this.authenticationService.login(username,pwd).pipe(first())
                .subscribe(( data2 )=> {
                    this.router.navigate([this.returnUrl]);
                },
                    error2 => {
                    this.error = error2
                    this.alertService.error(error2);
                    this.authenticationService.logout()
                    this.loading = false;
                    }
                );
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
        
    }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        console.log(Md5.hashStr(this.f.password.value))
        //this.loginForm.get('password').setValue(Md5.hashStr(this.f.password.value))
        //const md5 = new Md5();
        //var encrypted_password=md5.appendStr(this.f.password.value).end();
        this.loading = true;

        this.authenticationService.login(this.f.username.value, Md5.hashStr(this.f.password.value)).pipe(first())
            .subscribe(( data )=> {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error
                    this.alertService.error(error);
                    this.authenticationService.logout()
                    this.loading = false;
                }
            );
    }
}