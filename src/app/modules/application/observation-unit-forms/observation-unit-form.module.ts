// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationUnitFormRoutingModule } from './observation-unit-form-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';
// Components
import { ObservationUnitFormComponent } from './observation-unit-form.component';
import { AuthGuard } from '../../../guards/auth.guards';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ObservationUnitFormRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
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