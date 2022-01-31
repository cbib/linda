// MODULES AND SERVICES
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
import { ValidatorModule } from './modules/application/validators/validator.module'
//import { DocumentationModule } from './modules/application/documentation/documentation.module'

// MATERIAL MODULES 
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule} from '@angular/material/divider';

// DIRECTIVES
import { AdDirective } from './directives/ad.directive';
import { DragDropDirective } from './directives/drag-drop.directive';
import { AlertComponent } from './directives/alert.component';

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



@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    AdminComponent,
    AdBannerComponent,
    PubAdComponent,
    AdDirective,
    DragDropDirective,
    PublicationsComponent,
    HomeNewComponent,
    NotFoundComponent
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
    FormModule,
    MaterialFormModule,
    ObservationUnitFormModule,
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
    GanttModule,
    ValidatorModule,
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
              AdService,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
