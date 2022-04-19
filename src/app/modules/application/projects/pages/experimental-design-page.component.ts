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
  selector: 'app-experimental-design-page',
  templateUrl: './experimental-design-page.component.html',
  styleUrls: ['./experimental-design-page.component.css']
})
export class ExperimentalDesignPageComponent implements OnInit, OnDestroy, AfterViewInit {

    BlockDesignForm = new FormGroup({
        totalBlockControl : new FormControl(''),
        totalRowPerBlockControl : new FormControl(''),
        totalColumnPerBlockControl : new FormControl(''),
        totalRowPerPlotControl : new FormControl(''),
        totalBlockPerRowControl : new FormControl('')
    })

    // Input args
    @Input('level') level: number;
    @Input('parent_id') parent_id:string;
    @Input('model_key') model_key: string;
    @Input('model_type') model_type: string;
    @Input('mode') mode: string;
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
    design_types=["BlockDesign", "CompleteBlockDesign","IncompleteBlockDesign"]
    private design:ExperimentalDesign;
    private design_type:string
    private total_block_number:number=0
    private total_column_per_block:number=0
    private total_row_per_block:number=0
    private total_row_per_plot:number=0
    private total_block_per_row:number=0
    private dataSource: MatTableDataSource<ExperimentalDesignInterface>;
    private displayedColumns: string[] = ['Blocks per trial', 'edit'];
    private study_id:string
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
                    this.level = params['level'];
                    this.model_type = params['model_type'];
                    this.model_key = params['model_key'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.study_id="studies/"+this.model_key
                }
              );
    } 
    ngAfterViewInit(){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._cdr.detectChanges()
        
    }
    showBlockInfo(i,ProductId){
        this.hideme[i] = !this.hideme[i];  
        this.Index = i; 
    }
    
    async ngOnInit(){
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
    async get_all_experimental_designs() {
        const data = await this.globalService.get_all_experimental_designs(this.model_key).toPromise()
        if (data.length>0){
            console.log(data[0].Blocking.value[0]['Blocks per trial']['value'])
            this.experimental_designs=data
            console.log(this.experimental_designs)
            
        }
        /* return this.globalService.get_all_experimental_designs(this.model_key).toPromise().then(
            data => {
                if (data.length>0){
                    console.log(data[0].Blocking.value[0]['Blocks per trial']['value'])
                    this.experimental_designs=data
                    
                }
            }
        ) */
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

    get total_block_control(){ return this.BlockDesignForm.get('totalBlockControl')}
    get total_row_per_block_control(){ return this.BlockDesignForm.get('totalRowPerBlockControl')}
    get total_column_per_block_control(){ return this.BlockDesignForm.get('totalColumnPerBlockControl')}
    get total_row_per_plot_control(){ return this.BlockDesignForm.get('totalRowPerPlotControl')}
    get total_block_per_row_control(){ return this.BlockDesignForm.get('totalBlockPerRowControl')}
    save(){
        this.globalService.add(this.design, this.model_type, this.study_id, false).pipe(first()).toPromise().then(
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
        const dialogRef = this.dialog.open(ConfirmationComponent, { width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    this.globalService.remove(element._id).pipe(first()).toPromise().then(
                        data => {
                            ////console.log(data)
                            if (data["success"]) {
                                console.log(data["message"])
                                var message = element._id + " has been removed from your history !!"
                                this.alertService.success(message)
                                this.ngOnInit()
                            }
                            else {
                                this.alertService.error("this form contains errors! " + data["message"]);
                            }
                        });
                }
            }
            //this.reloadComponent(['/projects'])
        });
    }
    add(element:ExperimentalDesignInterface){
  
    }
    onEdit(element:ExperimentalDesignInterface){
  
    }
    removeBlock(_block){
        this.experimental_design_blocks.forEach( (block, index) => {
          if(block === _block) this.experimental_design_blocks.splice(index,1);
        });
     }
    display_block(_block:BlockDesignInterface){
        console.log(_block['Block number'].value)
        console.log(this.experimental_design_blocks)
        console.log(this.experimental_design_blocks.filter(block =>
            block['Block number'].value===_block['Block number'].value
        ))
    }

    onDesignTypeChange(value:string){
        this.design_type=value
        console.log(this.design_type)
    }

    onSubmit(){
        console.warn(this.BlockDesignForm.value);
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
    get get_design_type(){
        return this.design_type
    }
    get totalBlockControl(){
        return this.BlockDesignForm.get('totalBlockControl');
    }
    get totalColumnPerBlockControl(){
        return this.BlockDesignForm.get('totalColumnPerBlockControl');
    }
    get totalRowPerBlockControl(){
        return this.BlockDesignForm.get('totalRowPerBlockControl');
    }
    get totalRowPerPlotControl(){
        return this.BlockDesignForm.get('totalRowPerPlotControl');
    }
    get get_BlockDesignForm(){
        return this.BlockDesignForm
    }
    get get_displayedColumns(){
        return this.displayedColumns
    }  
    get get_dataSource(){
        return this.dataSource
    }

}