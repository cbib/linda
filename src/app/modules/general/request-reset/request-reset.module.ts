import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestResetRoutingModule } from './request-reset-routing.module';
import { RequestResetComponent } from './request-reset.component';
import { AuthenticationService } from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
@NgModule({
  declarations: [RequestResetComponent],
  imports: [
    CommonModule,
    RequestResetRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RequestResetComponent
  ],
  providers: [
    AuthGuard,
    AuthenticationService
  ],
})
export class RequestResetModule { }
