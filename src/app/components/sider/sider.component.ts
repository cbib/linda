import { Component, Input } from '@angular/core';
import {GlobalService, SearchService, AuthenticationService } from '../../services';
@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css']
})
export class SiderComponent {
  @Input() private _currentUser!: {};
  public get currentUser(): {} {
        return this._currentUser;
  }
  public set currentUser(value: {}) {
        this._currentUser = value;
  }
    constructor(private authenticationService:AuthenticationService) {
      //console.log("Welcome in Sider component")
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      //console.log( this.currentUser)
      if (!localStorage.getItem('currentUser')==undefined){
         this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
         
      }
    }
}