import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, Input, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { GlobalService, AlertService, FileService, SearchService } from '../../../../services';
import { WizardService } from '../services/wizard.service';
import { MiappeNode, User } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { first } from 'rxjs/operators';
import { MediaObserver } from "@angular/flex-layout";
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
  //DIALOGS
  import { ConfirmationComponent } from '../../dialogs/confirmation.component';
  import { TemplateSelectionComponent } from '../../dialogs/template-selection.component';
  import { ExportComponent } from '../../dialogs/export.component';
  import { DatatableComponent } from '../../dialogs/datatable.component';
  
  //MODELS
  import { BiologicalMaterialTableModel} from '../../../../models/biological_material_models'
  import { ObservationUnitTableModel} from '../../../../models/observation_unit_models'
  import { MiappeFlatNode } from '../../../../models/miappe_flat_node'
import { PersonInterface } from 'src/app/models/linda/person';
  
  const ELEMENT_BM_DATA: BiologicalMaterialTableModel[] = []
  
  @Component({
    selector: 'app-projects-tree',
    templateUrl: './projects-tree.component.html',
    styleUrls: ['./projects-tree.component.css']
  })
  export class ProjectsTreeComponent implements OnInit {
  
      @Input() search_string: string;
      @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
      @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
      @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
      ///@ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>
      @ViewChild('biologicalMaterialDataTable', {static: false}) table;
      @Output() notify: EventEmitter<string> = new EventEmitter<string>();
      panelOpenState = false;
      contextMenuPosition = { x: '0px', y: '0px' };
      userMenuPosition = { x: '0px', y: '0px' };
      userMenusecondPosition = { x: '0px', y: '0px' };
      investigationMenuPosition = { x: '0px', y: '0px' };
      helpMenuPosition = { x: '0px', y: '0px' };
      private nodes: MiappeNode[]
      // public statistics: {};
      private displayed = false;
      loaded:boolean=false
      private currentUser : PersonInterface
      private active_node: MiappeNode;
      private current_data_keys = []
      private current_data_array = []
      private current_data_file_keys = []
      private current_data_file_array = []
      private multiple_selection: boolean = false;
      private parent_key: string;
      private parent_id: string;
      private model_key: string;
      private model_selected: string
      nodekey: any;
      private biological_materials = []
      private experimental_factors = []
      private samples = []
      private obs_unit_data = []
      private bm_datatables = {}
      private observation_id = ""
      private biological_material_id = ""
      public vertices: any = []
      public projects: any  = []
      startTime: Date;
      endTime: Date;
      timeDiff: number;
  
      dataTable: any;
      dtOptions: DataTables.Settings = {};
      tableData = [];
      private bm_datasources:{} = {}
      private ou_datasources:{} = {}
  
      constructor(
          private globalService: GlobalService,
          private fileService: FileService,
          private searchService: SearchService,
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
      private ont_transformer = (node: MiappeNode, level: number) => {
          return {
              expandable: !!node.get_children() && node.get_children().length > 0,
              name: node.name,
              def: node.def,
              id: node.id,
              fill_percentage: node.fill_percentage,
              term: node,
              level: level,
          };
      }
  
      private treeControl = new FlatTreeControl<MiappeFlatNode>(node => node.level, node => node.expandable);
      private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.get_children());
      private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      private initialSelection = []
      private checklistSelection = new SelectionModel<MiappeFlatNode>(true, this.initialSelection /* multiple */);
  
      public handlePageBottom(event: PageEvent) {
          this.paginator.pageSize = event.pageSize;
          this.paginator.pageIndex = event.pageIndex;
          this.paginator.page.emit(event);
      }
      async ngOnInit() {
         this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          //console.log(this.currentUser)
          await this.get_vertices()
          this.get_projects()
          // this.dtOptions = {
          //     pagingType: 'full_numbers',
          //     pageLength: 5,
          //     processing: true
          //   };
          this.nodes = []
          this.nodes = this.build_hierarchy(this.vertices)
          //////console.log(this.nodes.length)
          //this.nodes[0].get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
          this.sort_nodes(this.nodes[0])
          this.dataSource.data = this.nodes
          // //console.log(this.dataSource.data)
          // this.treeControl.expand()
          this.treeControl.expandAll();
          // //console.log(this.treeControl.dataNodes[4])
          // //console.log(this.treeControl.getLevel(this.treeControl.dataNodes[4]))
          // //console.log(this.treeControl.dataNodes)
          // this.treeControl.expandDescendants(this.treeControl.dataNodes[4])
          var descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[0])
          //this.treeControl.expandDescendants(this.treeControl.dataNodes[0])
          this.treeControl.expand(this.treeControl.dataNodes[0])
          this.loaded=true
          // if (this.treeControl.getLevel(descendants[d]) === 1) {
          //   //console.log(descendants[d].name)
          // this.treeControl.expand(descendants[d])
          // this.treeControl.expandDescendants(descendants[d])
          // }
          // if (this.treeControl.getLevel(descendants[d])===2){
          //    //console.log(descendants[d]['term']['children'])
          //    this.treeControl.expand(descendants[d])
          //    descendants[d]['term']['children'].sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]));
          //    //console.log(test)
          // }
  
  
          // }
          //this.treeControl.expand(this.treeControl.dataNodes[0]);
          
  
          this.searchService.getData().subscribe(data => {
              //////console.log(data);
              //this.search_string=data
          })
          
          this.wizardService.onClickTour(this.vertices, this.currentUser)
          //this.onClickTour()
      }
      async get_vertices() {
          let user = JSON.parse(localStorage.getItem('currentUser'));
          ////////console.log(user)
          this.start();
          return this.globalService.get_all_vertices(user._key).toPromise().then(
          //return this.globalService.get_all_vertices(user._key).subscribe(
              data => {
                  this.end()
                  this.vertices = data;
              }
          )
      }
      build_hierarchy(edges: []): MiappeNode[] {
          //////console.log(edges)
          var cpt = 0;
          var tmp_nodes = []
          tmp_nodes.push(new MiappeNode("Investigations tree", "Investigations tree", "", 0))
          edges.forEach(
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
                              if (parent_id.includes('investigation')){
                                short_name = vertice['Project Name']
                              }
                              else{
                                short_name = vertice['Study Name']
                              }
                          }
                      }
                  )
                  if (short_name === "" || short_name === undefined) {
                      short_name = _to
                  }
  
                  var vertice_data= vertices.filter(component => component['_id'] == _to)[0]
                  var vertice_data_keys = Object.keys(vertice_data).filter(component => !component.startsWith("_"))
                  var bm_vertice_data:{}[]=[]
                  if (_to.includes("biological_material")){
                      // var bm_vertice= vertices.filter(component => component['_id'] == _to)
                      // var bm_vertice_data_keys = Object.keys(bm_vertice).filter(component => !component.startsWith("_"))
                      //////console.log(bm_vertice)
                      bm_vertice_data=this.prepare_bm_data(vertice_data, vertice_data_keys)
                      vertice_data_keys=Object.keys(bm_vertice_data[0])
                      //this.bm_datatables[_to]=bm_vertice
                      //////console.log(this.bm_datatables)
                  }
                  if (_to.includes("observation_unit")){
                      this.prepare_ou_data(vertice_data, vertice_data_keys)
                  }
                  //////console.log(vertice_data)
                  //////console.log(vertice_data_keys)
                  if (parent_id.includes("persons")) {
                      if (cpt === 0) {
                          tmp_nodes[0].add_children(new MiappeNode(_to, short_name, "", percent, parent_id, vertice_data_keys, vertice_data, bm_vertice_data))
                      }
                      else {
                          tmp_nodes[0].add_children(new MiappeNode(_to, short_name, "", percent, parent_id, vertice_data_keys, vertice_data, bm_vertice_data))
                      }
                  }
                  else {
                      this.searchTerm(tmp_nodes, parent_id).add_children(new MiappeNode(_to, short_name, "", percent, parent_id, vertice_data_keys, vertice_data, bm_vertice_data))
                  }
                  cpt += 1
              }
          )
          ///////console.log(tmp_nodes)
          return tmp_nodes;
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
      sort_nodes(node: MiappeNode) {
          if (node.has_child) {
              node.get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
              node.get_children().forEach(node => {
                  if (node.has_child) {
                      this.sort_nodes(node)
                      //node.get_children().sort((a, b) => a.name.split("/")[0].localeCompare(b.name.split("/")[0]))
                  }
              })
          }
  
      }
      get_projects(){
          let selected = [this.currentUser['_id']];
          let res = this.vertices.filter(({
              e
              }) => selected.includes(e['_from'])
          );  
          res.forEach(
              r =>{
                  let project_id=r['s']['vertices'][1]["Investigation unique ID"]
                  let short_name=r['s']['vertices'][1]["Project Name"]
                  this.projects.push({"project_short_name":short_name,"project_id":project_id,"project_parent_id":this.currentUser['_id']})
              }
          );
      }
      get get_tutorial_done(){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          //////console.log(this.currentUser['tutoriel_done'])
          return this.currentUser['tutoriel_done']
      }
      get get_tutoriel_level(){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          return this.currentUser['tutoriel_step']
      }
      get get_dataSource() {
          return this.dataSource;
      }
      get get_treeControl() {
          return this.treeControl;
      }
      get get_model_selected() {
          if (this.model_selected === undefined) {
              return ""
          }
          else {
              return this.model_selected;
  
          }
      }
      get get_bm_field() {
          return Object.keys(this.biological_materials[0]);
      }
      get get_ef_field() {
          return Object.keys(this.experimental_factors[0]);
      }
      get get_sample_field() {
          return Object.keys(this.samples[0]);
      }
      get get_ou_field() {
          return Object.keys(this.obs_unit_data[0]);
      }
      activate_multiple_selection(val: boolean) {
          this.multiple_selection = val;
          var selected_set = this.checklistSelection.selected
      }
      expandNode() {
          //////console.log(this.treeControl.dataNodes[3])
          this.treeControl.expand(this.treeControl.dataNodes[3]);
      }
      onContextMenu(event: MouseEvent, node: MiappeNode) {
          this.active_node = node
          event.preventDefault();
          //        this.contextMenuPosition.x = event.clientX + 'px';
          //        this.contextMenuPosition.y = event.clientY + 'px';
          //        this.contextMenu.menuData = { 'node': node };
          //        this.contextMenu.openMenu();
          //this.contextMenu.openMenu();
      }
      onClick(node: MiappeNode) {
          this.active_node = node
          //////console.log(node.id)
          // if (node.id == "Investigations tree"){
          //     this.userMenu.openMenu();
          //     this.userMenusecond.openMenu();
          // }
          
          // if (node.id.split('/')[0]== "investigations"){
          //     this.investigationMenu.openMenu();
          // }
          //this.userMenusecond.openMenu();
      }
      onNext(node:string) {
          //////console.log(node)
      }
      start() {
          this.startTime = new Date();
      };
      end() {
          this.endTime = new Date();
          this.timeDiff = this.endTime.valueOf() - this.startTime.valueOf();
          this.timeDiff = this.timeDiff / 1000.0;
          //////console.log("Elapsed time :" + this.timeDiff+ " seconds")
      
          // get seconds 
          var seconds = Math.round(this.timeDiff);
          //////console.log(seconds + " seconds");
      } 
      onExperimental_design(node){
          this.router.navigate(['/design'])
      }
      onExport(node: MiappeNode) {
          var model_type = this.globalService.get_model_type(node.id)
          this.globalService.get_parent(node.id).toPromise().then(parent_data => {
              var is_investigation = parent_data["_from"].includes("users")
              const dialogRef = this.dialog.open(ExportComponent, { width: '500px', data: { expandable: node.expandable, is_investigation: is_investigation } });
              dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                      if (result.event == 'Confirmed') {
                          //var selected_format=result.selected_format
                          //var recursive_check=result.recursive_check
                          //var model_id=node.id
                          var collection_name = node.id.split("/")[0];
                          var model_key = node.id.split("/")[1];
                          this.globalService.get_by_key(model_key, model_type).toPromise().then(model_data => {
                              //Parse in a recursive way all submodels
                              if ((node.expandable) && (result.recursive_check)) {
                                  this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                                      this.fileService.saveFiles(model_data, submodel_data, collection_name, node.id, result.selected_format);
                                  });
                              }
                              else {
                                  this.fileService.saveFile(model_data, node.id, model_type, result.selected_format);
                              }
                          });
                      }
                  }
              })
          });
      }
      onExplore(node: MiappeNode){
          //////console.log("you are gonna explore your data !!")
          this.router.navigate(['/explore'], { queryParams: {parent_id: node.id} })
      }
      onExportIsa(node: MiappeNode) {
          var model_type = this.globalService.get_model_type(node.id)
          var model_key = node.id.split("/")[1];
          var model_id = node.id
          var collection_name = node.id.split("/")[0];
          this.globalService.get_by_key(model_key, model_type).toPromise().then(model_data => {
              //Parse in a recursive way all submodels
              var isa_model = "investigation_isa"
              this.globalService.get_model(model_type).toPromise().then(model => {
                  this.globalService.get_all_childs_by_model(collection_name, model_key).toPromise().then(submodel_data => {
                      this.globalService.get_model(isa_model).toPromise().then(isa_model => {
                          this.fileService.saveISA(model_data, submodel_data, model_type, collection_name, model_id, isa_model, model);
                      });
                  });
              });
          });
      }
      onEdit(node: MiappeNode) {
          this.active_node = node
          var model_key = this.active_node.id.split("/")[1];
          var model_type = this.globalService.get_model_type(this.active_node.id)
          if (model_type != "") {
              this.globalService.get_parent(this.active_node.id).toPromise().then(
                  data => {
                      if (model_type == "metadata_file") {
                          this.router.navigate(['/download'], { queryParams: { parent_id: data._from, model_key: model_key, model_type: "metadata_file", mode: "edit" } });
                      }
                      else if (model_type == "data_file"){
                          this.router.navigate(['/download'], { queryParams: { parent_id: data._from, model_key: model_key, model_type: "data_file", mode: "edit-data" } });
                      }
                      else {
                          if (model_type === "biological_material") {
                              this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: data._from, model_key: model_key, model_type: model_type, mode: "edit" } });
                          }
                          else if (model_type === "observation_unit") {
                              this.router.navigate(['/Observationunitform'], { queryParams: { level: "1", parent_id: data._from, model_key: model_key, model_type: model_type, mode: "edit" } });
                          }
                          else {
                              this.router.navigate(['/generic_form'], { queryParams: { level: "1", parent_id: data._from, model_key: model_key, model_type: model_type, mode: "edit" , inline:"false", asTemplate:false, onlyTemplate:false}, skipLocationChange: true});
  
                          }
                      }
                  }
              )
          }
          else {
              this.alertService.error("this node is not editable ");
          }
      }
      remove_selected(node: MiappeFlatNode) {
          ////////console.log(node)
          //var descendants = this.treeControl.getDescendants(node);
          //var descAllSelected = descendants.every(child =>this.checklistSelection.isSelected(child));                                
          //var selected_set=this.checklistSelection._selection
          var selected_set = this.checklistSelection.selected
          //////console.log(selected_set)
          //        //////console.log(set.entries())
          var to_be_remove = []
          selected_set.forEach(function (value) {
  
              var test: MiappeNode = value["term"];
              //this.onRemove(test)
              //////console.log(test)
              to_be_remove.push(test.id)
  
          });
          //////console.log(to_be_remove)
          for (var i = 0; i < to_be_remove.length; i++) {
              //////console.log(to_be_remove[i].split("/")[0])
              if (to_be_remove[i].split("/")[0] === "observation_units") {
                  this.globalService.remove_observation_unit(to_be_remove[i]).pipe(first()).toPromise().then(
                      data => {
                          if (data["success"]) {
                              //////console.log(data["message"])
                          }
                          else {
                              this.alertService.error("this form contains errors! " + data["message"]);
                          }
                      }
                  );
              }
              else {
                  this.globalService.remove(to_be_remove[i]).pipe(first()).toPromise().then(
                      data => {
                          if (data["success"]) {
                              //////console.log(data["message"])
                          }
                          else {
                              this.alertService.error("this form contains errors! " + data["message"]);
                          }
                      }
                  );
              }
          }
          //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
          this.reloadComponent(['/projects_tree'])
      }
      reloadCurrentRoute() {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/projects_tree', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
          });
      }
      reloadComponent(path:[string]) {
          let currentUrl = this.router.url;
          //////console.log(currentUrl)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(path);
      }
      onRemove(node: MiappeNode) {
          this.active_node = node
          const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false , mode: 'remove', model_type:this.get_model_type(this.active_node)} });
          dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                  if (result.event == 'Confirmed') {
                      //////console.log(this.active_node.id.split("/")[0])
                      if (this.active_node.id.split("/")[0] === "observation_units") {
                          this.globalService.remove_observation_unit(this.active_node.id).pipe(first()).toPromise().then(
                              data => {
                                  //console.log(data)
                                  if (data["success"]) {
                                      //////console.log(data["message"])
                                      var message = this.active_node.id + " has been removed from your history !!"
                                      this.alertService.success(message)
                                      //setTimeout(() => {this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });},5000);
                                      setTimeout(() => {this.reloadComponent(['/projects_tree']);},5000);
                                      
                                      
                                      
                                  }
                                  else {
                                      this.alertService.error("Cannot remove observation units node !! error message: " + data["message"]);
                                  }
                              }
                          );
                          //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                          
                          //this.reloadComponent(['/projects_tree'])
                          //window.location.reload();
                      }
                      // All the other nodes type
                      else {
                          // Remove only childs from the seleccted node
                          if (result.all_childs) {
                              this.globalService.remove_childs(this.active_node.id).pipe(first()).toPromise().then(
                                  data => {
                                      if (data["success"]) {
                                          //////console.log(data["message"])
                                          var message = "child nodes of " + this.active_node.id + " have been removed from your history !!"
                                          this.alertService.success(message)
                                      }
                                      else {
                                          this.alertService.error("this form contains errors! " + data["message"]);
                                      }
                                  }
                              );
                              // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                              // this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                              //this.reloadComponent(['/projects_tree'])
                              //window.location.reload();
                              this.reloadComponent(['/projects_tree'])
                          }
                          //Remove only observed variable or experimental factors
                          // TODO add handler for observation units, biological materials, etc.
                          else if(result.only!=""){
                              //////console.log(result.only)
                              this.globalService.remove_childs_by_type(this.active_node.id, result.only).pipe(first()).toPromise().then(
                                  data => {
                                      if (data["success"]) {
                                          //////console.log(data["message"])
                                          var message = "child nodes of " + this.active_node.id + " have been removed from your history !!"
                                          //this.alertService.success(message)
                                          var datafile_ids=data["datafile_ids"]
                                          var removed_ids=data["removed_ids"]
                                          // datafile_ids.forEach(datafile_id => {
                                          //     this.globalService.remove_associated_headers_linda_id(datafile_id, removed_ids, 'data_files').pipe(first()).toPromise().then(
                                          //         data => { //////console.log(data); }
                                          //       )
                                          // //     this.globalService.update_associated_headers(element, this.update_associated_headers[filename], 'data_files').pipe(first()).toPromise().then(data => {//////console.log(data);})
                                          // });
                                      }
                                      else {
                                          this.alertService.error("this form contains errors! " + data["message"]);
                                      }
                                  }
                              );
                              // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                              // this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                              this.reloadComponent(['/projects_tree'])
                              //window.location.reload();
  
                          }
                          else {
                              //////console.log(this.active_node.id)
                              this.globalService.remove(this.active_node.id).pipe(first()).toPromise().then(
                                  data => {
                                      //////console.log(data)
                                      if (data["success"]) {
                                          //////console.log(data["message"])
                                          var message = this.active_node.id + " has been removed from your history !!"
                                          this.alertService.success(message)
                                          let new_step=0
                                          if (!this.currentUser.tutoriel_done){
                                              if (this.active_node.id.split("/")[0] === "investigations") {
                                                  new_step=0
                                              }
                                              else if (this.active_node.id.split("/")[0] === "studies") {
                                                  new_step=2
                                              }
                                              else if(this.active_node.id.split("/")[0] ==="experimental_factors"){
                                                  new_step=4
                                              }
                                              else if(this.active_node.id.split("/")[0] ==="observed_variables"){
                                                  new_step=6
                                              }
                                              else if(this.active_node.id.split("/")[0] ==="biological_materials"){
                                                  new_step=8
                                              }
                                              else if(this.active_node.id.split("/")[0] ==="biological_materials"){
                                                  new_step=10
                                              }
                                              else if(this.active_node.id.split("/")[0] ==="data_files"){
                                                  new_step=12
                                              }
                                              else{
                                                  new_step=0
                                              }
                                              this.currentUser.tutoriel_step=new_step.toString()
                                              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                                          }
                                          this.reloadComponent(['/projects_tree'])
                                          //this.router.navigate(['/projects_tree'], { queryParams: { key: this.parent_key } });
                                          //window.location.reload();
                                          ///this.router.navigate(['/projects_tree']);
                                          
                                      }
                                      else {
                                          this.alertService.error("this form contains errors! " + data["message"]);
                                      }
                                  }
                              );
                              // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                              
                              
                              
                          }
  
  
                      }
  
                      
                  }
              }
  
  
          });
      }
      onFileChange(event) {
          //////console.log(this.active_node)
  
          //this.fileUploaded = <File>event.target.files[0];
          let uploadResponse = { status: '', message: 0, filePath: '' };
  
          if (event.target.files.length > 0) {
  
              uploadResponse.status = 'progress'
              let fileUploaded = event.target.files[0];
              let fileReader = new FileReader();
              let fileName = fileUploaded.name
              var parent_id = ''
              if (this.active_node.id === 'Investigations tree') {
                  parent_id = this.currentUser["_id"]
              }
              else {
                  parent_id = this.active_node.id
              }
              this.fileService.add_multiple_model(fileReader, parent_id)
              fileReader.readAsArrayBuffer(fileUploaded);
          }
      }
      add_from_file(model_type: string, template: string) {
          var model_key = this.active_node.id.split("/")[1]
          var parent_id = ""
          if (this.active_node.id != 'Investigations tree') {
              parent_id = this.active_node.id
              if (!this.currentUser.tutoriel_done){
                  let new_step=13
                  if (this.currentUser.tutoriel_step==="12"){
                      this.currentUser.tutoriel_step=new_step.toString()
                      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                  }
                  else{
                      this.alertService.error("You are not in the right form as requested by the tutorial")
                  }
              }
              this.router.navigate(['/download'], { queryParams: { parent_id: parent_id, model_key: model_key, model_type: model_type, mode: "download" } });
          }
      }
      /* add_form_from_file(model_type: string, template: string) {
          var model_key = this.active_node.id.split("/")[1]
          var parent_id = ""
          if (this.active_node.id != 'Investigations tree') {
              parent_id = this.active_node.id
              this.router.navigate(['/download'], { queryParams: { parent_id: parent_id, model_key: model_key, model_type: model_type, mode: "extract-form" } });
          }
      } */
      assign_component(model_type: string, template: string){
          var model_key = this.active_node.id.split("/")[1]
          var parent_id = ""
          if (this.active_node.id != 'Investigations tree') {
              parent_id = this.active_node.id
              this.router.navigate(['/assign'], { queryParams: { parent_id: parent_id, model_key: model_key, model_type: model_type, mode: "extract-again" } });
          }
      }
      add_from_data_file(model_type: string) {
          //////console.log(this.active_node.id)
          var model_key = this.active_node.id.split("/")[1]
          var parent_id = ""
          if (this.active_node.id != 'Investigations tree') {
              parent_id = this.active_node.id
              if (!this.currentUser.tutoriel_done){
                  let new_step=15
                  if (this.currentUser.tutoriel_step==="14"){
                      this.currentUser.tutoriel_step=new_step.toString()
                      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                  }
                  else{
                      this.alertService.error("You are not in the right form as requested by the tutorial")
                  }
              }
              this.router.navigate(['/extract'], { queryParams: { parent_id: parent_id, model_key: model_key, model_type: model_type, mode: "extract" } });
          }
      }
      add(model_type: string, template: string) {
          var model_key = this.active_node.id.split("/")[1]
          //////console.log(model_key)
          //////console.log(template)
          var model_coll = this.active_node.id.split("/")[0];
          let user = JSON.parse(localStorage.getItem('currentUser'));
          if (template == 'saved') {
              const dialogRef = this.dialog.open(TemplateSelectionComponent, { width: '500px', data: { search_type: "Template", model_id: "", user_key: user._key, model_type: model_type, values: {}, parent_id: this.active_node.id } });
              dialogRef.afterClosed().subscribe(result => {
                  
                  if (result) {
                      parent_id = ""
                      if (this.active_node.id === 'Investigations tree') {
                          parent_id = user["_id"]
                      }
                      else {
                          parent_id = this.active_node.id
                      }
                      var keys = Object.keys(result.values);
  
                      for (var i = 0; i < keys.length; i++) {
                          if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                              keys.splice(i, 1);
                              //var k=this.keys[i]
                              i--;
                          }
                      }
                      var new_values = {}
                      keys.forEach(attr => { new_values[attr] = result.values[attr] })
                      //////console.log(new_values)
                      this.globalService.add(new_values, model_type, parent_id, false).pipe(first()).toPromise().then(
                          data => {
                              if (data["success"]) {
                                  ////////console.log(data["message"])
                                  //this.model_id=data["_id"];
                                  this.ngOnInit();
                                  //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                  var message = "A new " + model_type[0].toUpperCase() + model_type.slice(1).replace("_", " ") + " based on " + result.values['_id'] + " has been successfully integrated in your history !!"
  
                                  this.alertService.success(message)
                                  this.reloadComponent(['/projects_tree'])
                                  return true;
                              }
                              else {
                                  ////////console.log(data["message"])
                                  this.alertService.error("this form contains errors! " + data["message"]);
                                  
                                  return false;
                                  //this.router.navigate(['/studies']);
                              }
                          }
                      );
                      
  
                  }
              });
              
              //            this.router.navigateByUrl(['/projects_tree'], { skipLocationChange: true }).then(() => 
              //            {
              //                this.router.navigate(['/projects_tree']);
              //            }); 
              //this.router.routeReuseStrategy.shouldReuseRoute = ( ) => false;                              
              //this.router.navigate(['/projects_tree'],{ queryParams: { key: user["_id"].split('/')[1]} });
  
          }
          else if (template == 'zip') {
              //////console.log('add zip file');
          }
          else if (template == 'parent') {
              //Here it is a special case for observation unit when you want to add
              //search for all biological_material in the parent study
              //////console.log('add zip file');
              var model_name = this.active_node.id.split("/")[0]
              var model_key = this.active_node.id.split("/")[1]
              var search_type = ""
              this.globalService.get_parent_id(model_name, model_key).toPromise().then(
                  data => {
                      var parent_id = data[0]["v_id"]
                      //////console.log(parent_id)
                      // if (model_type==='observed_variable'){
                      //     search_type="Observed variable"
                      // }
                      // else if (model_type==='experimental_factor'){
                      //     search_type="Experimental factor"
                      // }
                      // else{
                      //     search_type="Biological material"
                      // }
  
                      const dialogRef = this.dialog.open(TemplateSelectionComponent, { width: '500px', data: { search_type: model_type, model_id: "", parent_id: parent_id, user_key: user._key, model_type: model_type, values: {} } });
                      dialogRef.afterClosed().subscribe(result => {
                          if (result) {
                              //////console.log(result.values)
                              var keys = Object.keys(result.values);
  
                              for (var i = 0; i < keys.length; i++) {
                                  if (keys[i].startsWith("_") || keys[i].startsWith("Definition")) {// || this.model[this.keys[i]].Level ==undefined || this.model[this.keys[i]].Level !=this.level) {
                                      keys.splice(i, 1);
                                      //var k=this.keys[i]
                                      i--;
                                  }
                              }
                              var new_values = {}
                              keys.forEach(attr => { new_values[attr] = result.values[attr] })
                              this.globalService.add(new_values, model_type, this.active_node.id, false).pipe(first()).toPromise().then(
                                  data => {
                                      if (data["success"]) {
                                          ////////console.log(data["message"])
                                          //this.model_id=data["_id"];
                                          this.ngOnInit();
                                          //this.router.navigate(['/homespace'],{ queryParams: { key:  this.parent_id.split('/')[1]} });
                                          var message = "A " + model_type[0].toUpperCase() + model_type.slice(1).replace("_", " ") + " from " + parent_id + " using " + result.values['_id'] + " has been successfully integrated in your history !!"
  
                                          this.alertService.success(message)
  
                                          return true;
                                      }
                                      else {
                                          ////////console.log(data["message"])
                                          this.alertService.error("this form contains errors! " + data["message"]);
                                          return false;
                                          //this.router.navigate(['/studies']);
                                      }
                                  }
                              );
                          }
                      });
                  }
              )
          }
          else {
              var parent_id = ""
              if (this.active_node.id != 'Investigations tree') {
                  parent_id = this.active_node.id
              }
              else {
                  parent_id = user._id
              }
              let new_step=0
              if (model_type === "metadata_file") {
                  this.router.navigate(['/download'], { queryParams: { parent_id: parent_id, model_key: model_key, model_type: model_type, mode: "create" } });
              }
              
              else if (model_type === "biological_material") {
                  //console.log(model_type)
                  ///new_step=parseInt(this.currentUser.tutoriel_step)+1
                  if (!this.currentUser.tutoriel_done){
                      if (this.currentUser.tutoriel_step==="8"){
                          new_step=9
                          this.currentUser.tutoriel_step=new_step.toString()
                          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                      }
                      else{
                          this.alertService.error("You are not in the right form as requested by the tutorial")
                      }
                  }
                  this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: parent_id, model_key: "", model_type: model_type, mode: "create" } });
              }
              else if (model_type === "observation_unit") {
                  if (!this.currentUser.tutoriel_done){
                      if (this.currentUser.tutoriel_step==="10"){
                          new_step=11
                          this.currentUser.tutoriel_step=new_step.toString()
                          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                      }
                      else{
                          this.alertService.error("You are not in the right form as requested by the tutorial")
                      }
                  }
                  this.router.navigate(['/Observationunitform'], { queryParams: { level: "1", parent_id: parent_id, model_key: "", model_type: model_type, mode: "create" } });
              }
              else {
                  if (model_type === "investigation" ){
                      if (!this.currentUser.tutoriel_done){
                          if (this.currentUser.tutoriel_step==="0"){
                              new_step=1
                              this.currentUser.tutoriel_step=new_step.toString()
                              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          }
                          else{
                              this.alertService.error("You are not in the right form as requested by the tutorial")
                          }
                      }
                      //new_step=parseInt(this.currentUser.tutoriel_step)+1  
                  }
                  if (model_type === "study" ){
                      if (!this.currentUser.tutoriel_done ){
                          if (this.currentUser.tutoriel_step==="2"){
                          new_step=3
                          this.currentUser.tutoriel_step=new_step.toString()
                          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          }
                          else{
                              this.alertService.error("You are not in the right form as requested by the tutorial")
                          }
                      }
                      //new_step=parseInt(this.currentUser.tutoriel_step)+1
  
                  }
                  if(model_type === "experimental_factor" ){
                      if (!this.currentUser.tutoriel_done ){
                          if (this.currentUser.tutoriel_step==="4"){
                              new_step=5
                              this.currentUser.tutoriel_step=new_step.toString()
                              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          }
                          else{
                              this.alertService.error("You are not in the right form as requested by the tutorial")
                          }
                      }
                      //new_step=parseInt(this.currentUser.tutoriel_step)+1
                  }
                  if(model_type === "observed_variable"){
                      if (!this.currentUser.tutoriel_done){
                          if (this.currentUser.tutoriel_step==="6"){
                              new_step=7
                              this.currentUser.tutoriel_step=new_step.toString()
                              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          }
                          else{
                              this.alertService.error("You are not in the right form as requested by the tutorial")
                          }
                          
                      }
                      //new_step=parseInt(this.currentUser.tutoriel_step)+1
                  }
                  this.router.navigate(['/generic_form'], { queryParams: { level: "1", parent_id: parent_id, model_key: "", model_type: model_type, mode: "create" , inline:"false", asTemplate:false, onlyTemplate:false}, skipLocationChange: true });
              }
          }
  
      }  
      identify() {
          //////console.log('Hello, Im user tree!');
      }
      isArray(obj : any ){
          return Array.isArray(obj)
      }
      ObservationTableRowSelected(i: number) {
          this.observation_id = this.obs_unit_data[i]['obsUUID']
          //////console.log(this.observation_id)
  
      }
      MaterialTableRowSelected(i) {
          this.biological_material_id = this.biological_materials[i]['bmUUID']
          //////console.log(this.biological_material_id)
      }
      get_ou_data(node: MiappeNode) {
          ////////console.log(node["term"].get_current_observation_unit_data()['observation_units'])
          return node["term"].get_current_observation_unit_data()['observation_units']
      }
      get_bm_data(node: MiappeNode): [] {
          ////////console.log(node["term"].get_current_observation_unit_data()['biological_materials'])
          return node["term"].get_current_observation_unit_data()['biological_materials']
  
      }
      get_ef_data(node: MiappeNode) {
  
          return node["term"].get_current_observation_unit_data()['experimental_factors']
  
      }
      get_sample_data(node: MiappeNode) {
  
          return node["term"].get_current_observation_unit_data()['samples']
  
      }
      show_datatable(node: MiappeNode){
          this.model_key = node.id.split("/")[1]
          var collection = node.id.split("/")[0]
          const dialogRef = this.dialog.open(DatatableComponent, { width: '1000px', data: { collection: collection, model_key: this.model_key } });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  if (result.event == 'Confirmed') {
                      //////console.log("hello")
                  }
              }
          });
      }
      show_info(node: MiappeNode) {
  
          this.current_data_keys = []
          this.current_data_array = []
          this.active_node = node
          //this.displayed = true;
  
          if ((node["id"] === "Investigations tree")) {
              this.model_selected = 'Investigations tree';
          }
          if ((node["id"].includes("metadata_files"))) {
              //get value for a given node
              this.model_selected = "metadata_files"
              this.model_key = node.id.split("/")[1]
              this.globalService.get_parent(node.id).toPromise().then(
                  data => {
                      this.parent_id = data._from;
                  }
              );
          }
          if ((node["id"].includes("observation_units"))) {
              this.model_selected = node["id"].split("/")[0]
              var key = node.id.split("/")[1]
              this.model_key = node.id.split("/")[1]
              var collection = node.id.split("/")[0]
              // //get value for a given node
              var return_data = { "observation_units": [], "biological_materials": [], "samples": [], "experimental_factors": [] }
              this.globalService.get_elem(collection, key).toPromise().then(
                  data => {
                      ////////console.log(data)
                      var obs_linda_id = data['_id']
                      var obs_keys = Object.keys(data);
                      this.obs_unit_data = []
                      for (var i = 0; i < data["Observation unit ID"].length; i++) {
                          var obs_unit = {}
                          obs_keys.forEach(key => {
                              if (!key.startsWith("_") && !key.startsWith("Definition")) {
                                  obs_unit[key] = data[key][i]
                              }
                          });
                          this.obs_unit_data.push(obs_unit)
                      }
                      this.observation_id = data["obsUUID"][0]
                      this.biological_materials = []
                      this.experimental_factors = []
                      this.samples = []
                      this.globalService.get_all_observation_unit_childs(obs_linda_id.split("/")[1]).toPromise().then(
                          observation_unit_childs_data => {
                              //get all biological materials
                              //console.log(observation_unit_childs_data)
                              for (var i = 0; i < observation_unit_childs_data.length; i++) {
                                  var child_id: string = observation_unit_childs_data[i]['e']['_to']
                                  ////////console.log(observation_unit_childs_data[i])
  
                                  if (child_id.includes("biological_materials")) {
                                      ////////console.log(child_id)
                                      ////////console.log(observation_unit_childs_data[i]['e']['biological_materials'])
                                      var tmp_bm: [] = observation_unit_childs_data[i]['e']['biological_materials']
                                      this.biological_materials = this.biological_materials.concat(tmp_bm)
  
                                  }
                                  else if (child_id.includes("experimental_factors")) {
                                      ////////console.log(child_id)
                                      ////////console.log(observation_unit_childs_data[i]['e']['experimental_factors'])
                                      var tmp_ef: [] = observation_unit_childs_data[i]['e']['experimental_factors']
                                      this.experimental_factors = this.experimental_factors.concat(tmp_ef)
                                  }
                                  //type sample childs
                                  else {
                                      ////////console.log(child_id)
  
                                      var sample_data = observation_unit_childs_data[i]['s']['vertices'][1]
                                      ////////console.log(sample_data)
                                      var sample_keys = Object.keys(sample_data);
                                      var sample = {}
                                      sample_keys.forEach(key => {
                                          if (!key.startsWith("_") && !key.startsWith("Definition")) {
                                              sample[key] = sample_data[key]
                                          }
                                      });
                                      this.samples.push(sample)
                                      // var tmp_samples:[]=observation_unit_childs_data[i]['e']['samples']
                                      // samples=samples.concat(tmp_samples)
                                  }
                              }
                              return_data["biological_materials"] = this.biological_materials
                              return_data["samples"] = this.samples
                              return_data["experimental_factors"] = this.experimental_factors
                          }
                      );
                      return_data["observation_units"] = this.obs_unit_data
                      // this.current_data_keys=Object.keys(data);
                      // this.current_data_array.push(data);
                      node["term"].set_current_observation_unit_data(return_data)
                      //node["term"].set_current_data_array(this.current_data_array)
                      node["term"].set_model_key(node.id.split("/")[1])
  
                      // for( var i = 0; i < this.current_data_keys.length; i++){ 
                      //     if ( this.current_data_keys[i].startsWith("_")) {
                      //         this.current_data_keys.splice(i, 1);
                      //         i--;
                      //     }
                      // }
                      //console.log(return_data)
                      // node["term"].set_current_data(this.current_data_keys)
                      // node["term"].set_model_key(node.id.split("/")[1])
                  }
              );
          }
          if ((node["id"].includes("biological_materials"))) {
              this.model_selected = node["id"].split("/")[0]
              // var key = node.id.split("/")[1]
              this.model_key = node.id.split("/")[1]
              
              
          //     var collection = node.id.split("/")[0]
          //     //get value for a given node
          //     var data=this.bm_datatables[node["id"]]
          //     // this.globalService.get_elem(collection, key).toPromise().then(
          //     //     data => {
          //             this.current_data_keys = Object.keys(data);
          //             this.current_data_array.push(data);
          //             //////console.log(this.current_data_array)
          //             // for (var i = 0; i < this.current_data_array[0]['Biological material ID'].length; i++) {
          //             //     //////console.log(this.current_data_array[0]['Biological material ID'][i][0])
          //             // }
                          
          //             node["term"].set_current_data_array(this.current_data_array)
          //             this.getBiologicalDataFromSource(data)
          //             ////console.log(node["term"].get_current_data_array())
          //             for (var i = 0; i < this.current_data_keys.length; i++) {
          //                 if (this.current_data_keys[i].startsWith("_")) {
          //                     this.current_data_keys.splice(i, 1);
          //                     i--;
          //                 }
          //             }
          //             // ////console.log(this.current_data)
          //             node["term"].set_current_data(this.current_data_keys)
          //             node["term"].set_model_key(node.id.split("/")[1])
          //         //});
          }
          else if ((node.id.split("/")[0] === 'data_files')) {
               this.model_selected = node["id"].split("/")[0]
          //     var key = node.id.split("/")[1]
               this.model_key = node.id.split("/")[1]
              
          //     var collection = node.id.split("/")[0]
          //     //get value for a given node
          //     this.globalService.get_elem(collection, key).toPromise().then(
          //         data => {
          //             this.current_data_keys = Object.keys(data);
          //             this.current_data_array.push(data);
          //             node["term"].set_current_data_array(this.current_data_array)
          //             for (var i = 0; i < this.current_data_keys.length; i++) {
          //                 if (this.current_data_keys[i].startsWith("_")) {
          //                     this.current_data_keys.splice(i, 1);
          //                     i--;
          //                 }
          //             }
          //             ////////console.log(this.current_data)
          //             node["term"].set_current_data(this.current_data_keys)
          //             node["term"].set_model_key(node.id.split("/")[1])
          //         }
          //     );
          }
          else {
              this.model_selected = node["id"].split("/")[0]
          //     var key = node.id.split("/")[1]
              this.model_key = node.id.split("/")[1]
          //     var collection = node.id.split("/")[0]
          //     //get value for a given node
          //     this.globalService.get_elem(collection, key).toPromise().then(
          //         data => {
          //             this.current_data_keys = Object.keys(data);
          //             this.current_data_array.push(data);
          //             node["term"].set_current_data_array(this.current_data_array)
          //             for (var i = 0; i < this.current_data_keys.length; i++) {
          //                 if (this.current_data_keys[i].startsWith("_")) {
          //                     this.current_data_keys.splice(i, 1);
          //                     i--;
          //                 }
          //             }
          //             node["term"].set_current_data(this.current_data_keys)
          //             node["term"].set_model_key(node.id.split("/")[1])
          //         }
          //     );
          }
          this.displayed=true
      }
      getBiologicalDataFromSource(data) {
          this.tableData = data;
          var columns = []
          var tableData_columns = Object.keys(this.tableData[0]);
          var object_type={}
          
          tableData_columns.forEach(key => {
            if (!key.startsWith('_') && !key.includes('source altitude') && !key.includes('source latitude') && !key.includes('source longitude')){
              object_type[key]=""
              columns.push({title: key, data: key})
            }
          });
          ///////console.log(object_type)
          var cpt=0
          var newTableData=[]
          for (var i = 0; i < this.tableData[0]["Biological material ID"].length; i++) {
          //this.tableData[0]["Biological material ID"].forEach(element => {
              for (var j = 0; j < this.tableData[0]["Biological material ID"][i].length; j++) {
              //element.forEach(bm_id => {
                  //////console.log(this.tableData[0]["Biological material ID"][i][j])
                  let object_type_tmp=Object.assign(object_type)
                  //ELEMENT_BM_DATA.push({'biologicalMaterialId':this.tableData[0]["Biological material ID"][i][j]})
                  object_type_tmp["Biological material ID"]=this.tableData[0]["Biological material ID"][i][j]
                  object_type_tmp["Material source ID (Holding institute/stock centre, accession)"]=this.tableData[0]["Material source ID (Holding institute/stock centre, accession)"][i]
                  newTableData.push(object_type_tmp)
              }//);
              //cpt+=1
          }//);
          //////console.log(newTableData)
          this.dtOptions['data']=newTableData
          this.dtOptions['columns']=columns
          // this.dtOptions = {
          //   data: newTableData,
          //   columns: columns
          // };  
          this.dataTable = $(this.table.nativeElement);
          this.dataTable.DataTable(this.dtOptions);
      }    
      prepare_ou_data(node_vertice, vertice_keys){
          var newTableData:{}[]=[]
          let  datasources: ObservationUnitTableModel[] = []
          var data= node_vertice
          var keys = vertice_keys
          for (var i = 0; i < data["Observation unit ID"].length; i++) {
              //this.tableData[0]["Biological material ID"].forEach(element => {
              let tmp_dict:ObservationUnitTableModel={"Observation unit ID":"","Observation unit factor value":"","Observation unit type":"", 'External ID':"", "Spatial distribution":""};
              for (var k = 0; k < keys.length; k++) {
                  if (!keys[k].startsWith('_') && !keys[k].includes('altitude') && !keys[k].includes('latitude') && !keys[k].includes('longitude') && !keys[k].includes('coordinates uncertainty') && !keys[k].includes('description')){
                      tmp_dict[keys[k]]=data[keys[k]][i] 
                  }
                  
              } 
              datasources.push(tmp_dict)
          }
          var dt_source=new MatTableDataSource<ObservationUnitTableModel>(datasources);
          this.ou_datasources[data['_id']] = dt_source; 
          
      } 
      prepare_bm_data(node_vertice, vertice_keys){
          var newTableData:{}[]=[]
          let datasources: BiologicalMaterialTableModel[] = []
          var data= node_vertice
          var keys = vertice_keys
          for (var i = 0; i < data["Biological material ID"].length; i++) {
              //this.tableData[0]["Biological material ID"].forEach(element => {
              for (var j = 0; j < data["Biological material ID"][i].length; j++) {
                  let tmp_dict:BiologicalMaterialTableModel={"Species":"","Organism":"","Biological material ID":"","Biological material preprocessing":"", 'Material source DOI':"", 'Material source ID (Holding institute/stock centre, accession)':"", 'Infraspecific name':"", 'Genus':""};
                  for (var k = 0; k < keys.length; k++) {
                      if (!keys[k].startsWith('_') && !keys[k].includes('altitude') && !keys[k].includes('latitude') && !keys[k].includes('longitude') && !keys[k].includes('coordinates uncertainty') && !keys[k].includes('description')){
  
                          if (keys[k].includes("Biological material") ){
                              tmp_dict[keys[k]]=data[keys[k]][i][j]
                          }
                          else if (keys[k].includes("Material") || keys[k].includes("Infraspecific")){
                              tmp_dict[keys[k]]=data[keys[k]][i]
                          }
                          
                          else{
                              tmp_dict[keys[k]]=data[keys[k]]
                          }  
                          
                      }
                      
                  }
                  newTableData.push(tmp_dict)
                  datasources.push(tmp_dict)
                  
                  
              }
          }
          var dt_source=new MatTableDataSource<BiologicalMaterialTableModel>(datasources);
          this.bm_datasources[data['_id']] = dt_source; 
  
          //////console.log(newTableData)
          //////console.log(ELEMENT_BM_DATA)
          return newTableData
      }
      get_ou_dataSource(node_id:string){
          ////console.log(node_id)
          return this.ou_datasources[node_id]
      }
      get_bm_dataSource(node_id:string){
          return this.bm_datasources[node_id]
      }
      get_bm_current_data_array(node: MiappeNode){
          return node["term"].get_bm_current_data_array()
      }
      get_current_data(node: MiappeNode) {
          return node["term"].get_current_data()
      }
      get_current_data_array(node: MiappeNode) {
          return node["term"].get_current_data_array()
      }
      get_current_data_file_headers(node: MiappeNode) {
          ////console.log(node["term"].get_current_data_array())
          let ass_headers=node["term"].get_current_data_array()['associated_headers']
  
          var associated_component=[]
          ass_headers.forEach(element => {
              if (element.selected){
                  associated_component.push(element)
              }
          });
          ////console.log(associated_component)
          return associated_component
      }
      get_model_key(node: MiappeNode) {
          return node["term"].get_model_key()
      }
      get_parent_id(node: MiappeNode) {
          return node["term"].get_parent_id()
      }
      get_model_type(node: MiappeNode) {
          return this.globalService.get_model_type(node.id)
      }
      get_model_type_for_wizard(node: MiappeNode) {
          let tmp_model_type=this.globalService.get_model_type(node.id)
          return (tmp_model_type === 'Investigations tree' ? 'Root' : tmp_model_type);
      }
      get_term_by_id(term_id: string): any {
          var term: MiappeNode;
          this.nodes.forEach(
              t => {
                  if (t.id === term_id) {
                      term = t
                  }
              })
          return term
      }
      get_term_child_by_id(term_id: string): MiappeNode[] {
          var term: MiappeNode[];
          this.nodes.forEach(
              t => {
                  if (t.id === term_id) {
                      term = t.get_children()
                  }
              })
          return term
      }
      searchTerm(terms: MiappeNode[], term_id: string): any {
          var term: MiappeNode;
          terms.forEach(
              t => {
                  if (t.id == term_id) {
                      term = t
                  }
                  else if (t.get_children() != null) {
                      var i;
                      for (i = 0; i < t.get_children().length; i++) {
                          term = this.searchTerm([t.get_children()[i]], term_id);
                      }
                  }
              }
          )
          return term
      }
      /** Whether all the descendants of the node are selected. */
      descendantsAllSelected(node: MiappeFlatNode): boolean {
          const descendants = this.treeControl.getDescendants(node);
          const descAllSelected = descendants.every(child =>
              this.checklistSelection.isSelected(child)
          );
          return descAllSelected;
      }
      /** Whether part of the descendants are selected */
      descendantsPartiallySelected(node: MiappeFlatNode): boolean {
          const descendants = this.treeControl.getDescendants(node);
          const result = descendants.some(child => this.checklistSelection.isSelected(child));
          return result && !this.descendantsAllSelected(node);
      }
      /** Toggle the to-do item selection. Select/deselect all the descendants node */
      todoItemSelectionToggle(node: MiappeFlatNode): void {
          this.checklistSelection.toggle(node);
          const descendants = this.treeControl.getDescendants(node);
          this.checklistSelection.isSelected(node) ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);
  
          // Force update for the parent
          descendants.every(child =>
              this.checklistSelection.isSelected(child)
          );
          this.checkAllParentsSelection(node);
      }
      /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
      todoLeafItemSelectionToggle(node: MiappeFlatNode): void {
          this.checklistSelection.toggle(node);
          this.checkAllParentsSelection(node);
      }
      /* Checks all the parents when a leaf node is selected/unselected */
      checkAllParentsSelection(node: MiappeFlatNode): void {
          let parent: MiappeFlatNode | null = this.getParentNode(node);
          while (parent) {
              this.checkRootNodeSelection(parent);
              parent = this.getParentNode(parent);
          }
      }
      /** Check root node checked state and change it accordingly */
      checkRootNodeSelection(node: MiappeFlatNode): void {
          const nodeSelected = this.checklistSelection.isSelected(node);
          const descendants = this.treeControl.getDescendants(node);
          const descAllSelected = descendants.every(child =>
              this.checklistSelection.isSelected(child)
          );
          if (nodeSelected && !descAllSelected) {
              this.checklistSelection.deselect(node);
          }
          else if (!nodeSelected && descAllSelected) {
              this.checklistSelection.select(node);
          }
      }
      /* Get the parent node of a node */
      getParentNode(node: MiappeFlatNode): MiappeFlatNode | null {
          const currentLevel = this.getLevel(node);
  
          if (currentLevel < 1) {
              return null;
          }
  
          const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
          for (let i = startIndex; i >= 0; i--) {
              const currentNode = this.treeControl.dataNodes[i];
  
              if (this.getLevel(currentNode) < currentLevel) {
                  return currentNode;
              }
          }
          return null;
      }
      searchTree(term: MiappeNode, term_id: string) {
          if (term.id == term_id) {
              return term;
          }
          else if (term.get_children() != null) {
              var i;
              var result = null;
              for (i = 0; result == null && i < term.get_children().length; i++) {
                  ////////console.log(term.children[i])
                  result = this.searchTree(term.get_children()[i], term_id);
              }
              return result;
          }
          return null;
      }
  
      //  get_node(term_id:string) : MiappeNode{
      //      var term:MiappeNode;
      //      this.ontology_tree.forEach(
      //          t=>{
      //              if (t.id===term_id){
      //                term=t
      //                ////////console.log(term_id)
      //              }
      //
      //          })
      //      return term
      //  }
  
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
  
      hasChild = (_: number, node: MiappeFlatNode) => node.expandable;
      getLevel = (node: MiappeFlatNode) => node.level;
  
      isExpandable = (node: MiappeFlatNode) => node.expandable;
  
      getChildren = (node: MiappeNode): MiappeNode[] => node.children;
      @ViewChild('tree', { static: false }) tree;
  
  }
  

