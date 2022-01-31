import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-environmental-parameter',
  templateUrl: './environmental-parameter.component.html',
  styleUrls: ['./environmental-parameter.component.css']
})
export class EnvironmentalParameterComponent implements OnInit {
  mode_table:boolean=true
  constructor() { }

  ngOnInit() {
  }

}
