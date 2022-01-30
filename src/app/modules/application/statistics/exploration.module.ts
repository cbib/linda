import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorationRoutingModule } from './exploration-routing.module';
import { ExplorationComponent } from './exploration.component';
import { StatisticsService } from './statistics.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({
  declarations: [ExplorationComponent],
  imports: [
    CommonModule,
    ExplorationRoutingModule,
    MatCardModule,
    FormsModule,
    MatButtonToggleModule,
    NgxChartsModule
  ],
  providers: [
    StatisticsService
  ],
  exports: [
    ExplorationComponent
  ]
})
export class ExplorationModule { }
