import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageRoutingModule } from './projects-page-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalService, AlertService, FileService, SearchService} from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { StudiesPageComponent } from './studies-page.component';
import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component'
import { StudyPageComponent } from './study-page.component'
import { MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule} from '@angular/material/divider'; 
import { ObservationUnitPageComponent} from './observation-unit-page.component'
import { BiologicalMaterialPageComponent } from './biological-material-page.component';
import { ExperimentalFactorPageComponent } from './experimental-factor-page.component';
import { DataFilesPageComponent } from './data-files-page.component';
import { ObservedVariablePageComponent } from './observed-variable-page.component';

// Mu entry module
import { DownloadModule } from '../../file_handlers/download.module';
import { ExtractModule } from '../../extract/extract.module';
import { AlertModule } from '../../alert/alert.module';
import { FormModule } from '../../forms/form.module';
import { ExplorationModule } from '../../statistics/exploration.module';

@NgModule({
  declarations: [ProjectsPageComponent,
    ProjectPageComponent, StudiesPageComponent, StudyPageComponent, ObservationUnitPageComponent, BiologicalMaterialPageComponent, ExperimentalFactorPageComponent, DataFilesPageComponent, ObservedVariablePageComponent],
  imports: [
    CommonModule,
    ProjectsPageRoutingModule,
    MatMenuModule,
    JoyrideModule,
    MatCardModule,
    MatChipsModule,
    FormModule,
    MatFormFieldModule,
    MatInputModule,
    DownloadModule,
    ExtractModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    AlertModule,
    ExplorationModule,
  ],
  exports: [
    ProjectsPageComponent,
    ProjectPageComponent,
    StudiesPageComponent,
    StudyPageComponent,
    ObservationUnitPageComponent,
    BiologicalMaterialPageComponent,
    ExperimentalFactorPageComponent,
    DataFilesPageComponent,
    ObservedVariablePageComponent
  ],
  providers: [
    JoyrideService,
    GlobalService, 
    AlertService,
    FileService, 
    SearchService,
    WizardService
  ],
  entryComponents: [
    StudiesPageComponent,
    StudyPageComponent,
    ObservationUnitPageComponent,
    BiologicalMaterialPageComponent,
    ExperimentalFactorPageComponent,
    DataFilesPageComponent,
    ObservedVariablePageComponent
  ]
})
export class ProjectsPageModule { }
