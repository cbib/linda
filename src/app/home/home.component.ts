import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AdService } from '../services';
import {AdItem } from '../banners/ad-item'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JoyrideService} from 'ngx-joyride';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    ads: AdItem[];
    step3 = false;
    step4 = false;
    currentUser: User;

    public LindaTour: GuidedTour = {
        tourId: 'purchases-tour',
        useOrb: false,
        skipCallback: (stepSkippedOn: number) => {
          console.log('skip callback called');
                 //this.dialog.closeAll();
        },
        completeCallback: () => {
          console.log('Complete callback called');
                  //this.dialog.closeAll();
      
        },
        steps: [
            {
                title: 'Welcome to the Guided Tour Demo',
                selector: '.demo-title',
                content: 'Hello !! <br> Youre about to discover LINDA Plant experimental metadata database !! The following tour will help you to take control of the tool and exploit its possibilities !!',
                orientation: Orientation.Bottom,
                action: () => {

                }
            },
            {
                title: 'General page step',
                content: 'We have the concept of general page steps so that a you can introuce a user to a page or non specific instructions',
                closeAction: () => {
                    this.step3 = true;
                }
            },
            {
                title: 'Positioning',
                selector: '.tour-middle-content',
                content: 'Step position can be set so that steps are always in view. This step is on the left.',
                orientation: Orientation.Left,
                action: () => {
                    this.step3 = true;
                },
            },
            {
                title: 'Positioning 2',
                selector: '.tour-middle-content',
                content: 'This step is on the right.',
                orientation: Orientation.Right,
                action: () => {
                    this.step3 = true;
                    this.step4 = false;
                },
            },
            {
                title: 'Scroll to content',
                selector: '.tour-scroll',
                content: 'Automatically scroll to elements so they are in view',
                orientation: Orientation.Top,
                action: () => {
                    this.step4 = true;
                    this.step3 = false;
                },
            },
            {
                title: 'Dialog Input Content',
                selector: '.mat-dialog-actions',
                content: 'Click Ok or No Thanks button',
                orientation: Orientation.Top,
                action: () => {
                    console.log('Dialog Opened');
                    this.step3 = false;
                    this.step4 = false;
                    //this.openDialog();
                },
            },
            
        ]
    };



    constructor(private router: Router, private adService: AdService, private readonly joyrideService: JoyrideService, private guidedTourService: GuidedTourService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
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
             { steps: ['StepZero', 'firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep','step6@tree', 'step7@tree','step7_1@tree', 'step8@tree', 'step8_1@tree',], stepDefaultPosition: 'bottom'} // Your steps order
         );
     }
    
    start_linda(){
        
         this.router.navigate(['/tree']);

    }
}