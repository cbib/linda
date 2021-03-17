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
import { BiologicalMaterial2, MaterialSource2 } from './material-form2.component';



export interface Material {
  "Genus": string;
  "Species": string;
  "Organism": string,
  "Infraspecific name": string;
  materials?: MaterialSource[] | MatTableDataSource<MaterialSource>;
}
export interface MaterialSource {
  "Material source ID (Holding institute/stock centre, accession)": string;
  "Material source description": string;
  "Material source DOI": string;
  "Material source altitude": string;
  "Material source latitude": string;
  "Material source longitude": string;
  "Material source coordinates uncertainty": string
  biologicalMaterials?: BiologicalMaterial[] | MatTableDataSource<BiologicalMaterial>;
}

export interface BiologicalMaterial {
  "Biological material ID": string;
  "Biological material preprocessing": string;
  "Biological material altitude": string;
  "Biological material latitude": string;
  "Biological material longitude": string;
  "Biological material coordinates uncertainty": string
}

@Component({
  selector: 'app-material-form3',
  templateUrl: './material-form3.component.html',
  styleUrls: ['./material-form3.component.css']
})
export class MaterialForm3Component implements OnInit {
  @Input() level;
  @Input() parent_id;
  @Input() model_key: string;
  @Input() model_type: string;
  @Input() mode: string;

  model: any = [];
  model_to_edit: any = [];
  cleaned_model: any = [];
  validated_term = {}
  model_keys = []
  selected_set: []
  ontology_type: string;

  materialForm: FormGroup;
  MaterialSourceDataSource: MatTableDataSource<MaterialSource>;
  materialSource: MaterialSource[] = []
  prettyfirstinnerDisplayedColumns = [
    'Material source ID (Holding institute/stock centre, accession)',
    'Material source description',
    'Material source DOI',
    'Material source altitude',
    'Material source latitude',
    'Material source longitude',
    'Material source coordinates uncertainty'
  ];
  prettysecondinnerDisplayedColumns = [
    "Biological material ID",
    "Biological material preprocessing",
    "Biological material altitude",
    "Biological material latitude",
    "Biological material longitude",
    "Biological material coordinates uncertainty"
  ];

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, public globalService: GlobalService,
    public ontologiesService: OntologiesService, private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
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

  ngOnInit() {
    this.materialForm = new FormGroup({});
    this.materialForm = this.fb.group({
      generalRows: this.fb.array([]),
      materialRows: this.fb.array([])
    });
    this.get_model()

  }
  async get_model() {
    this.model = [];

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

      const generalControl = this.materialForm.get('generalRows') as FormArray;
      const materialControl = this.materialForm.get('materialRows') as FormArray;

      generalControl.push(this.initiateGeneralForm())

      this.globalService.get_by_key(this.model_key, this.model_type).toPromise().then(_model_to_edit => {
        this.model_to_edit = _model_to_edit;
        console.log(this.model_to_edit)
        var materialSource: MaterialSource[] = []
        for (var i = 0; i < this.model_to_edit["Material source ID (Holding institute/stock centre, accession)"].length; i++) {
          var material = {}
          material["Material source DOI"] = this.model_to_edit["Material source DOI"][i]
          material["Material source ID (Holding institute/stock centre, accession)"] = this.model_to_edit["Material source ID (Holding institute/stock centre, accession)"][i]
          material["Material source altitude"] = this.model_to_edit["Material source altitude"][i]
          material["Material source latitude"] = this.model_to_edit["Material source latitude"][i]
          material["Material source longitude"] = this.model_to_edit["Material source longitude"][i]
          material["Material source description"] = this.model_to_edit["Material source description"][i]
          material["Material source coordinates uncertainty"] = this.model_to_edit["Material source coordinates uncertainty"][i]
          var biological_materials: BiologicalMaterial[] = []
          var biological_materials_control = this.fb.array([])
          for (var j = 0; j < this.model_to_edit["Biological material ID"][i].length; j++) {
            var biological_material = {}
            biological_material["Biological material ID"] = this.model_to_edit["Biological material ID"][i][j]
            biological_material["Biological material altitude"] = this.model_to_edit["Biological material altitude"][i][j]
            biological_material["Biological material coordinates uncertainty"] = this.model_to_edit["Biological material coordinates uncertainty"][i][j]
            biological_material["Biological material latitude"] = this.model_to_edit["Biological material latitude"][i][j]
            biological_material["Biological material longitude"] = this.model_to_edit["Biological material longitude"][i][j]
            biological_material["Biological material preprocessing"] = this.model_to_edit["Biological material preprocessing"][i][j]
            biological_materials.push(biological_material as BiologicalMaterial)
            biological_materials_control.push(this.initiateBiologicalMaterialForm("", i, j))
          }

          // materialControl.push(this.initiateForm("", i, biological_materials_control))
          (material as MaterialSource).biologicalMaterials = new MatTableDataSource(biological_materials)
          materialControl.push(this.initiateForm("", i, biological_materials_control))
          materialSource.push(material as MaterialSource)
        }

        console.log(materialSource)
        console.log(materialControl)
        this.MaterialSourceDataSource = new MatTableDataSource(materialSource)
        console.log(this.MaterialSourceDataSource)
      })
    })

  }

  build_datasource() {

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
  initiateBiologicalMaterialForm(mode: string = "create", material_index: number = 0, index: number = 0): FormGroup {

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
  initiateForm(mode: string = "create", index: number = 0, tmp_bm: FormArray): FormGroup {
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
    materialAttributeFilters['biologicalMaterialRows'] = tmp_bm
    return this.fb.group(materialAttributeFilters);

  }
  get getGeneralFormControls() {
    const generalControl = this.materialForm.get('generalRows') as FormArray;
    if (generalControl.controls.length > 0) {
      // console.log(generalControl.controls[0].value)
    }
    return generalControl;
  }

  get getMaterialFormControls() {
    const materialControl = this.materialForm.get('materialRows') as FormArray;
    return materialControl;
  }

  getMaterialFormGroupControls(index:number=0){
    const materialControl = this.materialForm.get('materialRows') as FormArray;
    return materialControl.controls[index]
  }

  getBiologicalMaterialFormControls(index:number=0) {
    const materialControl = this.materialForm.get('materialRows') as FormArray;
    const biologicalMaterialControl = materialControl.controls[index].get('biologicalMaterialRows') as FormArray;
    return biologicalMaterialControl;
  }




}
