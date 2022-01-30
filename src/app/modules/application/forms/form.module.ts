// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormRoutingModule } from './form-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';

// Components
import { FormComponent } from './form.component';
import { AuthGuard } from '../../../guards/auth.guards';


@NgModule({
  imports: [
    CommonModule,
    FormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    JoyrideModule.forChild()
  ],
  exports: [
    FormComponent
  ],
  declarations: [
    FormComponent
  ],
  entryComponents:[FormComponent],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    JoyrideService,
    GlobalService
  ],
})

export class FormModule { }