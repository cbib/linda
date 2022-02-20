import { Component, ViewEncapsulation} from '@angular/core';
import { User } from './models';
import { PersonInterface } from './models/linda/person';

@Component({
  selector: 'app-linda',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
/**
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 */
export class AppComponent {
  title = 'linda';
  currentUser: PersonInterface;
  
}