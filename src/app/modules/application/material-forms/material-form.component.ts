import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators,ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalService, AlertService, OntologiesService } from '../../../services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators/unique-id-validator.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import * as uuid from 'uuid';
import { DelimitorComponent } from '../dialogs/delimitor.component';
import { CsvLoaderComponent } from '../dialogs/csv-loader.component';
import * as XLSX from 'xlsx';
import { UserInterface } from 'src/app/models/linda/person';
import { DataTableDirective } from 'angular-datatables';
import {JoyrideService} from 'ngx-joyride';
import { GermPlasmInterface } from 'src/app/models/linda/germplasm';
import { Observable, Subject } from 'rxjs';
import { ColDef, PaginationNumberFormatterParams, FirstDataRenderedEvent, GridReadyEvent, SideBarDef, GridApi, RefreshCellsParams,RowSelectedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
//import { SetFilterModel} from 'ag-grid-enterprise';
import { BiologicalMaterial, BiologicalMaterialFullInterface, BiologicalMaterialInterface } from 'src/app/models/linda/biological-material';
import { CustomTooltip } from './custom-tooltip.component';
import { BiologicalMaterialComponent } from '../dialogs/biological-material.component';
import { TitleCasePipe } from '@angular/common';
/* import {
  CheckboxSelectionCallbackParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams,
  PaginationNumberFormatterParams,
} from '@ag-grid-community/core';
 */
@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
})
export class MaterialFormComponent implements OnInit {
  //Input parameters from user tree component
  @Input() level;
  @Input() parent_id;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;
  @Input('role') role: string;
  @Input('grand_parent_id') grand_parent_id: string;
  @Input('group_key') group_key: string;
  @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
  //@ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild(AgGridAngular, { static: false }) selectAgGrid: AgGridAngular;
  @ViewChild(AgGridAngular, { static: false }) agGrid: AgGridAngular;

  //@ViewChild('dataTable', {static: true}) table;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dataTable: any;
  //dtOptions: any;
  dtOptionsMatTable: any = {};
  //dtOptionsMatTable: DataTables.Settings = {};
  dtOptions: DataTables.Settings = {};
  tableData = [];


  materialTable: FormGroup;
  materialControl: FormArray;
  biologicalMaterialControl: FormArray;
  generalControl: FormArray;
  mode_table: boolean = false;
  materialTouchedRows: any;
  biologicalMaterialTouchedRows: any;
  generalTouchedRows: any;

  Checked= false
  private startfilling: boolean = false;
  private currentUser:UserInterface
  show_spinner: boolean = false;
  index_row = 0
  material_id = ""
  selected_term: OntologyTerm
  selected_set: []
  ontology_type: string;

  validated_term = {}
  marked = false;
  ontologies = ['XEO', 'EO', 'EnvO', 'PO_Structure', 'PO_Development']
  model_id: string;
  max_level = 1;
  model: any = [];
  model_to_edit: any = [];
  levels = []
  cleaned_model: any = [];
  keys: any = [];
  used_mat_ids=[]
  selectedRowIndex = -1;
  bottom="bottom"
  center="center"
  subscription: any;


  // I/O part
  fileUploaded: File;
  fileName: string = ""
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadResponse = { status: '', message: 0, filePath: '' };
  taxons:{'species':string,'taxon':[]}[]=[]
  selected_taxons:{'species':string,'taxon':[]}[]=[]
  germplasms:GermPlasmInterface[]=[]
  selected_germplasms:GermPlasmInterface[]=[]
  germplasm_loaded:boolean=false
  unique_taxon_groups:{}={}
  selected_taxon:string=""
  selected_bms:BiologicalMaterial[]=[]
  
  ///dtOptions: DataTables.Settings = {};

/*    // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>(); */

  private columns=[]
  public selectPaginationPageSize = 10;
  public selectPaginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = function (params) {
    return '[' + params.value.toLocaleString() + ']';
  };
  
  selectColumnDefs: ColDef[] = [
    //{ field: 'TaxonGroup', rowGroup: true, hide: true},
    { field: 'AccessionName', checkboxSelection: true},
    
    //{ field: 'AccessionName'},
    { field: 'TaxonGroup'},
    { field: 'Genus'},
    { field: 'TaxonScientificName'},
    { field: 'AccessionNumber'},
    { field: 'CollectionNames'},
    {field: 'CollectionTypes'},
    {field: 'HoldingInstitution'},
    {field:'DOI'},
    {field:'LotName'},
    {field:'PanelNames'},
    {field:'PanelSizes'}
  ];
  
  public selectDefaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };
  public selectAutoGroupColumnDef: ColDef = {
    headerName: 'Accession name',
    field: 'AccessionName',
    minWidth: 250,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  };
  /* public selectAutoGroupColumnDef: ColDef = {
    headerName: 'Lot Name',
    field: 'LotName',
    minWidth: 250,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  }; */
  //rowData: Observable<any[]>;
  public selectSideBar: SideBarDef | string | boolean | null = 'filters';
  public selectRowData!: any[];
  private selectGridApi!: GridApi;
  
  public doc:BiologicalMaterialFullInterface;
  public SideBar: SideBarDef | string | boolean | null = 'filters';
  public RowData!: BiologicalMaterialInterface[];
  private gridApi!: GridApi;
  public tooltipShowDelay = 0;
  public tooltipHideDelay = 2000;


  // MATERIAL TABLE
  
  ColumnDefs: ColDef[] = [
    { field: 'Biological material ID', 
      tooltipField: 'Biological material ID', 
      pinned: 'left', 
      
      headerCheckboxSelection: true, 
      headerCheckboxSelectionFilteredOnly: true,
      /* headerCheckboxSelection: params => {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        return displayedColumns[0] === params.column;
      },  */
      minWidth: 180, 
      checkboxSelection: true},
    { field: 'Material source ID (Holding institute/stock centre, accession)'},
    //{ field: 'Material source ID (Holding institute/stock centre, accession)', rowGroup: true, tooltipField: 'Biological material ID',pinned: 'left' },
    //{ field: 'Genus', tooltipField: 'Biological material ID', pinned: 'left' },
    //{ field: 'Species', tooltipField: 'Biological material ID', pinned: 'left' },
    //{ field: 'Organism', pinned: 'left' },
    //{ field: 'Material source ID (Holding institute/stock centre, accession)', rowGroup: true, hide: true, tooltipField: 'Biological material ID',pinned: 'left' },

    { field: 'Infraspecific name'},
    { field: 'Material source description'},
    { field: 'Material source DOI', hide: true },
    { field: 'Material source altitude'},
    { field: 'Material source latitude'},
    { field: 'Material source longitude'},
    { field: 'Material source coordinates uncertainty'},
    { field: 'Biological material preprocessing'},
    { field: 'Biological longitude'},
    { field: 'Biological latitude'},
    { field: 'Biological altitude'},
    { field: 'Biological coordinates uncertainty'}
  ];
  public DefaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    tooltipComponent: CustomTooltip
  };
  public AutoGroupColumnDef: ColDef = {
    headerName: 'Biological material ID',
    field: 'Biological material ID',
    tooltipField: 'Biological material ID', 
    minWidth: 250,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  };

  public PaginationPageSize = 10;
  public PaginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = function (params) {
    return '[' + params.value.toLocaleString() + ']';
  };
 public all_selected:boolean=false
  
  
  constructor(private fb: FormBuilder, public globalService: GlobalService,private readonly joyrideService: JoyrideService,
    public ontologiesService: OntologiesService,

    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public bmdialog: MatDialog) {

    //this.rowData = this.globalService.get_germplasms()
    this.germplasm_loaded=false
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
    if (this.model_key != "") {
      this.get_model_by_key();
    }
  }

  RefreshAll() {
    var params = {
      force: true
    };
    console.log('before refreshing')
    //agGrid.api == gridApi
    ///this.agGrid.api.refreshCells(params);
    this.gridApi.setRowData((this.RowData))
    ///this.gridApi.refreshCells(params)
    
    //this.gridApi.redrawRows();
  }
  async ngOnInit() {
    this.selected_bms=[]
    this.RowData=[]
    console.log(this.columns)
    /* this.columns=[
      {title:"Material source ID (Holding institute/stock centre, accession)", data:"Material source ID (Holding institute/stock centre, accession)"},
      {title:"Material source description", data:"Material source description"},
      {title:"Material source DOI", data:"Material source DOI"},
      {title:"Material source altitude", data:"Material source altitude"},
      {title:"Material source latitude", data:"Material source latitude"},
      {title:"Material source longitude", data:"Material source longitude"},
      {title:"Material source coordinates uncertainty", data:"Material source coordinates uncertainty"},
      {title:"Edit", data:"Edit"},
      {title:"Delete", data:"Delete"}
    ]
    this.dtOptionsMatTable = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      scrollX:true,
      columns:this.columns
    }; */
    this.germplasm_loaded=false
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    
    this.mode_table = false
    this.materialTouchedRows = [];
    this.biologicalMaterialTouchedRows = [];
    this.generalTouchedRows = [];
    this.index_row = 0
    this.material_id = ""
    this.used_mat_ids=[]
    this.materialTable = this.fb.group({
      materialRows: this.fb.array([]),
      biologicalMaterialRows: this.fb.array([]),
      generalRows: this.fb.array([])
    });
    //this.get_model()
    await this.get_ncbi_taxon()
    await this.get_germplasm_unique_taxon_groups()
    ///console.log(this.mode)
    //this.onClickTour(); 
  }
  ngAfterOnInit() {
    this.materialControl = this.materialTable.get('materialRows') as FormArray;
    this.biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    this.generalControl = this.materialTable.get('generalRows') as FormArray;
  }
 
  getSelectedRows():void{
    const selectedNodes = this.selectAgGrid.api.getSelectedNodes();
    console.log(selectedNodes)
    const selectedData = selectedNodes.map(node => node.data);
    console.log(selectedData)
    let formDialogRef2 = this.bmdialog.open(BiologicalMaterialComponent, { width: '1200px', data: { material_type: 'Material ID', data_filename: "", mode:"no_data_files" } });
    formDialogRef2.afterClosed().subscribe((result2) => {
      if (result2) {
        if (result2.event == 'Confirmed') {
            let biological_material_n:number = (result2.biological_material_n as number)
            let replication:number = (result2.replication as number)
            for (let index = 0; index < selectedData.length; index++) {
              const element = selectedData[index];
              for (let repindex = 1; repindex < replication+1; repindex++) {
                for (let bmindex = 1; bmindex < biological_material_n+1; bmindex++) {
                  //materialControl.push(this.initiateMaterialFormWithValues(element))
                  //biologicalMaterialControl.push(this.initiateBiologicalMaterialFormWithValues(selectedData));
                  let bm_id=element["HoldingInstitution"].split(" - ")[0] +"_"+ element["AccessionNumber"]+ "_rep" + repindex + "_" +bmindex
                  let bm:BiologicalMaterial=new BiologicalMaterial(bm_id)
                  bm['Material source ID (Holding institute/stock centre, accession)']=element["HoldingInstitution"].split(" - ")[0] +"_"+ element["AccessionNumber"]
                  bm['Material source DOI']=element["DOI"]
                  bm['Material source altitude']=""
                  bm['Material source description']="Material from " + element["HoldingInstitution"] + " - Lot name: " +element['LotName']+ " - Panel names:" +element['PanelNames']+ " - Panel sizes: " + element['PanelSizes']
                  bm['Material source latitude']=""
                  bm['Material source longitude']=""
                  bm.Genus=element["Genus"] 
                  bm.replication=replication
                  bm.Species=element["TaxonScientificName"].split(" ")[1]
                  bm.Organism=""
                  bm['Infraspecific name']=element["TaxonScientificName"]
                  this.RowData.push(bm)
                }
              }
            }
            this.RefreshAll()
        }
      }
    });
  }
  onRowSelected(event: RowSelectedEvent) {
    //console.log(event.node.data)
    let bm:BiologicalMaterialFullInterface=event.node.data as BiologicalMaterialFullInterface
    //this.selected_bms.push(bm)
  }
  onSelectionChanged(event: SelectionChangedEvent) {
    var rowCount = event.api.getSelectedNodes().length;
    this.selected_bms=[]
    event.api.getSelectedNodes().forEach(node=>{
      if (this.selected_bms.filter(bm=>bm['Biological material ID']===node.data['Biological material ID']).length===0){
        this.selected_bms.push(node.data)
      }
    })
    /* if (rowCount===0){
      this.selected_bms=[]

    }
    else{
      event.api.getSelectedNodes().forEach(node=>{
        if (this.selected_bms.filter(bm=>bm['Biological material ID']===node.data['Biological material ID']).length===0){
          this.selected_bms.push(node.data)
        }
      })
    } */
    console.log(this.selected_bms)
  }
  removeSelectedBmRows():void{
    this.selected_bms.forEach(_bm=>{
      this.RowData=this.RowData.filter(bm=>bm['Biological material ID']!==_bm['Biological material ID'])
    })
    this.selected_bms=[]
  }
  async get_model_by_key() {
    //console.log('test')
    this.model_to_edit = [];
    await this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
      this.model_to_edit = data;
    //console.log(this.model_to_edit)
      //this.modelForm.patchValue(this.model_to_edit);
    });
  }
  onSelectGridReady(params: GridReadyEvent) {
    this.selectGridApi = params.api;
    this.globalService.get_germplasms().subscribe((data) => {

      this.selectRowData = data; 
      //console.log(this.selectRowData)
      //this.selectRowData=this.selectRowData.filter(selectRow=>!selectRow['DOI'].includes('urn:URGI'))
      this.selectRowData = [...new Map(this.selectRowData.map(v => [JSON.stringify([v.AccessionNumber]), v])).values()]
      //console.log(this.selectRowData)
      this.selectGridApi.setRowData(this.selectRowData)
    });
  }
  convertRowData(){
    let doc_to_add = {
      'Genus': [],
      'Species': [],
      'Organism': [],
      'replication': [],
      'Infraspecific name': [],
      'Material source ID (Holding institute/stock centre, accession)': [],
      'Material source description': [],
      'Material source longitude': [],
      'Material source altitude': [],
      'Material source latitude': [],
      'Material source DOI': [],
      'Material source coordinates uncertainty': [],
      'Biological material ID': [],
      'Biological material preprocessing': [],
      'Biological material coordinates uncertainty': [],
      'Biological material longitude': [],
      'Biological material latitude': [],
      'Biological material altitude': []
    };
    let material_group = this.RowData.reduce((r, a) => {
      r[a['Material source ID (Holding institute/stock centre, accession)']] = [...r[a['Material source ID (Holding institute/stock centre, accession)']] || [], a];
      return r;
    }, {});
    /* console.log("group", material_group);
    console.log("group length", Object.keys(material_group).length); */
    let cpt_mat=0
    Object.keys(material_group).forEach(material=>{
      let materiel_doc=material_group[material] //array of bm
      //console.log(materiel_doc)
      doc_to_add.replication.push(materiel_doc[0].replication)
      doc_to_add.Genus.push(materiel_doc[0].Genus)
      doc_to_add.Species.push(materiel_doc[0].Species)
      doc_to_add.Organism.push(materiel_doc[0].Organism)
      doc_to_add['Infraspecific name'].push(materiel_doc[0]['Infraspecific name'])
      doc_to_add['Material source ID (Holding institute/stock centre, accession)'].push(materiel_doc[0]['Material source ID (Holding institute/stock centre, accession)'])
      doc_to_add['Material source description'].push(materiel_doc[0]['Material source description'])
      doc_to_add['Material source DOI'].push(materiel_doc[0]['Material source DOI'])
      let keys=Object.keys(materiel_doc[0])
      
      for (let index = 0; index < keys.length; index++) {
        if (keys[index].includes("Biological ")){
          var element=keys[index]
          let tmp_bm=[]
          for (let j = 0; j < materiel_doc.length; j++) {
            tmp_bm.push(materiel_doc[j][element])
            
          }
          doc_to_add[element].push(tmp_bm)
        }
      }
      
      cpt_mat++
      
    });

    /* let cpt_mat=0
    for (let index = 0; index < this.RowData.length; index++) {
      const materiel_doc = this.RowData[index];
      console.log(materiel_doc)
      doc_to_add.Genus.push(materiel_doc.Genus)
      doc_to_add.Species.push(materiel_doc.Species)
      doc_to_add.Organism.push(materiel_doc.Organism)
      doc_to_add['Infraspecific name'].push(materiel_doc['Infraspecific name'])
      doc_to_add['Material source ID (Holding institute/stock centre, accession)'].push(materiel_doc['Material source ID (Holding institute/stock centre, accession)'])
      doc_to_add['Material source description'].push(materiel_doc['Material source description'])
      doc_to_add['Material source DOI'].push(materiel_doc['Material source DOI'])
      let keys=Object.keys(materiel_doc)
      
      for (let bm_index = 0; bm_index < keys.length; bm_index++) {
        if (keys[bm_index].includes("Biological ")){
          var element=keys[index]
          let tmp_bm=[]
          for (let j = 0; j < this.RowData.length; j++) {
            tmp_bm.push(materiel_doc[element])
            
          }
          doc_to_add[element].push(tmp_bm)
        }
      }
      
      cpt_mat++ 
    }
    */

    console.log(doc_to_add)
    return doc_to_add
    /* for (let index = 0; index < this.RowData.length; index++) {
      const bm = this.RowData[index];
      doc_to_add.Genus.push(bm.Genus)
      doc_to_add.Species.push(bm.Species)
      doc_to_add.Organism.push(bm.Organism)
      doc_to_add['Infraspecific name'].push(bm['Infraspecific name'])
      doc_to_add['Material source ID (Holding institute/stock centre, accession)'].push(bm['Material source ID (Holding institute/stock centre, accession)'])
      doc_to_add['Material source description'].push(bm['Material source description'])
      doc_to_add['Material source DOI'].push(bm['Material source DOI'])
      
    } */
  }
  get_data(){
    this.RowData=[]
    if (this.model_key!==''){
      this.globalService.get_biological_material_by_key(this.model_key).toPromise().then(data_full => {
        if (data_full.success){
          let data=data_full.data
          for (var i = 0; i < data["Material source ID (Holding institute/stock centre, accession)"].length; i++) {
            for (var j = 0; j < data["Biological material ID"][i].length; j++) {
              let bm:BiologicalMaterial=new BiologicalMaterial(data["Biological material ID"][i][j])
              bm['Material source ID (Holding institute/stock centre, accession)']=data["Material source ID (Holding institute/stock centre, accession)"][i]
              bm['Material source DOI']=data["Material source DOI"][i]
              bm['Material source altitude']=data["Material source altitude"][i]
              bm['Material source description']=data["Material source description"][i]
              bm['Material source latitude']=data["Material source latitude"][i]
              bm['Material source longitude']=data["Material source longitude"][i]
              bm.Genus=data["Genus"][i]
              bm.Species=data["Species"][i]
              bm.Organism=data["Organism"][i]
              bm["Infraspecific name"]=data["Infraspecific name"][i]
              this.RowData.push(bm)
            }
          }
          this.RefreshAll();
        }
      });
      
    }
    console.log(this.RowData)
  }
  onGridReady(params: GridReadyEvent) {
    
    this.gridApi = params.api;
    this.get_data()
    //this.gridApi.setRowData((this.RowData))

    
  }
  onSelectPageSizeChanged(){
    var value = (document.getElementById('select-page-size') as HTMLInputElement)
    .value;
    this.selectGridApi.paginationSetPageSize(Number(value));
  }
  onPageSizeChanged(){
    var value = (document.getElementById('page-size') as HTMLInputElement)
    .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onInputChanges(field:string,value: string){
    console.log(value)
  }
  
  async get_ncbi_taxon(){
    this.taxons = await this.globalService.get_ncbi_taxon_data().toPromise()
    console.log(this.taxons[0])
  }
  async get_germplasm_unique_taxon_groups(){
    this.unique_taxon_groups = await this.globalService.get_germplasm_unique_taxon_groups().toPromise()
  }

  /* async get_germplasms() {
    this.globalService.get_germplasm_taxon_group_accession_numbers(this.selected_taxon).subscribe(
      data => {
      this.germplasm_loaded=false
      this.tableData = data.data;
      this.dtOptions = {
        data: this.tableData,
        columns: this.columns,
        pageLength: 5,
        lengthMenu : [5, 10, 15, 20]
      };
    }, err => {
      this.germplasm_loaded=false
    }, () => {
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOptions);   
    });
  } */
  
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
  get get_selected_taxon(){
    return this.selected_taxon    
  }
  get get_taxons(){
    return this.taxons
  }
  get get_tableData(){
    return this.tableData
  }
  get get_selected_taxons(){
    return this.selected_taxons
  }
  get get_unique_taxon_groups():string[]{
    return this.unique_taxon_groups['TaxonGroup']
  }
  get get_germplasm_loaded():boolean{
    return this.germplasm_loaded
  }
  CleanTable():void{
    this.RowData=[]
    this.RefreshAll()
  }
  select_all_filtered():void{
    this.selectAgGrid.api.selectAllFiltered()
    const selectedNodes = this.selectAgGrid.api.getSelectedNodes();
    console.log(selectedNodes)
    const selectedData = selectedNodes.map(node => node.data);
    console.log(selectedData)
    this.all_selected=true
  }
  get no_row_selected():boolean{
    if (this.selectAgGrid){
      return this.selectAgGrid.api.getSelectedNodes().length===0
    }
    else{
      return true
    }
    
  }

  deselect_all_filtered():void{
    this.selectAgGrid.api.deselectAllFiltered()
    this.all_selected=false
  }
  onTaskAdd(event) {
    this.selected_taxons = []
    let search_string = event.target.value;
    if (search_string === "" || search_string.length<4) {
    }
    else{
      for (var taxon in this.taxons) {
        if (this.taxons[taxon].species.includes(search_string)){
          this.selected_taxons.push(this.taxons[taxon])
        }
      }
      console.log(this.selected_taxons)
    }
            
    this.startfilling = false;
    this.keys.forEach(attr => {
      if (this.materialTable.value[attr] !== "") {
        this.startfilling = true;
      }
    });
    // //console.log(this.startfilling)
    // //console.log(this.materialTable.value)
  }
  get_model() {
    this.model = [];
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    this.globalService.get_model(this.model_type).toPromise().then(data => {
      this.model = data;
      // //console.log(this.model)
      this.keys = Object.keys(this.model);
      this.cleaned_model = []
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].startsWith("_") || this.keys[i].startsWith("Definition")) {
          this.keys.splice(i, 1);
          i--;
        }
        else {
          var dict = {}
          dict["key"] = this.keys[i]
          dict["pos"] = this.model[this.keys[i]]["Position"]
          dict["level"] = this.model[this.keys[i]]["Level"]
          dict["Associated_ontologies"] = this.model[this.keys[i]]["Associated ontologies"]
          this.cleaned_model.push(dict)
        }
      }
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
      const generalControl = this.materialTable.get('generalRows') as FormArray;
      const materialControl = this.materialTable.get('materialRows') as FormArray;
      const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
      generalControl.push(this.initiateGeneralForm());
      if (this.mode!=="create" && this.mode!=="preprocess"){
        for (var i = 0; i < this.model_to_edit["Material source ID (Holding institute/stock centre, accession)"].length; i++) {
          materialControl.push(this.initiateMaterialForm("",i));
          for (var j = 0; j < this.model_to_edit["Biological material ID"][i].length; j++) {
            biologicalMaterialControl.push(this.initiateBiologicalMaterialForm("",i,j));
          }
        }
      }
      //generalControl.push(this.formBuilder.group(attributeFilters))
      // //console.log(this.materialTable.value)
    });
  }
  isMaterialIDDuplicate(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      // const userNames = this..get("credentials").value;
      // //console.log(userNames);
      // const names = userNames.map(item=> item.username.trim());
      const materialControl = this.materialTable.get('materialRows') as FormArray;
      const names = materialControl.controls.map(item=> item.value['Material source ID (Holding institute/stock centre, accession)']);
      for (var j = 0; j < materialControl.controls.length; j++) {
        //console.log(materialControl.controls[j].get('Material source ID (Holding institute/stock centre, accession)').value)
      
      }
      const hasDuplicate = names.some((name, index) => names.indexOf(name, index + 1) != -1);
      
      if (hasDuplicate) {
        //console.log(hasDuplicate);
        return { duplicate: true };
      }

      return null;
    }
  } 
  initiateMaterialFormWithValues(selected_data:{}): FormGroup {
    
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value=''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Material")) {
          if (attr["key"].includes("Material source ID")) {
            attributeFilters[attr["key"]] = [selected_data['AccessionNumber'], [Validators.required, Validators.minLength(4)]];

          }
          else if(attr["key"].includes("DOI")){
            attributeFilters[attr["key"]] = [selected_data['DOI'], [Validators.required, Validators.minLength(4)]];

          }
          else{
            attributeFilters[attr["key"]] = [""]
          }
          attributeFilters['mat-id'] = uuid.v4()
          this.material_id = attributeFilters['mat-id']
        }
      }
      
    });
    return this.fb.group(attributeFilters,{ updateOn: "blur" });
  }
  initiateMaterialForm(mode:string="create", index:number=0): FormGroup {
    // //console.log(this.cleaned_model)
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value=''
      
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Material")) {
        //if (attr["key"].includes("Material") || attr["key"].includes("Infraspecific name")) {
          if (mode!=="create"){
            value=this.model_to_edit[attr["key"]][index]
          }
          if (attr["key"].includes("ID")) {
            //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
            //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService,this.model_type, attr)];
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"], this.parent_id)];
            //attributeFilters[attr["key"]] = [value,{validators: [Validators.required, Validators.minLength(4), this.isMaterialIDDuplicate()],asyncValidators: [UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"])],updateOn: 'blur'}];
            //attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4), this.isMaterialIDDuplicate()], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"])];

          }
          else if (attr["key"].includes("Project Name")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else if (attr["key"].includes("Study Name")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else {
            attributeFilters[attr["key"]] = [value];
          }
          attributeFilters['mat-id'] = uuid.v4()
          this.material_id = attributeFilters['mat-id']
        }

      }
    });

    return this.fb.group(attributeFilters,{ updateOn: "blur" });
  }
  initiateBiologicalMaterialFormWithValues(selected_data:{}): FormGroup {
    
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value=''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Biological")) {
          if (attr["key"].includes("ID")) {
             let bm_id=selected_data["HoldingInstitution"].split(" - ")[0] +"_"+ selected_data["AccessionNumber"] + "_1"

            attributeFilters[attr["key"]] = [bm_id, [Validators.required, Validators.minLength(4)]];

          }
          else{
            attributeFilters[attr["key"]] = [""]
          }
          attributeFilters['mat-id'] = uuid.v4()
          this.material_id = attributeFilters['mat-id']
        }
      }
      
    });
    return this.fb.group(attributeFilters,{ updateOn: "blur" });
  }
  initiateBiologicalMaterialForm(mode:string="create", material_index:number=0, index:number=0): FormGroup {
    ////console.log(this.cleaned_model)
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value=''
      
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Biological")) {
          if (mode!=="create"){
            //console.log(attr["key"])
            //console.log(this.model_to_edit[attr["key"]])
            //console.log(this.model_to_edit[attr["key"]][material_index][index])
            value=this.model_to_edit[attr["key"]][material_index][index]
          }
          if (attr["key"].includes("ID")) {
            //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
            //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService,this.model_type, attr)];
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"], this.parent_id)];
          }
          else if (attr["key"].includes("Project Name")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else if (attr["key"].includes("Study Name")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
        }
          else {
            attributeFilters[attr["key"]] = [value];
          }
          attributeFilters['mat-id'] = this.material_id


        }

      }
    });

    return this.fb.group(attributeFilters);
  }
  initiateGeneralForm(): FormGroup {
    //console.log(this.cleaned_model)

    let attributeFilters = {};
      this.cleaned_model.forEach(attr => {
        var value=''
        if (this.mode!=="create"){
          value=this.model_to_edit[attr["key"]]
        }
        this.validated_term[attr["key"]] = { selected: false, values: "" }
        if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
          if (!attr["key"].includes("Biological") && !attr["key"].includes("Material")) {
            if (attr["key"].includes("ID")) {
              //var uniqueIDValidatorComponent:UniqueIDValidatorComponent=new UniqueIDValidatorComponent()
              //attributeFilters[attr] = [this.model[attr].Example,[Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService,this.model_type, attr)];
              
              attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.alreadyThere(this.globalService, this.alertService, this.model_type, attr["key"], this.parent_id)];
            }
            else if (attr["key"].includes("Project Name")) {
              attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
            }
            else if (attr["key"].includes("Study Name")) {
              attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
            else {
              attributeFilters[attr["key"]] = [value];
            }
            //attributeFilters['mat-id'] = this.material_id
          }
        }
      });

    return this.fb.group(attributeFilters);
  }
  RowSelected(i) {
    ////console.log(i)
    this.index_row = i

    this.selectedRowIndex = i;

    const materialControl = this.materialTable.get('materialRows') as FormArray;
    this.material_id = materialControl.controls[i].value['mat-id']
    ////console.log(control.controls[i].value)
  }
  addMaterialRow() {
    const materialControl = this.materialTable.get('materialRows') as FormArray;
    materialControl.push(this.initiateMaterialForm());
    //this.index_row+=1
    ////console.log(this.material_id)
    ////console.log(this.index_row)
  }
  addBiologicalMaterialRow() {
    ////console.log(this.material_id)
    if (this.material_id === "") {
      this.alertService.error("you need to select or create a material first !!!!")
    }
    else {
      const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
      biologicalMaterialControl.push(this.initiateBiologicalMaterialForm());
    }
  }
  editBiologicalMaterial(index: number){
    console.log("here  you have to open a new dialog component with the table for biologiccal material as in user tree")
  }  
  deleteMaterialRow(index: number) {
    const materialControl = this.materialTable.get('materialRows') as FormArray;
    this.material_id = materialControl.controls[index].value['mat-id']
    materialControl.removeAt(index);
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    for (var i = 0; i < biologicalMaterialControl.controls.length; i++) {
      if (biologicalMaterialControl.controls[i].value['mat-id'] === this.material_id) {
        biologicalMaterialControl.removeAt(i);
        i--
      }
    }
    if (materialControl.controls.length > 0) {
      this.material_id = materialControl.controls[materialControl.controls.length - 1].value['mat-id']
    }
    else {
      this.material_id = ""
    }
  }
  deleteBiologicalMaterialRow(index: number) {
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    biologicalMaterialControl.removeAt(index);
  }
  addBiologicalMaterialTerm(index: number, key: string, id: string) {
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    biologicalMaterialControl.controls[index].patchValue({ "Biological material preprocessing": id })
  }
  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }
  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }
  get getMaterialFormControls() {
    const materialControl = this.materialTable.get('materialRows') as FormArray;
    return materialControl;
  }
  get getBiologicalMaterialFormControls() {
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    return biologicalMaterialControl;
  }
  get getGeneralFormControls() {
    const generalControl = this.materialTable.get('generalRows') as FormArray;
    if (generalControl.controls.length > 0) {
    }
    return generalControl;

  }
  onLatitudeChange(value) {
  }
  onLongitudeChange(value) {
  }
  formatLatitudeLabel(value: number) {
    //north hemisphera
    if (value > 0) {
      var decimals = value - Math.floor(value);
      return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′N"
    }
    //south hemisphera
    if (value < 0) {
      var decimals = value - Math.floor(value);
      return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′S"
    }
    else {
      return value;
    }
  }
  formatLabel(value: number) {
    return value + 'm';
  }
  formatLongitudeLabel(value: number) {
    ////console.log(value)
    //east hemisphera
    if (value > 0) {
      var decimals = value - Math.floor(value);
      return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′E"
    }
    //west hemisphera
    if (value < 0) {
      var decimals = value - Math.floor(value);
      return Math.floor(value) + "°" + decimals.toFixed(2).substring(2) + "′W"
    }

    else {
      return value;
    }
  }
  onOntologyTermSelection(ontology_id: string, key: string, index: number, multiple: boolean = true) {

    //this.show_spinner = true;
    const dialogRef = this.dialog.open(OntologyTreeComponent, { disableClose: true, width: '1000px', autoFocus: true,  maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], uncheckable: false, multiple: multiple } });
    // dialogRef..afterOpened().subscribe(result => {
    //     this.show_spinner = false;
    // })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.startfilling = true;
        // //console.log(multiple)
        // //console.log(key)
        this.ontology_type = result.ontology_type;
        this.selected_set = result.selected_set;
        if (this.selected_set !== undefined) {
          if (multiple) {
            var term_ids = this.getBiologicalMaterialFormControls.controls[index].value[key] + '/'
            for (var i = this.selected_set.length - 1; i >= 0; i--) {
              term_ids += this.selected_set[i]['id'] + '/'
            }
            term_ids = term_ids.slice(0, -1);
            this.validated_term[key] = { selected: true, values: term_ids };
            this.getBiologicalMaterialFormControls.controls[index].value[key].patchValue(term_ids)
          }
          else {

            if (this.selected_set.length > 0) {
              // //console.log(this.getBiologicalMaterialFormControls)
              // //console.log(this.getBiologicalMaterialFormControls.controls)
              // //console.log(this.getBiologicalMaterialFormControls.controls[index].value)
              // //console.log(this.getBiologicalMaterialFormControls.controls[index].value[key])
              // //console.log(this.selected_set)
              // //console.log(this.selected_set)
              // //console.log(this.getBiologicalMaterialFormControls)
              // //console.log(result.selected_set[0]['id'])
              this.addBiologicalMaterialTerm(index, key, result.selected_set[0]['id'])
              //this.getBiologicalMaterialFormControls.controls[index].value[key].patchValue(result.selected_set[0]['id'])
              this.startfilling = true;
            }
          }
        }
      }
    });
  }
  
  get_startfilling() {
    return this.startfilling;
  };
  notify_checkbox_disabled() {
    if (!this.startfilling) {
      this.alertService.error('need to fill the form first');
    }
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  };
  
  submitForm() {
    /* const materialControl = this.materialTable.get('materialRows') as FormArray;
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    const generalControl = this.materialTable.get('generalRows') as FormArray;
    if (this.mode==='preprocess'){
      materialControl.push(this.initiateMaterialForm());
      biologicalMaterialControl.push(this.initiateBiologicalMaterialForm());
    }
    this.materialTouchedRows = materialControl.controls.filter(row => row.touched).map(row => row.value);
    this.biologicalMaterialTouchedRows = biologicalMaterialControl.controls.filter(row => row.touched).map(row => row.value);
    this.generalTouchedRows = generalControl.controls.filter(row => row.touched).map(row => row.value);
    var return_data = {}
    generalControl.controls.forEach(general_attr => {
      return_data = general_attr.value
    });
    console.log(return_data)
    var material_index = 0
    //this.materialTouchedRows.forEach(material_attr => {
    materialControl.controls.forEach(material_attr => {
      var data = material_attr.value
      var material_attr_keys = Object.keys(data)
      var current_mat_id = ""
      for (var i = 0; i < material_attr_keys.length; i++) {
        if (material_attr_keys[i] === 'mat-id') {
          current_mat_id = data[material_attr_keys[i]]
        }
        else {
          if (return_data[material_attr_keys[i]]) {
            return_data[material_attr_keys[i]].push(data[material_attr_keys[i]])
          }
          else {
            return_data[material_attr_keys[i]] = []
            return_data[material_attr_keys[i]].push(data[material_attr_keys[i]])
          }
        }
      }
      this.cleaned_model.forEach(attr => {
        if (attr["level"] === "3") {
          if (return_data[attr["key"]]) {
            return_data[attr["key"]].push([])
          }
          else {
            return_data[attr["key"]] = [[]]
          }
        }
      });
      biologicalMaterialControl.controls.forEach(biological_material_attr => {
        var data2=biological_material_attr.value
        if (data2['mat-id'] === current_mat_id) {
          var biological_material_attr_keys = Object.keys(data2)
          for (var i = 0; i < biological_material_attr_keys.length; i++) {
            if (biological_material_attr_keys[i] !== 'mat-id') {
              return_data[biological_material_attr_keys[i]][material_index].push(data2[biological_material_attr_keys[i]])
            }
          }
        }
      });
      material_index += 1
    }); */
    if (this.mode==="preprocess"){
      var data={'form':this.convertRowData(), 'template':this.marked}
      this.notify.emit(data);
    }
    else{
      console.log(this.convertRowData())
      this.save(this.convertRowData())
    }
  }
  
  save(form: any): boolean {
    if (this.mode === "create") {
      this.globalService.add(form, this.model_type, this.parent_id, this.marked).pipe(first()).toPromise().then(
        data => {
          if (data["success"]) {
            this.model_id = data["_id"];
            this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "biomat", role: this.role, group_key: this.group_key } });
            var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
            this.alertService.success(message)
            if  (!this.currentUser.tutoriel_done){
              let new_step=10
              this.currentUser.tutoriel_step=new_step.toString()
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            return true;
          }
          else {
            this.alertService.error("this form contains errors! " + data["message"]);
            return false;
          }
        }
      );
    }
    //edit mode
    else {
      //let element = event.target as HTMLInputElement;
      //let value_field = element.innerText;
      console.log(form)
      console.log(this.RowData)

      this.globalService.update_document(this.model_key, form, this.model_type).pipe(first()).toPromise().then(
        data => {
          if (data["success"]) {
            var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
            this.alertService.success(message)
            this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "biomat", role: this.role, group_key: this.group_key } });
            return true;
          }
          else {
            this.alertService.error("this form contains errors! " + data["message"]);

            return false;
          };
        }
      );
    }
    //Here register the form with the correct investigation id et study id
    //this.formDataService.setAddress(this.address);
    return true;
  };
  cancel(form: any) {
    if (this.mode==="preprocess"){
      this.notify.emit('cancel the form');
    }
    else{
      if  (!this.currentUser.tutoriel_done){
          let new_step=8
          this.currentUser.tutoriel_step=new_step.toString()
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "biomat", role: this.role, group_key: this.group_key } });
    }
  };
  toggleTheme() {
    this.mode_table = !this.mode_table;
  }
  onClickTour(help_mode:boolean=false) {
    if (help_mode){
      this.joyrideService.startTour(
        { steps: ['Step1_1', 'Step1_2', 'Step1_3', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
    );
    }
    else{
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
      if (this.currentUser['tutoriel_step'] === "9"){
          this.joyrideService.startTour(
              { steps: ['Step1_1', 'Step1_2', 'Step1_3', 'StepDemoForm', 'StepSubmit'], stepDefaultPosition: 'center'} // Your steps order
          );
              //this.currentUser.tutoriel_step="2"
              //localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
    }

  }
  onDone() {
  //this.joyrideService.closeTour()
  //Biological  form template
  //if (this.currentUser['tutoriel_step']==="9"){
    var species_list=["B73", "PH207", "Oh43", "W64A", "EZ47"]
    const generalRows = this.materialTable.get('generalRows') as FormArray;
    generalRows.controls[0].patchValue({ "Genus": "Zea" })
    generalRows.controls[0].patchValue({ "Species": "mays" })
    generalRows.controls[0].patchValue({ "Organism": "NCBI:4577" })
    generalRows.controls[0].patchValue({ "Infraspecific name": species_list })
    var cpt=0
    var gbl_cpt=0
    const MaterialControl = this.materialTable.get('materialRows') as FormArray;
    const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    species_list.forEach(species=>{

      //console.log(species)
      
      MaterialControl.push(this.initiateMaterialForm('create', cpt));
      var m_id='INRA:' + species
      ////console.log(m_id)
      ////console.log(MaterialControl.controls[cpt])
      MaterialControl.controls[cpt].patchValue({ "Material source ID (Holding institute/stock centre, accession)": m_id })
      //MaterialControl.controls[cpt].patchValue({ "Infraspecific name": species })
      // TODO finish bm incorporation
      
      
      for (var i=1;i<11;i++){
        var bm_id=m_id+'_' + i
        //console.log(bm_id)
        biologicalMaterialControl.push(this.initiateBiologicalMaterialForm("create",cpt ,i-1));
        biologicalMaterialControl.controls[gbl_cpt].patchValue({ "Biological material ID": bm_id })
        biologicalMaterialControl.controls[gbl_cpt].patchValue({ "Biological material preprocessing": "PECO:0007210" })
        gbl_cpt+=1
      }
      cpt+=1
    })
  //}  
  this.startfilling=true
  }


  // submit(form: any) {
  //     if (!this.startfilling && this.mode != "edit") {
  //         this.alertService.error('need to fill the form first');

  //     }
  //     else {
  //         this.save(form)
  //     }
  // };



}
