import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { AppComponent } from './app.component';
import { AlertComponent } from './directives/alert.component';
import { AuthGuard } from './guards/auth.guards';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { GlobalService, AlertService, AuthenticationService, UserService,InvestigationService,EventService, ObservationUnitService} from './services';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DownloadComponent } from './download/download.component';
import { DateValidatorComponent } from './validators/date-validator.component';
import { platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { A11yModule} from '@angular/cdk/a11y';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { PortalModule} from '@angular/cdk/portal';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { CdkStepperModule} from '@angular/cdk/stepper';
import { CdkTableModule} from '@angular/cdk/table';
import { CdkTreeModule} from '@angular/cdk/tree';
import { NavbarComponent } from './navbar/navbar.component';
import { OntologyTreeComponent } from './ontology-tree/ontology-tree.component';
import { DialogComponent } from './dialog/dialog.component';
//import { DialogOverviewExampleDialog } from './dialog/dialog.component';
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
import { OntologyTerm } from './ontology/ontology-term';
import { UserTreeComponent } from './user-tree/user-tree.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DateformatComponent } from './dateformat/dateformat.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { EmailvalidatorComponent } from './validators/emailvalidator.component';
import { TemplateSelectionDialogComponent } from './dialog/template-selection-dialog.component';
import { DelimitorDialogComponent } from './dialog/delimitor-dialog.component';
import { UserComponent } from './users/user.component';
import { AdminComponent } from './admin/admin.component';




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
    

    
//    DialogOverviewExampleDialog,
    //ModaltreeComponent,
    
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
    DragDropModule
  ],
  entryComponents:[DialogComponent,OntologyTreeComponent,DateformatComponent,ConfirmationDialogComponent,TemplateSelectionDialogComponent,DelimitorDialogComponent],
  providers: [AuthGuard,
              AlertService,
              AuthenticationService,
              InvestigationService,
              EventService,
              ObservationUnitService,
              UserService,
              GlobalService,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
