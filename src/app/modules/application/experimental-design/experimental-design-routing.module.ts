import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperimentalDesignComponent } from './experimental-design.component';

const routes: Routes = [{ path: '', component: ExperimentalDesignComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperimentalDesignRoutingModule { }
