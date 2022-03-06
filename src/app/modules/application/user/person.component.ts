import { Component, OnInit,Input } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, UserService, GlobalService } from '../../../services';
import { Md5 } from 'ts-md5/dist/md5'
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { PersonInterface, UserInterface } from 'src/app/models/linda/person';
import { timeStamp } from 'console';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditFormComponent } from '../dialogs/edit-form.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  //@Input('currentPerson') currentPerson: PersonInterface;
  registerForm: FormGroup = this.formBuilder.group({
    'Person name': ['', Validators.required],
    'username': [''],
    'Person affiliation': ['', Validators.required],
    'Person role': [''],
    'Person ID': ['', [Validators.required, Validators.minLength(12)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "person", "Person ID")],
    'Person email': ['', [Validators.required, Validators.email], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "person", "Person email")],
  }
  );
  submitted = false;
  currentUser:UserInterface
  currentPerson:PersonInterface
  loaded:boolean=false
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute, 
    private globalService: GlobalService,
    public editdialog: MatDialog) {
      /* this.route.queryParams.subscribe(
        params => {
            this.currentPerson = params['currentPerson'];
            //console.log(this.currentPerson)
        }
      ); */


  }

  ngOnInit() {
    this.currentUser=JSON.parse(localStorage.getItem('currentUser'))
    /* await this.userService.get_person(this.currentUser['Person ID']).toPromise().then(
      person => {
        this.currentPerson=person[0]
        console.log(this.currentPerson)
      }
    ); */
    this.currentUser=JSON.parse(localStorage.getItem('currentUser'))
    this.userService.get_person(this.currentUser['Person ID']).toPromise().then(
      person => {
        this.currentPerson=person[0]
        console.log(this.currentPerson)
        this.personName.patchValue(this.currentPerson['Person name'])
        this.Username.patchValue(this.currentUser.username)
        this.personID.patchValue(this.currentPerson['Person ID'])
        this.personAffiliation.patchValue(this.currentPerson['Person affiliation'])
        this.personRole.patchValue(this.currentPerson['Person role'])
        this.personEmail.patchValue(this.currentPerson['Person email'])
        this.loaded=true
      }
    );

    

    /* this.registerForm.setValue({'Person name':this.currentPerson['Person name']})
    this.registerForm.setValue({'username':this.currentUser.username})
    this.registerForm.setValue({'Person ID':this.currentPerson['Person ID']})
    this.registerForm.setValue({'Person affiliation':this.currentPerson['Person affiliation']})
    this.registerForm.setValue({'Person role':this.currentPerson['Person role']})
    this.registerForm.setValue({'Person email':this.currentPerson['Person email']}) */
    console.log(this.currentPerson)
    
  }
  onModify(field:string){
    //open modify field dialog with only one field and one button 
    const dialogRef = this.editdialog.open(EditFormComponent, { width: '1000px', data: {person_id:this.currentPerson['Person ID'], field_to_edit:field} });
              dialogRef.afterClosed().subscribe(data => {
                  if (data !== undefined) {
                      console.log(data)
                  };
              });
  }

  get getregisterForm(){
    return this.registerForm
  }
  get get_currentPerson(){
    return this.currentPerson
  }
  get currentPerson_keys(){
    return Object.keys(this.currentPerson).filter(key=>!key.startsWith('_'))
  }
  get account_creation_date(){
/*     console.log(this.currentUser.dateCreated)
    const date2 = new Date('December 31, 1975, 23:15:30 GMT-11:00');
    console.log(date2.toTimeString())
    console.log(date2.getDate())
    console.log(date2.getMonth())
    console.log(date2.getUTCMonth())
    console.log(date2.toLocaleString('en', { month: 'long' })); */
    let account_creation_date=new Date(this.currentUser.dateCreated)
    console.log(account_creation_date.getFullYear());
    console.log(account_creation_date.getMonth())
    console.log(account_creation_date.toLocaleString('default', { month: 'long' }));
    // get day considering UTC
    console.log(account_creation_date.getUTCDate());
    //let date_label=account_creation_date.toLocaleString('en', { month: 'long' }) + " " + account_creation_date.getFullYear()
    
    return account_creation_date.toLocaleString('en', { month: 'long' }) + " " + account_creation_date.getFullYear()
  }
  get currentUser_keys(){
    return Object.keys(this.currentUser).filter(key=>key==="username")
  }
  get personName() { return this.registerForm.get('Person name') }
  get Username() { return this.registerForm.get('username') }
  get personAffiliation() { return this.registerForm.get('Person affiliation') }
  get personRole() { return this.registerForm.get('Person role') }
  get personID() { return this.registerForm.get('Person ID') }
  get personEmail() { return this.registerForm.get('Person email') }
  get password() { return this.registerForm.get('password') }
  get confirmPassword() { return this.registerForm.get('confirmpassword') }

}
