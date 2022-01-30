import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { MatTableModule } from '@angular/material/table';
import { AlertService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MatTableModule
    
  ],
  exports: [
    TemplatesComponent
  ],
  providers: [
    AuthGuard,
    AlertService
  ]

})
export class TemplatesModule { }
