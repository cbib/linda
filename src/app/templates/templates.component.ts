import { Component, OnInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material';
import { GlobalService, AlertService} from '../services';
import { MatTableDataSource } from '@angular/material/table';
import { splitAtColon } from '@angular/compiler/src/util';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
export interface TemplateElement {
  id: string;
  model: number;
  model_type:string;
  edit:string;
  key:string;
}

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

export class TemplatesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'model', 'edit'];
  dataSource
  private currentUser
  private selected_model_type=""
  private key =""
  constructor(private globalService : GlobalService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute) 
    { 

    }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    await this.get_templates(this.currentUser._key)
  }
  get_templates(user_key){
    const ELEMENT_DATA: TemplateElement[]=[]
    this.globalService.get_all_templates(user_key).toPromise().then(
      data => {
          data.forEach(element => {

            let model=element['_id'].split('/')[0].slice(0, (element['_id'].split('/')[0].length-10)).replace("_", " ")
            this.selected_model_type=element['_id'].split('/')[0].slice(0, (element['_id'].split('/')[0].length-10))
            this.key=element['_id'].split('/')[1]
            //let model=element['_id'].split('/')[0].slice(0-10)
            ELEMENT_DATA.push({'id':element['_id'], 'model': model, key: this.key, 'model_type': this.selected_model_type, 'edit': "test" })
          });
          this.dataSource = ELEMENT_DATA;

      }
  );
  }
  edit_template(element){
    this.router.navigate(['/generic'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: element.key, model_type: element.model_type, mode: "edit_template" } });

  }
  remove_template(element){
    this.globalService.remove_template(element.id).pipe(first()).toPromise().then(
      data => {
          if (data["success"]) {
              this.alertService.success(data["message"])
              this.router.navigate(['/tree'])
          }
          else {
              this.alertService.error("this form contains errors! " + data["message"]);
              this.router.navigate(['/tree'])
          }
      }
  );
  }
}
