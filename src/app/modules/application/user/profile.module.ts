import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AlertService, UserService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [ProfileComponent, UserComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  exports: [
    ProfileComponent,
    UserComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    UserService
  ]
})
export class ProfileModule { }
