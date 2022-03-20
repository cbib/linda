import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component';
import { StudyPageComponent } from './study-page.component'
import { ExperimentalFactorPageComponent } from './experimental-factor-page.component';
import { EventPageComponent } from './event-page.component';

const routes: Routes = [
  { path: '',children: [
                        { path: 'projects_page',component: ProjectsPageComponent},
                        { path: '',redirectTo: "projects_page",pathMatch: "full"},
                        { path: "project_page",component: ProjectPageComponent},
                        { path: "study_page",component: StudyPageComponent},
                        { path: "experimental_factor_page",component: ExperimentalFactorPageComponent},
                        { path: "event_page",component: EventPageComponent}    
                       ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsPageRoutingModule { }
