import { Component, OnInit, Input, Inject, ViewChild  } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { UserService, GlobalService, OntologiesService, AlertService, StatisticsService } from '../services';
import { OntologyTerm } from '../ontology/ontology-term';
import { Instance } from '../ontology/instance';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { SearchResultDialogComponent } from '../dialog/search-result-dialog.component';
import { MatProgressSpinner } from '@angular/material';
import { JoyrideService } from 'ngx-joyride';
import { multi, single } from '../data/data';
@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  styleUrls: ['./exploration.component.css']
})
export class ExplorationComponent implements OnInit {
  parent_id=""
  title = 'Angular Charts';

  view: any[] = [600, 400];

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

  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  //pie
  showLabels = true;
  public single=single
  public multi = multi
  constructor(private router: Router, 
              private statisticsService: StatisticsService, 
              private readonly joyrideService: JoyrideService,
              private route: ActivatedRoute,public dialog: MatDialog) {
    this.route.queryParams.subscribe(
      params => {
          this.parent_id = params['parent_id']
          console.log(this.parent_id)
      }
      
    );

  }
  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {

  }
  

}
