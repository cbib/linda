import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-observation-unit',
  templateUrl: './observation-unit.component.html',
  styleUrls: ['./observation-unit.component.css']
})
export class ObservationUnitComponent implements OnInit {
  mode_table:boolean=true
  constructor() { }

  ngOnInit() {
  }

}
