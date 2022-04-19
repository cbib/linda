import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { BiologicalMaterialFullInterface, BiologicalMaterialInterface } from 'src/app/models/linda/biological-material';
import { BiologicalMaterialTableModel } from '../../../../models/biological_material_models'
import { first } from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-biological-material-page',
  templateUrl: './biological-material-page.component.html',
  styleUrls: ['./biological-material-page.component.css']
})
export class BiologicalMaterialPageComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Input('role') role: string;
  @Input('grand_parent_id') grand_parent_id: string;
  @Input('group_key') group_key: string;
  
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  private dataSource: MatTableDataSource<BiologicalMaterialFullInterface>;
  //private displayedColumns: string[] = ['Infraspecific name', 'Species', 'Genus','total materials','total biological materials','edit'];

  private displayedColumns: string[] = ['Genus', 'Species', 'Infraspecific name','total materials','total biological materials','edit'];
  loaded: boolean = false
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };
  //private bm_datasources:{} = {}
  bm_vertice_data
  dt_source: MatTableDataSource<BiologicalMaterialTableModel>;
  newTableData: {}[] = []

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
        this.role=params['role']
        this.grand_parent_id=params['grand_parent_id']
        this.group_key=params['group_key']
      }
    );
  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    //console.log(this.parent_id)
    await this.set_all_biological_materials()
    this.loaded = true
  }
  /* async get_all_biological_materials() {
    return this.globalService.get_all_biological_materials(this.parent_id.split('/')[1]).toPromise().then(
      data => {
        if (data.length>0){
          //console.log(data)
          var keys= Object.keys(data[0])
          this.prepare_bm_data(data[0],keys)
          ////console.log(this.dt_source)
          //this.dataSource = new MatTableDataSource(data);
          ////console.log(this.dataSource)
          this.dt_source.paginator = this.paginator;
          this.dt_source.sort = this.sort;
          this.loaded = true
        }
        else{
          //console.log(data)
          this.loaded = true
        }
        
      }
    )
  } */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
  async set_all_biological_materials() {
    var data = await this.globalService.get_all_biological_materials(this.parent_id.split('/')[1]).toPromise();
    //console.log(data);
    for (let index = 0; index < data.length; index++) {
      //const element = data[index];
      data[index]['total materials']=data[index]["Material source ID (Holding institute/stock centre, accession)"].length
      data[index]['total biological materials']=data[index]["Biological material ID"][0].length*data[index]['total materials']
      data[index]['Infraspecific name']=Array.from(new Set(data[index]['Infraspecific name']))
      data[index]['Species']=Array.from(new Set(data[index]['Species']))
      data[index]['Genus']=Array.from(new Set(data[index]['Genus']))
      if (data[index]['Infraspecific name'].length>3){
        data[index]['Infraspecific name']=data[index]['Infraspecific name'].slice(0, 3);
        data[index]['Infraspecific name'].push("...")
      }
      if (data[index]['Species'].length>3){
        data[index]['Species']=data[index]['Species'].slice(0, 3);
        data[index]['Species'].push("...")
      }
      if (data[index]['Genus'].length>3){
        data[index]['Genus']=data[index]['Genus'].slice(0, 3);
        data[index]['Genus'].push("...")
      }
      
    }
    /* data[0]['total materials']=data[0]["Material source ID (Holding institute/stock centre, accession)"].length
    data[0]['total biological materials']=data[0]["Biological material ID"][0].length*data[0]['total materials']
    data[0]['Infraspecific name']=Array.from(new Set(data[0]['Infraspecific name']))
    data[0]['Species']=Array.from(new Set(data[0]['Species']))
    data[0]['Genus']=Array.from(new Set(data[0]['Genus']))
    if (data[0]['Infraspecific name'].length>3){
      data[0]['Infraspecific name']=data[0]['Infraspecific name'].slice(0, 3);
    }
    if (data[0]['Species'].length>3){
      data[0]['Species']=data[0]['Species'].slice(0, 3);
    }
    if (data[0]['Genus'].length>3){
      data[0]['Genus']=data[0]['Genus'].slice(0, 3);
    } */
    //data[0]['Species']=Array.from(new Set(data[0]['Species']))
    //data[0]['Genus']=Array.from(new Set(data[0]['Genus']))
    console.log(data[0]['Species']);
    this.dataSource = new MatTableDataSource(data);
    //console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  get get_displayedColumns() {
    return this.displayedColumns
  }
  get get_dataSource() {
    ////console.log(this.newTableData)
    return this.dataSource
  }
  get get_grand_parent_id(){
    return this.grand_parent_id
  }
  get get_mode(){
      return this.mode
  }
  get get_model_key(){
      return this.model_key
  }
  get get_role(){
      return this.role
  }
  get get_parent_id(){
    return this.parent_id
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "biomat", role: this.role, group_key: this.group_key } });

    //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: _model_id, model_key: this.model_key, model_type: 'study', activeTab: 'data_files', mode: "edit", role: this.role, group_key: this.group_key } });
  }

  onRemove(element: BiologicalMaterialFullInterface) {
    this.globalService.remove(element._id).pipe(first()).toPromise().then(
      data => {
          //////console.log(data)
          if (data["success"]) {
              //console.log(data["message"])
              var message = element._id + " has been removed from your history !!"
              this.alertService.success(message)
              this.reloadComponent()
          }
          else {
              this.alertService.error("this form contains errors! " + data["message"]);
          }
      });
  }
  add(element: BiologicalMaterialFullInterface) {
    this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: "", model_type: 'biological_material', mode: "create", role:this.role, grand_parent_id:this.grand_parent_id, group_key:this.group_key } });

  }
  onEdit(element: BiologicalMaterialFullInterface) {
    this.router.navigate(['/materialform'], { queryParams: { level: "1", parent_id: this.parent_id, model_key: element._key, model_type: this.model_type, mode: "edit" ,role:this.role, grand_parent_id:this.grand_parent_id, group_key:this.group_key } });
  }
  async prepare_bm_data(node_vertice, vertice_keys) {
    ////console.log(node_vertice)
    ////console.log(vertice_keys)
    //var newTableData:{}[]=[]
    let datasources: BiologicalMaterialTableModel[] = []
    var data = node_vertice
    var keys = vertice_keys
    for (var i = 0; i < data["Biological material ID"].length; i++) {
      //this.tableData[0]["Biological material ID"].forEach(element => {
      for (var j = 0; j < data["Biological material ID"][i].length; j++) {
        let tmp_dict: BiologicalMaterialTableModel = { "Species": "", "Organism": "", "Biological material ID": "", "Biological material preprocessing": "", 'Material source DOI': "", 'Material source ID (Holding institute/stock centre, accession)': "", 'Infraspecific name': "", 'Genus': "" };
        for (var k = 0; k < keys.length; k++) {
          if (!keys[k].startsWith('_') && !keys[k].includes('altitude') && !keys[k].includes('latitude') && !keys[k].includes('longitude') && !keys[k].includes('coordinates uncertainty') && !keys[k].includes('description')) {

            if (keys[k].includes("Biological material")) {
              tmp_dict[keys[k]] = data[keys[k]][i][j]
            }
            else if (keys[k].includes("Material") || keys[k].includes("Infraspecific")) {
              tmp_dict[keys[k]] = data[keys[k]][i]
            }

            else {
              tmp_dict[keys[k]] = data[keys[k]]
            }

          }

        }
        this.newTableData.push(tmp_dict)
        datasources.push(tmp_dict)


      }
    }
    this.dt_source = new MatTableDataSource<BiologicalMaterialTableModel>(datasources);
  }
}
