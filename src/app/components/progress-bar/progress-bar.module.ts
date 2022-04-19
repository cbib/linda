import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { ProgressBarComponent } from './progress-bar.component';
import { ProgressBarRoutingModule } from './progress-bar-routing.module';
@NgModule({
  declarations: [
    ProgressBarComponent
  ],
  imports: [
    ProgressBarRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ProgressBarComponent
  ],
  providers: [
  ]
  , entryComponents: [
    ProgressBarComponent
  ]
  
})
export class ProgressBarModule { }
