import { Type } from '@angular/core';

export class AdItem {
  private _data:any;
  constructor(public component: Type<any>, public data: any) {
    this._data=data
  }
}