import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentalDesignRoutingModule } from './experimental-design-routing.module';
import { ExperimentalDesignComponent } from './experimental-design.component';


@NgModule({
  declarations: [ExperimentalDesignComponent],
  imports: [
    CommonModule,
    ExperimentalDesignRoutingModule
  ]
})
export class ExperimentalDesignModule { }
