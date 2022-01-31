import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-observed-variable',
  templateUrl: './observed-variable.component.html',
  styleUrls: ['./observed-variable.component.css']
})
export class ObservedVariableComponent implements OnInit {
  mode_table:boolean=true
  constructor() { }

  ngOnInit() {
  }

}
