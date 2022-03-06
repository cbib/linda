import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UserInterface, PersonInterface } from 'src/app/models/linda/person';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService, AlertService, UserService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UniqueIDValidatorComponent } from '../../application/validators/unique-id-validator.component'
import { first } from 'rxjs/operators';

interface DialogData {
  field_to_edit: string;
  person_id: string;
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
  private person_id: string;
  private field_to_edit:string
  constructor(    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private userService:UserService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<EditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.person_id = this.data.person_id
      this.field_to_edit = this.data.field_to_edit
    }

  ngOnInit() {
    console.log(this.field_to_edit)
    if (this.field_to_edit==='email'){
      this.editForm = this.formBuilder.group({
        'email': ['', [Validators.required, Validators.email], UniqueIDValidatorComponent.create(this.globalService, this.alertService, "person", "Person email")],
      });
    }
    else if(this.field_to_edit==='name'){
      this.editForm = this.formBuilder.group({
        'name': ['',Validators.required],
      });
    }
    else if(this.field_to_edit==='username'){
      this.editForm = this.formBuilder.group({
        'username': ['',Validators.required],
      });
    }
    else if(this.field_to_edit==='affiliation'){
      this.editForm = this.formBuilder.group({
        'affiliation': ['',Validators.required],
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
    else if (this.field_to_edit==='affiliation'){

    }
    else if (this.field_to_edit==='name'){

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
    //this.globalService.update(this.data_file._key, this.data_file, 'data_file').pipe(first()).toPromise().then(data => { 
    //console.log(data); 
    this.dialogRef.close({event:"Confirmed"});

  }

}
