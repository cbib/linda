import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './table.component';
import { ObservationUnitTableComponent } from './observation-unit-table.component';
import { BiologicalMaterialTableComponent } from './biological-material-table.component';

const routes: Routes = [
  { path: '', component: TableComponent, children: [] },
  { path: 'biologicalmaterialtable', component: BiologicalMaterialTableComponent, children: [] },
  { path: 'Observationunittable', component: ObservationUnitTableComponent, children: [] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule { }