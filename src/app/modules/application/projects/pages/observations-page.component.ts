import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservationUnitInterface } from 'src/app/models/linda/observation-unit';

@Component({
  selector: 'app-observations-page',
  templateUrl: './observations-page.component.html',
  styleUrls: ['./observations-page.component.css']
})
export class ObservationsPageComponent implements OnInit {
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Input('role') role: string;
  @Input('group_key') group_key: string;
  @Input('grand_parent_id') grand_parent_id: string;

  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  constructor(
    public globalService: GlobalService,
    public ontologiesService: OntologiesService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
        this.mode = params['mode'];
        this.role = params['role']
        this.group_key = params['group_key']
        this.grand_parent_id = params['grand_parent_id']
      }
    );
  }

  ngOnInit() {
    console.warn(this.level)
    console.warn(this.model_type)
    console.warn(this.model_key)
    console.warn(this.mode)
    console.warn(this.parent_id)
    console.warn(this.group_key)
    console.warn(this.role)
    console.warn(this.grand_parent_id)
  }
  get_output_from_child(val: any) {
    if (val === 'cancel the form') {
      console.log("Cancel form")
    }
    else {
      console.log("Cancel form")
    }
  }
  get get_parent_id() {
    return this.parent_id
  }
  get get_grand_parent_id() {
    return this.grand_parent_id
  }
  get get_mode() {
    return this.mode
  }
  get get_model_key() {
    return this.model_key
  }
  get get_role() {
    return this.role
  }
  get get_group_key() {
    return this.group_key
  }
}
