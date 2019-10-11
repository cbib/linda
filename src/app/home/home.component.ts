import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    
    currentUser: User;

    constructor(private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    }
    
    ngOnInit() {}
}