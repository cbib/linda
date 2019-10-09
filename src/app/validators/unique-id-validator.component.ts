import { Component, OnInit } from '@angular/core';
import { FormControl,ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalService, AlertService } from '../services';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-unique-id-validator',
  templateUrl: './unique-id-validator.component.html',
  styleUrls: ['./unique-id-validator.component.css'],
  //providers:[InvestigationService, AlertService]
})

export class UniqueIDValidatorComponent{
  create= UniqueIDValidatorComponent.create;
  //test= UniqueIDValidatorComponent.test;
  //constructor(private inv: InvestigationService, private alert: AlertService) { }   
  
//  private async get_investigation_service_response(value:string){
//      return await this.inv.is_exist("Investigation unique ID", value).pipe(first()).toPromise().then(
//            data => {
////                    setTimeout(() => {control.updateValueAndValidity();}, 10);
//                    console.log(data["success"])
//                    if (data["success"]){
//                        console.log(data["message"])
//                        this.alert.clear()
//                        return null
//                        //console.log(control.errors);
//                    }else{
//                        this.alert.error(data["success"]);
//                        //console.log(control.errors);
//                        return { 'unique_id': true }
//                    }
//            //return data["success"] ? null : { 'create': true };
//
//        });
//  }
  static create(globalService: GlobalService, alertService: AlertService, model_type:string, field:string){
    
    return (control: FormControl) => {

        //return this.get_investigation_service_response(control.value);
        //console.log(field)
//        if (control.value ===""){
//            return { 'create': true };
//        }
        return globalService.is_exist(field, control.value, model_type).pipe(first()).toPromise().then(
            data => {
//                    setTimeout(() => {control.updateValueAndValidity();}, 10);
                    console.log(control.value)
                    
                    if (control.value ===""){
                        return { 'create': true };
                    }
                    
                    if (data["success"]){
                        //console.log(data["message"])
                        alertService.clear()
                        //return null
                        //console.log(control.errors);
                    }else{
                        alertService.error("this "+field+" is already used. Please select new one ! ");
                        //console.log(control.errors);
                        //return { 'unique_id': true }
                    }
            return data["success"] ? null : { 'create': true };

        });
    };
  }
   
//    static test(control: FormControl): { [key: string]: any } {
//       this.investigationService.is_exist("Investigation unique ID", control.value).pipe(first()).toPromise().then(
//        data => {
//            if (!data["success"]){
//
//                return { "test": true };
//            }
//
//        });
//
//        return null;
//   }


}

