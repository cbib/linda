import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../../services';

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
//        this.subscription = this.alertService.getMessage().subscribe(message => { 
//            this.message = message;
//        });
        
        this.subscription = this.alertService.getMessage()
            .subscribe(message => {
                switch (message && message.type) {
                    case 'success':
                        message.cssClass = 'alert alert-success alert-dismissible';
                        break;
                    case 'error':
                        message.cssClass = 'alert alert-danger alert-dismissible';
                        break;
                }

                this.message = message;
            });
        
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}


