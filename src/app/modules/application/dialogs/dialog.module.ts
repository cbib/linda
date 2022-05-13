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
import { BiologicalMaterialComponent } from './biological-material.component'
import { SampleSelectionComponent } from './sample-selection.component'
import { HelpLoaderComponent } from './help-loader.component'
import { ShareProject } from './share-project';
import { TableComponent } from '../tables/table.component';

import { GlobalService} from '../../../services';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule} from '@angular/material/radio' 
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule} from '@angular/material/select'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { TextFieldModule} from '@angular/cdk/text-field';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { FormModule } from '../forms/form.module';
import { MaterialFormModule } from '../material-forms/material-form.module'
import { ObservationUnitFormModule } from '../observation-unit-forms/observation-unit-form.module';
import { GroupLoginComponent } from './group-login.component';
import { AlertModule } from '../alert/alert.module';
import { FilesLoaderComponent } from './files-loader.component';
import { TablesModule} from '../tables/tables.module';
import { AssignComponent } from './assign.component';
import { MapColumnComponent } from './map-column.component';
import { DefineComponent } from './define.component'
import { DataTablesModule } from 'angular-datatables';
import { AddColumnComponent } from './add-column.component';
import { EditFormComponent } from './edit-form.component';
import { ProjectLoaderComponent } from './project-loader.component';
import { ProgressBarModule } from 'src/app/components/progress-bar/progress-bar.module';
import { AssociateBiologicalMaterial } from './associate-biological-material.component';
import { MatInputModule } from '@angular/material/input';
import { AssociateObservationUnit } from './associate-observation-unit.component';
import { MatMenuModule } from '@angular/material';
import {ChipListComponent} from 'src/app/components/chip-list/chip-list.component'

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
    BiologicalMaterialComponent,
    SampleSelectionComponent,
    HelpLoaderComponent,
    ShareProject,
    GroupLoginComponent,
    FilesLoaderComponent,
    AssignComponent,
    MapColumnComponent,
    DefineComponent,
    AddColumnComponent,
    EditFormComponent,
    ProjectLoaderComponent,
    AssociateBiologicalMaterial,
    AssociateObservationUnit,
    ChipListComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    ProgressBarModule,
    MatExpansionModule,
    MatTreeModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSliderModule,
    TextFieldModule,
    ScrollingModule,
    MatRadioModule,
    MatTableModule,
    FormModule,
    MaterialFormModule,
    ObservationUnitFormModule,
    AlertModule,
    TablesModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
    DataTablesModule
    
    
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
    BiologicalMaterialComponent,
    SampleSelectionComponent,
    HelpLoaderComponent,
    ShareProject,
    GroupLoginComponent,
    FilesLoaderComponent,
    EditFormComponent,
    ProjectLoaderComponent,
    AssociateBiologicalMaterial,
    AssociateObservationUnit,
    ChipListComponent
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
    BiologicalMaterialComponent,
    SampleSelectionComponent,
    HelpLoaderComponent,
    ShareProject,
    GroupLoginComponent,
    FilesLoaderComponent,
    TableComponent,
    AssignComponent,
    DefineComponent,
    AddColumnComponent,
    EditFormComponent,
    ProjectLoaderComponent,
    AssociateBiologicalMaterial,
    AssociateObservationUnit,
    ChipListComponent
  ]
})
export class DialogModule { }
