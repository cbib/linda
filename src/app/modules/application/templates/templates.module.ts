import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { MatTableModule } from '@angular/material/table';
import { AlertService} from '../../../services';
import { AuthGuard } from '../../../guards/auth.guards';
import { AlertModule } from '../alert/alert.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MatTableModule,
    FormsModule,
    AlertModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
    
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
