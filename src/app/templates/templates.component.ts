import { Component, OnInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material';
import { GlobalService} from '../services';
import { MatTableDataSource } from '@angular/material/table';
import { splitAtColon } from '@angular/compiler/src/util';

export interface TemplateElement {
  id: string;
  model: number;
  template:{}
}

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

export class TemplatesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'model'];
  dataSource
  constructor(private globalService : GlobalService) { }

  async ngOnInit() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(user)
    await this.get_templates(user._key)
  }
  get_templates(user_key){
    const ELEMENT_DATA: TemplateElement[]=[]
    this.globalService.get_all_templates(user_key).toPromise().then(
      data => {
          console.log(data);
          data.forEach(element => {
            console.log(element)
            let model=element['_id'].split('/')[0].slice(0, (element['_id'].split('/')[0].length-10)).replace("_", " ")
            //let model=element['_id'].split('/')[0].slice(0-10)
            console.log(model)
            ELEMENT_DATA.push({'id':element['_id'], 'model': model, 'template': element })
          });
          this.dataSource = ELEMENT_DATA;

      }
  );
  }

}
