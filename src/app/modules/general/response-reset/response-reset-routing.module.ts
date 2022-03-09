import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponseResetComponent } from './response-reset.component';

const routes: Routes = [{ path: '', component: ResponseResetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseResetRoutingModule { }
