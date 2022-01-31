import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experimental-factor',
  templateUrl: './experimental-factor.component.html',
  styleUrls: ['./experimental-factor.component.css']
})
export class ExperimentalFactorComponent implements OnInit {
  mode_table:boolean=true
  constructor() { }

  ngOnInit() {
  }

}
