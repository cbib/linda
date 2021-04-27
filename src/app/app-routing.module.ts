import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DownloadComponent } from './download/download.component';
import { AuthGuard } from './guards/auth.guards';
import { NavbarComponent } from './navbar/navbar.component';
import { OntologyTreeComponent } from './ontology-tree/ontology-tree.component';
//import { DialogComponent } from './dialog/dialog.component';
import { UserTreeComponent } from './user-tree/user-tree.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
//import { SendmailComponent } from './forms/sendmail.component';
import { OntologyDescriptionComponent } from './documentation/ontology-description.component';
import { MiappeDescriptionComponent } from './documentation/miappe-description.component';
import { DonwloadedComponent } from './download/donwloaded.component';
import { ReleasesComponent } from './documentation/releases.component';
import { MaterialFormComponent } from './forms/material-form.component';
import { ObservationUnitFormComponent } from './forms/observation-unit-form.component';
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
import { GanttComponent } from './test_component/gantt.component'
import { PublicDataComponent } from './documentation/public-data.component';



const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trees',component: OntologyTreeComponent,canActivate: [AuthGuard]},
  { path: 'tree',component: UserTreeComponent,canActivate: [AuthGuard]},
  { path: 'download',component: DownloadComponent,canActivate: [AuthGuard]},
  { path: 'downloaded',component: DonwloadedComponent,canActivate: [AuthGuard]},
  { path: 'home',component: HomeComponent},
  { path: 'investigation',component: InvestigationComponent},
  { path: 'study',component: StudyComponent},
  { path: 'event',component: EventComponent},
  { path: 'observation_unit',component: ObservationUnitComponent},
  { path: 'biological_material',component: BiologicalMaterialComponent},
  { path: 'observed_variable',component: ObservedVariableComponent},
  { path: 'experimental_factor',component: ExperimentalFactorComponent},
  { path: 'environmental_parameter',component: EnvironmentalParameterComponent},
  { path: 'sample',component: SampleComponent},
  { path: 'navbars',component: NavbarComponent},
  { path: 'generic',component: FormComponent},
  { path: 'generic2',component: MaterialFormComponent},
  { path: 'generic4',component: MaterialForm2Component},
  { path: 'generic5',component: MaterialForm3Component},
  { path: 'generic3',component: ObservationUnitFormComponent},
  { path: 'ontologies',component: OntologyDescriptionComponent},
  { path: 'admin',component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'help',component: HelpComponent, canActivate: [AuthGuard]},
  { path: 'public_data',component: PublicDataComponent, canActivate: [AuthGuard]},
  { path: 'data_exploration',component: DataExplorationComponent, canActivate: [AuthGuard]},
  { path: 'project_example',component: ProjectExampleComponent, canActivate: [AuthGuard]},
  { path: 'releases',component: ReleasesComponent, canActivate: [AuthGuard]},
  //{ path: 'mail',component: SendmailComponent,canActivate: [AuthGuard]},
  { path: 'miappe',component: MiappeDescriptionComponent,canActivate: [AuthGuard]},
  { path: 'gantt',component: GanttComponent,canActivate: [AuthGuard]}
  
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
