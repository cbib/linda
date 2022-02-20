import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  modify_email(){
    console.log("email to modify -> redirect to register page ? ")
  }
  modify_pwd(){
    console.log("password to modify -> redirect to register page ? ")
    
  }

}
