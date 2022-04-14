// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRoutingModule } from './table-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { GlobalService, AlertService, UserService} from '../../../services';

// Components
import { TableComponent } from './table.component';
import { ObservationUnitTableComponent } from './observation-unit-table.component';
import { BiologicalMaterialTableComponent } from './biological-material-table.component';
import { AuthGuard } from '../../../guards/auth.guards';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    TableRoutingModule,
    MatMenuModule,
    MatCardModule, 
    JoyrideModule.forChild()
  ],
  exports: [
    TableComponent,
    BiologicalMaterialTableComponent,
    ObservationUnitTableComponent
  ],
  declarations: [
    TableComponent,
    BiologicalMaterialTableComponent,
    ObservationUnitTableComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    JoyrideService,
    GlobalService
  ],
})

export class TablesModule { }