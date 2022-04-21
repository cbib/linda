import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component';
import { StudyPageComponent } from './study-page.component'
import { ExperimentalFactorPageComponent } from './experimental-factor-page.component';
import { EventPageComponent } from './event-page.component';
import { ObservedVariablePageComponent } from './observed-variable-page.component';
import { EnvironmentVariablePageComponent } from './environment-variable-page.component';
import { DataFilePageComponent } from './data-file-page.component';
import { ExperimentalDesignPageComponent } from './experimental-design-page.component';

const routes: Routes = [
  { path: '',children: [
                        { path: 'projects_page',component: ProjectsPageComponent},
                        { path: '',redirectTo: "projects_page",pathMatch: "full"},
                        { path: "project_page",component: ProjectPageComponent},
                        { path: "study_page",component: StudyPageComponent},
                        { path: "experimental_factor_page",component: ExperimentalFactorPageComponent},
                        { path: "event_page",component: EventPageComponent},
                        { path: "observed_variable_page",component: ObservedVariablePageComponent},
                        { path: "environmental_variable_page",component: EnvironmentVariablePageComponent},
                        { path: "data_file_page",component: DataFilePageComponent}  ,
                        { path: "experimental_design_page",component: ExperimentalDesignPageComponent}   
                       ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsPageRoutingModule { }
