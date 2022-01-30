import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtractRoutingModule } from './extract-routing.module';
import { ExtractComponent } from './extract.component';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService} from '../../../services';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@NgModule({
  declarations: [ExtractComponent],
  imports: [
    CommonModule,
    ExtractRoutingModule,
    MatCardModule,
    JoyrideModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonToggleModule
    
    
  ],
  exports: [
    ExtractComponent
  ],
  providers: [
    JoyrideService,
    GlobalService, 
    AlertService
  ],
})
export class ExtractModule { }
