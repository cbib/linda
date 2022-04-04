import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
  import { MatMenuTrigger } from '@angular/material/menu';
  import { MatPaginator, PageEvent} from '@angular/material/paginator';
  import { MatSort} from '@angular/material/sort'
  import { GlobalService, AlertService, OntologiesService } from '../../../../services';
  import { Router, ActivatedRoute } from '@angular/router';
  import { MatTableDataSource} from '@angular/material/table';
  import { ExperimentalFactorInterface } from 'src/app/models/linda/experimental_factor';
  import { UserInterface } from 'src/app/models/linda/person';
  import { LindaEvent } from 'src/app/models/linda/event';
  import { first } from 'rxjs/operators';
  import { FormGenericComponent } from 'src/app/modules/application/dialogs/form-generic.component'
  import { MatDialog } from '@angular/material/dialog';
  
  @Component({
    selector: 'app-observed-variable-page',
  templateUrl: './observed-variable-page.component.html',
  styleUrls: ['./observed-variable-page.component.css']
  })
  export class ObservedVariablePageComponent implements OnInit {
    @Input('level') level: number;
      @Input('parent_id') parent_id:string;
      @Input('model_id') model_id: string;
      @Input('model_type') model_type: string;
      @Input('model_key') model_key: string;
      @Input('activeTab') activeTab: string;
      @Input('mode') mode: string;
      @Input('role') role: string;
      @Input('group_key') group_key: string;
      @Input('grand_parent_id') grand_parent_id: string;
      
    @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
    
    private currentUser: UserInterface
  
    constructor(        
      public globalService: GlobalService,
      public ontologiesService: OntologiesService,
      private router: Router,
      private alertService: AlertService,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private _cdr: ChangeDetectorRef) { 
      this.route.queryParams.subscribe(
        params => {
            this.level = params['level'];
            this.model_type = params['model_type'];
            this.model_key = params['model_key'];
            this.mode = params['mode'];
            this.parent_id = params['parent_id']
            this.group_key = params['group_key']
            this.role = params['role']
            this.grand_parent_id = params['grand_parent_id']
            
        }
      );
    }
  
    async ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.parent_id)
      //await this.get_vertices()
    }
    ngAfterViewInit() {
      this.route.queryParams.subscribe(params => {
          this.activeTab = params['activeTab'];
          this._cdr.detectChanges()
      });
  }
    changeTab(tab:string){
      this.activeTab=tab
      console.log(this.activeTab)
    }
    get get_parent_id(){
        return this.parent_id
    }
    get get_mode(){
        return this.mode
    }
    get get_model_id(){
        return this.model_id
    }
    get get_model_key(){
        return this.model_key
    }
    get get_role(){
        return this.role
    }
    get get_group_key(){
        return this.group_key
    }
    get_output_from_child(val:any){
      if (val === 'cancel the form'){
        console.log("Cancel form")
      }
      else{
          console.log("Cancel form")
      }
  }
  
  close(){
    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "obs", role: this.role, group_key: this.group_key } });
  
      //this.notify.emit("close_study")
      //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type:'investigation', activeTab: 'assStud', mode: "edit" , role: this.get_role, group_key: this.group_key} });
      // Same as delete project and all childs 
  }
    
    
    
  
  }
  
  