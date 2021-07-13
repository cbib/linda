import { Component, OnInit, Input, Inject, ViewChild  } from '@angular/core';
import { GlobalService, AlertService, StatisticsService } from '../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoyrideService } from 'ngx-joyride';
import { multi, single } from '../data/data';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  styleUrls: ['./exploration.component.css']
})
export class ExplorationComponent implements OnInit {
  parent_id=""
  selected_file: string = ""
  selected_observed_variable:string = ""
  investigation_key:string= ""
  filename_used = []
  datafile_ids = {}
  datafile_study_ids = {}
  ObservedVariables: {} = {};
  ObservationUnits: {} = {};
  BiologicalMaterials: {} = {};
  title = 'Angular Charts';

  view: any[] = [600, 400];
  view2: any[] = [600, 400];

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Genotype';
  showYAxisLabel = true;
  yAxisLabel = 'Plant Height';
  timeline = true;
  private factor_value_array=[]
  private associated_headers_by_filename = {}
  private headers_by_filename = {}
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  //pie
  showLabels = true;
  public single=single
  public my_data = []
  constructor(private router: Router, 
              private statisticsService: StatisticsService, 
              private readonly joyrideService: JoyrideService,
              private alertService: AlertService,
              private globalService: GlobalService,
              private route: ActivatedRoute,public dialog: MatDialog) {
    this.route.queryParams.subscribe(
      params => {
          this.parent_id = params['parent_id']
          this.investigation_key=params['parent_id'].split('/')[1]
      }
      
    );
    this.factor_value_array=[]

  }
  onFilenameChange(values: string) {
    this.selected_file = values

  }
  onVariableChange(value: string) {
    this.selected_observed_variable = value
    console.log(this.ObservedVariables[this.selected_file])
    console.log(this.associated_headers_by_filename[this.selected_file])
    console.log(value)

    if(this.ObservationUnits[this.selected_file].length !== 0){
      var observation_unit= this.ObservationUnits[this.selected_file][0]['observation_unit']
      console.log(observation_unit)
      if(this.associated_headers_by_filename[this.selected_file].filter(element=> element.associated_linda_id==observation_unit._id).length === 0){
        this.alertService.error("You do not have any observation units associated with any column of this data file ! You need to link a column with one of your observation units if exist else create one biological material and link it to the corresponding assigned column in your data file. \
        Remember before linking a column to a linda component , you must assign the right type to your column. (i.e. Is this an esperimental factor column , an observed variable, etc.. ? ")
      }
      else{
      
        //var ou_header= this.associated_headers_by_filename[this.selected_file].filter(element=> element.associated_linda_id==observation_unit._id)[0]['header']
        console.log(observation_unit['Observation Unit factor value'])
        
        var factor_value=new Set(observation_unit['Observation Unit factor value'])
        this.factor_value_array = Array.from(factor_value);
        console.log(factor_value)
        
        var biological_material= this.BiologicalMaterials[this.selected_file][0]['biological_material']
        if(this.associated_headers_by_filename[this.selected_file].filter(element=> element.associated_linda_id==biological_material._id).length === 0){
          this.alertService.error("You do not have any biological material associated with any column of this data file ! You need to link a column with one of your biological materials if exist else create one biological material and link it to the corresponding assigned column in your data file. \
          Remember before linking a column to a linda component , you must assign the right type to your column. (i.e. Is this an esperimental factor column , an observed variable, etc.. ? ")
        }
        else{
          var bm_header= this.associated_headers_by_filename[this.selected_file].filter(element=> element.associated_linda_id==biological_material._id)[0]['header']
          
          //before to run this step, you need to have Biological material associated with your data files
          this.globalService.get_data_from_datafiles(this.datafile_ids[this.selected_file].split('/')[1], bm_header).toPromise().then(bm_data => {
            console.log(bm_data)
            var observed_variable= this.ObservedVariables[this.selected_file].filter(element=> element['observed_variable']['Trait']==value)[0]['observed_variable']
            console.log(observed_variable._id)
            var header= this.associated_headers_by_filename[this.selected_file].filter(element=> element.associated_linda_id==observed_variable._id)[0]['header']
            this.globalService.get_data_from_datafiles(this.datafile_ids[this.selected_file].split('/')[1], header).toPromise().then(observed_variable_data => {
              console.log(observed_variable_data)
              var bm_data_value=new Set(bm_data[0])
              var bm_data_value_array = Array.from(bm_data_value);
              var cpt=0
              bm_data[0].forEach(val=>{
                var obj_data={"name": "", "series": []}
                if (this.my_data.filter(element=> element.name==val).length===0){
                  obj_data={"name": val, "series": []}
                  this.my_data.push(obj_data)
                }
                else{
                  obj_data=this.my_data.filter(element=> element.name==val)[0]
                }
                obj_data.series.push({'name':observation_unit['Observation Unit factor value'][cpt], 'value':parseFloat(observed_variable_data[0][cpt])})
                cpt+=1
              })
              console.log(this.my_data)
            })
          })
        }
      }
    }
    else{
      this.alertService.error("You do not have any observation units associated with any column of this data file ! You need to link a column with one of your observation units if exist else create one biological material and link it to the corresponding assigned column in your data file. \
      Remember before linking a column to a linda component , you must assign the right type to your column. (i.e. Is this an esperimental factor column , an observed variable, etc.. ? ")
    }
  }
  onSelect(event) {
    console.log(event);
  }
  async get_data() {
    const data = await this.globalService.get_all_data_files(this.investigation_key).toPromise();
    this.filename_used = []
    if (data.length > 0 && data[0] !== null) {
      data[0].forEach(
        data_file => {
          console.log(data_file)
          if (!this.filename_used.includes(data_file.filename)) {
            this.datafile_ids[data_file.filename] = data_file.eto
            this.headers_by_filename[data_file.filename] = []
            this.datafile_study_ids[data_file.filename] = data_file.efrom
            this.filename_used.push(data_file.filename)
            this.ObservedVariables[data_file.filename] = []
            this.ObservationUnits[data_file.filename] = []
            this.associated_headers_by_filename[data_file.filename] = []
            this.BiologicalMaterials[data_file.filename] = []
            
          }
          this.selected_file = this.filename_used[0]
          data_file.associated_headers.forEach(element => {
            if (!this.headers_by_filename[data_file.filename].includes(element.header)) {
                ///if (!this.headers.includes(element.header)){
                var header = element.header
                let tmp_associated_header = { 'header': element.header, selected: element.selected, associated_component: element.associated_component,associated_linda_id: element.associated_linda_id,  associated_component_field: element.associated_component_field, is_time_values: element.is_time_values, is_numeric_values: element.is_numeric_values }
                this.associated_headers_by_filename[data_file.filename].push(tmp_associated_header)
                
              }
            }
          );
          this.globalService.get_type_child_from_parent(data_file.efrom.split("/")[0], data_file.efrom.split("/")[1], 'observed_variables').toPromise().then(
            observed_variable_data => {
              console.log(observed_variable_data)
              observed_variable_data.forEach(observed_variable => {
                this.ObservedVariables[data_file.filename].push({'observed_variable':observed_variable, 'study_id':data_file.efrom})
              });
              this.globalService.get_type_child_from_parent(data_file.efrom.split("/")[0], data_file.efrom.split("/")[1], 'observation_units').toPromise().then(
                observation_unit_data => {
                  console.log(observation_unit_data)
                  observation_unit_data.forEach(observation_unit => {
                    this.ObservationUnits[data_file.filename].push({'observation_unit':observation_unit, 'study_id':data_file.efrom})
                  });
                  this.globalService.get_type_child_from_parent(data_file.efrom.split("/")[0], data_file.efrom.split("/")[1], 'biological_materials').toPromise().then(
                    biological_material_data => {
                      console.log(biological_material_data)
                      biological_material_data.forEach(biological_material => {
                        this.BiologicalMaterials[data_file.filename].push({'biological_material':biological_material, 'study_id':data_file.efrom})
                        
                      });
                    }
                  )
                }
              )
              //this.selected_observed_variable=observed_variable_data[0]["Trait"]
              
              //this.my_data.push()
            }
          )
        }
      )
    }
  }

  ngOnInit() {
    this.investigation_key=this.parent_id.split('/')[1]
    this.get_data()
  }
  

}
