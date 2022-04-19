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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataTablesModule } from 'angular-datatables';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { CustomTooltip } from './custom-tooltip.component';

//import 'ag-grid-enterprise';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialFormRoutingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    DataTablesModule,
    AgGridModule.withComponents([CustomTooltip]),
    JoyrideModule.forChild()
  ],
  exports: [
    MaterialFormComponent
  ],
  declarations: [
    MaterialFormComponent,
    CustomTooltip
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