import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';
import { StudyFormComponent } from './study-form.component';

const routes: Routes = [
  { path: '', component: FormComponent, children: [] },
  //{ path: '', component: StudyFormComponent, children: [] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
