import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AlertService, UserService, GlobalService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
import { PersonComponent } from './person.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule} from '@angular/material/list'; 
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '../dialogs/dialog.module';


@NgModule({
  declarations: [ProfileComponent, PersonComponent, MessageComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    DialogModule
  ],
  exports: [
    ProfileComponent,
    PersonComponent,
    MessageComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    GlobalService
  ],
  entryComponents: [
    PersonComponent,
    MessageComponent
  ]
})
export class ProfileModule { }
