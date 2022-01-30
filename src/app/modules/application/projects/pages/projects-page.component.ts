import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter } from '@angular/core';
  import { SelectionModel } from '@angular/cdk/collections';
  import { GlobalService, AlertService, FileService, SearchService, UserService } from '../../../../services';
  import { WizardService } from '../services/wizard.service';
  import { MiappeNode } from '../../../../models';
  import { Router, ActivatedRoute } from '@angular/router';
  import { MatDialog } from '@angular/material/dialog';
  import { MatChip, MatMenuTrigger } from '@angular/material';
  import { MediaObserver } from "@angular/flex-layout";
  import {MatPaginator, PageEvent} from '@angular/material/paginator';
  
  @Component({
    selector: 'app-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css']
  })
  export class ProjectsPageComponent implements OnInit {
  
      @Input() search_string: string;
      @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
      @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
      ///@ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>
      @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  
      contextMenuPosition = { x: '0px', y: '0px' };
      userMenuPosition = { x: '0px', y: '0px' };
      userMenusecondPosition = { x: '0px', y: '0px' };
      investigationMenuPosition = { x: '0px', y: '0px' };
      helpMenuPosition = { x: '0px', y: '0px' };
  
      // public statistics: {};
      private displayed = false;
      loaded:boolean=false
      private currentUser
      private multiple_selection: boolean = false;
      private parent_key: string;
      private parent_id: string;
      private model_key: string;
      private model_selected: string
      public vertices: any = []
      public projects: any  = []
      startTime: Date;
      endTime: Date;
      timeDiff: number;
      dataTable: any;
      dtOptions: DataTables.Settings = {};
      tableData = [];
  
      constructor(
          private globalService: GlobalService,
          private searchService: SearchService,
          private userService: UserService,
          private router: Router,
          private alertService: AlertService,
          private wizardService: WizardService,
          private route: ActivatedRoute,
          public media: MediaObserver,
          public dialog: MatDialog
      ) {
          // this.route.queryParams.subscribe(
          //     params => {
          //         this.parent_key = params['key'];
          //     }
          // );
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }
      
      private initialSelection = []
      private checklistSelection = new SelectionModel<MatChip>(true, this.initialSelection /* multiple */);
  
      public handlePageBottom(event: PageEvent) {
          this.paginator.pageSize = event.pageSize;
          this.paginator.pageIndex = event.pageIndex;
          this.paginator.page.emit(event);
      }
      async ngOnInit() {
          
          await this.get_vertices()
          this.get_projects()
  
          this.loaded=true
  
  
          this.searchService.getData().subscribe(data => {
              ////console.log(data);
              //this.search_string=data
          })
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          console.log(this.currentUser)
          //this.wizardService.onClickTour(this.vertices, this.currentUser)
  
      }
      async get_vertices() {
          let user = JSON.parse(localStorage.getItem('currentUser'));
          //////console.log(user)
          this.start();
          return this.globalService.get_all_vertices(user._key).toPromise().then(
          //return this.globalService.get_all_vertices(user._key).subscribe(
              data => {
                  console.log(data)
                  this.end()
                  this.vertices = data;
              }
          )
      }
      play_again(){
          this.wizardService.play_again(this.vertices, this.currentUser)
      }
      turn_off(){
          this.wizardService.turn_off(this.currentUser)
      }
      onDone(){
          this.wizardService.onDone(false,this.currentUser ,this.vertices)
      }
      onClickTour(replay:boolean, level:string){
          this.wizardService.onClickTour(this.vertices, this.currentUser, replay, level)
      }
      get get_displayed(){
          return this.displayed
      }
      get get_multiple_selection(){
          return this.multiple_selection
      }
      get get_checklist_selection(){
          return this.checklistSelection
      }
      selectedProjectChip(elem){
        console.warn("a project has been selected")
        console.warn(elem)
      }  
      get_projects(){
          var cpt = 0;
          console.log(this.vertices)
          let selected = [this.currentUser['_id']];
          let res = this.vertices.filter(({
              e
              }) => selected.includes(e['_from'])
          );
  
          console.log(res)
          res.forEach(
              r =>{
                  let project_id=r['s']['vertices'][1]["Investigation unique ID"]
                  let short_name=r['s']['vertices'][1]["Short title"]
                  this.projects.push({"project_short_name":short_name,"project_id":project_id,"project_parent_id":this.currentUser['_id']})
              }
          );
          
  
  
  
          /* this.vertices.forEach(
              e => {
                  var _from: string;
                  var _to: string;
  
                  _from = e["e"]["_from"]
                  _to = e["e"]["_to"]
                  
                  var vertices: [] = e["s"]["vertices"]
                  
                  var parent_id:string = e["e"]["_from"]
                  var percent = 0.0
                  var short_name = ""
                  vertices.forEach(
                      vertice => {
                          if (vertice['_id'] === _to) {
                              var vertice_keys = Object.keys(vertice)
                              var total = 0
                              for (var i = 0; i < vertice_keys.length; i++) {
                                  if (vertice[vertice_keys[i]] !== "") {
                                      total += 1
                                  }
                              }
                              percent = Math.round(100 * ((total - 3) / (vertice_keys.length - 3)))
                              short_name = vertice['Short title']
                          }
                      }
                  )
                  if (short_name === "" || short_name === undefined) {
                      short_name = _to
                  }
                  ////console.log(vertice_data)
                  ////console.log(vertice_data_keys)
  
                  var vertice_data= vertices.filter(component => component['_id'] == _to)[0]
                  var vertice_data_keys = Object.keys(vertice_data).filter(component => !component.startsWith("_"))
                  
                  if (parent_id.includes("users")) {
                          this.projects.push({"project_short_name":short_name,"project_id":_to,"project_parent_id":parent_id, "vertice_data":vertice_data})
                  }
                  cpt += 1
              }
          ) */
      }
      get get_tutorial_done(){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          return this.currentUser['tutoriel_done']
      }
      get get_tutoriel_level(){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          return this.currentUser['tutoriel_step']
      }
      get get_model_selected() {
          if (this.model_selected === undefined) {
              return ""
          }
          else {
              return this.model_selected;
  
          }
      }
   
      activate_multiple_selection(val: boolean) {
          this.multiple_selection = val;
          var selected_set = this.checklistSelection.selected
      }
      
      onNext(node:string) {
          ////console.log(node)
      }
      start() {
          this.startTime = new Date();
      };
      end() {
          this.endTime = new Date();
          this.timeDiff = this.endTime.valueOf() - this.startTime.valueOf();
          this.timeDiff = this.timeDiff / 1000.0;
          ////console.log("Elapsed time :" + this.timeDiff+ " seconds")
      
          // get seconds 
          var seconds = Math.round(this.timeDiff);
          ////console.log(seconds + " seconds");
      } 
      onExperimental_design(node){
          this.router.navigate(['/design'])
      }
      
      
      
     
  
      reloadCurrentRoute() {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/projects_tree', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
          });
      }
      reloadComponent(path:[string]) {
          let currentUrl = this.router.url;
          ////console.log(currentUrl)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(path);
      }
      onRemove() {
        this.reloadComponent(['/projects'])
      }
      
     
      
      add(model_type: string, template: string) {
      }  
      identify() {
          ////console.log('Hello, Im user tree!');
      }
      isArray(obj : any ){
          return Array.isArray(obj)
      }
  
      show_info() {
          this.displayed=true
      }
      getStyle(node: MiappeNode): Object {
  
          if (node.id.includes('Investigations tree')) {
  
              return { backgroundColor: 'white', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (node.id.includes('studies')) {
  
              return { backgroundColor: '#b6b6b6', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (node.id.includes('investigations')) {
  
              return { backgroundColor: 'lightblue', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          
          else if (node.id.includes('events')) {
  
              return { backgroundColor: 'lightcoral', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (node.id.includes('metadata')) {
  
              return { backgroundColor: 'OldLace', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (node.id.includes('observed')) {
  
              return { backgroundColor: '#2E8B57', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
  
          else if (node.id.includes('biological_materials')) {
  
              return { backgroundColor: '#72bcd4', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (node.id.includes('observation_units')) {
  
              return { backgroundColor: '#FF7F50', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else {
              return { backgroundColor: 'LightSteelBlue', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
      }
  
      getIconStyle(key: string): Object {
          if (key.includes('study')) {
  
              return { backgroundColor: '#b6b6b6','border-radius': '4px',  'float': 'left' }
          }
          else if (key.includes('event')) {
  
              return { backgroundColor: 'lightcoral', 'border-radius': '4px', 'float': 'left' }
          }
          else if (key.includes('observed_variable')) {
  
              return { backgroundColor: '#2E8B57','border-radius': '4px', 'float': 'left' }
          }
          else if (key.includes('material')) {
  
              return { backgroundColor: '#72bcd4', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
          }
          else if (key.includes('biological_material')) {
  
              return { backgroundColor: 'LightBlue','border-radius': '4px','float': 'left'}
          }
          else if (key.includes('observation_unit')) {
  
              return { backgroundColor: '#FF7F50', 'border-radius': '4px', 'float': 'left' }
          }
          else {
              return { backgroundColor: 'LightSteelBlue', 'border-radius': '4px',  'float': 'left' }
          }
      }
  }