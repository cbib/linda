import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert.component';
import { AlertService} from '../../../services';

@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    AlertComponent
  ],
  providers: [ 
    AlertService
  ],
})
export class AlertModule { }
