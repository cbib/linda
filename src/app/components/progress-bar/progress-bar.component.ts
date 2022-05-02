import { Component, OnInit, Input, ViewChildren, QueryList ,OnChanges, EventEmitter, Output} from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-progress-bar',
   template: `
   <div class="progress-bar-container">
      <div class="progress-bar {{color}}" 
         [ngStyle]="{'width': get_progress + '%'}">
      </div>
   </div>
   `,
   styleUrls: ['./progress-bar.component.css']
}) 

export class ProgressBarComponent implements OnInit, OnChanges {
   @Input('progress') progress: number;
   @Input('total') total: number;
   @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
   //@ViewChildren(ProgressBarComponent) myChildren: QueryList<ProgressBarComponent>;
   color: string; 
   constructor(private route: ActivatedRoute,) {
      
      this.route.queryParams.subscribe(
         params => {
           this.progress = params['progress'];
           this.total = params['total'];


         }
       );
       console.log(this.progress)
       console.log(this.total)
    } 
   ngOnInit() {
       console.log(this.progress)
       console.log(this.total)
      //if we don't have progress, set it to 0.
      if (!this.progress) {
         this.progress = 0;
      }  //if we don't have a total aka no requirement, it's 100%.
      if (this.total === 0) {
         this.total = this.progress;
      } else if (!this.total) {
         this.total = 100;
      }  //if the progress is greater than the total, it's also 100%.
      if (this.progress > this.total) {
         this.progress = 100;
         this.total = 100;
      }
      this.progress = (this.progress / this.total) * 100; 
      if (this.progress < 55) {
         this.color = 'red';
      } 
      else if (this.progress < 75) {
         this.color = 'yellow';
      } 
      else {
         this.color = 'green';
      }
   }
   set_progress(_progress:number){
      console.log(_progress)
      this.progress = (_progress / this.total) * 100; 
      console.log(this.progress)
      if (this.progress < 30) {
         this.color = 'red';
      } 
      else if (this.progress < 60) {
         this.color = 'yellow';
      } 
      else {
         this.color = 'green';
      }
      this.ngOnChanges()
   }
   get get_progress(){
      return this.progress
   }
   ngOnChanges() {
       console.log("changing");
       console.log(this);
       this.notify.emit(this.get_progress);
   } 
}
