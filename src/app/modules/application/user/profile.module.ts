import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AlertService, UserService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
import { PersonComponent } from './person.component';

@NgModule({
  declarations: [ProfileComponent, PersonComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  exports: [
    ProfileComponent,
    PersonComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    UserService
  ],
  entryComponents: [
    PersonComponent
  ]
})
export class ProfileModule { }
