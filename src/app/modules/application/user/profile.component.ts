import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(  
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
    let tmp_user=localStorage.getItem('currentUser')
    console.log(tmp_user)
  }
  myFunction(event){
    console.log(event)

  }
  modify_email(){
    console.log("email to modify -> redirect to register page ? ")
  }
  modify_pwd(){
    console.log("password to modify -> redirect to register page ? ")
    
  }

}

