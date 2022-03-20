import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UserInterface, PersonInterface } from 'src/app/models/linda/person';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService, UserService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { first } from 'rxjs/operators';
import { Md5} from 'ts-md5/dist/md5';

interface DialogData {
  field_to_edit: string;
  person: PersonInterface;
}

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
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  editForm: FormGroup ;
  private person: PersonInterface;
  private field_to_edit:string
  currentUser: UserInterface

  constructor(    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private userService:UserService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<EditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.person = this.data.person
      this.field_to_edit = this.data.field_to_edit
      console.log(this.person)
    }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    console.log(this.field_to_edit)
    if (this.field_to_edit==='Person email'){
      this.editForm = this.formBuilder.group({
        'Person email': ['', [Validators.required, Validators.email], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, "person", "Person email")],
      });
    }
    else if(this.field_to_edit==='Person name'){
      this.editForm = this.formBuilder.group({
        'Person name': ['',Validators.required],
      });
    }
    else if(this.field_to_edit==='username'){
      this.editForm = this.formBuilder.group({
        'username': ['',Validators.required],
      });
    }
    else if(this.field_to_edit==='Person affiliation'){
      this.editForm = this.formBuilder.group({
        'Person affiliation': ['',Validators.required],
      });
    }
    else if(this.field_to_edit==='password'){
      this.editForm = this.formBuilder.group({
        'password': ['', [Validators.required, Validators.minLength(6)]],
        'confirmpassword': ['', Validators.required],
      },{validator: MustMatch('password', 'confirmpassword')});
      
    }
    else{
      //field to describe
      this.editForm = this.formBuilder.group({
        'field': ['',Validators.required],
      });
    }
    
  }
  OnEdit(){
    if (this.field_to_edit==='username'){
      /* this.userService.update_personal_infos() */
    }
    else if (this.field_to_edit==='password'){

    }
    else if (this.field_to_edit==='Person affiliation'){

    }
    else if (this.field_to_edit==='Person name'){

    }
    else if (this.field_to_edit==='Person email'){

    }
    //email
    else{

    }
    // update field in user or person depending ffield 


  }
  get field() { return this.editForm.get(this.field_to_edit); }
  get confirmpassword (){return this.editForm.get("confirmpassword")}
  get get_editForm() {
    return this.editForm
  }
  get get_field_to_edit(){
    return this.field_to_edit
  } 
  onNoClick(): void {
    this.dialogRef.close({event:"Cancelled"});
  }
  onOkClick(): void {
    if (this.field_to_edit.includes("Person")){
      console.log(this.field.value)
      console.log(this.person['Person ID'])
      console.log(this.field_to_edit )
      let data=this.globalService.update_person(this.field.value, this.person['Person ID'], this.field_to_edit).toPromise()
      console.log(data); 
    }
    else{
      if (this.field_to_edit==='password'){
        console.log(Md5.hashStr(this.field.value))
        let data=this.globalService.update_user(Md5.hashStr(this.field.value), this.currentUser._key, this.field_to_edit).toPromise()
        console.log(data);
      }
      else{
        let data=this.globalService.update_user(this.field.value, this.currentUser._key, this.field_to_edit).toPromise()
        console.log(data);
      }

       
    }
    
    //this.globalService.update_(this.data_file._key, this.field_to_edit , 'person').pipe(first()).toPromise().then(data => { 
    //console.log(data); 
    this.dialogRef.close({event:"Confirmed"});

  }

}
