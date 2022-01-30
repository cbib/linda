import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation.component';
import { DelimitorComponent} from './delimitor.component'
import { CsvLoaderComponent} from './csv-loader.component'
import { OntologyTreeComponent } from './ontology-tree.component';
import { DatatableComponent} from './datatable.component'
import { TemplateSelectionComponent} from './template-selection.component'
import { DateformatComponent} from './dateformat.component' 
import { SearchResultComponent } from './search-result.component';
import { ExportComponent } from './export.component'
import { SelectionComponent } from './selection.component';
import { FormGenericComponent } from './form-generic.component';
import  {BiologicalMaterialComponent } from './biological-material.component'

import { GlobalService} from '../../../services';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule} from '@angular/material/select'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {TextFieldModule} from '@angular/cdk/text-field';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { FormModule } from '../forms/form.module';
import { MaterialFormModule } from '../material-forms/material-form.module'
import { ObservationUnitFormModule } from '../observation-unit-forms/observation-unit-form.module';

@NgModule({
  declarations: [
    ConfirmationComponent, 
    DelimitorComponent,
    CsvLoaderComponent,
    OntologyTreeComponent,
    DatatableComponent,
    TemplateSelectionComponent,
    DateformatComponent,
    SearchResultComponent,
    ExportComponent,
    SelectionComponent,
    FormGenericComponent,
    BiologicalMaterialComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTreeModule,
    MatCardModule,
    MatIconModule,
    TextFieldModule,
    ScrollingModule,
    MatTableModule,
    FormModule,
    MaterialFormModule,
    ObservationUnitFormModule
    
  ],
  providers: [
    GlobalService
  ],
  exports:[
    ConfirmationComponent,
    DelimitorComponent,
    CsvLoaderComponent,
    OntologyTreeComponent,
    DatatableComponent,
    TemplateSelectionComponent,
    DateformatComponent,
    SearchResultComponent,
    ExportComponent,
    SelectionComponent,
    FormGenericComponent,
    BiologicalMaterialComponent
  ],
  entryComponents:[
    ConfirmationComponent,
    DelimitorComponent,
    CsvLoaderComponent,
    OntologyTreeComponent,
    DatatableComponent,
    TemplateSelectionComponent,
    DateformatComponent,
    SearchResultComponent,
    ExportComponent,
    SelectionComponent,
    FormGenericComponent,
    BiologicalMaterialComponent
  ]
})
export class DialogModule { }
