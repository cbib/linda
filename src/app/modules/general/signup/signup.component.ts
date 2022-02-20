import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, GlobalService } from '../../../services';
import { Md5 } from 'ts-md5/dist/md5'
import { UniqueIDValidatorComponent } from  '../../application/validators/unique-id-validator.component'

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup = this.formBuilder.group({
        'Person name': ['', Validators.required],
        'username': [''],
        'Person affiliation': ['', Validators.required],
        'Person role': [''],
        'Person ID': ['', [Validators.required, Validators.minLength(12)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "person", "Person ID")],
        'Person email': ['', [Validators.required, Validators.email]],
        'password': ['', [Validators.required, Validators.minLength(6)]],
        'confirmpassword': ['', Validators.required],

        /* 'usernames': this.formBuilder.array([
          this.formBuilder.control('')
        ]) */
      },{validator: MustMatch('password', 'confirmpassword')}
      );
    registerForm2: FormGroup=new FormGroup({})
    loading = false;
    submitted = false;
    private cleaned_model: {}[] = [];
    private validated_term = {}
    private model: {} ={}
    private keys: any = [];
    

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private globalService: GlobalService) { }



    ngOnInit() {

        /* this.registerForm = this.formBuilder.group({
            'Person name': ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmpassword: ['', Validators.required],
            confirmpassword: ['', Validators.required],
            confirmpassword: ['', Validators.required],
            
        },{validator: MustMatch('password', 'confirmpassword')}
        ); */
        console.log(this.registerForm)
        //this.set_model()
        
    }
    set_model() {
        
        //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
        this.globalService.get_model("person").toPromise().then(data => {
            this.model = data;
            this.keys = Object.keys(this.model);
            this.cleaned_model = []
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i].startsWith("_") || this.keys[i].startsWith("Definition")) {
                    this.keys.splice(i, 1);
                    i--;
                }
                else {
                    var dict = {}
                    dict["key"] = this.keys[i]
                    dict["pos"] = this.model[this.keys[i]]["Position"]
                    dict["level"] = this.model[this.keys[i]]["Level"]
                    dict["format"] = this.model[this.keys[i]]["Format"]
                    dict["Associated_ontologies"] = this.model[this.keys[i]]["Associated_ontologies"]
                    this.cleaned_model.push(dict)
                }
            }
            this.cleaned_model.push({"key":"password","pos":"7","level":"1","format":"md5password","Associated_ontologies":undefined})
            this.cleaned_model.push({"key":"confirmpassword","pos":"8","level":"1","format":"md5password","Associated_ontologies":undefined})
            this.cleaned_model.push({"key":"username","pos":"2","level":"1","format":"Short text","Associated_ontologies":undefined})
            this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a['pos'] - b['pos']; });
            console.log(this.cleaned_model)   
            //this.registerForm2 = new FormGroup({});
            this.registerForm2 = this.initiateForm()  
            console.log(this.registerForm2)       
        });
    };
    initiateForm(): FormGroup {
        let attributeFilters = {};
        this.cleaned_model.forEach(attr => {
            this.validated_term[attr["key"]] = { selected: false, values: "" }
            if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
                if (attr["key"].includes("ID")) {
                    //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
                    //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService,this.model_type, attr)];
                    attributeFilters[attr["key"]] = ['', [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "person", attr["key"])];
                }
                else if (attr["key"].includes("Short title")) {
                    attributeFilters[attr["key"]] = ['', [Validators.required, Validators.minLength(4)]];
                }
                else if (attr["key"].includes("email")){
                    attributeFilters[attr["key"]] = ['', [Validators.required, Validators.email]];
                }
                else if (attr["key"].includes("password")){
                    attributeFilters[attr["key"]] =  ['', [Validators.required, Validators.minLength(6)]]
                }
                else if (attr["key"].includes("username")){
                    attributeFilters[attr["key"]] =  ['', [Validators.required]]
                }
                else {
                    attributeFilters[attr["key"]] = [''];
                }
            }
        });
        console.log(attributeFilters)

        return this.formBuilder.group(attributeFilters,{validator: MustMatch('password', 'confirmpassword')});
    }
    
    // convenience getter for easy access to form fields
    get f() { 
        return this.registerForm.controls; 
    }
    
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        console.log(Md5.hashStr(this.registerForm.value.password))
        this.registerForm.get('password').setValue(Md5.hashStr(this.registerForm.value.password))
        this.registerForm.get('confirmpassword').setValue(Md5.hashStr(this.registerForm.value.confirmpassword))
        //this.loading = true;
        console.log(this.registerForm.value)
        this.userService.register_person(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            );
    }
    get getregisterForm(){
        return this.registerForm
    }
    get usernames() {
        return this.registerForm.get('usernames') as FormArray;
    }
    addUsername() {
        this.usernames.push(this.formBuilder.control(''));
    }

}
