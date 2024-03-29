// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormRoutingModule } from './form-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';

// Components
import { FormComponent } from './form.component';
import { AuthGuard } from '../../../guards/auth.guards';
import { StudyFormComponent } from './study-form.component';
import { AlertModule } from '../alert/alert.module';


@NgModule({
  imports: [
    CommonModule,
    FormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatBadgeModule,
    AlertModule,
    JoyrideModule.forChild()
  ],
  exports: [
    FormComponent,
    StudyFormComponent
  ],
  declarations: [
    FormComponent,
    StudyFormComponent,
  ],
  entryComponents:[FormComponent, StudyFormComponent],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    JoyrideService,
    GlobalService
  ],
})

export class FormModule { }