import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsTreeComponent } from './projects-tree.component';

const routes: Routes = [{ path: '', component: ProjectsTreeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsTreeRoutingModule { }
