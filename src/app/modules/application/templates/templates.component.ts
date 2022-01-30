import { Component, OnInit } from '@angular/core';
import { GlobalService, AlertService} from '../../../services';
import { splitAtColon } from '@angular/compiler/src/util';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { TemplateElement} from '../../../models/template_models'


@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

//Add possibility to import a template into a existing esperiment

export class TemplatesComponent implements OnInit {
  private displayedColumns: string[] = ['id', 'model', 'edit'];
  private dataSource
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
  get get_displayedColumns(){
    return this.displayedColumns
  }  
  get get_data_source(){
    return this.dataSource
  }
  edit_template(element){
    this.router.navigate(['/generic_form'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: element.key, model_type: element.model_type, mode: "edit_template" } });

  }
  reloadComponent(path:[string]) {
    //let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(path);
}
  remove_template(element){
    this.globalService.remove_template(element.id).pipe(first()).toPromise().then(
      data => {
          if (data["success"]) {
              this.alertService.success(data["message"])
              this.router.navigate(['/projects_tree'])
              this.reloadComponent(['/templates'])
          }
          else {
              this.alertService.error("Template form has not been removed - Check database administrator! - " + data["message"]);
              this.reloadComponent(['/templates'])
          }
      }
  );
  }
}
