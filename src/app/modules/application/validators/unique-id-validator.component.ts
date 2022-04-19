import { Component, OnInit } from '@angular/core';
import { FormControl,ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalService, AlertService } from '../../../services';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-unique-id-validator',
  templateUrl: './unique-id-validator.component.html',
  styleUrls: ['./unique-id-validator.component.css']
})

export class UniqueIDValidatorComponent{
  alreadyThere= UniqueIDValidatorComponent.alreadyThere;
  
  static alreadyThere(globalService: GlobalService, alertService: AlertService, model_type:string, field:string, parent_id:string="", as_template:boolean=false){
    
    return (control: FormControl) => {
        //return globalService.is_exist(field, control.value, model_type).subscribe(

        return globalService.is_exist(field, control.value, model_type, parent_id, as_template).pipe(first()).toPromise().then(
            data => {
                    if (control.value ===""){
                        return { 'alreadyThere': true };
                    }
                    if (data["success"]){
                        alertService.clear()
                    }else{
                        alertService.error("this "+field+" is already used. Please select new one ! ");
                    }
            return data["success"] ? null : { 'alreadyThere': true };

        });
    };
  }
}

