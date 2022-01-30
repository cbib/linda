import { Component, OnInit } from '@angular/core';
import { FormControl,ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-emailvalidator',
  templateUrl: './emailvalidator.component.html',
  styleUrls: ['./emailvalidator.component.css']
})
export class EmailvalidatorComponent implements OnInit {
  validateEmailDomain: any;
  constructor() { }

  ngOnInit() :void{
      this.validateEmailDomain = (control: FormControl) => {
      // you have the control here and you can call any exported method like validateEmailDomain(control: AbstractControl, globalVar: GlobalVarService)
      if (!JSON.stringify(control.value).endsWith(".eu")) {
          return { response: true };
      }
      return null;
  }
}
}