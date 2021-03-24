import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AdService } from '../services';
import {AdItem } from '../banners/ad-item'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JoyrideService} from 'ngx-joyride';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    ads: AdItem[];

    currentUser: User;

    constructor(private router: Router, private adService: AdService, private readonly joyrideService: JoyrideService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    }
    
    ngOnInit() {
        // var image_path=window.location.href+'assets/images/cbib.jpg'
        // console.log(image_path)
        this.ads = this.adService.getAds();

    }
    onClick() {
        this.joyrideService.startTour(
            { steps: ['firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'step6@tree', 'step7@tree'] } // Your steps order
        );
    }
    
    start_linda(){
        
         this.router.navigate(['/tree']);

    }
}