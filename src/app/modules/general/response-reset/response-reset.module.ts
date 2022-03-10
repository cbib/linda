import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseResetRoutingModule } from './response-reset-routing.module';
import { ResponseResetComponent } from './response-reset.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ResponseResetComponent],
  imports: [
    CommonModule,
    ResponseResetRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ResponseResetComponent
  ]
})
export class ResponseResetModule { }
