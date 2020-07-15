import { Component, Input } from '@angular/core';

import { AdComponent }      from './ad.component';

@Component({
  template: `
    <div class="job-ad">
      
    <!--<mat-card style="height: 350px">-->
            <h4>{{data.headline}}</h4>
          <a href={{data.link}}>
            <img style="width:50%;height:50%" src="{{data.body}}">
          </a>

      <!--</mat-card>-->
    </div>
  `
})
export class PubAdComponent implements AdComponent {
  @Input() data: any;

}