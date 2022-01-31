import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
  { path: '',children: [
                        { path: 'data_exploration',component: DataExplorationComponent},
                        { path: '',redirectTo: "data_exploration",pathMatch: "full"},
                        { path: "ontologies",component: OntologyDescriptionComponent},
                        { path: "investigation",component: InvestigationComponent},
                        { path: "miappe",component: MiappeDescriptionComponent},
                        { path: "study",component: StudyComponent},
                        { path: "event",component: EventComponent},
                        { path: "observation_unit",component: ObservationUnitComponent},
                        { path: "biological_material",component: BiologicalMaterialMiappeComponent},
                        { path: "observed_variable",component: ObservedVariableComponent},
                        { path: "experimental_factor",component: ExperimentalFactorComponent},
                        { path: "environmental_parameter",component: EnvironmentalParameterComponent},
                        { path: "sample",component: SampleComponent},
                        { path: "releases", component: ReleasesComponent},
                        { path: 'public_data',component: PublicDataComponent},
                        { path: 'project_example',component: ProjectExampleComponent},

                       ]}
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentationRoutingModule { }