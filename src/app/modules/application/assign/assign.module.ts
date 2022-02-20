import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule} from '@angular/material/select'; 
import { GlobalService, AlertService} from '../../../services';

import { AssignRoutingModule } from './assign-routing.module';
import { AssignComponent } from './assign.component';


@NgModule({
  declarations: [AssignComponent],
  imports: [
    CommonModule,
    AssignRoutingModule,
    NgxChartsModule,
    MatCardModule,
    JoyrideModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    AssignComponent
  ],
  providers: [
    JoyrideService,
    GlobalService, 
    AlertService
  ],
})
export class AssignModule { }
