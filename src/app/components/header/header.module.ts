import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderRoutingModule } from './header-routing.module';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { HeaderComponent } from './header.component';
import { SearchService } from 'src/app/services';
import { SearchResultComponent } from 'src/app/modules/application/dialogs/search-result.component';
@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HeaderRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    SearchService
  ]
  , entryComponents: [
    SearchResultComponent
  ]
  
})
export class HeaderModule { }
