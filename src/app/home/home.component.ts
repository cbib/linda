import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../models/user';
import { UserService,InvestigationService,GlobalService } from '../services';
import { Router } from '@angular/router';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    keys:any = [];
    
    investigations:any = [];

    constructor(

        private router: Router) 
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
    }

    ngOnInit() {
        //this.loadAllUsers();
        //this.loadAllInvestigations();
        //this.load_keys();
    }
}