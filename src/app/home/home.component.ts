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
    step3 = false;
    step4 = false;
    currentUser: User;

    constructor(private router: Router, private adService: AdService, private readonly joyrideService: JoyrideService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));  
        if (this.currentUser['tutoriel_checked'] === false){
            console.log(this.currentUser)
            console.log("start Guided tour part 1")
            this.onClick()
            // this.joyrideService.startTour(
            //     { steps: ['step6@tree', 'step8@tree', 'step8_1@tree'], stepDefaultPosition: 'bottom'} // Your steps order
            //     );
        }  
    }
    
    ngOnInit() {
        // var image_path=window.location.href+'assets/images/cbib.jpg'
        // console.log(image_path)
        this.ads = this.adService.getAds();

    }
    // public onClick(): void {
    //     this.guidedTourService.startTour(this.LindaTour);
    // }
    onClick() {
         this.joyrideService.startTour(
            { steps: ['StepZero', 'firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep'], stepDefaultPosition: 'center'} // Your steps order
         );
     }
     onDone(){
         this.router.navigate(['/tree'])
     }

    
    start_linda(){
        
         this.router.navigate(['/tree']);

    }
}