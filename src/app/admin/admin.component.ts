import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    users: User[] = [];
    constructor() { }

    ngOnInit() {}
//    private loadAllUsers() {
//        this.userService.getAll().pipe(first()).subscribe(users => { 
//            this.users = users; 
//        });
//    }
//    deleteUser(id: string) {
//        this.userService.delete(id).pipe(first()).subscribe(() => { 
//            this.loadAllUsers() 
//        });
//    }

}
