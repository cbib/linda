// MODULES AND SERVICES
// import {GuidedTourModule, GuidedTourService} from 'ngx-guided-tour';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { NgGanttEditorModule } from 'ng-gantt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalService, AlertService, UserService, AdService, SearchService} from './services';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { DataTablesModule } from 'angular-datatables';

// CUSTOM MODULES
import { HeaderModule } from './components/header/header.module';
import { FooterModule } from './components/footer/footer.module';
import { SiderModule } from './components/sider/sider.module';
import { FormModule } from './modules/application/forms/form.module';
import { MaterialFormModule } from './modules/application/material-forms/material-form.module';
import { ObservationUnitFormModule} from './modules/application/observation-unit-forms/observation-unit-form.module'
import { TableModule } from './modules/application/tables/table.module'
import { ExplorationModule } from './modules/application/statistics/exploration.module';
import { DownloadModule } from './modules/application/file_handlers/download.module';
import { TemplatesModule } from './modules/application/templates/templates.module';
import { ProfileModule } from './modules/application/user/profile.module';
import { HelpModule } from './modules/general/help/help.module'
import { ExperimentalDesignModule } from './modules/application/experimental-design/experimental-design.module';
import { ExtractModule } from './modules/application/extract/extract.module';
import { ProjectsTreeModule } from './modules/application/projects/tree/projects-tree.module'
import { ProjectsPageModule} from './modules/application/projects/pages/projects-page.module'
import { DialogModule } from './modules/application/dialogs/dialog.module';
import { GanttModule } from './modules/application/gantt/gantt.module';

// MATERIAL MODULES 
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';


// DIRECTIVES
import { AdDirective } from './directives/ad.directive';
import { DragDropDirective } from './directives/drag-drop.directive';
import { AlertComponent } from './directives/alert.component';

// COMPONENTS
import { AppComponent } from './app.component';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AuthGuard } from './guards/auth.guards';
import { DateValidatorComponent } from './validators/date-validator.component';
import { UniqueIDValidatorComponent } from './validators/unique-id-validator.component';
import { EmailvalidatorComponent } from './validators/emailvalidator.component';
import { AdBannerComponent } from './banners/ad-banner.component';
import { PubAdComponent } from './banners/pub-ad.component';

//DOCUMENTATION COMPONENTS
import { PublicationsComponent } from './documentation/publications.component';
import { ReleasesComponent } from './documentation/releases.component';
import { DataExplorationComponent } from './documentation/data-exploration.component';
import { InvestigationComponent } from './documentation/miappe_components/investigation.component';
import { ProjectExampleComponent } from './documentation/project-example.component';
import { StudyComponent } from './documentation/miappe_components/study.component';
import { EventComponent } from './documentation/miappe_components/event.component';
import { BiologicalMaterialMiappeComponent } from './documentation/miappe_components/biological-material-miappe.component';
import { ObservationUnitComponent } from './documentation/miappe_components/observation-unit.component';
import { ObservedVariableComponent } from './documentation/miappe_components/observed-variable.component';
import { ExperimentalFactorComponent } from './documentation/miappe_components/experimental-factor.component';
import { EnvironmentalParameterComponent } from './documentation/miappe_components/environmental-parameter.component';
import { SampleComponent } from './documentation/miappe_components/sample.component';
import { PublicDataComponent } from './documentation/public-data.component';
import { OntologyDescriptionComponent } from './documentation/ontology-description.component';
import { MiappeDescriptionComponent } from './documentation/miappe-description.component';

// PAGES COMPONENTS 
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './modules/general/home/home.component';
import { HomeNewComponent } from './modules/general/home/home-new.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    DateValidatorComponent,
    EmailvalidatorComponent,
    UniqueIDValidatorComponent,
    AdminComponent,
    OntologyDescriptionComponent,
    MiappeDescriptionComponent,
    AdBannerComponent,
    PubAdComponent,
    AdDirective,
    DragDropDirective,
    PublicationsComponent,
    ReleasesComponent,
    DataExplorationComponent,
    InvestigationComponent,
    ProjectExampleComponent,
    StudyComponent,
    EventComponent,
    BiologicalMaterialMiappeComponent,
    ObservationUnitComponent,
    ObservedVariableComponent,
    ExperimentalFactorComponent,
    EnvironmentalParameterComponent,
    SampleComponent,
    PublicDataComponent,
    HomeNewComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    BrowserAnimationsModule,
    NgxJsonViewerModule,
    ScrollingModule,
    DataTablesModule,
    DragDropModule,
    JoyrideModule.forRoot(),
    //NgGanttEditorModule,
    //GuidedTourModule,
    NgxChartsModule,
    HeaderModule,
    FormModule,
    MaterialFormModule,
    ObservationUnitFormModule,
    FooterModule,
    SiderModule,
    TableModule,
    ExplorationModule,
    DownloadModule,
    TemplatesModule,
    ProfileModule,
    HelpModule,
    ExperimentalDesignModule,
    ExtractModule,
    ProjectsTreeModule,
    ProjectsPageModule,
    DialogModule,
    GanttModule
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })    
  ],
  entryComponents:[PubAdComponent],
  providers: [AuthGuard,
              AlertService,
              UserService,
              GlobalService,
              SearchService,
              JoyrideService,
              AdService,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
