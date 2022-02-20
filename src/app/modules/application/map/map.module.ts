import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    AgmCoreModule.forRoot({

      apiKey: 'AIzaSyBreO7SfrnpTqEWZcvEGTBxYnUUEUGZ_Y4',

      libraries: ['places']

    })
  ]
})
export class MapModule { }
