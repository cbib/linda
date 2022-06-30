import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort'
import { first } from 'rxjs/operators';
import { ExperimentalDesignInterface } from 'src/app/models/linda/experimental-design';
import { ExperimentalDesign } from 'src/app/models/linda/experimental-design';
import { BlockDesignInterface } from 'src/app/models/linda/experimental-design';
import { BlockDesign } from 'src/app/models/linda/experimental-design';
import { Replication } from 'src/app/models/linda/experimental-design';
import { PlotDesign } from 'src/app/models/linda/experimental-design';
import { RowDesign } from 'src/app/models/linda/experimental-design';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource} from '@angular/material/table';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from 'src/app/models/linda/person';

@Component({
  selector: 'app-experimental-designs-page',
  templateUrl: './experimental-designs-page.component.html',
  styleUrls: ['./experimental-designs-page.component.css']
})
export class ExperimentalDesignsPageComponent implements OnInit, OnDestroy, AfterViewInit {

    BlockDesignForm = new FormGroup({
        totalBlockControl : new FormControl(''),
        totalRowPerBlockControl : new FormControl(''),
        totalColumnPerBlockControl : new FormControl(''),
        totalRowPerPlotControl : new FormControl(''),
        totalBlockPerRowControl : new FormControl('')
    })

    // Input args
    @Input('level') level: number;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('parent_id') parent_id:string;
    @Input('grand_parent_id') grand_parent_id: string;
    @Input('mode') mode: string;
    @Input('role') role: string;
    @Input('group_key') group_key: string;
   

    @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();

    // Menu part
    @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) helpMenu: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) userMenusecond: MatMenuTrigger;
    @ViewChild(MatMenuTrigger, { static: false }) investigationMenu: MatMenuTrigger;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    
    contextMenuPosition = { x: '0px', y: '0px' };
    userMenuPosition = { x: '0px', y: '0px' };
    userMenusecondPosition = { x: '0px', y: '0px' };
    investigationMenuPosition = { x: '0px', y: '0px' };
    helpMenuPosition = { x: '0px', y: '0px' };

    experimental_design_blocks:BlockDesign[]=[]
    design_types=["CompleteBlockDesign","IncompleteBlockDesign"]
    private design:ExperimentalDesign;
    private design_type:string
    private total_block_number:number=0
    private total_column_per_block:number=0
    private total_row_per_block:number=0
    private total_row_per_plot:number=0
    private total_block_per_row:number=0
    private dataSource: MatTableDataSource<ExperimentalDesignInterface>;
    private displayedColumns: string[] = ['Blocks per trial', 'number of entries', 'edit'];
    private experimental_designs:ExperimentalDesignInterface[]=[]

    private currentUser:UserInterface



    ///// TESST PART
    products = [];  
    countryCode: any;  
    currencySymbol:any;  
    productCountryInformation: any = [];  
    hideme = [];  
    Index: any;  
    countryId: any;  
    country: any;  
    priceToDisplay=[];

    constructor(public globalService: GlobalService,
        public ontologiesService: OntologiesService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private formBuilder:FormBuilder,
        private _cdr: ChangeDetectorRef,
        public dialog: MatDialog){
            this.route.queryParams.subscribe(
                params => {
                    /* this.level = params['level'];
                    this.model_type = params['model_type'];
                    this.model_key = params['model_key'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.study_id="studies/"+this.model_key */

                    this.level = params['level'];
                    this.model_type = params['model_type'];
                    this.model_key = params['model_key'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.group_key = params['group_key']
                    this.role=params['role']
                    this.grand_parent_id=params['grand_parent_id']
                }
              );
    } 

    
    
    async ngOnInit(){
        console.warn(this.level)
        console.warn(this.model_type)
        console.warn(this.model_key)
        console.warn(this.mode)
        console.warn(this.parent_id)
        console.warn(this.group_key)
        console.warn(this.role)
        console.warn(this.grand_parent_id)
        this.dataSource = new MatTableDataSource([]);
        await this.get_all_experimental_designs()
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.dataSource = new MatTableDataSource(this.experimental_designs);
        //console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.extract_design(36,7,3)
        //console.log(this.design)   
    }
    ngAfterViewInit(){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._cdr.detectChanges()
        
    }
    async get_all_experimental_designs() {
        const data = await this.globalService.get_all_experimental_designs(this.model_key).toPromise()
        if (data.length>0){
            console.log(data[0].Blocking.value[0]['Blocks per trial']['value'])
            this.experimental_designs=data
            console.log(this.experimental_designs)
        }
    }

    onExtractDesign(){
        console.warn(this.BlockDesignForm.controls)
        this.BlockDesignForm.get('totalBlockControl').value
        this.total_block_number= this.BlockDesignForm.get('totalBlockControl').value
        this.total_column_per_block= this.BlockDesignForm.get('totalColumnPerBlockControl').value
        this.total_row_per_block= this.BlockDesignForm.get('totalRowPerBlockControl').value
        this.total_row_per_plot=this.BlockDesignForm.get('totalRowPerPlotControl').value
        this.experimental_design_blocks=[]
        /* let blocks=this.total_block_number
        let columns=this.total_column_per_block
        let rows=this.total_row_per_block */
        this.design=new ExperimentalDesign()
        var replication:Replication=new Replication()
        replication.set_replicate_number(3)
        this.design.set_replication(replication)
        this.design.set_number_of_entries(this.total_block_number*this.total_column_per_block*this.total_row_per_block)
        var plot=1
        for (var block=1;block<(this.total_block_number+1);block++){
            var block_design:BlockDesign=new BlockDesign(block, this.total_block_number)
            for (var column=1;column<this.total_column_per_block+1;column++){  
                
                
                for (var row=1;row<this.total_row_per_block+1;row++){
                    
                    var row_design:RowDesign=new RowDesign()
                    row_design.set_row_number(row/this.total_row_per_plot)
                    row_design.set_row_per_plot(this.total_row_per_plot)
                    var plot_design:PlotDesign=new PlotDesign()
                    plot_design.set_column_number(column)
                    if (row%this.total_row_per_plot===0){
                        plot_design.set_plot_number(plot)
                        plot_design.add_row_design(row_design)
                        block_design.add_plot_design(plot_design)
                        //var plot_design:PlotDesign=new PlotDesign()
                        plot++
                        
                    }
                    else{
                        
                        plot_design.add_row_design(row_design)

                    }
                    /* else{
                        block_design.add_plot_design(plot_design)
                    } */
                }
                
                
            }
            //console.log(block_design)
            this.experimental_design_blocks.push(block_design)
            this.design.add_block_design(block_design)
        }
        //console.log(this.design)
        //console.log(this.design.get_block_design(4))
        //console.log(this.experimental_design_blocks)
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.   
    }
    public handlePageBottom(event: PageEvent) {
        this.paginator.pageSize = event.pageSize;
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.page.emit(event);
    }

    save(){
        this.globalService.add(this.design, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    this.ngOnInit();
                    return true;
                }
                else {
                    this.alertService.error("this form contains errors! " + data["message"]);
                    return false;
                }
            }
        );
    }
    
    onRemove(element:ExperimentalDesignInterface) {
        console.log(element)
        const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true,width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    if (element['Associated observation units'].value!==null){
                        const remove_res= await this.globalService.remove_observation_unit(element['Associated observation units'].value).toPromise()
                        if (remove_res["success"]) {
                            this.globalService.remove(element._id).pipe(first()).toPromise().then(
                                data => {
                                    ////console.log(data)
                                    if (data["success"]) {
                                        console.log(data["message"])
                                        var message = element._id + " has been removed from your history !!"
                                        
                                        this.alertService.success(message)
                                        this.reloadComponent()
                                    }
                                    else {
                                        this.alertService.error("this form contains errors! " + data["message"]);
                                    }
                                }
                            );
                        }
                        else{
                            this.alertService.error("a error is occured when suppressing experimental associated component")
                        }
                    }
                    else{
                        this.globalService.remove(element._id).pipe(first()).toPromise().then(
                            data => {
                                ////console.log(data)
                                if (data["success"]) {
                                    console.log(data["message"])
                                    var message = element._id + " has been removed from your history !!"
                                    
                                    this.alertService.success(message)
                                    this.reloadComponent()
                                }
                                else {
                                    this.alertService.error("this form contains errors! " + data["message"]);
                                }
                            }
                        );
                    }
                }
            }
            //this.reloadComponent(['/projects'])
        });
    }

    onAdd(){
        console.warn(this.level)
        console.warn(this.model_type)
        console.warn(this.model_key)
        console.warn(this.mode)
        console.warn(this.parent_id)
        console.warn(this.group_key)
        console.warn(this.role)
        console.warn(this.grand_parent_id)
        this.router.navigate(['/experimental_design_page'], { queryParams: { 
            level: "1", 
            grand_parent_id:this.grand_parent_id, 
            parent_id: this.parent_id, 
            model_key: "",
            model_id: "", 
            model_type: this.model_type, 
            mode: "create", 
            activeTab: "'exp_design_info'", 
            role: this.role, 
            group_key: this.group_key 
        }}); 
    }
    
    onEdit(element:ExperimentalDesignInterface){
        console.warn(this.level)
        console.warn(this.model_type)
        console.warn(this.model_key)
        console.warn(this.mode)
        console.warn(this.parent_id)
        console.warn(this.group_key)
        console.warn(this.role)
        console.warn(this.grand_parent_id)
        console.log(element['_id'])
        this.router.navigate(['/experimental_design_page'], { queryParams: { 
            level: "1", 
            grand_parent_id:this.grand_parent_id, 
            parent_id: this.parent_id, 
            model_key: element['_key'],
            model_id: element['_id'], 
            model_type: this.model_type, 
            mode: "edit", 
            activeTab: "'exp_design_info'", 
            role: this.role, 
            group_key: this.group_key 
        }});
    }

    removeBlock(_block){
        this.experimental_design_blocks.forEach( (block, index) => {
          if(block === _block) this.experimental_design_blocks.splice(index,1);
        });
    }

    display_block(_block:BlockDesignInterface){
        console.log(_block['Block number'].value)
        console.log(this.experimental_design_blocks)
        console.log(this.experimental_design_blocks.filter(block => block['Block number'].value===_block['Block number'].value))
    }
    
    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "studydesign", role: this.role, group_key: this.group_key } });
    }

    onDesignTypeChange(value:string){
        this.design_type=value
        console.log(this.design_type)
    }

    onSubmit(){
        console.warn(this.BlockDesignForm.value);
    }
    /* get total_block_control(){ return this.BlockDesignForm.get('totalBlockControl')}
    get total_block_per_row_control(){ return this.BlockDesignForm.get('totalBlockPerRowControl')}
    get total_row_per_block_control(){ return this.BlockDesignForm.get('totalRowPerBlockControl')}
    get total_column_per_block_control(){ return this.BlockDesignForm.get('totalColumnPerBlockControl')}
    get total_row_per_plot_control(){ return this.BlockDesignForm.get('totalRowPerPlotControl')}
     */
    get totalBlockControl(){ return this.BlockDesignForm.get('totalBlockControl');}
    get totalBlockPerRowControl(){ return this.BlockDesignForm.get('totalBlockPerRowControl')}
    get totalRowPerBlockControl(){ return this.BlockDesignForm.get('totalRowPerBlockControl');}
    get totalColumnPerBlockControl(){ return this.BlockDesignForm.get('totalColumnPerBlockControl');}
    get totalRowPerPlotControl(){ return this.BlockDesignForm.get('totalRowPerPlotControl'); }
    
    get get_BlockDesignForm(){ return this.BlockDesignForm }
    get get_displayedColumns(){ return this.displayedColumns }  
    get get_dataSource(){ return this.dataSource }
    get get_design_type(){ return this.design_type}
    showBlockInfo(i,ProductId){
        this.hideme[i] = !this.hideme[i];  
        this.Index = i; 
    }

}