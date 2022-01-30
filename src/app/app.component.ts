import { Component, ViewEncapsulation} from '@angular/core';
import { User } from './models';

@Component({
  selector: 'app-linda',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'linda';
  currentUser: User;
  
}