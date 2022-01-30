import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiderRoutingModule } from './sider-routing.module';
import { SiderComponent } from './sider.component';

@NgModule({
  declarations: [
    SiderComponent
  ],
  imports: [
    CommonModule,
    SiderRoutingModule
  ],
  exports: [
    SiderComponent
  ],
})
export class SiderModule { }