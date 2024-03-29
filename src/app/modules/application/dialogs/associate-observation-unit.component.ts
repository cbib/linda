import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, GlobalService } from '../../../services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {BiologicalMaterialDialogModel } from '../../../models/biological_material_models'
import {ExperimentalFactorDialogModel} from '../../../models/experimental_factor_models' 
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BiologicalMaterial, BiologicalMaterialFullInterface } from 'src/app/models/linda/biological-material';
import { ExperimentalDesign } from 'src/app/models/linda/experimental-design';
import { ObservationUnit, ObservationUnitInterface } from 'src/app/models/linda/observation-unit';
import * as uuid from 'uuid';
import { cpuUsage } from 'process';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
interface DialogData {
  model_id: string;
  mode:string;
  model_key:string;
  parent_id: string;
  model_type: string;
  material_id:string;
  total_available_plots:number;
  design:ExperimentalDesign;
}

@Component({
  selector: 'app-associate-observation-unit',
  templateUrl: './associate-observation-unit.component.html',
  styleUrls: ['./associate-observation-unit.component.css']
})
export class AssociateObservationUnit implements OnInit {
  private model_id: string;
  private model_key: string;
  private mode: string;
  model_type: string;
  material_id:string
  private parent_id: string;
  plot_dict={}
  return_data = { "observation_units": [], "biological_materials": [], "samples": [], "experimental_factors": [] }
  
  design:ExperimentalDesign;
  total_available_plots:number=0
  observation_unit_level:string=""
  current_material_id:string=""
  biological_model:BiologicalMaterialFullInterface;
  observation_levels= [
    {
      "levelName": "study",
      "levelOrder": 1
    },
    {
      "levelName": "field",
      "levelOrder": 2
    },
    {
      "levelName": "entry",
      "levelOrder": 3
    },
    {
      "levelName": "rep",
      "levelOrder": 4
    },
    {
      "levelName": "block",
      "levelOrder": 5
    },
    {
      "levelName": "sub-block",
      "levelOrder": 6
    },
    {
      "levelName": "plot",
      "levelOrder": 7
    },
    {
      "levelName": "sub-plot",
      "levelOrder": 8
    },
    {
      "levelName": "plant",
      "levelOrder": 9
    },
    {
      "levelName": "pot",
      "levelOrder": 10
    },
    {
      "levelName": "sample",
      "levelOrder": 11
    }
  ]
  loaded:boolean=false
  building:boolean=false
  built: boolean=false;
  constructor(
    private globalService: GlobalService, 
    public dialogRef: MatDialogRef<AssociateObservationUnit>,
    private _cdr: ChangeDetectorRef,
    private alertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
      this.model_id = this.data.model_id
      this.model_key = this.data.model_key
      this.model_type = this.data.model_type
      this.parent_id = this.data.parent_id
      this.material_id=this.data.material_id
      this.total_available_plots=this.data.total_available_plots
      this.design=this.data.design
      this.mode=this.data.mode
      console.log(this.design)
      this.building=false
      this.loaded=false
      this.built=false

     }

  async ngOnInit() {
    console.log(this.material_id)
    console.log(this.parent_id)
    this.biological_model= (await this.globalService.get_biological_material_by_key(this.material_id.split('/')[1]).toPromise()).data
    console.log(this.biological_model)
  }
  onObservationUnitLevelChange(value){
    console.log(value)
    this.observation_unit_level=value
    this.current_material_id=this.design['Associated biological Materials'].value
    this.return_data = { "observation_units": [], "biological_materials": [], "samples": [], "experimental_factors": [] }
    if(value==='plot'){
      
      let bm_list:BiologicalMaterialDialogModel[][]=[]
      this.design.Blocking.value.forEach(block=>{
        block['Plot design'].value.forEach(plot=>{
          let obs_unit={}
          let sub_bm_list:BiologicalMaterialDialogModel[]=[]
          
          
          obs_unit['External ID']=""
          obs_unit['Observation Unit factor value']=""
          obs_unit['Observation unit ID']=value+":"+plot['Plot number'].value
          obs_unit['Observation unit type']=value
          obs_unit['Spatial distribution']="block-"+block['Block number'].value+":"+"plot-"+plot['Plot number'].value + ":column-"+plot['Column number'].value
          let obs_id=uuid.v4()
          this.plot_dict[plot['Plot number'].value]=obs_id
          obs_unit['obsUUID']=obs_id
          this.load_material(this.biological_model, obs_id, plot.Associate_material_source.value, plot.Associated_biological_material.value).forEach(load_mat=>{
            sub_bm_list.push(load_mat)
          })
          bm_list.push(sub_bm_list)
          
          this.return_data.observation_units.push(obs_unit)
          //this.load_material(this.biological_model, obs_id, plot.Associate_material_source.value, plot.Associated_biological_material.value)
          
        })
      })
      this.return_data.biological_materials=bm_list
      
      
      console.log(this.return_data)
    }
    this.loaded=true
  }
  load_material(model: BiologicalMaterialFullInterface, obs_uuid:string, material_id:string, biological_material_ids:string[]): BiologicalMaterialDialogModel[] {
    var data = []
    var keys = Object.keys(model);
    var mat_ids = model['Material source ID (Holding institute/stock centre, accession)']
    var mat_index = model['Material source ID (Holding institute/stock centre, accession)'].indexOf(material_id)
    var genus = model['Genus'][mat_index]
    var species = model['Species'][mat_index]
    var replication:number= parseInt(model['replication'][mat_index])
    for (let index = 0; index < biological_material_ids.length; index++) {
      data.push({
        biologicalMaterialId: biological_material_ids[index],
        materialId: material_id,
        genus: genus,
        species: species,
        lindaID: model["_id"],
        obsUUID: obs_uuid,
        bmUUID:uuid.v4()
      })
    }
    /* for (let index = 1; index < replication+1; index++) {
      let bms=model["Biological material ID"][mat_index].filter(bm_id=>bm_id.includes("_rep"+index+"_"))
      console.log(bms)
      for (var k = 0; k < bms.length; k++) {
        data.push({
          biologicalMaterialId: bms[k],
          materialId: material_id,
          genus: genus,
          species: species,
          lindaID: model["_id"],
          obsUUID: obs_uuid
        })
      }

      
    } */
    /* for (var k = 0; k < model["Biological material ID"][mat_index].length; k++) {
      data.push({
        biologicalMaterialId: model["Biological material ID"][mat_index][k],
        materialId: material_id,
        genus: genus,
        species: species,
        lindaID: model["_id"],
        obsUUID: obs_uuid
      })
    } */
    return data
  }
  get get_observation_unit_level(){
    return this.observation_unit_level
  }
  get get_building(){
    return this.building
  }
  get get_built(){
    return this.built
  }
  get get_loaded(){
    return this.loaded
  }
  async save() {
    this.building=true
    if (this.mode === "create") {
      //timer(0, 5000).pipe( switchMap(() => this.globalService.add_observation_units(this.return_data, this.model_type, this.parent_id)), takeUntil(this.stopPolling) )
      const data=await this.globalService.add_observation_units(this.return_data, this.model_type, this.parent_id).toPromise()
      if (data["success"]) {

        this.model_id = data["_id"];
        var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
        this.alertService.success(message)
        this.building=false
        this.built=true

      }
      else {
        this.alertService.error("this form contains errors! " + data["message"]);
        this.building=false
        this.built=false

      }
      
      /* await this.globalService.add_observation_units(this.return_data, this.model_type, this.parent_id).pipe(first()).toPromise().then(
        data => {
          if (data["success"]) {

            this.model_id = data["_id"];
            var message = "A new " + this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully integrated in your history !!"
            this.alertService.success(message)
            this.building=false
            this.built=true

          }
          else {
            this.alertService.error("this form contains errors! " + data["message"]);
            this.building=false
            this.built=false

          }
        }
      ); */
    }
    else {
      let element = event.target as HTMLInputElement;
      let value_field = element.innerText;
      await this.globalService.update_observation_units_and_childs(this.return_data, this.model_key, this.model_type, this.parent_id).pipe(first()).toPromise().then(
        data => {
          console.log(data)
          if (data["success"]) {
            var message = this.model_type[0].toUpperCase() + this.model_type.slice(1).replace("_", " ") + " has been successfully updated in your history !!"
            this.alertService.success(message)

          }
          else {
            this.alertService.error("this form contains errors! " + data["message"]);
          };
        }
      );
    }
    return true;
  };
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

  onNoClick(): void {
    this.dialogRef.close({event:"Cancel", selected_material: null});
  }
  onOkClick(): void {
    this.dialogRef.close({event:"Confirmed", observation_unit_id: this.model_id, obsuuids: this.plot_dict});
  }

}
