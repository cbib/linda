import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GlobalService, AlertService, OntologiesService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { first } from 'rxjs/operators';
import structuredClone from '@ungap/structured-clone';
import * as uuid from 'uuid';
import {ChipListComponent} from 'src/app/components/chip-list/chip-list.component'

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
    IncompleteBlockDesignInterface,
    PlotDesignInterface
} from 'src/app/models/linda/experimental-design';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../../dialogs/confirmation.component'
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from 'src/app/models/linda/person';
import { SelectionComponent } from '../../dialogs/selection.component';
import { AssociateBiologicalMaterial } from '../../dialogs/associate-biological-material.component';
import { AssociateObservationUnit } from '../../dialogs/associate-observation-unit.component';
import { BiologicalMaterialFullInterface } from 'src/app/models/linda/biological-material';
import { timeStamp } from 'console';
import { SampleSelectionComponent } from '../../dialogs/sample-selection.component';
import { AssociateObservedVariable } from '../../dialogs/associate-observed-variable.component';
import { PlotOverviewComponent } from '../../dialogs/plot-overview.component';
import { AssociateExperimentalFactorComponent } from '../../dialogs/associate-experimental-factor.component';
import { ExperimentalFactor } from 'src/app/models/linda/experimental_factor';
import { indexOf } from 'lodash';

export interface subComponent{
    'Associated biological material':[]
    'Associated sample':[]
}

export interface ExperimentalFactorNames {
    name: string;
  }

@Component({
    selector: 'app-experimental-design-page',
    templateUrl: './experimental-design-page.component.html',
    styleUrls: ['./experimental-design-page.component.css']
})
export class ExperimentalDesignPageComponent implements OnInit, OnDestroy, AfterViewInit {
    // Input args
    @Input('level') level: number;
    @Input('parent_id') parent_id: string;
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
        totalBlockControl: new FormControl(''),
        totalRowPerBlockControl: new FormControl(''),
        totalColumnPerBlockControl: new FormControl(''),
        totalRowPerPlotControl: new FormControl(''),
        totalBlockPerRowControl: new FormControl('')
    })
    plot_sub_components:subComponent[] = []
    bm_data = []
    //experimental_design_blocks:BlockDesign[]=[]
    design_types = ["CompleteBlockDesign", "IncompleteBlockDesign"]
    private design: ExperimentalDesign;
    private block_design_type: string = ""
    private total_block_number: number = 0
    private total_column_per_block: number = 0
    private total_row_per_block: number = 0
    private total_row_per_plot: number = 0
    private total_block_per_row: number = 0
    private dataSource: MatTableDataSource<ExperimentalDesignInterface>;
    private displayedColumns: string[] = ['Blocks per trial', 'edit'];
    private study_id: string
    private experimental_designs: ExperimentalDesignInterface[] = []
    private currentUser: UserInterface
    public designLoaded: boolean = false
    public blockDesignLoaded: boolean = false
    public biologicalMaterialLoaded: boolean = false
    public observationUnitLoaded: boolean = false
    public sampleLoaded: boolean = false;
    public complete_block_design_type: CompleteBlockDesign;
    public incomplete_block_design_type: IncompleteBlockDesign;
    public available_designs: string[]
    public block_design_subtype: string
    public block_index: number = 0
    public plot_index: number = 0
    public material_id: string = ""
    public selected_factor_id:string=""
    public selected_factor_values:string[]=[]
    factors_col = [
        'LightCoral',
        'lightblue',
        'Silver',
        'lightgreen',
        'Gainsboro',
        'LightPink',
        'Orange',
        'DarkKhaki',
        'AntiqueWhite',
        'CornflowerBlue',
        'DarkMagenta',
        'LavenderBlush',
        'Turquoise'
      ]
    sample_data = []
    panel_disabled: boolean = false
    panel_expanded: boolean = false

    ///// TESST PART
    hideme = [];
    secondhideme = [];
    thirdhideme = [];
    obsthirdhideme = [];
    Index: any;
    SecondIndex: any;
    ThirdIndex: any;
    obsThirdIndex: any;
    experimentalFactorNames: ExperimentalFactorNames[]=[];

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
        private formBuilder: FormBuilder,
        private _cdr: ChangeDetectorRef,
        public dialog: MatDialog) {
        this.block_index = 0
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
                this.activeTab = params['activeTab']
            }
        );
        if (this.model_key !== "") {
            this.get_design_by_key()
        }

    }
    async ngOnInit() {
        this.activeTab = "exp_design_info"
        this.block_design_type = ""
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
        this.design = new ExperimentalDesign()
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
    }
    ngAfterViewInit() {
        /* this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
            this._cdr.detectChanges()
        }); */
    }
    get_collection_dates(blocknum:number,plotnum:number){
        return Array.from(new Set(this.design.Blocking.value.filter(block=> block['Block number'].value===blocknum)[0]['Plot design'].value.filter(plot=>plot['Plot number'].value===plotnum)[0].get_samples().map(sample=>sample['Collection date'])))
    }
    get_observation_dates(blocknum:number,plotnum:number){
        return Array.from(new Set(this.design.Blocking.value.filter(block=> block['Block number'].value===blocknum)[0]['Plot design'].value.filter(plot=>plot['Plot number'].value===plotnum)[0].get_observations().map(observation=>observation['Observation date'])))
    }
    get_sample_plot_sub_components(blocknum:number, plotnum:number, date:Date){
        return this.design.Blocking.value.filter(block=> block['Block number'].value===blocknum)[0]['Plot design'].value.filter(plot=>plot['Plot number'].value===plotnum)[0].get_samples().filter(sample=>sample['Collection date']===date)
    }
    get_observation_plot_sub_components(blocknum:number, plotnum:number, date:Date){
        return this.design.Blocking.value.filter(block=> block['Block number'].value===blocknum)[0]['Plot design'].value.filter(plot=>plot['Plot number'].value===plotnum)[0].get_observations().filter(observation=>observation['Observation date']===date)
    }

    get_design_by_key() {
        this.globalService.get_experimental_design_by_key(this.model_key).toPromise().then(async res => {
            if (res.success) {
                let data = res.data
                console.log(data['Blocking'].value[0]['Plot design'].value)

                let tmp_column_num = []
                data['Blocking'].value[0]['Plot design'].value.filter(val => tmp_column_num.push(val['Column number'].value))
                let tmp_row_num = []
                let RowPerPlot = 0
                //data['Blocking'].value[0]['Plot design'].value[0]['Row design'].value.filter(val=>tmp_row_num.push(val['Row number'].value))
                //let plot_designs=data['Blocking'].value[0]['Plot design'].value
                data['Blocking'].value[0]['Plot design'].value.forEach(val => {
                    val['Row design'].value.forEach(val2 => {
                        tmp_row_num.push(val2['Row number'].value)
                        RowPerPlot = val2['Row per plot'].value
                    })

                })
                if (data['Blocking'].value[0]['Complete Block Design'].value.length > 0) {
                    this.block_design_type = 'CompleteBlockDesign'
                    this.available_designs = Object.keys(data['Blocking'].value[0]['Complete Block Design'].value[0])
                    this.available_designs.forEach(available_design => {
                        if (data['Blocking'].value[0]['Complete Block Design'].value[0][available_design].value === true) {
                            this.block_design_subtype = available_design
                        }
                    })
                    console.log(Object.keys(data['Blocking'].value[0]['Complete Block Design'].value[0] as CompleteBlockDesign))
                    this.complete_block_design_type = data['Blocking'].value[0]['Complete Block Design'].value[0] as CompleteBlockDesign
                }
                else {
                    this.block_design_type = 'IncompleteBlockDesign'
                    this.available_designs = Object.keys(data['Blocking'].value[0]['Incomplete Block Design'].value[0] as IncompleteBlockDesign)
                    this.available_designs.forEach(available_design => {
                        if (data['Blocking'].value[0]['Incomplete Block Design'].value[0][available_design].value === true) {
                            this.block_design_subtype = available_design
                        }
                    })

                    this.incomplete_block_design_type = data['Blocking'].value[0]['Incomplete Block Design'].value[0] as IncompleteBlockDesign
                }



                let column_num = Array.from(new Set(tmp_column_num))
                let row_num = Array.from(new Set(tmp_row_num))
                this.design = new ExperimentalDesign()
                var replication: Replication = new Replication()
                Object.assign(replication, data.Replication.value)
                this.design.set_replication(replication)
                if (data['Associated sample ID'].value!==null){
                    this.design.set_sample_id(data['Associated sample ID'].value)
                }
                if (data['Associated observed variable IDs'].value.length > 0){
                    this.design.set_observed_variable_id(data['Associated observed variable IDs'].value)    
                }
                if (data['Associated experimental factor IDs'].value.length > 0){
                    this.design.set_experimental_factor_id(data['Associated experimental factor IDs'].value) 
                    data['Associated experimental factor IDs'].value.forEach(factor=>{
                        this.experimentalFactorNames.push({ name: factor})
                    })
                    this.selected_factor_id=data['Associated experimental factor IDs'].value[0]
                    
                       
                }
                if (data['Associated observations'].value.length > 0){
                    this.design.set_associated_observations(data['Associated observations'].value)    
                }
                if (data['Associated sample'].value.length > 0) {
                    this.design.set_associated_samples(data['Associated sample'].value)
                    this.sampleLoaded = true
                }
                if (data['Associated observation units'].value !== null) {
                    this.design.set_observation_unit_id(data['Associated observation units'].value)

                    const observation_unit_childs_data = await this.globalService.get_all_observation_unit_childs_by_type(data['Associated observation units'].value.split("/")[1], 'biological_materials').toPromise()//.then(observation_unit_childs_data => {
                    console.log(observation_unit_childs_data)
                    //get all biological materials
                    if (observation_unit_childs_data.length > 0) {
                        let data = []
                        data = observation_unit_childs_data
                        var child_id: string = data[0]['e']['_to']
                        var tmp_bm: [] = data[0]['e']['biological_materials']
                        this.bm_data = this.bm_data.concat(tmp_bm)
                    }




                }

                //this.design=ExperimentalDesign.create_design(data)
                console.log(this.design)
                ///Object.assign(this.design, data);
                //structuredClone
                //this.design=JSON.parse(JSON.stringify(data))
                //this.design=structuredClone(data)
                //this.design=JSON.parse(JSON.stringify(data));
                data.Blocking.value.forEach(block => {
                    let new_block_design = new BlockDesign(block['Block number'].value, data.Blocking.value.length)
                    if (block['Complete Block Design'].value.length > 0) {
                        new_block_design.add_complete_block_design(this.complete_block_design_type)
                    }
                    else {
                        new_block_design.add_incomplete_block_design(this.incomplete_block_design_type)
                    }
                    //new_block_design=BlockDesign.create_block_design(block)
                    block['Plot design'].value.forEach(plot_design => {
                        if (!this.selected_factor_values.includes(plot_design.Associated_factor_values.value[0])){
                            this.selected_factor_values.push(plot_design.Associated_factor_values.value[0])
                        }
                        let new_plot_design = new PlotDesign(plot_design['Column number'].value, plot_design['Plot number'].value, plot_design['Associate_material_source'].value, plot_design['Associated_biological_material'].value,plot_design.Associated_factor_values.value, plot_design['Replicate number'].value)
                        //new_plot_design=PlotDesign.create_plot_design(plot_design)
                        //Object.assign(new_plot_design, plot_design)
                        if (plot_design['Observation unit uuid'].value !== null) {
                            new_plot_design.set_observation_uuid(plot_design['Observation unit uuid'].value)
                        }
                        if (plot_design['Associated samples'].value !== null) {
                            new_plot_design.set_samples(plot_design['Associated samples'].value)
                        }
                        if (plot_design['Associated plot observations'].value !== null) {
                            new_plot_design.set_observations(plot_design['Associated plot observations'].value)
                        }
                        plot_design['Row design'].value.forEach(row_design => {
                            //let new_row_design=new RowDesign()
                            let new_row_design = RowDesign.create_row_design(row_design)
                            //Object.assign(new_row_design, row_design)
                            this.total_row_per_plot = row_design['Row per plot'].value
                            new_plot_design['Row design'].value.push(new_row_design)
                            //Object.assign(new_row_design, row_design)
                        })
                        new_block_design['Plot design'].value.push(new_plot_design)
                        //Object.assign(new_plot_design, plot_design)
                    })
                    this.design.Blocking.value.push(new_block_design)
                    //Object.assign(new_block_design, block)
                })
                //replication.set_replicate_number(data.Replication.value.get_replicate_number())
                this.total_block_number = data.Blocking.value.length
                this.total_column_per_block = column_num.length
                this.total_row_per_block = row_num.length
                let total_entries = this.total_block_number * this.total_column_per_block * (this.total_row_per_block / this.total_row_per_plot)
                this.design.set_number_of_entries(total_entries)
                if (data["Associated biological Materials"].value !== null) {
                    this.material_id = data["Associated biological Materials"].value
                    this.design.set_biological_material_id(data["Associated biological Materials"].value)
                }
                this.design.set_block_per_row(data['Block per Row'].value)
                //this.design=data
                //this.design=data as ExperimentalDesign
                //console.log(Object.keys(this.design).filter((key) => typeof this.design[key] === 'function').map((key) => this.design[key]))
                //this.experimental_design_blocks=data['Blocking'].value
                this.totalBlockControl.patchValue(this.get_design.Blocking.value.length)
                this.totalBlockControl.setValue(this.get_design.Blocking.value.length)
                this.totalColumnPerBlockControl.patchValue(column_num.length)
                this.totalColumnPerBlockControl.setValue(column_num.length)
                this.totalRowPerPlotControl.patchValue(RowPerPlot)
                this.totalRowPerPlotControl.setValue(RowPerPlot)
                this.totalRowPerBlockControl.patchValue(row_num.length)
                this.totalRowPerBlockControl.setValue(row_num.length)
                console.log(data['Block per Row'].value)
                this.totalBlockPerRowControl.patchValue(this.get_design.get_block_per_row())
                this.totalBlockPerRowControl.setValue(this.get_design.get_block_per_row())
                console.log(this.design)
                this.designLoaded = true
                this.blockDesignLoaded = true
                if (data['Blocking'].value[0]['Plot design'].value[0]['Associate_material_source'].value !== null) {
                    this.biologicalMaterialLoaded = true
                }
                if (data['Associated observation units'].value !== null) {
                    this.observationUnitLoaded = true
                }
                this.get_collection_dates(1,1)
            }
        });

    }
    onDesignTypeChange(value: string) {
        this.block_design_type = value
        console.log(this.block_design_type)
        this.available_designs = []
        if (this.block_design_type === "CompleteBlockDesign") {
            this.complete_block_design_type = new CompleteBlockDesign(false, false, false)
            console.log(this.complete_block_design_type)
            this.available_designs = Object.keys(this.complete_block_design_type)
            this.available_designs.push
        }
        else {
            this.incomplete_block_design_type = new IncompleteBlockDesign(false, false)
            this.available_designs = Object.keys(this.incomplete_block_design_type)
            console.log(this.incomplete_block_design_type)
        }
        console.log(this.available_designs)
    }
    onExtractDesign() {
        this.designLoaded = false
        this.blockDesignLoaded = false
        if  (this.design['Associated biological Materials'].value!==null){
            this.removeBiologicalMaterial()
        }
        
        console.warn(this.BlockDesignForm.controls)
        this.BlockDesignForm.get('totalBlockControl').value
        this.total_block_number = this.BlockDesignForm.get('totalBlockControl').value
        this.total_column_per_block = this.BlockDesignForm.get('totalColumnPerBlockControl').value
        this.total_row_per_block = this.BlockDesignForm.get('totalRowPerBlockControl').value
        this.total_row_per_plot = this.BlockDesignForm.get('totalRowPerPlotControl').value
        this.total_block_per_row = this.totalBlockPerRowControl.value
        console.warn(this.total_row_per_plot)
        // this.experimental_design_blocks=[]
        /* let blocks=this.total_block_number
        let columns=this.total_column_per_block
        let rows=this.total_row_per_block */
        delete this.design

        this.design = new ExperimentalDesign()
        var replication: Replication = new Replication()
        replication.set_replicate_number(3)
        this.design.set_replication(replication)
        this.design.set_block_per_row(this.total_block_per_row)
        //this.design.set_number_of_entries(this.total_block_number*this.total_column_per_block*this.total_row_per_block)
        for (var block = 1; block < (this.total_block_number + 1); block++) {
            var block_design: BlockDesign = new BlockDesign(block, this.total_block_number)
            //console.log(block_design)
            //this.experimental_design_blocks.push(block_design)
            this.design.add_block_design(block_design)
        }
        this.designLoaded = true
        console.log(this.design)
        console.log(Object.keys(this.design).filter((key) => typeof this.design[key] === 'function').map((key) => this.design[key]))
        //console.log(this.design.get_block_design(4))
        //console.log(this.experimental_design_blocks)
    }
    onExtractBlockDesign() {
        this.blockDesignLoaded = false
        if  (this.design['Associated biological Materials'].value!==null){
            this.removeBiologicalMaterial()
        }
        console.warn(this.BlockDesignForm.controls)
        this.BlockDesignForm.get('totalBlockControl').value
        this.total_block_number = this.BlockDesignForm.get('totalBlockControl').value
        this.total_column_per_block = this.BlockDesignForm.get('totalColumnPerBlockControl').value
        this.total_row_per_block = this.BlockDesignForm.get('totalRowPerBlockControl').value
        this.total_row_per_plot = this.BlockDesignForm.get('totalRowPerPlotControl').value
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
        let total_entries = this.total_block_number * this.total_column_per_block * (this.total_row_per_block / this.total_row_per_plot)
        this.design.set_number_of_entries(total_entries)

        var plot = 1
        this.design.Blocking.value.forEach(block_design => {
            block_design.clean_plot_design()
            block_design['Complete Block Design'].value=[]
            block_design['Incomplete Block Design'].value=[]
        })

        this.design.Blocking.value.forEach(block_design => {
            if (this.block_design_type === "CompleteBlockDesign") {
                //this.complete_block_design_type[this.block_design_subtype].value = true
                block_design['Complete Block Design'].value.push(this.complete_block_design_type)
            }
            else {
                //this.incomplete_block_design_type[this.block_design_subtype] = true
                block_design['Incomplete Block Design'].value.push(this.incomplete_block_design_type)
            }
            for (var column = 1; column < this.total_column_per_block + 1; column++) {
                //var plot_design=new PlotDesign()
                for (var row = 1; row < this.total_row_per_block + 1; row++) {
                    var row_design: RowDesign = new RowDesign()
                    row_design.set_row_number(row)
                    row_design.set_row_per_plot(this.total_row_per_plot)

                    if (row % this.total_row_per_plot === 0) {
                        var plot_design = new PlotDesign()
                        plot_design.set_column_number(column)
                        plot_design.set_plot_number(plot)
                        plot_design.add_row_design(row_design)
                        block_design.add_plot_design(plot_design)
                        //var plot_design:PlotDesign=new PlotDesign()
                        plot++
                    }
                    else {
                        plot_design.add_row_design(row_design)
                    }
                    /* else{
                        block_design.add_plot_design(plot_design)
                    } */
                }
            }
        })
        this.blockDesignLoaded = true

        /* if (!this.block_design_subtype) {
            this.alertService.error("You have to define which design subtypes first")
        }
        else {
            this.design.Blocking.value.forEach(block_design => {
                if (this.block_design_type === "CompleteBlockDesign") {
                    this.complete_block_design_type[this.block_design_subtype].value = true
                    block_design['Complete Block Design'].value.push(this.complete_block_design_type)
                }
                else {
                    this.incomplete_block_design_type[this.block_design_subtype] = true
                    block_design['Incomplete Block Design'].value.push(this.incomplete_block_design_type)
                }
                for (var column = 1; column < this.total_column_per_block + 1; column++) {
                    //var plot_design=new PlotDesign()
                    for (var row = 1; row < this.total_row_per_block + 1; row++) {
                        var row_design: RowDesign = new RowDesign()
                        row_design.set_row_number(row)
                        row_design.set_row_per_plot(this.total_row_per_plot)

                        if (row % this.total_row_per_plot === 0) {
                            var plot_design = new PlotDesign()
                            plot_design.set_column_number(column)
                            plot_design.set_plot_number(plot)
                            plot_design.add_row_design(row_design)
                            block_design.add_plot_design(plot_design)
                            //var plot_design:PlotDesign=new PlotDesign()
                            plot++
                        }
                        else {
                            plot_design.add_row_design(row_design)
                        }

                    }
                }
            })
            this.blockDesignLoaded = true
        } */
    }
    addObservationUnits() {
        const dialogRef = this.dialog.open(AssociateObservationUnit, { disableClose: true, width: '1400px', autoFocus: true, maxHeight: '1000px', data: { model_id: "", parent_id: this.parent_id, model_type: "observation_unit", material_id: this.material_id, design: this.design, mode: 'create', model_key: '' } });
        dialogRef.afterClosed().subscribe(async result => {
            if (result.event === 'Confirmed') {
                console.log(result.observation_unit_id)
                this.design.set_observation_unit_id(result.observation_unit_id)
                this.design.Blocking.value.forEach(block => {
                    block['Plot design'].value.forEach(plot => {
                        plot.set_observation_uuid(result.obsuuids[plot['Plot number'].value])
                        this.observationUnitLoaded = true
                    })
                })
                const observation_unit_childs_data = await this.globalService.get_all_observation_unit_childs_by_type(result.observation_unit_id.split("/")[1], 'biological_materials').toPromise()//.then(observation_unit_childs_data => {
                console.log(observation_unit_childs_data)
                //get all biological materials
                if (observation_unit_childs_data.length > 0) {
                    let data = []
                    data = observation_unit_childs_data
                    var child_id: string = data[0]['e']['_to']
                    var tmp_bm: [] = data[0]['e']['biological_materials']
                    this.bm_data = this.bm_data.concat(tmp_bm)
                    if (this.mode==='create'){
                        this.onAdd()
                    }
                    else{
                        this.onSave()
                    }
                }
            }
        });
        console.log(this.design)
    }
    async removeObservationUnits(confirm:boolean=true) {
        if  (confirm){
            const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'removeobs_unit', model_type: "observation_unit" } });
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result) {
                    if (result.event == 'Confirmed') {
                        let obs_unit_id_to_remove = this.design.get_observation_unit_id()
                        this.design.set_observation_unit_id(null)
                        this.design.Blocking.value.forEach(block_design => {
                            block_design['Plot design'].value.forEach(plot_design => {
                                plot_design['Observation unit uuid'].value = null
                            })
                        });
                        this.observationUnitLoaded = false
                        await this.globalService.remove_observation_unit(obs_unit_id_to_remove).toPromise()
                        this.removeSample(false)
                        if (this.mode==='create'){
                            this.onAdd()
                        }
                        else{
                            this.onSave()
                        }
                    }
                }
            });
        }
        else{
            let obs_unit_id_to_remove = this.design.get_observation_unit_id()
            this.design.set_observation_unit_id(null)
            this.design.Blocking.value.forEach(block_design => {
                block_design['Plot design'].value.forEach(plot_design => {
                    plot_design['Observation unit uuid'].value = null
                })
            });
            this.observationUnitLoaded = false
            await this.globalService.remove_observation_unit(obs_unit_id_to_remove).toPromise()
            this.removeSample(false)
            if (this.mode==='create'){
                this.onAdd()
            }
            else{
                this.onSave()
            }
        }
        
    }

    addExperimentalFactor() {
        console.log(this.parent_id)
        const dialogRef = this.dialog.open(AssociateExperimentalFactorComponent, {
            disableClose: true,
            width: '1400px',
            autoFocus: true,
            maxHeight: '800px',
            data: {
                model_id: "",
                parent_id: this.parent_id,
                model_type: "experimental_factor",
                total_available_plots: this.design['number of entries'].value,
                role: this.role,
                grand_parent_id: this.grand_parent_id,
                available_designs:this.available_designs,
                group_key: this.group_key,
                design:this.design,
                total_blocks_per_row:this.totalBlockPerRowControl.value,
                block_design_type:this.block_design_type,
                total_columns_per_block:this.totalColumnPerBlockControl.value
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result)
                result.selected_experimental_factor.forEach(async exp_fac=>{
                    let selected_experimental_factor: ExperimentalFactor = exp_fac
                    if (!this.design.get_experimental_factor_ids().includes(selected_experimental_factor._id)){
                        this.design.add_experimental_factor_id(selected_experimental_factor._id)
                        this.selected_factor_id=selected_experimental_factor._id
                        this.experimentalFactorNames.push({ name: selected_experimental_factor._id});
                        this.selected_factor_values=selected_experimental_factor['Experimental Factor values'].split(';')
                        let plot_index=0
                        this.design.Blocking.value.forEach(block => {
                            if (this.block_design_type === "CompleteBlockDesign") {
                                block['Complete Block Design'].value[0][result.block_design_subtype].value=true
                            }
                            else{
                                block['Incomplete Block Design'].value[0][result.block_design_subtype].value=true
                            }
                            block['Plot design'].value.forEach(plot => {
                                plot.add_factor_values(result.experimental_factor_values[plot_index+1]['factor_value'])
                                console.log(plot.Associated_factor_values.value)
                                //plot.add_factor_values('test')
                                plot_index++
                            });
                        });
                        //  update all observation unit factor value
                        //const data = await this.globalService.add_observation_units_factor_value( result.experimental_factor_values , this.design.get_observation_unit_id()).toPromise()
                    }
                    else{
                        this.alertService.error("this factor is already associated with this design")
                    }
                });



            }
        });
    }
    get_background_color(index: number, subtype: string = "") {
        /* console.log(index)
        if (subtype === 'completely randomized design') {
          console.log(subtype)
        }
        else if (subtype === 'Randomized complete block design') {
          console.log(subtype)
        }
        else if (subtype === 'Balanced incomplete design') {
          console.log(subtype)
        }
        else if (subtype === 'Partially balanced design') {
          console.log(subtype)
        }
        else if (subtype === 'Latin square') {
          console.log(subtype)
        }
        else {
          console.log(subtype)
        } */
        if (this.design.get_experimental_factor_ids().length>0){
            //get factor index
            let factor_value_index=indexOf(this.design.get_experimental_factor_ids(), this.selected_factor_id)
            //console.log(indexOf(this.selected_factor_values,this.design.get_block_plot_design(index+1).get_factor_values()[factor_value_index]))
            //console.log(this.selected_factor_values)

            //get factor values 
            //console.log(this.design.get_block_plot_design(index).Associated_factor_values)
            //console.log(this.experimentalFactorNames)

            return this.factors_col[indexOf(this.selected_factor_values,this.design.get_block_plot_design(index+1).get_factor_values()[factor_value_index])]
        }
        else{
            return  'lightgreen' 
        }
        
    
    
      }
    onBlockIndexChange(value){
        console.log(value)
        this.block_index = value
    }
    get get_block_index(){
        return this.block_index
    }
    get_output_from_ExpFactorNamesForm(val: any) {
        
        //remove factor mode
        if(val.skills.length<this.experimentalFactorNames.length) {
            //remove factor ids and factor valuess in each plot
        }
        //select factor mode
        else if (val.skills.length===this.experimentalFactorNames.length){
            this.selected_factor_id=val.selected_skill
            this.selected_factor_values=[]
            let factor_value_index=indexOf(this.design.get_experimental_factor_ids(), this.selected_factor_id)
            this.design.Blocking.value.forEach(block => {
                block['Plot design'].value.forEach(plot => {
                    if (!this.selected_factor_values.includes(plot.get_factor_values()[factor_value_index]))
                    this.selected_factor_values.push(plot.get_factor_values()[factor_value_index])
                })
            })
            
            // get index  off  this factor in design
            // get all factor values in each plot at this index
            // get unique entry 
        }
        //add factor
        else{
            this.selected_factor_id=val.selected_skill
            this.selected_factor_values=[]
            console.log(val.selected_skill)
            this.experimentalFactorNames = val.skills
            let factor_value_index=indexOf(this.design.get_experimental_factor_ids(), this.selected_factor_id)
            this.design.Blocking.value.forEach(block => {
                block['Plot design'].value.forEach(plot => {
                    if (!this.selected_factor_values.includes(plot.get_factor_values()[factor_value_index]))
                    this.selected_factor_values.push(plot.get_factor_values()[factor_value_index])
                })
            })

        }
        
    }
    get_background_code_color(index: number) {

        return this.factors_col[index + 1]
      }
    get get_factor_values(){
        return this.selected_factor_values
    }
    removeExperimentalFactor() {
        const dialogRef = this.dialog.open(AssociateExperimentalFactorComponent, {
            disableClose: true,
            width: '1400px',
            autoFocus: true,
            maxHeight: '800px',
            data: {
                model_id: "",
                parent_id: this.parent_id,
                model_type: "biological_material",
                total_available_plots: this.design['number of entries'].value,
                role: this.role,
                grand_parent_id: this.grand_parent_id,
                group_key: this.group_key,
                design:this.design
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result)
                
            }
        });
    }

    addBiologicalMaterial() {
        const dialogRef = this.dialog.open(AssociateBiologicalMaterial, {
            disableClose: true,
            width: '1400px',
            autoFocus: true,
            maxHeight: '800px',
            data: {
                model_id: "",
                parent_id: this.parent_id,
                model_type: "biological_material",
                total_available_plots: this.design['number of entries'].value,
                role: this.role,
                grand_parent_id: this.grand_parent_id,
                group_key: this.group_key
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result)
                let selected_material: BiologicalMaterialFullInterface = result.selected_material
                let mat_list = selected_material['Material source ID (Holding institute/stock centre, accession)']
                let plot_num = 1
                let rep = parseInt(selected_material.replication[0])
                this.design.set_biological_material_id(selected_material["_id"])
                this.material_id = selected_material["_id"]
                for (let replicate_index = 0; replicate_index < parseInt(selected_material.replication[0]); replicate_index++) {
                    console.log(replicate_index)
                    for (let matindex = 0; matindex < mat_list.length; matindex++) {
                        //console.log(matindex)
                        const element = mat_list[matindex];
                        //console.log(plot_num)
                        //console.log(this.design.get_block_plot_design(plot_num))
                        //this.design.get_block_plot_design(plot_num) as PlotDesign
                        this.design.get_block_plot_design(plot_num).add_material(element)
                        this.design.get_block_plot_design(plot_num).set_replicate_number(replicate_index + 1)
                        let bm_list = selected_material['Biological material ID'][matindex]
                        bm_list = bm_list.filter(biomat => biomat.includes("rep" + (replicate_index + 1) + "_"))
                        for (let bmindex = 0; bmindex < bm_list.length; bmindex++) {
                            const element2 = bm_list[bmindex];
                            this.design.get_block_plot_design(plot_num).add_biological_material(element2)
                        }
                        plot_num++
                        this.biologicalMaterialLoaded = true
                    }
                }
            }
        })
        /* const dialogRef = this.dialog.open(SelectionComponent,
                { width: '1400px', autoFocus: true, disableClose: true, maxHeight: '800px', data: { model_id: "", parent_id: this.parent_id, model_type: "biological_material", values: [], already_there: []} }
              );
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  console.log(result)
    
                }
            }) 
        */
    }

    removeBiologicalMaterial() {
        const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, all_childs: true, mode: 'unlinkbm', model_type: "biological_material" } });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                if (result.event == 'Confirmed') {
                    this.design['Associated biological Materials'].value=null
                    this.design['Associated sample ID'].value=null
                    this.design.Blocking.value.forEach(block_design => {
                        block_design['Plot design'].value.forEach(plot_design => {
                            plot_design.Associate_material_source.value = null
                            plot_design.Associated_biological_material.value = []
                            plot_design['Replicate number'].value = null
                        })
                    })
                    this.biologicalMaterialLoaded = false
                    if (this.design.get_observation_unit_id()!==null){
                        this.removeObservationUnits(false)
                    }
                    if (this.design.get_sample_id()!==null){
                        this.removeSample(false)
                    }
                    if (this.mode==='create'){
                        this.onAdd()
                    }
                    else{
                        this.onSave()
                    }
                }
            }
        });
    }

    extractSample() {
        //first  get bm data
        let obs_uuids = []
        this.design.Blocking.value.forEach(block => {
            block['Plot design'].value.forEach(plot => {
                obs_uuids.push(plot.get_observation_uuid())
            })
        })
        const dialogRef = this.dialog.open(SampleSelectionComponent,
            { 
                disableClose: true, 
                width: '1400px', 
                autoFocus: true, 
                restoreFocus: false, 
                maxHeight: '800px', 
                data: { 
                    model_id: "", 
                    parent_id: this.parent_id, 
                    bm_data: this.bm_data, 
                    model_type: "sample", 
                    values: [], 
                    observation_id: obs_uuids 
                } 
            }
        );
        dialogRef.afterClosed().subscribe(async res => {
            if (res.event === 'Confirmed') {
                console.log(res.sample_data)
                let result: [] = res.sample_data
                const data = await this.globalService.add_observation_units_samples({ "samples": result }, this.design['Associated observation units'].value).toPromise()
                this.design.add_associated_samples(result)
                this.design.set_sample_id(data['_id'])
                
                this.design.Blocking.value.forEach(block => {
                    block['Plot design'].value.forEach(plot => {
                        plot.add_samples(result.filter(sample => sample['obsUUID'] === plot.get_observation_uuid()))
                    })
                })
                /* result.forEach(sample => {
                    sample
                }) */
                let message = "experimental factor selected! "
                this.alertService.success(message);
                this.sampleLoaded = true
                if (this.mode==='create'){
                    this.onAdd()
                }
                else{
                    this.onSave()
                }
            }
        });
    }
    async removeSample(confirm:boolean=true) {
        if  (confirm){
            const dialogRef = this.dialog.open(ConfirmationComponent, { 
                disableClose: true, 
                width: '500px', 
                data: { 
                    validated: false, 
                    only_childs: false, 
                    all_childs: true, 
                    mode: 'removesample', 
                    model_type: "sample" 
                } 
            });
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result) {
                    if (result.event == 'Confirmed') {
                        this.design['Associated sample'].value = []
                        this.design.Blocking.value.forEach(block_design => {
                            block_design['Plot design'].value.forEach(plot_design => {
                                plot_design['Associated samples'].value = []
                            })
                        })
                        this.sampleLoaded = false
                        await this.globalService.remove(this.design['Associated sample ID'].value).toPromise()
                        this.design['Associated sample ID'].value = null
                        if (this.mode==='create'){
                            this.onAdd()
                        }
                        else{
                            this.onSave()
                        }
                    }
                }
            });
        }
        else{
            this.design['Associated sample'].value = []
            this.design.Blocking.value.forEach(block_design => {
                block_design['Plot design'].value.forEach(plot_design => {
                    plot_design['Associated samples'].value = []
                })
            })
            this.sampleLoaded = false
            await this.globalService.remove(this.design['Associated sample ID'].value).toPromise()
            this.design['Associated sample ID'].value = null
            if (this.mode==='create'){
                this.onAdd()
            }
            else{
                this.onSave()
            }
            
        }
        
    }

    addObservations(){
        const dialogRef = this.dialog.open(
            AssociateObservedVariable, 
            { 
                disableClose: true, 
                width: '95%', 
                autoFocus: true, 
                maxHeight: '1000px', 
                data: { 
                    model_id: "", 
                    parent_id: this.parent_id, 
                    model_type: "observed_variable", 
                    bm_data: this.bm_data,
                    material_id: this.material_id, 
                    total_available_plots: this.design['number of entries'].value,
                    design: this.design, 
                } 
            });

        dialogRef.afterClosed().subscribe(async result => {
            if (result.event === 'Confirmed') {
                console.log(result)
                result.selected_observed_variable.forEach(async obs_var=>{
                    this.design['Associated observed variable IDs'].value.push(obs_var['_id'])
                    this.design.set_associated_observations(result.observations)
                    this.design.Blocking.value.forEach(block => {
                        block['Plot design'].value.forEach(plot => {
                            plot.add_observations(result.observations.filter(observation => observation['obsUUID'] === plot.get_observation_uuid()))
                        })
                    })

                    /* result.observations.forEach(observation=>{
                        console.log(observation['obsUUID']) 
                        this.design.Blocking.value.forEach(block=>{
                            console.log(block)
                            block['Plot design'].value.filter(plot=>
                                plot.get_observation_uuid()===observation['obsUUID']
                            )[0].add_observation(observation)
                        })
                    }) */
                    
                    const data = await this.globalService.add_observation_units_observed_variables({ "observations": result.observations }, this.design['Associated observation units'].value, obs_var['_id']).toPromise()
                })
            }
        });
    }

    
    //edit mode submission
    onSave() {
        if (this.design.get_total_block()!==this.totalBlockControl.value){
            this.removeBiologicalMaterial()
        }
        if(this.totalColumnPerBlockControl.value*this.totalRowPerBlockControl.value!==this.design.get_total_plot_per_block()){
            this.removeBiologicalMaterial()
        }
        if (this.totalRowPerPlotControl.value!==this.design.Blocking.value[0]['Plot design'].value[0].get_row_design(1)['Row per plot'].value){
            this.removeBiologicalMaterial()
        }
        else{
            /* if(this.totalColumnPerBlockControl.value!==this.design.get_total_column_per_block() || this.totalRowPerBlockControl.value!==this.design.get_total_row_per_block()){
                this.total_row_per_plot=this.totalRowPerPlotControl.value
                this.design.Blocking.value.forEach(block_design => {
                    let plot=1
                    
                    for (var column = 1; column < this.totalColumnPerBlockControl.value + 1; column++) {
                        //var plot_design=new PlotDesign()
                        for (var row = 1; row < this.totalRowPerBlockControl.value + 1; row++) {
                            var plot_design=block_design.get_plot_design(plot)
                            var row_design: RowDesign = new RowDesign()
                            row_design.set_row_number(row)
                            row_design.set_row_per_plot(this.total_row_per_plot)

                            if (row % this.total_row_per_plot === 0) {
                                
                                plot_design.set_column_number(column)
                                plot++
                            }
                            else {
                                plot_design.add_row_design(row_design)
                            }
                        }
                    }
                });
            } */
        this.design.set_block_per_row(this.totalBlockPerRowControl.value)
        //check that block or plot design 
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
    }
    //create mode submission
    onAdd() {
        this.globalService.add(this.design, this.model_type, this.parent_id, false).pipe(first()).toPromise().then(
            data => {
                if (data["success"]) {
                    //this.ngOnInit();
                    this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id: this.parent_id, model_type: 'study', mode: "edit", activeTab: "studydesign", role: this.role, group_key: this.group_key } });

                    return true;
                }
                else {
                    this.alertService.error("this form contains errors! " + data["message"]);
                    return false;
                }
            }
        );
    }
    onRemove(element: ExperimentalDesignInterface) {
        console.log(element)
        const dialogRef = this.dialog.open(ConfirmationComponent, { disableClose: true, width: '500px', data: { validated: false, only_childs: false, mode: 'remove', model_type: this.model_type } });
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
    removeBlock(_block) {
        this.get_design.Blocking.value.forEach((block, index) => {
            if (block === _block) this.get_design.Blocking.value.splice(index, 1);
        });
    }
    display_block(_block: BlockDesignInterface) {
        console.log(_block['Block number'].value)
        console.log(this.get_design.Blocking.value)
        this.block_index = _block['Block number'].value - 1
    }
    changeTab(tab: string) {
        this.activeTab = tab
        console.log(this.activeTab)
    }
    showBlockInfo(i, value) {
        this.hideme[i] = !this.hideme[i];
        this.Index = i;
    }
    showPlotInfo(j: number, value) {
        this.secondhideme[j] = !this.secondhideme[j];
        this.SecondIndex = j;
    }
    showSampleDateInfo(k: number, value) {
        this.thirdhideme[k] = !this.thirdhideme[k];
        this.ThirdIndex = k;
    }
    showObservationDateInfo(l: number, value) {
        this.obsthirdhideme[l] = !this.obsthirdhideme[l];
        this.obsThirdIndex = l;
    }
    display_plot(_plot: PlotDesignInterface) {
        console.log(_plot['Plot number'].value)
        this.plot_index = _plot['Plot number'].value - 1
        
        const dialogRef = this.dialog.open(PlotOverviewComponent, {
            disableClose: true,
            width: '1400px',
            autoFocus: true,
            maxHeight: '800px',
            data: {
                model_id: "",
                parent_id: this.parent_id,
                model_type: "biological_material",
                plot_design: _plot,
                role: this.role,
                grand_parent_id: this.grand_parent_id,
                group_key: this.group_key
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result)
            }
        });
    }
    onSubmit() {
        console.warn(this.BlockDesignForm.value);
    }
    /* get total_block_control(){ return this.BlockDesignForm.get('totalBlockControl')}
    get total_block_per_row_control(){ return this.BlockDesignForm.get('totalBlockPerRowControl')}
    get total_row_per_block_control(){ return this.BlockDesignForm.get('totalRowPerBlockControl')}
    get total_column_per_block_control(){ return this.BlockDesignForm.get('totalColumnPerBlockControl')}
    get total_row_per_plot_control(){ return this.BlockDesignForm.get('totalRowPerPlotControl')}
     */

    get get_biological_material_loaded() { return this.biologicalMaterialLoaded }
    get get_observation_unit_loaded() { return this.observationUnitLoaded }
    get get_sample_loaded() { return this.sampleLoaded }
    get totalBlockControl() { return this.BlockDesignForm.get('totalBlockControl'); }
    get totalBlockPerRowControl() { return this.BlockDesignForm.get('totalBlockPerRowControl') }
    get totalRowPerBlockControl() { return this.BlockDesignForm.get('totalRowPerBlockControl'); }
    get totalColumnPerBlockControl() { return this.BlockDesignForm.get('totalColumnPerBlockControl'); }
    get totalRowPerPlotControl() { return this.BlockDesignForm.get('totalRowPerPlotControl'); }
    get get_BlockDesignForm() { return this.BlockDesignForm }
    get get_displayedColumns() { return this.displayedColumns }
    get get_dataSource() { return this.dataSource }
    get get_design(): ExperimentalDesign { return this.design }
    get get_design_type() { return this.block_design_type }
    get get_design_subtype() { return this.block_design_subtype }
    get get_parent_id() { return this.parent_id }
    get get_mode() { return this.mode }
    get get_model_id() { return this.model_id }
    get get_model_key() { return this.model_key }
    get get_role() { return this.role }
    get get_group_key() { return this.group_key }
    get get_grand_parent_id() {
        return this.grand_parent_id
    }

    get_associated_material_source(_pd: PlotDesign) {
        if (_pd['Associate_material_source'].value !== null) {
            return _pd['Plot number'].value + ": " + _pd['Associate_material_source'].value
        }
        else {
            return _pd['Plot number'].value + ": No material defined"
        }
    }
    get_observation_units(_expd: ExperimentalDesign): number | string {
        // console.log(_expd)
        if (_expd['Associated observation units'].value !== null) {
            return _expd['Associated observation units'].value
        }
        else {
            return "No observation unit defined"
        }
    }
    get_bm() {
        this.get_observation_units(this.design)
    }
    get_observations(_expd: ExperimentalDesign, block_num: number) {
        let tmp_block: BlockDesign = _expd.Blocking.value.filter(block => block['Block number'].value === block_num)[0]
        let observations = []
        tmp_block['Plot design'].value.forEach(plot => {
            //console.log(plot)
            observations = observations.concat(plot['Associated plot observations'].value)
        })
        if (observations.length > 0) {
            return observations.length
        }
        else {
            return "No observations defined"
        }
    }

    get_samples(_expd: ExperimentalDesign, block_num: number) {
        let tmp_block: BlockDesign = _expd.Blocking.value.filter(block => block['Block number'].value === block_num)[0]
        let samples = []
        tmp_block['Plot design'].value.forEach(plot => {
            samples = samples.concat(plot['Associated samples'].value)
        })
        if (samples.length > 0) {
            return samples.length
        }
        else {
            return "No samples defined"
        }
    }
    get_associated_biological_material(_pd: PlotDesign) {
        return _pd['Associated_biological_material'].value.length
    }
    get_associated_sample(_pd: PlotDesign, date:Date) {
        return _pd['Associated samples'].value.filter(sample=>sample['Collection date']===date).length
    }
    get_associated_observation(_pd: PlotDesign, date:Date) {
        return _pd['Associated plot observations'].value.filter(observation=>observation['Observation date']===date).length
    }
    get_replicate_number(_pd: PlotDesign): number | string {
        if (_pd['Replicate number'].value !== null) {
            return _pd['Replicate number'].value
        }
        else {
            return "No material defined"
        }
    }
    get_observation_uuid(_pd: PlotDesign): number | string {
        if (_pd['Observation unit uuid'].value === null || _pd['Observation unit uuid'].value === "") {
            return "No observations defined"
        }
        else {
            return _pd['Observation unit uuid'].value

        }
    }
    get_output_from_child(val: any) {
        if (val === 'cancel the form') {
            console.log("Cancel form")
        }
        else {
            console.log("Cancel form")
        }
    }
    
    close() {
        this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.grand_parent_id, model_key: this.parent_id.split('/')[1], model_id: this.parent_id, model_type: 'study', mode: "edit", activeTab: "studydesign", role: this.role, group_key: this.group_key } });

        //this.notify.emit("close_study")
        //this.router.navigate(['/study_page'], { queryParams: { level: "1", parent_id: this.parent_id, model_id: this.parent_id, model_key: this.parent_id.split("/")[1], model_type:'investigation', activeTab: 'assStud', mode: "edit" , role: this.get_role, group_key: this.group_key} });
        // Same as delete project and all childs 
    }

}