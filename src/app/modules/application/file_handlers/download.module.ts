import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule} from '@angular/material/select'; 
import { GlobalService, AlertService} from '../../../services';

@NgModule({
  declarations: [DownloadComponent],
  imports: [
    CommonModule,
    DownloadRoutingModule,
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
    DownloadComponent
  ],
  providers: [
    JoyrideService,
    GlobalService, 
    AlertService
  ],
})
export class DownloadModule { }
