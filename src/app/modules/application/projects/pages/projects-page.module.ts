import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageRoutingModule } from './projects-page-routing.module';
//Services
import { GlobalService, AlertService, FileService, SearchService} from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
// Material modules
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

import { MatDividerModule} from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// My page components

import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component'
import { StudiesPageComponent } from './studies-page.component';
import { StudyPageComponent } from './study-page.component'
import { ObservationUnitPageComponent} from './observation-unit-page.component'
import { BiologicalMaterialPageComponent } from './biological-material-page.component';
import { DataFilesPageComponent } from './data-files-page.component';
import { DataFilePageComponent } from './data-file-page.component';
import { ExperimentalDesignsPageComponent } from './experimental-designs-page.component';
import { ExperimentalDesignPageComponent } from './experimental-design-page.component';
import { PersonsPageComponent } from './persons-page.component';
import { ObservationsPageComponent } from './observations-page.component';
import { ExperimentalFactorsPageComponent } from './experimental-factors-page.component';
import { ExperimentalFactorPageComponent } from './experimental-factor-page.component';
import { EventsPageComponent } from './events-page.component';
import { EventPageComponent } from './event-page.component'
import { ObservedVariablesPageComponent } from './observed-variables-page.component';
import { ObservedVariablePageComponent } from './observed-variable-page.component';
import { EnvironmentVariablesPageComponent } from './environment-variables-page.component';
import { EnvironmentVariablePageComponent } from './environment-variable-page.component';



// Mu entry module
import { DownloadModule } from '../../file_handlers/download.module';
import { ExtractModule } from '../../extract/extract.module';
import { AlertModule } from '../../alert/alert.module';
import { FormModule } from '../../forms/form.module';
import { ExplorationModule } from '../../statistics/exploration.module';
import { GanttModule } from '../../gantt/gantt.module';
import { ProjectsTreeModule} from  '../../projects/tree/projects-tree.module'
import { AssignModule } from '../../assign/assign.module';
import { TablesModule } from '../../tables/tables.module';
import { TableModule} from 'primeng/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';



@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectPageComponent, 
    StudiesPageComponent, 
    StudyPageComponent, 
    ObservationUnitPageComponent, 
    BiologicalMaterialPageComponent, 
    ExperimentalFactorPageComponent, 
    DataFilesPageComponent, 
    ObservedVariablePageComponent,
    ExperimentalDesignsPageComponent,
    ExperimentalDesignPageComponent,
    PersonsPageComponent,
    EventPageComponent,
    ObservationsPageComponent,
    ExperimentalFactorsPageComponent,
    EventsPageComponent,
    ObservedVariablesPageComponent,
    EnvironmentVariablesPageComponent,
    EnvironmentVariablePageComponent,
    DataFilePageComponent],
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
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AlertModule,
    ExplorationModule,
    GanttModule,
    ProjectsTreeModule,
    TablesModule,
    AssignModule,
    FormsModule, 
    ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    TextFieldModule,
    // Primeng modules
    TableModule
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
    ObservedVariablePageComponent,
    ExperimentalDesignsPageComponent,
    ExperimentalDesignPageComponent,
    PersonsPageComponent,
    EventPageComponent,
    ObservationsPageComponent,
    ExperimentalFactorsPageComponent,
    EventsPageComponent,
    ObservedVariablesPageComponent,
    EnvironmentVariablesPageComponent
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
    ObservedVariablePageComponent,
    ExperimentalDesignsPageComponent,
    ExperimentalDesignPageComponent,
    PersonsPageComponent,
    EventPageComponent,
    ObservationsPageComponent,
    ExperimentalFactorsPageComponent,
    EventsPageComponent,
    ObservedVariablesPageComponent,
    EnvironmentVariablesPageComponent
  ]
})
export class ProjectsPageModule { }
