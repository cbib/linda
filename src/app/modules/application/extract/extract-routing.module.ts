import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractComponent } from './extract.component';

const routes: Routes = [{ path: '', component: ExtractComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractRoutingModule { }
