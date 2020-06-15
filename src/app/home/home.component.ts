import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AdService } from '../services';
import {AdItem } from '../banners/ad-item'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    private ads: AdItem[];

    currentUser: User;

    constructor(private router: Router, private adService: AdService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    }
    
    ngOnInit() {
        this.ads = this.adService.getAds();

    }
    
    start_linda(){
         this.router.navigate(['/tree']);

    }
}