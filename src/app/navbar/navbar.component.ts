import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() max_level; 
  @Input() parent_id; 
  @Input() model_type:string;
  @Input() model_key:string;
  @Input() mode:string;
  @Input() levels : number[];
  constructor() {}
  ngOnInit() {}

}
