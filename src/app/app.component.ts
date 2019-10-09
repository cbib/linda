import { Component,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-linda',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'LINDA';
  selected="Home";
  
}
