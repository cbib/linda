import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './directives/alert.component';
import { AuthGuard } from './guards/auth.guards';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { GlobalService, AlertService, AuthenticationService, UserService,InvestigationService,EventService, ObservationUnitService, AdService, SearchService} from './services';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DownloadComponent } from './download/download.component';
import { DateValidatorComponent } from './validators/date-validator.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { NavbarComponent } from './navbar/navbar.component';
import { OntologyTreeComponent } from './ontology-tree/ontology-tree.component';
import { DialogComponent } from './dialog/dialog.component';
import { DataTablesModule } from 'angular-datatables';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { UniqueIDValidatorComponent } from './validators/unique-id-validator.component';
import { FormComponent } from './forms/form.component';
import { UserTreeComponent } from './user-tree/user-tree.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DateformatComponent } from './dateformat/dateformat.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog.component';
import { EmailvalidatorComponent } from './validators/emailvalidator.component';
import { TemplateSelectionDialogComponent } from './dialog/template-selection-dialog.component';
import { DelimitorDialogComponent } from './dialog/delimitor-dialog.component';
import { UserComponent } from './users/user.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { SendmailComponent } from './forms/sendmail.component';
import { OntologyDescriptionComponent } from './documentation/ontology-description.component';
import { MiappeDescriptionComponent } from './documentation/miappe-description.component';
import { AdBannerComponent } from './banners/ad-banner.component';
import { PubAdComponent } from './banners/pub-ad.component';
import { AdDirective } from './directives/ad.directive';
import { DragDropDirective } from './directives/drag-drop.directive';
import { UploadFileComponent } from './download/upload-file.component';
import { ExportDialogComponent } from './dialog/export-dialog.component';
import { PublicationsComponent } from './documentation/publications.component';
import { ReleasesComponent } from './documentation/releases.component';
import { SearchResultDialogComponent } from './dialog/search-result-dialog.component';
import { MaterialDialogComponent } from './dialog/material-dialog.component';
import { MaterialFormComponent } from './forms/material-form.component';
import { ObservationUnitFormComponent } from './forms/observation-unit-form.component';
import { SelectionDialogComponent } from './dialog/selection-dialog.component';
import { SampleSelectionComponent } from './dialog/sample-selection.component';
import { MaterialForm2Component } from './forms/material-form2.component';
import { MaterialForm3Component } from './forms/material-form3.component';
import { DataExplorationComponent } from './documentation/data-exploration.component';
import { InvestigationComponent } from './documentation/miappe_components/investigation.component';
import { ProjectExampleComponent } from './documentation/project-example.component';
import { StudyComponent } from './documentation/miappe_components/study.component';
import { EventComponent } from './documentation/miappe_components/event.component';
import { BiologicalMaterialComponent } from './documentation/miappe_components/biological-material.component';
import { ObservationUnitComponent } from './documentation/miappe_components/observation-unit.component';
import { ObservedVariableComponent } from './documentation/miappe_components/observed-variable.component';
import { ExperimentalFactorComponent } from './documentation/miappe_components/experimental-factor.component';
import { EnvironmentalParameterComponent } from './documentation/miappe_components/environmental-parameter.component';
import { SampleComponent } from './documentation/miappe_components/sample.component';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { NgGanttEditorModule } from 'ng-gantt';
import { GanttComponent } from './test_component/gantt.component'
//import {GuidedTourModule, GuidedTourService} from 'ngx-guided-tour';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PublicDataComponent } from './documentation/public-data.component';
import { DatatableDialogComponent } from './dialog/datatable-dialog.component';
import { HelpLoaderDialogComponent } from './dialog/help-loader-dialog.component';
import { ExtractComponentComponent } from './extract/extract-component.component';
import { FormDialogComponent } from './dialog/form-dialog.component';
import { EditComponent } from './edition/edit.component';
import { TemplatesComponent } from './templates/templates.component';
import { ExplorationComponent } from './statistics/exploration.component';
import { BiologicalMaterialDialogComponent } from './dialog/biological-material-dialog.component';
import { BiologicalMaterialTableComponent } from './table/biological-material-table.component';
import { CsvLoaderDialogComponent } from './dialog/csv-loader-dialog.component';
import { ObservationUnitTableComponent } from './table/observation-unit-table.component';
import { ExperimentalDesignComponent } from './design/experimental-design.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    DownloadComponent,
    RegisterComponent,
    DateValidatorComponent,
    EmailvalidatorComponent,
    NavbarComponent,
    OntologyTreeComponent,
    UniqueIDValidatorComponent,
    FormComponent,
    DialogComponent,
    UserTreeComponent,
    DateformatComponent,
    ConfirmationDialogComponent,
    TemplateSelectionDialogComponent,
    DelimitorDialogComponent,
    UserComponent,
    AdminComponent,
    HelpComponent,
    SendmailComponent,
    OntologyDescriptionComponent,
    MiappeDescriptionComponent,
    AdBannerComponent,
    PubAdComponent,
    AdDirective,
    DragDropDirective,
    UploadFileComponent,
    ExportDialogComponent,
    PublicationsComponent,
    ReleasesComponent,
    SearchResultDialogComponent,
    MaterialDialogComponent,
    MaterialFormComponent,
    ObservationUnitFormComponent,
    SelectionDialogComponent,
    SampleSelectionComponent,
    MaterialForm2Component,
    MaterialForm3Component,
    DataExplorationComponent,
    InvestigationComponent,
    ProjectExampleComponent,
    StudyComponent,
    EventComponent,
    BiologicalMaterialComponent,
    ObservationUnitComponent,
    ObservedVariableComponent,
    ExperimentalFactorComponent,
    EnvironmentalParameterComponent,
    SampleComponent,
    GanttComponent,
    PublicDataComponent,
    DatatableDialogComponent,
    HelpLoaderDialogComponent,
    ExtractComponentComponent,
    FormDialogComponent,
    EditComponent,
    TemplatesComponent,
    ExplorationComponent,
    BiologicalMaterialDialogComponent,
    BiologicalMaterialTableComponent,
    CsvLoaderDialogComponent,
    ObservationUnitTableComponent,
    ExperimentalDesignComponent
        
    

    
//    DialogOverviewExampleDialog,
//    ModaltreeComponent,
//    EmailvalidatorComponent
    
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
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
    MatTooltipModule,
    MatTreeModule,
    BrowserAnimationsModule,
    NgxJsonViewerModule,
    ScrollingModule,
    DataTablesModule,
    DragDropModule,
    JoyrideModule.forRoot(),
    NgGanttEditorModule,
    //GuidedTourModule,
    NgxChartsModule,
      
  ],
  entryComponents:[DialogComponent,
                   OntologyTreeComponent,
                   DateformatComponent, 
                   ConfirmationDialogComponent, 
                   TemplateSelectionDialogComponent, 
                   DelimitorDialogComponent,
                   ExportDialogComponent,
                   SearchResultDialogComponent,
                   PubAdComponent,
                   SelectionDialogComponent,
                   SampleSelectionComponent,
                   DatatableDialogComponent,
                   HelpLoaderDialogComponent,
                   FormDialogComponent,
                   BiologicalMaterialDialogComponent,
                   CsvLoaderDialogComponent
                   
                   ],
  providers: [AuthGuard,
              AlertService,
              AuthenticationService,
              InvestigationService,
              EventService,
              ObservationUnitService,
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
