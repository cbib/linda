import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    JoyrideModule.forChild(),

  ],
  exports: [
    AboutComponent
  ],
  declarations: [
    AboutComponent
  ],
  providers: [
  ],
})
export class AboutModule { }


