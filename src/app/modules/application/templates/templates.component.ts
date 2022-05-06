import { Component, OnInit, ViewChild , AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { GlobalService, AlertService, UserService} from '../../../services';
import { splitAtColon } from '@angular/compiler/src/util';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { TemplateElement} from '../../../models/template_models'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

//Add possibility to import a template into a existing esperiment

export class TemplatesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private displayedColumns: string[] = ['id', 'Model', 'Actions'];
  private dataSource:MatTableDataSource<TemplateElement>;
  private currentUser
  private selected_model_type=""
  private model_key =""
  private selected_model:string=""
  private model_types :{}[]= [{"event":"Event"}, {"experimental_factor":"Experimental factor"},{"observed_variable":"Observed variable"},{"environment":"Environment"}]

  constructor(private globalService : GlobalService,
    private router: Router,
    private alertService: AlertService,
    private userService:UserService,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef) 
    { 
      this.dataSource = new MatTableDataSource([]);
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.selected_model='Experimental factor'
      this.get_templates()
    }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //await this.get_templates()
  }
  async get_templates(){
    const ELEMENT_DATA: TemplateElement[]=[]
    return await this.userService.get_person_id(this.currentUser._key).toPromise().then(
      async person_id => {
          console.log(person_id)
          const data = await this.globalService.get_templates(person_id[0].split("/")[1]).toPromise();
        if (data) {
          data.forEach(result => {
            console.log(result);
            this.model_key = result['template']['_id'].split('/')[1];
            ELEMENT_DATA.push({ 'id': result['template']['_id'], 'model': result['template'], key: this.model_key, 'model_type': result['template']['_model_type'], 'edit': "test" });
          });
          //this.dataSource = ELEMENT_DATA;
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this._cdr.detectChanges();
        }
      }
    );
  }
  ngAfterViewInit(): void {
    console.log(this.dataSource)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._cdr.detectChanges()
  }
  get get_model_types() : {}[]{
    return this.model_types
  }
  get get_selected_model(){
    return this.selected_model
  }
  

  get_key(model:{}){
    return Object.keys(model)[0];
  }
  get_value(model:{}){
    return model[Object.keys(model)[0]];
  }
  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get get_dataSource() {
    return this.dataSource
  }


  

  /* get_all_templates(user_key){
    const ELEMENT_DATA: TemplateElement[]=[]
    this.globalService.get_all_templates(user_key).toPromise().then(
      data => {
          data.forEach(element => {
            if (element){
              //let model=element['_id'].split('/')[0].slice(0, (element['_id'].split('/')[0].length-10)).replace("_", " ")

              let model = element['_model_type']
              //this.selected_model_type=element['_id'].split('/')[0].slice(0, (element['_id'].split('/')[0].length-10))
              this.key=element['_id'].split('/')[1]
              //let model=element['_id'].split('/')[0].slice(0-10)
              ELEMENT_DATA.push({'id':element['_id'], 'model': model, key: this.key, 'model_type': model, 'edit': "test" })
            }
            
          });
          this.dataSource = ELEMENT_DATA;
      }
  );
  } */
  get get_displayedColumns(){
    return this.displayedColumns
  }  
  get get_data_source(){
    return this.dataSource
  }
  edit_template(element:any){
    console.log(element)
    this.router.navigate(['/generic_form'], { queryParams: { 
      level: "1", 
      parent_id: this.currentUser._id, 
      model_key: element.key, 
      model_type: element.model_type, 
      mode: "edit_template" , 
      inline:"false", 
      asTemplate:false, 
      onlyTemplate:true,
      role:"owner"} });

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
              this.reloadComponent(['/templates'])
          }
          else {
              this.alertService.error("Template form has not been removed - Check database administrator! - " + data["message"]);
              this.reloadComponent(['/templates'])
          }
      }
  );
  }
  onModelChange(values: string) {

    this.selected_model = values
  }
  onAdd(){
    if (! this.selected_model){
      this.alertService.error("You need to select a model first !! ")
    }else{
      this.router.navigate(['/generic_form'], { queryParams: { level: "1", parent_id: this.currentUser._id, model_key: "", model_type: this.selected_model, mode: "create" , inline:"false", asTemplate:true, onlyTemplate:true, role:"owner"}, skipLocationChange: true}); //replaceUrl: false

    }
  }
}
