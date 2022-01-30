import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guards';
import { Routes, RouterModule } from '@angular/router';

// Home and Admin Component (no module)
import { HomeComponent } from './modules/general/home/home.component';
import { AdminComponent } from './components/admin/admin.component'

//Documentation Components
import { OntologyDescriptionComponent } from './documentation/ontology-description.component';
import { MiappeDescriptionComponent } from './documentation/miappe-description.component';
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


//import { GanttComponent } from './modules/application/gantt/gantt.component'
import { PublicDataComponent } from './documentation/public-data.component';
import { HomeNewComponent } from './modules/general/home/home-new.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {
    path: 'login',
    loadChildren: () => import('./modules/general/login/login.module')
      .then(mod => mod.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./modules/general/signup/signup.module')
      .then(mod => mod.SignupModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/general/about/about.module')
      .then(mod => mod.AboutModule)
  },
  //FORMS
  {
    path: 'generic_form',
    loadChildren: () => import('./modules/application/forms/form.module')
      .then(mod => mod.FormModule)
  },
  // { path: 'materialform', redirectTo: '/materialform', pathMatch: 'full' },
  {
    path: 'materialform',
    loadChildren: () => import('./modules/application/material-forms/material-form.module')
      .then(mod => mod.MaterialFormModule)
  },
  {
    path: 'Observationunitform',
    loadChildren: () => import('./modules/application/observation-unit-forms/observation-unit-form.module')
      .then(mod => mod.ObservationUnitFormModule)
  },
  { 
    path: 'explore', 
    loadChildren: () => import('./modules/application/statistics/exploration.module')
      .then(m => m.ExplorationModule) 
  },
  { 
    path: 'download', 
    loadChildren: () => import('./modules/application/file_handlers/download.module')
      .then(m => m.DownloadModule) 
  },
  { path: 'templates', 
    loadChildren: () => import('./modules/application/templates/templates.module')
      .then(m => m.TemplatesModule) 
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./modules/application/user/profile.module')
      .then(m => m.ProfileModule) 
  },
  { 
    path: 'user', 
    loadChildren: () => import('./modules/application/user/profile.module')
      .then(m => m.ProfileModule) 
  },
  { 
    path: 'help', 
    loadChildren: () => import('./modules/general/help/help.module')
      .then(m => m.HelpModule) 
  },
  { 
    path: 'experimental_design', 
    loadChildren: () => import('./modules/application/experimental-design/experimental-design.module')
      .then(m => m.ExperimentalDesignModule) 
  },
  { 
    path: 'extract', 
    loadChildren: () => import('./modules/application/extract/extract.module')
      .then(m => m.ExtractModule) 
  },  
  { 
    path: 'projects_tree', 
    loadChildren: () => import('./modules/application/projects/tree/projects-tree.module')
      .then(m => m.ProjectsTreeModule) 
  },
  { 
    path: 'projects_page', 
    loadChildren: () => import('./modules/application/projects/pages/projects-page.module')
      .then(m => m.ProjectsPageModule) 
  },
  { 
    path: 'gantt', 
    loadChildren: () => import('./modules/application/gantt/gantt.module')
      .then(m => m.GanttModule) 
  },




  
  
  { path: 'home2',component: HomeNewComponent},
  
  // UNUSED ?
  { path: 'releases',component: ReleasesComponent, canActivate: [AuthGuard]},
  
  // MIAPPE COMPONENT
  { path: 'investigation',component: InvestigationComponent},
  { path: 'study',component: StudyComponent},
  { path: 'event',component: EventComponent},
  { path: 'observation_unit',component: ObservationUnitComponent},
  { path: 'biological_material',component: BiologicalMaterialMiappeComponent},
  { path: 'observed_variable',component: ObservedVariableComponent},
  { path: 'experimental_factor',component: ExperimentalFactorComponent},
  { path: 'environmental_parameter',component: EnvironmentalParameterComponent},
  { path: 'sample',component: SampleComponent},

  //MISCELLANOUS EXTRA
  //{ path: 'gantt',component: GanttComponent,canActivate: [AuthGuard]},
  { path: 'ontologies',component: OntologyDescriptionComponent},
  { path: 'admin',component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'public_data',component: PublicDataComponent, canActivate: [AuthGuard]},
  { path: 'data_exploration',component: DataExplorationComponent, canActivate: [AuthGuard]},
  { path: 'project_example',component: ProjectExampleComponent, canActivate: [AuthGuard]},
  { path: 'miappe',component: MiappeDescriptionComponent,canActivate: [AuthGuard]},
  { path: '**', component: NotFoundComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
    ///enableTracing: true
  }),

],
  exports: [RouterModule]
})
export class AppRoutingModule { }
