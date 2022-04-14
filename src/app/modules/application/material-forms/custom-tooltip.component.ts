
import { ITooltipParams} from 'ag-grid-community';
import { ITooltipAngularComp} from 'ag-grid-angular';
import { Component } from '@angular/core';


@Component({
  selector: 'tooltip-component',
  template: ` <div class="custom-tooltip" [style.background-color]="color">
    <p><span>Genus: </span>{{ data['Genus'] }}</p>
    <p><span>Species: </span>{{ data['Species'] }}</p>
    <p><span>Material ID: </span>{{ data['Material source ID (Holding institute/stock centre, accession)'] }}</p>
    <p><span>Biological Material ID: </span>{{ data['Biological material ID'] }}</p>
    
  </div>`,
  styles: [
    `
      :host {
        position: absolute;
        width: 150px;
        height: 70px;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})
export class CustomTooltip implements ITooltipAngularComp {
  private params!: { color: string } & ITooltipParams;
  public data!: any;
  public color!: string;

  agInit(params: { color: string } & ITooltipParams): void {
    this.params = params;

    this.data = params.api!.getDisplayedRowAtIndex(params.rowIndex!)!.data;
    this.color = this.params.color || 'white';
  }
}