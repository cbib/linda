import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  ObservationUnitFormComponent } from './observation-unit-form.component'

const routes: Routes = [
  { path: '', component:  ObservationUnitFormComponent, children: [] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  ObservationUnitFormRoutingModule { }