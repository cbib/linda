// Modules and services
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService, AlertService} from '../../../services';
import { UniqueIDValidatorComponent} from './unique-id-validator.component'
import { DateValidatorComponent } from './date-validator.component'
import { EmailvalidatorComponent } from './emailvalidator.component'
 
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
    exports: [
        UniqueIDValidatorComponent,
        DateValidatorComponent,
        EmailvalidatorComponent
    ],
    declarations: [
        UniqueIDValidatorComponent,
        DateValidatorComponent,
        EmailvalidatorComponent
    ],
    providers: [
      AlertService,
      GlobalService
    ],
  })
  
  export class ValidatorModule { }