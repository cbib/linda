// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFormRoutingModule } from './material-form-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';
// Components
import { MaterialFormComponent } from './material-form.component';
import { AuthGuard } from '../../../guards/auth.guards';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialFormRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    JoyrideModule.forChild()
  ],
  exports: [
    MaterialFormComponent
  ],
  declarations: [
    MaterialFormComponent
  ],
  entryComponents:[MaterialFormComponent],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    JoyrideService,
    GlobalService
  ],
})

export class MaterialFormModule { }