// to create call var mg: ModelGant, then assign the corresponding object
export interface ModelGant {
    pID: number;
    pName: string;
    pStart: string;
    pEnd: string;
    pClass: string;
    pLink: string;
    pMile: number;
    pRes: string;
    pComp: number;
    pGroup: number;
    pParent: number;
    pOpen: number;
    pDepend: string;
    pCaption: string;
    pNotes: string;
  
  }
  
  export class GantElement implements ModelGant{
    pID: number;
    pName: string;
    pStart: string;
    pEnd: string;
    pClass: string;
    pLink: string;
    pMile: number;
    pRes: string;
    pComp: number;
    pGroup: number;
    pParent: number;
    pOpen: number;
    pDepend: string;
    pCaption: string;
    pNotes: string;
    constructor(_pRes:string, _pName:string, _pID:number, _pMile:number, _pGroup:number,_pComp:number, _pParent:number, _pOpen:number){
      this.pID=_pID;
      this.pName="";
      this.pStart="";
      this.pEnd="";
      this.pClass="";
      this.pLink="";
      this.pMile= _pMile;
      this.pRes="";
      this.pComp=_pComp;
      this.pGroup=_pGroup;
      this.pParent=_pParent;
      this.pOpen=_pOpen;
      this.pDepend="";
      this.pCaption="";
      this.pNotes="";
    }
  }