
// MODULES AND SERVICES
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalService, AlertService, UserService, AdService, SearchService, BrapiService} from './services';
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
import { ProgressBarModule } from './components/progress-bar/progress-bar.module';
import { FormModule } from './modules/application/forms/form.module';
import { MaterialFormModule } from './modules/application/material-forms/material-form.module';
import { ObservationUnitFormModule} from './modules/application/observation-unit-forms/observation-unit-form.module'
import { TablesModule } from './modules/application/tables/tables.module'
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
import { ValidatorModule } from './modules/application/validators/validator.module'
import { AlertModule } from './modules/application/alert/alert.module'
import { MapModule } from './modules/application/map/map.module'  
import { AssignModule } from './modules/application/assign/assign.module';
import { RequestResetModule } from './modules/general/request-reset/request-reset.module';

// MATERIAL MODULES 
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule} from '@angular/material/divider';

// DIRECTIVES
import { AdDirective } from './directives/ad.directive';
import { DragDropDirective } from './directives/drag-drop.directive';

// COMPONENTS
import { AppComponent } from './app.component';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AuthGuard } from './guards/auth.guards';
import { AdBannerComponent } from './banners/ad-banner.component';
import { PubAdComponent } from './banners/pub-ad.component';
import { PublicationsComponent } from './modules/application/documentation/publications.component';

// PAGES COMPONENTS 
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './modules/general/home/home.component';
import { HomeNewComponent } from './modules/general/home/home-new.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';
import { ResponseResetComponent } from './modules/general/response-reset/response-reset.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    AdBannerComponent,
    PubAdComponent,
    AdDirective,
    DragDropDirective,
    PublicationsComponent,
    HomeNewComponent,
    NotFoundComponent,
    ResponseResetComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // Material modules
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    NgxJsonViewerModule,
    ScrollingModule,
    DataTablesModule,
    DragDropModule,
    JoyrideModule.forRoot(),
    NgxChartsModule,
    
    //My lazy modules
    HeaderModule,
    FooterModule,
    SiderModule,
    ProgressBarModule,
    FormModule,
    MaterialFormModule,
    ObservationUnitFormModule,
    TablesModule,
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
    GanttModule,
    ValidatorModule,
    AlertModule,
    MapModule,
    AssignModule,
    RequestResetModule
    //DocumentationModule
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })    
  ],
  entryComponents:[PubAdComponent],
  providers: [AuthGuard,
              AlertService,
              UserService,
              GlobalService,
              SearchService,
              JoyrideService,
              BrapiService,
              AdService,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
              ],
  bootstrap: [AppComponent]
})
/**
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 */
export class AppModule { }
