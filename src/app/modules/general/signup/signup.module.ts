import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { GlobalService, AlertService, UserService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    SignupComponent
  ],
  declarations: [
    SignupComponent
  ],
  providers: [
    AlertService,
    UserService,
    GlobalService
  ],
})
export class SignupModule { }