import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort'
import { first } from 'rxjs/operators';
import { 
    ExperimentalDesign,
    BlockDesign,
    Replication,
    PlotDesign,
    RowDesign,
    BlockDesignInterface,
    CompleteBlockDesign, 
    IncompleteBlockDesign, 
    ExperimentalDesignInterface,
    CompleteBlockDesignInterface,
    IncompleteBlockDesignInterface } from 'src/app/models/linda/experimental-design';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource} from '@angular/material/table';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from 'src/app/models/linda/person';
import { SelectionComponent } from '../../dialogs/selection.component';

@Component({
  selector: 'app-experimental-design-page',
  templateUrl: './experimental-design-page.component.html',
  styleUrls: ['./experimental-design-page.component.css']
})
export class ExperimentalDesignPageComponent implements OnInit, OnDestroy, AfterViewInit {
    // Input args
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
    BlockDesignForm = new FormGroup({
        totalBlockControl : new FormControl(''),
        totalRowPerBlockControl : new FormControl(''),
        totalColumnPerBlockControl : new FormControl(''),
        totalRowPerPlotControl : new FormControl(''),
        totalBlockPerRowControl : new FormControl('')
    })

    

    
 

    //experimental_design_blocks:BlockDesign[]=[]
    design_types=["CompleteBlockDesign","IncompleteBlockDesign"]
    private design:ExperimentalDesign;
    private block_design_type:string=""
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
    public designLoaded:boolean=false
    public blockDesignLoaded:boolean=false
    public complete_block_design_type:CompleteBlockDesign;
    public incomplete_block_design_type:IncompleteBlockDesign;
    public available_designs:string[]
    public block_design_subtype:string

    ///// TESST PART
    hideme = [];  
    Index: any;  
    /* products = [];  
    countryCode: any;  
    currencySymbol:any;  
    productCountryInformation: any = [];  
    hideme = [];  
    Index: any;  
    countryId: any;  
    country: any;  
    priceToDisplay=[]; */

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
                    this.model_id = params['model_id'];
                    this.mode = params['mode'];
                    this.parent_id = params['parent_id']
                    this.group_key = params['group_key']
                    this.role = params['role']
                    this.grand_parent_id = params['grand_parent_id']
                    this.activeTab=params['activeTab']
                    
                    
                }
              );
              if (this.model_key!==""){
                this.get_design_by_key()
              }
              
    } 

    

    
    showBlockInfo(i,ProductId){
        this.hideme[i] = !this.hideme[i];  
        this.Index = i; 
    }
    get_design_by_key(){
        this.design=new ExperimentalDesign()
        this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
            console.log(data['Blocking'].value[0]['Plot design'].value)
            if (data['Blocking'].value[0]['Complete Block Design'].value.length>0){
                this.block_design_type='CompleteBlockDesign'
                
                this.available_designs=Object.keys(data['Blocking'].value[0]['Complete Block Design'].value[0])
                this.available_designs.forEach(available_design=>{
                     if (data['Blocking'].value[0]['Complete Block Design'].value[0][available_design].value===true){
                        this.block_design_subtype=available_design
                     }
                })
                console.log(Object.keys(data['Blocking'].value[0]['Complete Block Design'].value[0] as CompleteBlockDesign))
                this.complete_block_design_type=data['Blocking'].value[0]['Complete Block Design'].value[0] as CompleteBlockDesign
            }
            else{
                this.block_design_type='IncompleteBlockDesign'
                this.block_design_subtype=data['Blocking'].value[0]['Incomplete Block Design'].value[0].filter(obj => obj.value===true)[0]
                this.available_designs=Object.keys(data['Blocking'].value[0]['Incomplete Block Design'].value[0]  as IncompleteBlockDesign)
                this.incomplete_block_design_type=data['Blocking'].value[0]['Incomplete Block Design'].value[0]  as IncompleteBlockDesign
            }


            
            let tmp_column_num=[]
            data['Blocking'].value[0]['Plot design'].value.filter(val=>tmp_column_num.push(val['Column number'].value))
            let tmp_row_num=[]
            let RowPerPlot=0
            //data['Blocking'].value[0]['Plot design'].value[0]['Row design'].value.filter(val=>tmp_row_num.push(val['Row number'].value))
            let plot_designs=data['Blocking'].value[0]['Plot design'].value

            data['Blocking'].value[0]['Plot design'].value.forEach(val=>{
                val['Row design'].value.forEach(val2=>{
                    tmp_row_num.push(val2['Row number'].value)
                    RowPerPlot=val2['Row per plot'].value
                })
                
            })    
            let column_num= Array.from(new Set(tmp_column_num))
            let row_num= Array.from(new Set(tmp_row_num))
            this.design=data as ExperimentalDesign
            //this.experimental_design_blocks=data['Blocking'].value
            this.totalBlockControl.patchValue(this.get_design.Blocking.value.length)
            this.totalBlockControl.setValue(this.get_design.Blocking.value.length)
            this.totalColumnPerBlockControl.patchValue(column_num.length)
            this.totalColumnPerBlockControl.setValue(column_num.length)
            this.totalRowPerPlotControl.patchValue(RowPerPlot)
            this.totalRowPerPlotControl.setValue(RowPerPlot)
            this.totalRowPerBlockControl.patchValue(row_num.length)
            this.totalRowPerBlockControl.setValue(row_num.length)
            this.totalBlockPerRowControl.patchValue(4)
            this.totalBlockPerRowControl.setValue(4)
            console.log(this.design)
            this.designLoaded=true
            this.blockDesignLoaded=true
        });
    }
    async ngOnInit(){
        this.activeTab="exp_design_info"
        this.block_design_type=""
        console.warn(this.level)
        console.warn(this.model_type)
        console.warn(this.model_key)
        console.warn(this.model_id)
        console.warn(this.mode)
        console.warn(this.parent_id)
        console.warn(this.group_key)
        console.warn(this.role)
        console.warn(this.grand_parent_id)
        console.warn(this.activeTab)
        //this._cdr.detectChanges()
        this.design=new ExperimentalDesign()
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
        
    }
    ngAfterViewInit(){
        /* this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
            this._cdr.detectChanges()
        }); */
    }
    get get_design():ExperimentalDesign{
        return this.design
    }
    changeTab(tab:string){
        this.activeTab=tab
        console.log(this.activeTab)
    }
    onDesignTypeChange(value:string){
        this.block_design_type=value
        console.log(this.block_design_type)
        this.available_designs=[]
        if (this.block_design_type==="CompleteBlockDesign"){
            this.complete_block_design_type=new CompleteBlockDesign(false,false,false)
            console.log(this.complete_block_design_type)
            this.available_designs=Object.keys(this.complete_block_design_type)
        }
        else{
            this.incomplete_block_design_type=new IncompleteBlockDesign(false,false)
            this.available_designs=Object.keys(this.incomplete_block_design_type)
            console.log(this.incomplete_block_design_type)
        }
        console.log(this.available_designs)    
    }
    onExtractDesign(){
        this.designLoaded=false
        this.blockDesignLoaded=false
        console.warn(this.BlockDesignForm.controls)
        this.BlockDesignForm.get('totalBlockControl').value
        this.total_block_number= this.BlockDesignForm.get('totalBlockControl').value
        this.total_column_per_block= this.BlockDesignForm.get('totalColumnPerBlockControl').value
        this.total_row_per_block= this.BlockDesignForm.get('totalRowPerBlockControl').value
        this.total_row_per_plot=this.BlockDesignForm.get('totalRowPerPlotControl').value
        console.warn(this.total_row_per_plot)
       // this.experimental_design_blocks=[]
        /* let blocks=this.total_block_number
        let columns=this.total_column_per_block
        let rows=this.total_row_per_block */
        delete this.design
        
        this.design=new ExperimentalDesign()
        var replication:Replication=new Replication()
        replication.set_replicate_number(3)
        this.design.set_replication(replication)
        //this.design.set_number_of_entries(this.total_block_number*this.total_column_per_block*this.total_row_per_block)
        for (var block=1;block<(this.total_block_number+1);block++){
            var block_design:BlockDesign=new BlockDesign(block, this.total_block_number)
            //console.log(block_design)
            //this.experimental_design_blocks.push(block_design)
            this.design.add_block_design(block_design)
        }
        this.designLoaded=true
        console.log(this.design)
        //console.log(this.design.get_block_design(4))
        //console.log(this.experimental_design_blocks)
    }
    addBiologicalMaterial(){
        const dialogRef = this.dialog.open(SelectionComponent,
            { width: '1400px', autoFocus: true, disableClose: true, maxHeight: '500px', data: { model_id: "", parent_id: this.parent_id, model_type: "biological_material", values: [], already_there: []} }
          );
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              console.log(result)

            }
        })
    }    

    onExtractBlockDesign(){
        this.blockDesignLoaded=false
        console.warn(this.BlockDesignForm.controls)
        this.BlockDesignForm.get('totalBlockControl').value
        this.total_block_number= this.BlockDesignForm.get('totalBlockControl').value
        this.total_column_per_block= this.BlockDesignForm.get('totalColumnPerBlockControl').value
        this.total_row_per_block= this.BlockDesignForm.get('totalRowPerBlockControl').value
        this.total_row_per_plot=this.BlockDesignForm.get('totalRowPerPlotControl').value
        console.warn(this.total_row_per_plot)

       // this.experimental_design_blocks=[]
        /* let blocks=this.total_block_number
        let columns=this.total_column_per_block
        let rows=this.total_row_per_block */
        //delete this.design
        
        
       /*  var replication:Replication=new Replication()
        replication.set_replicate_number(3)
        this.design.set_replication(replication) */
        console.warn(this.total_block_number)
        console.warn(this.total_column_per_block)
        console.warn(this.total_row_per_block)
        console.log(this.design)
        let total_entries=this.total_block_number*this.total_column_per_block*this.total_row_per_block
        this.design.set_number_of_entries(total_entries)
        var plot=1
        this.design.Blocking.value.forEach(block_design=>{
            block_design.clean_plot_design()
        })
        this.design.Blocking.value.forEach(block_design=>{
            
            if (this.block_design_type==="CompleteBlockDesign"){
                this.complete_block_design_type[this.block_design_subtype].value=true
                block_design['Complete Block Design'].value.push(this.complete_block_design_type)
            }
            else{
                this.incomplete_block_design_type[this.block_design_subtype]=true
                block_design['Incomplete Block Design'].value.push(this.incomplete_block_design_type)
            }
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
        })
        this.blockDesignLoaded=true
    }
    
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        
    }
    onSave(){
        this.globalService.update_document(this.model_key, this.design, this.model_type, false).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
                    this.alertService.success(message)
                    return true;
                }
                else {
                    this.alertService.error("this form contains errors! " + data["message"]);
                    return false;
                };


            }
        );
    }
    onAdd(){
        this.globalService.add(this.design, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    //this.ngOnInit();
                    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "studydesign", role: this.role, group_key: this.group_key } });

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

    removeBlock(_block){
        this.get_design.Blocking.value.forEach( (block, index) => {
          if(block === _block) this.get_design.Blocking.value.splice(index,1);
        });
     }
    display_block(_block:BlockDesignInterface){
        console.log(_block['Block number'].value)
        console.log(this.get_design.Blocking.value)
        console.log(this.get_design.Blocking.value.filter(block =>
            block['Block number'].value===_block['Block number'].value
        ))
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
    get get_design_type(){ return this.block_design_type}
    get get_design_subtype(){ return this.block_design_subtype}

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
    close(){
        this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id:  this.parent_id, model_type: 'study', mode: "edit", activeTab: "studydesign", role: this.role, group_key: this.group_key } });
      
          //this.notify.emit("close_study")
          //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type:'investigation', activeTab: 'assStud', mode: "edit" , role: this.get_role, group_key: this.group_key} });
          // Same as delete project and all childs 
      }

}