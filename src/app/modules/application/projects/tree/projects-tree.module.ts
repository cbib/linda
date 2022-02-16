import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsTreeRoutingModule } from './projects-tree-routing.module';
import { ProjectsTreeComponent } from './projects-tree.component';
import { GlobalService, AlertService, FileService, SearchService} from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from '../../tables/table.module'
import { DownloadModule } from '../../file_handlers/download.module';

//import { AlertComponent } from '../../../../directives/alert.component';
@NgModule({
  declarations: [ProjectsTreeComponent],
  imports: [
    CommonModule,
    ProjectsTreeRoutingModule,
    MatMenuModule,
    JoyrideModule,
    MatCardModule,
    MatTreeModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule,
    TableModule,
    DownloadModule
  ],
  exports: [
    ProjectsTreeComponent
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
export class ProjectsTreeModule { }
