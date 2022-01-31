import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService} from '../../../services';
import { DocumentationRoutingModule } from './documentation-routing.module'
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataExplorationComponent } from './data-exploration.component';
import { MiappeDescriptionComponent } from './miappe-description.component'
import { StudyComponent } from './miappe_components/study.component';
import { EventComponent } from './miappe_components/event.component';
import { BiologicalMaterialMiappeComponent } from './miappe_components/biological-material-miappe.component';
import { ObservationUnitComponent } from './miappe_components/observation-unit.component';
import { ObservedVariableComponent } from './miappe_components/observed-variable.component';
import { ExperimentalFactorComponent } from './miappe_components/experimental-factor.component';
import { EnvironmentalParameterComponent } from './miappe_components/environmental-parameter.component';
import { SampleComponent } from './miappe_components/sample.component';
import { InvestigationComponent } from './miappe_components/investigation.component';
import { OntologyDescriptionComponent } from './ontology-description.component'
import { ReleasesComponent } from './releases.component';
import { PublicDataComponent } from './public-data.component';
import { ProjectExampleComponent } from './project-example.component';

@NgModule({
  declarations: [
    DataExplorationComponent,
    OntologyDescriptionComponent,
    MiappeDescriptionComponent,
    InvestigationComponent,
    StudyComponent,
    EventComponent,
    BiologicalMaterialMiappeComponent,
    ObservationUnitComponent,
    ObservedVariableComponent,
    ExperimentalFactorComponent,
    EnvironmentalParameterComponent,
    SampleComponent,
    ReleasesComponent,
    PublicDataComponent,
    ProjectExampleComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DocumentationRoutingModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatTreeModule,
    MatCardModule,
    TextFieldModule,
    ScrollingModule
    
  ],
  providers: [
    GlobalService
  ],
  exports:[
    DataExplorationComponent,
    OntologyDescriptionComponent,
    MiappeDescriptionComponent,
    InvestigationComponent,
    StudyComponent,
    EventComponent,
    BiologicalMaterialMiappeComponent,
    ObservationUnitComponent,
    ObservedVariableComponent,
    ExperimentalFactorComponent,
    EnvironmentalParameterComponent,
    SampleComponent,
    ReleasesComponent,
    PublicDataComponent,
    ProjectExampleComponent
  ],
  entryComponents:[],
})
export class DocumentationModule { }
