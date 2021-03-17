import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalService, AlertService, OntologiesService } from '../services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueIDValidatorComponent } from '../validators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OntologyTreeComponent } from '../ontology-tree/ontology-tree.component';
import { OntologyTerm } from '../ontology/ontology-term';
import * as uuid from 'uuid';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-material-form2',
  templateUrl: './material-form2.component.html',
  styleUrls: ['./material-form2.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('detailExpand2', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class MaterialForm2Component implements OnInit {

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChild('outerSort', { static: true }) sort2: MatSort;
  @ViewChild('outerSort', { static: true }) sort3: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerSort') innerSort2: QueryList<MatSort>;
  @ViewChildren('innerSort') innerSort3: QueryList<MatSort>;
  @ViewChildren('materialInnerTables') materialInnerTables: QueryList<MatTable<MaterialSource2>>;
  @ViewChildren('materialSourceInnerTables') materialSourceInnerTables: QueryList<MatTable<BiologicalMaterial2>>;
  @Input() level;
  @Input() parent_id;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;

  materialTable2: FormGroup;
  MaterialDataSource: MatTableDataSource<Material>;
  //MaterialSourceDataSource: MatTableDataSource<MaterialSource2>;
  MaterialSourceDataSource: MatTableDataSource<any>;
  materialsData: Material[] = [];
  materialsSourceData: MaterialSource2[] = [];
  MaterialColumnsToDisplay = ['genus', 'species', 'organism', 'infraspecificName'];
  firstinnerDisplayedColumns = ['ID', 'description', 'doi', 'altitude', 'latitude', 'longitude', 'coordinatesUncertainty'];
  
  prettyfirstinnerDisplayedColumns= [
    'Material source ID (Holding institute/stock centre, accession)',
    'Material source description', 
    'Material source DOI', 
    'Material source altitude', 
    'Material source latitude', 
    'Material source longitude',
    'Material source coordinates uncertainty'
    ];

    prettysecondinnerDisplayedColumns= [
      "Biological material ID",
      "Biological material preprocessing",
      "Biological material altitude",
      "Biological material latitude",
      "Biological material longitude",
      "Biological material coordinates uncertainty"
      ];
  secondinnerDisplayedColumns = ['ID', 'preprocessing', 'altitude', 'latitude', 'longitude', 'coordinatesUncertainty'];
  

  //expandedElement: User | null;
  materialExpandedElement: Material | null;
  material2ExpandedElement: Material2 | null;
  materialSourceExpandedElement: MaterialSource | null;
  materialSource2ExpandedElement: MaterialSource2 | null;
  model: any = [];
  model_to_edit: any = [];
  cleaned_model: any = [];
  validated_term = {}
  model_keys=[]
  selected_set: []
  ontology_type: string;


  //tempalte html
  startfilling: boolean = false;
  marked: boolean = false;


  constructor(
    private cd: ChangeDetectorRef, private fb: FormBuilder, public globalService: GlobalService,
    public ontologiesService: OntologiesService, private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_type = params['model_type'];
        this.model_key = params['model_key'];
        this.mode = params['mode'];
        this.parent_id = params['parent_id']
      }
    );
    // if (this.model_key != "") {
    //   this.get_model_by_key();
    // }
  }

  ngOnInit() {

    // this.materialTable2 = this.fb.group({
    //   generalRows: this.fb.array([
    //     this.fb.group({
    //       materialRows:this.fb.array([
    //         this.fb.group({
    //           biologicalMaterialRows: this.fb.array([])
    //         })

    //       ])
    //     })
    //   ])
    // });

    // this.materialTable2 = this.fb.group({
    //   generalRows: this.fb.array([]),
    //   materialRows: this.fb.array([
    //     this.fb.group({
    //       biologicalMaterialRows: this.fb.array([])
    //     })

    //   ])
    // });

    this.materialTable2 = this.fb.group({
      generalRows: this.fb.array([]),
      materialRows: this.fb.array([])
    });

    

    // MATERIALS.forEach(material => {
    //   if (material.materials && Array.isArray(material.materials) && material.materials.length) {
    //     material.materials.forEach(materialsource => {
    //       if (materialsource.biologicalMaterials && Array.isArray(materialsource.biologicalMaterials) && materialsource.biologicalMaterials.length) {
    //         var testmaterialsData: MaterialSource[] = [];
    //         testmaterialsData = [...testmaterialsData, { ...materialsource, biologicalMaterials: new MatTableDataSource(materialsource.biologicalMaterials) }];
    //         this.materialsData = [...this.materialsData, { ...material, materials: new MatTableDataSource(testmaterialsData) }];
    //       }
    //       else {
    //         var testmaterialsData: MaterialSource[] = [];
    //         testmaterialsData = [...testmaterialsData, materialsource];
    //         this.materialsData = [...this.materialsData, { ...material, materials: new MatTableDataSource(testmaterialsData) }];
    //       }
    //     });
    //   }
    //   else {
    //     this.materialsData = [...this.materialsData, material];
    //   }
    // });
    // this.MaterialDataSource = new MatTableDataSource(this.materialsData);
    // this.MaterialDataSource.sort = this.sort2;
    this.get_model()
  }
  
  async get_model() {
    this.model = [];
    this.materialTable2 = new FormGroup({});
    //Get asynchronicly MIAPPE model => Remove useless keys (_, Definition) => build      
    await this.globalService.get_model(this.model_type).toPromise().then(data => {
      this.model = data;
      this.model_to_edit = [];
      // console.log(this.model)
      this.model_keys = Object.keys(this.model);
      this.cleaned_model = []
      for (var i = 0; i < this.model_keys.length; i++) {
        if (this.model_keys[i].startsWith("_") || this.model_keys[i].startsWith("Definition")) {
          this.model_keys.splice(i, 1);
          i--;
        }
        else {
          var dict = {}
          dict["key"] = this.model_keys[i]
          dict["pos"] = this.model[this.model_keys[i]]["Position"]
          dict["level"] = this.model[this.model_keys[i]]["Level"]
          dict["Associated_ontologies"] = this.model[this.model_keys[i]]["Associated ontologies"]
          this.cleaned_model.push(dict)
        }
      }
      this.cleaned_model = this.cleaned_model.sort(function (a, b) { return a.pos - b.pos; });
      const generalControl2 = this.materialTable2.get('generalRows') as FormArray;
      const materialControl2 = this.materialTable2.get('materialRows') as FormArray;
      //const biologicalMaterialControl2 = materialControl2.controls[0].get('biologicalMaterialRows') as FormArray;
      generalControl2.push(this.initiateGeneralForm())
      if (this.mode !== "create") {
        
        this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(_model_to_edit => {
          this.model_to_edit = _model_to_edit;
          //this.modelForm.patchValue(this.model_to_edit);
          //var materialsourceData: MaterialSource2[] = [];
          
          for (var i = 0; i < this.model_to_edit["Material source ID (Holding institute/stock centre, accession)"].length; i++) {
            //var tmp_bm_group=this.fb.group({})
            var tmp_bm=this.fb.array([])
            //var testmaterialsData: BiologicalMaterial2[] = [];
            //var testmaterialsData: MaterialSource[] = [];

            //var tmp_source_bm:BiologicalMaterial2[]=[]
            for (var j = 0; j < this.model_to_edit["Biological material ID"][i].length; j++) {
              tmp_bm.push(this.initiateBMForm("", i, j));
              //testmaterialsData = [...testmaterialsData, this.initiateBMForm("", i, j) ];
          
            }
            //console.log(testmaterialsData)
            //materialsourceData = [...materialsourceData, { ...this.initiateForm("", i, tmp_bm), biologicalMaterials: new MatTableDataSource(testmaterialsData) }];

            //tmp_source_bm.push(new MatTableDataSource(testmaterialsData.controls))
            materialControl2.push(this.initiateForm("", i, tmp_bm))
            //this.materialsSourceData.push(this.initiateData("", i, tmp_source_bm))
          }



          //this.MaterialSourceDataSource = new MatTableDataSource(materialsourceData);
          this.MaterialSourceDataSource = new MatTableDataSource(materialControl2.controls);
          console.log(materialControl2.controls)
          var tmp_source:AbstractControl[]=[]
          var materialsourceData: MaterialSource2[] = [];
          
          materialControl2.controls.forEach(control => {

           // var tmp_control=control as FormArray
               
            var bm_control=control.get('biologicalMaterialRows') as FormArray

            bm_control.controls.forEach(bm_control2 => {
              console.log(bm_control2.value)
            
            })

            console.log(bm_control)
            console.log(new MatTableDataSource(bm_control.controls))
            if (bm_control.controls && Array.isArray(bm_control) && bm_control.length) {
              //tmp_source = [...tmp_source, { ...bm_control.controls, biologicalMaterialRows: new MatTableDataSource(bm_control.controls) }];
            }
            else{
            //     tmp_source= [...tmp_source,control]
            }

          //   console.log(control.value)
          //   console.log(control.get('biologicalMaterialRows'))
          })
          // this.MaterialSourceDataSource = new MatTableDataSource(tmp_source);
      //this.MaterialSourceDataSource = new MatTableDataSource(this.materialsSourceData);
      this.MaterialSourceDataSource.sort = this.sort3;
      console.log(this.materialsSourceData)
        });
        
      }
      else{
        this.MaterialSourceDataSource = new MatTableDataSource(materialControl2.controls);
        //this.MaterialSourceDataSource = new MatTableDataSource(this.materialsSourceData);
        this.MaterialSourceDataSource.sort = this.sort3;
        console.log(this.materialsSourceData)
      }
      
    });
  }
  // ngAfterOnInit() {
  //   this.MaterialSourceDataSource = new MatTableDataSource(this.materialsSourceData);
  //   this.MaterialSourceDataSource.sort = this.sort3;
  // }

  

  initiateForm(mode: string = "create", index: number = 0, tmp_bm:FormArray ): FormGroup {
    let materialAttributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Material")) {
          if (mode !== "create") {
            value = this.model_to_edit[attr["key"]][index]
          }
          if (attr["key"].includes("ID")) {
            materialAttributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
          }
          else if (attr["key"].includes("Short title")) {
            materialAttributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else {
            materialAttributeFilters[attr["key"]] = [value];
          }
          materialAttributeFilters['mat-id'] = uuid.v4()
        }
      }
    });
    materialAttributeFilters['biologicalMaterialRows']=tmp_bm
    return this.fb.group(materialAttributeFilters);

  }

  // initiateData(mode: string = "create", index: number = 0, tmp_source_bm:BiologicalMaterial2[]  ): MaterialSource2 {
  //   let materialAttributeFilters = {};
  //   this.cleaned_model.forEach(attr => {
  //     var value = ''
  //     this.validated_term[attr["key"]] = { selected: false, values: "" }
  //     if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
  //       if (attr["key"].includes("Material")) {
  //         if (mode !== "create") {
  //           value = this.model_to_edit[attr["key"]][index]
  //         }
  //         if (attr["key"].includes("ID")) {
  //           materialAttributeFilters[attr["key"]] = value;
  //         }
  //         else if (attr["key"].includes("Short title")) {
  //           materialAttributeFilters[attr["key"]] = value;
  //         }
  //         else {
  //           materialAttributeFilters[attr["key"]] = value;
  //         }
  //         materialAttributeFilters['mat-id'] = uuid.v4()
  //       }
  //     }
  //   });
  //   materialAttributeFilters['biologicalMaterialRows']=tmp_source_bm
  //   return materialAttributeFilters as MaterialSource2

  // }

  initiateBMForm(mode: string = "create",material_index:number=0, index: number = 0): FormGroup {

    let biologicalMaterialAttributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Biological")) {
          if (mode !== "create") {
            value = this.model_to_edit[attr["key"]][material_index][index]
          }
          if (attr["key"].includes("ID")) {
            biologicalMaterialAttributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
          }
          else if (attr["key"].includes("Short title")) {
            biologicalMaterialAttributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else {
            biologicalMaterialAttributeFilters[attr["key"]] = [value];
          }
        }
      }
    });
    return this.fb.group(biologicalMaterialAttributeFilters);
  }


  // initiateBMData(mode: string = "create",material_index:number=0, index: number = 0): BiologicalMaterial2 {

  //   let biologicalMaterialAttributeFilters= {};
  //   this.cleaned_model.forEach(attr => {
  //     var value = ''
  //     this.validated_term[attr["key"]] = { selected: false, values: "" }
  //     if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
  //       if (attr["key"].includes("Biological")) {
  //         if (mode !== "create") {
  //           value = this.model_to_edit[attr["key"]][material_index][index]
  //         }
  //         if (attr["key"].includes("ID")) {
  //           biologicalMaterialAttributeFilters[attr["key"]] = value
  //         }
  //         else if (attr["key"].includes("Short title")) {
  //           biologicalMaterialAttributeFilters[attr["key"]] = value
  //         }
  //         else {
  //           biologicalMaterialAttributeFilters[attr["key"]] = value
  //         }
  //       }
  //     }
  //   });
  //   return biologicalMaterialAttributeFilters as BiologicalMaterial2;
  // }
  



  initiateMaterialForm(mode: string = "create", index: number = 0): FormGroup {
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Material")) {
          if (mode !== "create") {
            value = this.model_to_edit[attr["key"]][index]
          }
          if (attr["key"].includes("ID")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];

          }
          else if (attr["key"].includes("Short title")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else {
            attributeFilters[attr["key"]] = [value];
          }
          attributeFilters['mat-id'] = uuid.v4()
          //this.material_id = attributeFilters['mat-id']
        }
      }
    });

    return this.fb.group(attributeFilters, { updateOn: "blur" });
  }

  initiateBiologicalMaterialForm(mode: string = "create", material_index: number = 0, index: number = 0,): FormGroup {
    //console.log(this.cleaned_model)
    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (attr["key"].includes("Biological")) {
          if (mode !== "create") {
            // console.log(attr["key"])
            // console.log(this.model_to_edit[attr["key"]])
            // console.log(this.model_to_edit[attr["key"]][material_index][index])
            value = this.model_to_edit[attr["key"]][material_index][index]
          }
          if (attr["key"].includes("ID")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
          }
          else if (attr["key"].includes("Short title")) {
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

  initiateGeneralForm(): FormGroup {
    //console.log(this.cleaned_model)

    let attributeFilters = {};
    this.cleaned_model.forEach(attr => {
      var value = ''
      if (this.mode !== "create") {
        value = this.model_to_edit[attr["key"]]
      }
      this.validated_term[attr["key"]] = { selected: false, values: "" }
      if (!attr["key"].startsWith("_") && !attr["key"].startsWith("Definition")) {
        if (!attr["key"].includes("Biological") && !attr["key"].includes("Material")) {
          if (attr["key"].includes("ID")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)], UniqueIDValidatorComponent.create(this.globalService, this.alertService, this.model_type, attr["key"])];
          }
          else if (attr["key"].includes("Short title")) {
            attributeFilters[attr["key"]] = [value, [Validators.required, Validators.minLength(4)]];
          }
          else {
            attributeFilters[attr["key"]] = [value];
          }
        }
      }
    });
    return this.fb.group(attributeFilters);
  }


  get getGeneralFormControls() {
    const generalControl = this.materialTable2.get('generalRows') as FormArray;
    if (generalControl.controls.length > 0) {
      // console.log(generalControl.controls[0].value)
    }
    return generalControl;
  }

  get getMaterialFormControls() {
    const materialControl = this.materialTable2.get('materialRows') as FormArray;
    return materialControl;
  }
  getMaterialFormGroupControls(index:number=0){
    const materialControl = this.materialTable2.get('materialRows') as FormArray;
    return materialControl.controls[index]


  }
  getBiologicalMaterialFormControls(index:number=0) {
    const materialControl = this.materialTable2.get('materialRows') as FormArray;
    const biologicalMaterialControl = materialControl.controls[index].get('biologicalMaterialRows') as FormArray;
    //const biologicalMaterialControl = this.materialTable.get('biologicalMaterialRows') as FormArray;
    // if (biologicalMaterialControl.controls.length>0){
    //   console.log(biologicalMaterialControl.controls[0].value)
    // }
    return biologicalMaterialControl;
  }
  addBiologicalMaterialTerm(index: number, key: string, id: string) {
    const materialControl = this.materialTable2.get('materialRows') as FormArray;
    const biologicalMaterialControl = materialControl.controls[index].get('biologicalMaterialRows') as FormArray;
    biologicalMaterialControl.controls[index].patchValue({ "Biological material preprocessing": id })
  }

  onOntologyTermSelection(ontology_id: string, key: string,material_index:number, index: number, multiple: boolean = true) {

    //this.show_spinner = true;
    const dialogRef = this.dialog.open(OntologyTreeComponent, { width: '1000px', autoFocus: true, disableClose: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], uncheckable: false, multiple: multiple } });
    // dialogRef..afterOpened().subscribe(result => {
    //     this.show_spinner = false;
    // })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.startfilling = true;
        // console.log(multiple)
        // console.log(key)
        this.ontology_type = result.ontology_type;
        this.selected_set = result.selected_set;
        if (this.selected_set !== undefined) {
          if (multiple) {
            var term_ids = this.getBiologicalMaterialFormControls(material_index).controls[index].value[key] + '/'
            for (var i = this.selected_set.length - 1; i >= 0; i--) {
              term_ids += this.selected_set[i]['id'] + '/'
            }
            term_ids = term_ids.slice(0, -1);
            this.validated_term[key] = { selected: true, values: term_ids };
            this.getBiologicalMaterialFormControls(material_index).controls[index].value[key].patchValue(term_ids)
          }
          else {

            if (this.selected_set.length > 0) {
              // console.log(this.getBiologicalMaterialFormControls)
              // console.log(this.getBiologicalMaterialFormControls.controls)
              // console.log(this.getBiologicalMaterialFormControls.controls[index].value)
              // console.log(this.getBiologicalMaterialFormControls.controls[index].value[key])
              // console.log(this.selected_set)
              // console.log(this.selected_set)
              // console.log(this.getBiologicalMaterialFormControls)
              // console.log(result.selected_set[0]['id'])
              this.addBiologicalMaterialTerm(index, key, result.selected_set[0]['id'])
              //this.getBiologicalMaterialFormControls.controls[index].value[key].patchValue(result.selected_set[0]['id'])
              this.startfilling = true;
            }
          }
        }
      }
    });
  }


  materialToggleRow(element: Material) {
    element.materials && (element.materials as MatTableDataSource<MaterialSource>).data.length ? (this.materialExpandedElement = this.materialExpandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    //this.materialInnerTables.forEach((table, index) => (table.MaterialDataSource as MatTableDataSource<MaterialSource>).sort = this.innerSort2.toArray()[index]);
  }
  material2ToggleRow(element: Material2) {
    element.materials && (element.materials as MatTableDataSource<MaterialSource2>).data.length ? (this.material2ExpandedElement = this.material2ExpandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    //this.materialInnerTables.forEach((table, index) => (table.MaterialDataSource as MatTableDataSource<MaterialSource>).sort = this.innerSort2.toArray()[index]);
  }

  biologicalMaterialToggleRow(element: MaterialSource) {
    console.log(element.biologicalMaterials)
    element.biologicalMaterials && (element.biologicalMaterials as MatTableDataSource<BiologicalMaterial>).data.length ? (this.materialSourceExpandedElement = this.materialSourceExpandedElement === element ? null : element) : null;

    this.cd.detectChanges();
    //this.materialInnerTables.forEach((table, index) => (table.MaterialDataSource as MatTableDataSource<MaterialSource>).sort = this.innerSort2.toArray()[index]);
  }
  biologicalMaterialToggleRow2(element: MaterialSource2) {
    console.log(element.biologicalMaterials)
    element.biologicalMaterials && (element.biologicalMaterials as MatTableDataSource<BiologicalMaterial2>).data.length ? (this.materialSource2ExpandedElement = this.materialSource2ExpandedElement === element ? null : element) : null;

    this.cd.detectChanges();
    //this.materialInnerTables.forEach((table, index) => (table.MaterialDataSource as MatTableDataSource<MaterialSource>).sort = this.innerSort2.toArray()[index]);
  }
  // applyFilter(filterValue: string) {
  //   this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).filter = filterValue.trim().toLowerCase());
  // }
  get_model_by_key() {
    this.model_to_edit = [];
    this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(data => {
      this.model_to_edit = data;
      //this.modelForm.patchValue(this.model_to_edit);
    });
  }
  onTaskAdd(event) {
    this.startfilling = false;
    this.model_keys.forEach(attr => {
      if (this.materialTable2.value[attr] !== "") {
        this.startfilling = true;
      }
    });
    // console.log(this.startfilling)
    // console.log(this.materialTable.value)
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
  cancel(form: any) {
    this.router.navigate(['/tree'], { queryParams: { key: this.parent_id.split('/')[1] } });

  };

  submitForm() {
  }
}


export interface Material {
  genus: string;
  species: string;
  organism: string,
  infraspecificName: string;
  materials?: MaterialSource[] | MatTableDataSource<MaterialSource>;
}

export interface Material2 {
  "Genus": string;
  "Species": string;
  "Organism": string,
  "Infraspecific name": string;
  materials?: MaterialSource2[] | MatTableDataSource<MaterialSource2>;
}

export interface MaterialSource {
  ID: string;
  description: string;
  doi: string;
  altitude: string;
  latitude: string;
  longitude: string;
  coordinatesUncertainty: string
  biologicalMaterials?: BiologicalMaterial[] | MatTableDataSource<BiologicalMaterial>;
}
export interface MaterialSource2 {
  "Material source ID (Holding institute/stock centre, accession)": string;
  "Material source description": string;
  "Material source DOI": string;
  "Material source altitude": string;
  "Material source latitude": string;
  "Material source longitude": string;
  "Material source coordinates uncertainty": string
  biologicalMaterials?: BiologicalMaterial2[] | MatTableDataSource<BiologicalMaterial2>;
}
export interface BiologicalMaterial {
  ID: string;
  preprocessing: string;
  altitude: string;
  latitude: string;
  longitude: string;
  coordinatesUncertainty: string
}
export interface BiologicalMaterial2 {
  "Biological material ID": string;
  "Biological material preprocessing": string;
  "Biological material altitude": string;
  "Biological material latitude": string;
  "Biological material longitude": string;
  "Biological material coordinates uncertainty": string
}


const MATERIALS: Material[] = [
  {
    genus: "Steves",
    species: "mason@test.com",
    organism: "banana",
    infraspecificName: "9864785214",
    materials: [
      {
        ID: "Street 1",
        description: "78542",
        doi: "Kansas",
        altitude: "Kansas",
        latitude: "Kansas",
        longitude: "Kansas",
        coordinatesUncertainty: "Kansas",
        biologicalMaterials: [
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
        ]
      }
    ]
  },
  {
    genus: "Mason",
    species: "mason@test.com",
    organism: "banana",
    infraspecificName: "9864785214",
    materials: [
      {
        ID: "Street 1",
        description: "78542",
        doi: "Kansas",
        altitude: "Kansas",
        latitude: "Kansas",
        longitude: "Kansas",
        coordinatesUncertainty: "Kansas",
        biologicalMaterials: [
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
        ]
      }
      ,
      {
        ID: "Street 1",
        description: "78542",
        doi: "Kansas",
        altitude: "Kansas",
        latitude: "Kansas",
        longitude: "Kansas",
        coordinatesUncertainty: "Kansas",
        biologicalMaterials: [
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
          , {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
        ]
      }
    ]
  },
  {
    genus: "Mason",
    species: "mason@test.com",
    organism: "banana",
    infraspecificName: "9864785214",
    materials: [
      {
        ID: "Street 1",
        description: "78542",
        doi: "Kansas",
        altitude: "Kansas",
        latitude: "Kansas",
        longitude: "Kansas",
        coordinatesUncertainty: "Kansas",
        biologicalMaterials: [
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
          , {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
        ]
      },
      {
        ID: "Street 1",
        description: "78542",
        doi: "Kansas",
        altitude: "Kansas",
        latitude: "Kansas",
        longitude: "Kansas",
        coordinatesUncertainty: "Kansas",
        biologicalMaterials: [
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          },
          {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
          , {
            ID: "Kansas",
            preprocessing: "Kansas",
            altitude: "Kansas",
            latitude: "Kansas",
            longitude: "Kansas",
            coordinatesUncertainty: "Kansas"
          }
        ]
      }
    ]
  }
];

// export interface MaterialSourceDataSource {
//   ID: string;
//   description: string;
//   doi: string;
//   altitude: string;
//   latitude: string;
//   longitude: string;
//   coordinatesUncertainty: string
//   biologicalMaterials?: MatTableDataSource<BiologicalMaterial>;
// }



/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
