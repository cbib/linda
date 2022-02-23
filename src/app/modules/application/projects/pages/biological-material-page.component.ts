import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { BiologicalMaterialInterface } from 'src/app/models/linda/biological-material';
import { BiologicalMaterialTableModel} from '../../../../models/biological_material_models'
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('mode') mode: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  private dataSource: MatTableDataSource<BiologicalMaterialInterface>;
  private displayedColumns: string[] = ['Infraspecific name', 'Species', 'edit'];
  loaded: boolean = false
  contextMenuPosition = { x: '0px', y: '0px' };
  userMenuPosition = { x: '0px', y: '0px' };
  userMenusecondPosition = { x: '0px', y: '0px' };
  investigationMenuPosition = { x: '0px', y: '0px' };
  helpMenuPosition = { x: '0px', y: '0px' };
  //private bm_datasources:{} = {}
  bm_vertice_data
  dt_source:MatTableDataSource<BiologicalMaterialTableModel>;
  newTableData:{}[]=[]

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
      }
    );
  }

  async ngOnInit() {
    console.log(this.parent_id)
    //await this.get_vertices()
    await this.get_all_biological_materials()
    
    

  }
  async get_all_biological_materials() {
    return this.globalService.get_all_biological_materials(this.parent_id.split('/')[1]).toPromise().then(
      data => {
        //console.log(data)
        if (data.length>0){
          var keys= Object.keys(data[0])
          this.prepare_bm_data(data[0],keys)
          //console.log(this.dt_source)
          //this.dataSource = new MatTableDataSource(data);
          //console.log(this.dataSource)
          this.dt_source.paginator = this.paginator;
          this.dt_source.sort = this.sort;
          this.loaded = true
        }
      }
    )
  }
  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt_source.filter = filterValue.trim().toLowerCase();

    if (this.dt_source.paginator) {
      this.dt_source.paginator.firstPage();
    }
  }
  get get_displayedColumns() {
    return this.displayedColumns
  }
  get get_dataSource() {
    //console.log(this.newTableData)
    return this.dt_source
  }

  onRemove(element: BiologicalMaterialInterface) {
  }
  add(element: BiologicalMaterialInterface) {
  }
  onEdit(element: BiologicalMaterialInterface) {
  }
  async prepare_bm_data(node_vertice, vertice_keys){
          //console.log(node_vertice)
          //console.log(vertice_keys)
          //var newTableData:{}[]=[]
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
                  this.newTableData.push(tmp_dict)
                  datasources.push(tmp_dict)
                  
                  
              }
          }
          this.dt_source=new MatTableDataSource<BiologicalMaterialTableModel>(datasources);
          
      }
}
