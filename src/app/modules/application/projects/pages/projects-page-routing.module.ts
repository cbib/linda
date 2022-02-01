import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsPageComponent } from './projects-page.component';
import { ProjectPageComponent } from './project-page.component';

const routes: Routes = [
  { path: '',children: [
                        { path: 'projects_page',component: ProjectsPageComponent},
                        { path: '',redirectTo: "projects_page",pathMatch: "full"},
                        { path: "project_page",component: ProjectPageComponent}
                       ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsPageRoutingModule { }
