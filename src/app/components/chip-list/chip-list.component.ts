import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'chip-list',
  templateUrl: 'chip-list.component.html',
  styleUrls: ['chip-list.component.css'],
})
export class ChipListComponent {
    @Input() skills;
    @Output() notify: EventEmitter<{}> = new EventEmitter<{}>();
    removable=true
    onRemove(name:string){
      this.skills=this.skills.filter(skill=>skill.name!==name)
      this.notify.emit({skills:this.skills, selected_skill:name})
    }
    onSelect(name:any){
      //this.skills=this.skills.filter(skill=>skill.name!==name)
      this.notify.emit({skills:this.skills, selected_skill:name})
    }
}