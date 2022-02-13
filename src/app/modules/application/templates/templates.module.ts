import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { MatTableModule } from '@angular/material/table';
import { AlertService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
import { AlertModule } from '../alert/alert.module';

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MatTableModule,
    FormsModule,
    AlertModule
    
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
