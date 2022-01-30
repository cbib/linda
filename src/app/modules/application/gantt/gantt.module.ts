import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttComponent } from './gantt.component';
import { NgGanttEditorModule } from 'ng-gantt';

@NgModule({
  declarations: [GanttComponent],
  imports: [
    CommonModule,
    GanttRoutingModule,
    NgGanttEditorModule
  ],
  exports:[GanttComponent]

})
export class GanttModule { }
