import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guards';
import { Routes, RouterModule } from '@angular/router';

// Home and Admin Component (no module)
import { HomeComponent } from './modules/general/home/home.component';
import { AdminComponent } from './components/admin/admin.component'
import { HomeNewComponent } from './modules/general/home/home-new.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';
import { ResponseResetComponent } from './modules/general/response-reset/response-reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'home2', pathMatch: 'full' },
  //{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'home2',component: HomeNewComponent},
  //{ path: 'response-reset',component: ResponseResetComponent},
  {
    path: 'login',
    loadChildren: () => import('./modules/general/login/login.module')
      .then(mod => mod.LoginModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./modules/application/map/map.module')
      .then(mod => mod.MapModule)
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
      .then(m => m.TemplatesModule),
      canActivate: [AuthGuard]   
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
      .then(m => m.ProjectsTreeModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: '', 
    loadChildren: () => import('./modules/application/projects/pages/projects-page.module')
      .then(m => m.ProjectsPageModule),
      canActivate: [AuthGuard]    
  },
  { 
    path: 'gantt', 
    loadChildren: () => import('./modules/application/gantt/gantt.module')
      .then(m => m.GanttModule) 
  },
  { 
    path: 'assign', 
    loadChildren: () => import('./modules/application/assign/assign.module')
    .then(m => m.AssignModule) ,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'request-reset', 
    loadChildren: () => import('./modules/general/request-reset/request-reset.module')
    .then(m => m.RequestResetModule)
  },
  { 
    path: 'response-reset', 
    loadChildren: () => import('./modules/general/response-reset/response-reset.module')
    .then(m => m.ResponseResetModule)
  },
  // DOCUMENTATION MODULE
  { 
    path: '', 
    loadChildren: () => import('./modules/application/documentation/documentation.module')
      .then(m => m.DocumentationModule) 
  },
  { 
    path: 'admin',
    component: AdminComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    component: NotFoundComponent 
  }
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
