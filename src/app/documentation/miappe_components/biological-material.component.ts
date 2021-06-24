import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-biological-material',
  templateUrl: './biological-material.component.html',
  styleUrls: ['./biological-material.component.css']
})
export class BiologicalMaterialComponent implements OnInit {
  mode_table:boolean=true
  constructor() { }

  ngOnInit() {
  }

}
