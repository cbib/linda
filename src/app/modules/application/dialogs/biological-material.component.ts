import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from '../../../services';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ChipListComponent } from 'src/app/components/chip-list/chip-list.component'
import { OntologyTreeComponent } from '../dialogs/ontology-tree.component';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import { BiologicalMaterial } from 'src/app/models/linda/biological-material';
interface DialogData {
  material_type: string;
  data_filename: string;
  mode: string;
  selected_data: [];
}
export interface TaxonScientificNames {
  name: string;
}
export interface BiologicalMaterialPreprocessings {
  name: string;
}

@Component({
  selector: 'app-biological-material',
  templateUrl: './biological-material.component.html',
  styleUrls: ['./biological-material.component.css']
})
export class BiologicalMaterialComponent implements OnInit {

  material_type: string;
  data_filename: string;
  biological_material_n: number;
  selected_data: any[] = []
  mode: string = "from_data_file"
  numbers: number[];
  replication: number;
  labelPosition: 'autogenerate ids' | 'paste ids' = 'autogenerate ids';
  PasteMaterialIds: "" | 'paste ids' = ""
  autogenerateIsChecked: boolean = false
  TaxonScientificName: string
  MaterialID: string
  BiologicalMaterialId: string;
  Taxon: string;
  Institution: string
  selected_species: any[];
  selected_taxons: any[];
  selected_institutions: any[] = [];
  BiologicalMaterialpastedIds: string[];
  MaterialpastedIds: string[];
  bm_list:BiologicalMaterial[]=[]

  taxonScientificNames: TaxonScientificNames[] = [];
  BiologicalMaterialPreprocessings: BiologicalMaterialPreprocessings[] = [];
  private taxonScientificNameForm: FormGroup;
  private BiologicalMaterialPreprocessingForm: FormGroup;
  BiologicalMaterialPreprocessing: string = "";
  validated_term = {}


  constructor(private globalService: GlobalService, private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<BiologicalMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.material_type = this.data.material_type
    this.data_filename = this.data.data_filename
    this.numbers = [];
    this.biological_material_n = 1
    this.replication = 1
    if (this.data.mode) {
      this.mode = this.data.mode
    }
    this.taxonScientificNameForm = this.fb.group({
      "keyTaxonScientificNames": new FormControl()
    });
    this.BiologicalMaterialPreprocessingForm = this.fb.group({
      "keyBiologicalMaterialPreprocessings": new FormControl()
    });
    this.MaterialpastedIds = []
    this.BiologicalMaterialpastedIds = []
    if (this.data.selected_data.length > 0) {
      this.selected_data = this.data.selected_data
      console.log(this.selected_data)
      this.MaterialID = ""
      let bm_count = 1
      this.selected_data.forEach(async bm => {
        console.log(bm.TaxonScientificName)
        if (bm_count === this.selected_data.length) {
          this.MaterialID = this.MaterialID.concat(bm.AccessionNumber)
        }
        else {
          this.MaterialID = this.MaterialID.concat(bm.AccessionNumber + '\n')
        }
        this.MaterialpastedIds.push(bm.AccessionNumber)
        if (this.taxonScientificNames.filter(species=>species.name===bm.TaxonScientificName).length===0){
          this.taxonScientificNames.push({ name: bm.TaxonScientificName });
        }
        
        this.Institution = bm.HoldingInstitution.split(" - ")[0]
        const res = await this.globalService.get_ncbi_taxon_data_by_species_regex(bm.TaxonScientificName).toPromise()
        console.log(res)
        ///this.Taxon=res[0].taxon
        //this.addSkillsToArray(bm.taxonScientificName);
        bm_count += 1
      })

    }

  }
  get get_taxonScientificNameForm() {
    return this.taxonScientificNameForm
  }
  get get_biologicalMaterialPreprocessingForm(){
    return this.BiologicalMaterialPreprocessingForm
  }
  keyTaxonScientificNames() {
    return this.taxonScientificNameForm.get('keyTaxonScientificNames') as FormControl
  }
  onNumChange(value: number) {
    this.biological_material_n = +value
  }
  onRepChange(value: number) {
    this.replication = +value
  }
  onspeciesChanged(event) {
    console.log(event.target.value)
  }
  onInstitutionChanged(event) {
    console.log(event.target.value)
  }
  onMaterialIdChanged(event) {
    console.log(event.target.value)
    this.MaterialID = event.target.value

  }
  get_output_from_taxonScientificNameForm(val: any) {
    console.log(this.taxonScientificNameForm.value)
    this.taxonScientificNames = val
    console.log(this.taxonScientificNameForm.value)

  }
  get_output_from_BiologicalMaterialPreprocessingForm(val: any) {
    console.log(this.BiologicalMaterialPreprocessingForm.value)
    this.BiologicalMaterialPreprocessings = val
    console.log(this.BiologicalMaterialPreprocessingForm.value)

  }
  onTaxonChanged(event) {
    console.log(event.target.value)
  }
  onAddScientificNames(event) {
    if (event.key === "Enter" || event.key === ",") {
      this.addScientificNamesToArray(this.taxonScientificNameForm.value['keyTaxonScientificNames']);
    }
  }
  onAddBiologicalMaterialPreprocessings(event) {
    if (event.key === "Enter" || event.key === ",") {
      this.addBiologicalMaterialPreprocessingsToArray(this.BiologicalMaterialPreprocessingForm.value['keyBiologicalMaterialPreprocessings']);
    }
  }
  onBlurMethod() {
    this.addScientificNamesToArray(this.taxonScientificNameForm.value['keyTaxonScientificNames'])
  }
  onBlurMethodBiologicalMaterialPreprocessing() {
    this.addBiologicalMaterialPreprocessingsToArray(this.BiologicalMaterialPreprocessingForm.value['keyBiologicalMaterialPreprocessings'])
  }

  addBiologicalMaterialPreprocessingsToArray(biologicalMaterialPreprocessing) {
    if ((biologicalMaterialPreprocessing|| '').trim()) {
      this.BiologicalMaterialPreprocessings.push({ name: biologicalMaterialPreprocessing.trim() });
    }
    this.taxonScientificNameForm.reset();
    event.preventDefault();
  }
  addScientificNamesToArray(taxonScientificName) {
    if ((taxonScientificName || '').trim()) {
      this.taxonScientificNames.push({ name: taxonScientificName.trim() });
    }
    this.taxonScientificNames=Array.from(new Set(this.taxonScientificNames))
    this.taxonScientificNameForm.reset();
    event.preventDefault();
  }

  ngOnInit() {
    for (var i: number = 1; i < 101; i++) {
      this.numbers.push(i)
    }
  }
  async searchTaxonScientificNameStart(event) {
    this.TaxonScientificName = event.target.value;
    if (this.TaxonScientificName === "" || this.TaxonScientificName.length < 3) {
      //this.active_list = false
      console.log("empty search")
    }
    else {
      //console.log(this.search_string)
      this.selected_species = []
      const res = await this.globalService.get_ncbi_taxon_data_by_species_regex(this.TaxonScientificName).toPromise()
      console.log(res)
      this.selected_species = res
    }
  }
  async searchTaxonStart(event) {
    this.Taxon = event.target.value;
    if (this.Taxon === "" || this.Taxon.length < 3) {
      //this.active_list = false
      console.log("empty search")
    }
    else {
      //console.log(this.search_string)
      this.selected_taxons = []
      const res = await this.globalService.get_ncbi_taxon_data_by_taxon_regex(this.Taxon).toPromise()
      console.log(res)
      this.selected_taxons = res
    }
  }
  save() {
/*     console.log(this.biological_material_n)
    console.log(this.replication)
    console.log(this.MaterialID.split('\n'))
    console.log(this.TaxonScientificName)
    console.log(this.taxonScientificNames)
    console.log(this.Institution)
    console.log(this.Taxon) */
    //this.MaterialpastedIds=this.MaterialpastedIds.concat(this.MaterialID.split('\n'))
    //console.log(this.MaterialpastedIds)
    /* if (this.PasteMaterialIds===""){
      console.log(this.MaterialID)
      this.MaterialpastedIds.push(this.MaterialID)
    }
    else{
      this.MaterialpastedIds=this.MaterialpastedIds.concat(this.MaterialID.split('\n'))
      console.log(this.MaterialpastedIds)
    } */
    //let bm_list:BiologicalMaterial[]=[]
    this.bm_list=[]
    this.taxonScientificNames.forEach(tsn => {
      this.MaterialpastedIds.forEach(mat_id => {
        if (this.labelPosition === 'autogenerate ids') {
          for (let repindex = 1; repindex < this.replication + 1; repindex++) {
            for (let bmindex = 1; bmindex < this.biological_material_n + 1; bmindex++) {
              let bm_id = this.Institution + "_" + mat_id + "_rep" + repindex + "_" + bmindex
              console.log(bm_id)
              let bm: BiologicalMaterial = new BiologicalMaterial(bm_id)
              bm['Material source ID (Holding institute/stock centre, accession)'] = this.Institution + "_" + mat_id
              bm['Material source DOI'] = ""
              bm['Material source altitude'] = ""
              bm['Material source description'] = "Material from " + this.Institution + " - Lot name: " + "" + " - Panel names:" + "" + " - Panel sizes: " + ""
              bm['Material source latitude'] = ""
              bm['Material source longitude'] = ""
              bm['Biological material preprocessing'] = this.BiologicalMaterialPreprocessings.map(bm=>bm.name).join("/")
              bm.Genus = tsn.name.split(" ")[0]
              bm.replication = this.replication
              bm.Species = tsn.name.split(" ")[1]
              bm.Organism = this.Taxon
              bm['Infraspecific name'] = tsn.name
              this.bm_list.push(bm)
            }
          }
        }
        else {
          this.BiologicalMaterialpastedIds = this.BiologicalMaterialpastedIds.concat(this.BiologicalMaterialId.split('\n'))
          for (let index = 0; index < this.BiologicalMaterialpastedIds.length; index++) {
            const element = this.BiologicalMaterialpastedIds[index];
            let bm_id = this.Institution + "_" + mat_id + "_" + element
            console.log(bm_id)
            let bm: BiologicalMaterial = new BiologicalMaterial(bm_id)
            bm['Material source ID (Holding institute/stock centre, accession)'] = this.Institution + "_" + mat_id
            bm['Material source DOI'] = ""
            bm['Material source altitude'] = ""
            bm['Material source description'] = "Material from " + this.Institution + " - Lot name: " + " " + " - Panel names:" + " " + " - Panel sizes: " + " "
            bm['Material source latitude'] = ""
            bm['Material source longitude'] = ""
            bm['Biological material preprocessing'] = this.BiologicalMaterialPreprocessings.map(bm=>bm.name).join("/")
            bm.Genus = element["Genus"]
            bm.replication = this.replication
            bm.Species = tsn.name.split(" ")[1]
            bm.Organism = this.Taxon
            bm['Infraspecific name'] =tsn.name
            this.bm_list.push(bm)
            
          }
        }
      });
    });
    console.log(this.bm_list)

  }
  onGlobalOntologyTermSelection(ontology_id: string, key: string, multiple: boolean = true) {
    const dialogRef = this.dialog.open(OntologyTreeComponent, { disableClose: true, width: '1000px', autoFocus: true, maxHeight: '100vh', data: { ontology_id: ontology_id, selected_term: null, selected_set: [], selected_key: "", uncheckable: false, multiple: multiple, model_type: 'biological_material', mode_simplified: false, observed: false, sub_class_of: "" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (!multiple) {
          if (result.selected_set !== undefined) {
            if (key === "Biological Material Preprocessing") {
              this.BiologicalMaterialPreprocessing = result.selected_set[0]['id']
              this.BiologicalMaterialPreprocessings.push({ name: result.selected_set[0]['id'].trim() });
              this.validated_term[key] = { selected: true, values: result.selected_set[0]['id'] };
            }
            
          }
        }
      }
    });
  }
  onTaskAdd(event) {
    ////console.log(event.target.value)
  }
  onBiologicalMaterialPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    console.log(pastedText)
    this.BiologicalMaterialpastedIds = this.BiologicalMaterialpastedIds.concat(pastedText.split('\n'))
  }
  onMaterialPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    console.log(pastedText)
    this.MaterialpastedIds = this.MaterialpastedIds.concat(pastedText.split('\n'))
  }
  get_selected_species() {
    return this.selected_species
  }
  get_selected_taxons() {
    return this.selected_taxons
  }
  get_selected_institutions() {
    return this.selected_institutions
  }

  onBiologicalMaterialInput(content: string) {
    console.log(content)
    this.BiologicalMaterialId = content
  }
  onMaterialInput(content: string) {
    console.log(content)
    this.MaterialpastedIds=[]
    this.MaterialID = content
    this.MaterialpastedIds = this.MaterialpastedIds.concat(this.MaterialID.split('\n'))

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    
      this.dialogRef.close({ event: "Confirmed", biological_material_n: (this.biological_material_n as number), replication: (this.replication as number), mode: 'autogenerated', bm_list:this.bm_list });


  }
}