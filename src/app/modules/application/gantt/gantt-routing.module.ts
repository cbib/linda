import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GanttComponent } from './gantt.component';

const routes: Routes = [{ path: '', component: GanttComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttRoutingModule { }
