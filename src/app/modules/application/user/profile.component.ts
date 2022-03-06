import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, GlobalService } from '../../../services';
import { PersonInterface, UserInterface } from 'src/app/models/linda/person';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser:UserInterface
  currentPerson:PersonInterface
  activeTab: string='personal_infos'
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.currentUser=JSON.parse(localStorage.getItem('currentUser'))
    /* this.userService.get_person(this.currentUser['Person ID']).toPromise().then(
      person => {
        this.currentPerson=person[0]
        console.log(this.currentPerson)
      }
    ); */
  }
  changeTab(tab:string){
    this.activeTab=tab
  }


  get get_currentPerson():PersonInterface{
    return this.currentPerson
  }
  myFunction(event) {
    console.log(event)

  }
  modify_email() {
    console.log("email to modify -> redirect to register page ? ")
  }
  modify_pwd() {
    console.log("password to modify -> redirect to register page ? ")

  }
}
