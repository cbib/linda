// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationUnitFormRoutingModule } from './observation-unit-form-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';
// Components
import { ObservationUnitFormComponent } from './observation-unit-form.component';
import { AuthGuard } from '../../../guards/auth.guards';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ObservationUnitFormRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    JoyrideModule.forChild()
  ],
  exports: [
    ObservationUnitFormComponent
  ],
  declarations: [
    ObservationUnitFormComponent
  ],
  entryComponents:[ObservationUnitFormComponent],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    JoyrideService,
    GlobalService
  ],
})

export class ObservationUnitFormModule { }