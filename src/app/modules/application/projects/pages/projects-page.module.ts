import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsPageRoutingModule } from './projects-page-routing.module';
import { ProjectsPageComponent } from './projects-page.component';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalService, AlertService, FileService, SearchService} from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
@NgModule({
  declarations: [ProjectsPageComponent],
  imports: [
    CommonModule,
    ProjectsPageRoutingModule,
    MatMenuModule,
    JoyrideModule,
    MatCardModule,
    MatChipsModule
  ],
  exports: [
    ProjectsPageComponent
  ],
  providers: [
    JoyrideService,
    GlobalService, 
    AlertService,
    FileService, 
    SearchService,
    WizardService
  ],
})
export class ProjectsPageModule { }
