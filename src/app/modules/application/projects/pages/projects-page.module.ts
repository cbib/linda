import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageRoutingModule } from './projects-page-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalService, AlertService, FileService, SearchService} from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component'
import { FormModule } from '../../forms/form.module';
@NgModule({
  declarations: [ProjectsPageComponent,
    ProjectPageComponent],
  imports: [
    CommonModule,
    ProjectsPageRoutingModule,
    MatMenuModule,
    JoyrideModule,
    MatCardModule,
    MatChipsModule,
    FormModule
  ],
  exports: [
    ProjectsPageComponent,
    ProjectPageComponent
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
