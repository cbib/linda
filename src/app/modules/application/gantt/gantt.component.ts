import { Component, OnInit, ViewChild } from '@angular/core';
import { GanttEditorComponent, GanttEditorOptions } from "ng-gantt/";
import { GlobalService} from '../../../services';
import { MiappeNode } from '../../../models';
import { GantElement } from './GantElement';
import { ModelGant } from './GantElement';


@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})

export class GanttComponent implements OnInit {
  @ViewChild(GanttEditorComponent, { static: false }) editor: GanttEditorComponent;
  public editorOptions: GanttEditorOptions;
  public data: any;
  public vertices: any = []
  public statistics: {};
  private nodes: MiappeNode[]
  private  myListmg = [] as Array<ModelGant>
  private  mylistobjmg = [] as Array<GantElement>
  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    await this.get_vertices()
    console.log(this.vertices)
    this.nodes = this.build_hierarchy(this.vertices)
    console.log(this.nodes)
    this.data = this.build_gantt(this.nodes)
    //this.data = this.initialData();
    console.log(this.data)

    //this.data = this.nodes
    this.editorOptions = {
      vFormat: "day",
      vEditable: true,
      vEventsChange: {
        taskname: () => {
          console.log("taskname");

        }
      }
    };
  }
  /* {
    pID: 1,
    pName: "Define Chart API",
    pStart: "",
    pEnd: "",
    pClass: "ggroupblack",
    pLink: "",
    pMile: 0,
    pRes: "Brian",
    pComp: 0,
    pGroup: 1,
    pParent: 0,
    pOpen: 1,
    pDepend: "",
    pCaption: "",
    pNotes: "Some Notes text"
  }, */
  build_gantt2(_nodes: MiappeNode[]){
    this.mylistobjmg
    _nodes.forEach(
      n => {
        let investigations = n.children
        investigations.forEach(
          i=> {
            //var mgi= new GantElement(_pID=parseInt(i.model_key),_pName=i.name)
            console.log(i)
          });
      }
    )
  }
  build_gantt(_nodes: MiappeNode[]){
    let mymgs = [] as Array<ModelGant>
    _nodes.forEach(
      n => {
        let investigations = n.children
        
        investigations.forEach(
          i=> {
            var mgi = {} as ModelGant
            mgi.pID=parseInt(i.model_key)     
            mgi.pName=i.name
            mgi.pStart=""
            mgi.pEnd=""
            mgi.pClass= "ggroupblack"
            mgi.pLink= ""
            mgi.pMile= 0
            mgi.pRes=i.parent_id
            mgi.pComp=0
            mgi.pGroup= 1
            mgi.pParent= 0
            mgi.pOpen= 1
            mgi.pDepend= ""
            mgi.pCaption= ""
            mgi.pNotes= "Some Notes text"
            mymgs.push(mgi)
            
            let studies = i.children
            console.log(studies)
            let cpt=0
            studies.forEach(
              s=> {

                var mgs = {} as ModelGant
                mgs.pID=parseInt(s.model_key)
                mgs.pName=s.name
                mgs.pStart="2017-02-21"
                mgs.pEnd="2017-03-09"
                mgs.pClass= "gtaskblue",
                mgi.pLink= ""
                mgi.pMile= 1
                mgs.pRes=i.parent_id
                mgs.pComp=s.fill_percentage
                mgi.pGroup= 1
                mgs.pParent=parseInt(i.model_key)
                mgs.pOpen= 1
                mgs.pDepend= ""
                mgs.pCaption= ""
                
                mymgs.push(mgs)
                //test observation unit
                /* var mgou = {} as ModelGant
                let pname= "obsunit_" + s.model_key
                mgou.pID=cpt
                mgou.pName=pname
                mgou.pStart="2017-02-21"
                mgou.pEnd="2017-03-09"
                mgou.pClass= "gtaskblue",
                mgou.pLink= ""
                mgou.pMile= 1
                mgou.pRes="fgvedwv"
                mgou.pComp=34
                mgou.pGroup= 1
                mgou.pParent=parseInt(s.model_key)
                mgou.pOpen= 1
                mgou.pDepend= ""
                mgou.pCaption= ""
                
                mymgs.push(mgou) */
              });
              cpt+=1
            
          });
          console.log(mymgs)
      });
      return mymgs
      

  }
  build_hierarchy(edges: []): MiappeNode[] {
    //console.log(edges)
    var cpt = 0;
    var tmp_nodes = []
    tmp_nodes.push(new MiappeNode("Investigations tree", "Investigations tree", "", 0))
    edges.forEach(
      e => {
        var vertices: [] = e["s"]["vertices"]
        var parent_id: string = e["e"]["_from"]
        var percent = 0.0
        var short_name = ""
        vertices.forEach(
          vertice => {
            if (vertice['_id'] === e["e"]["_to"]) {
              var vertice_keys = Object.keys(vertice)
              var total = 0
              for (var i = 0; i < vertice_keys.length; i++) {
                if (vertice[vertice_keys[i]] !== "") {
                  total += 1
                }
              }
              percent = Math.round(100 * ((total - 3) / (vertice_keys.length - 3)))
              if (parent_id.includes('investigation')){
                short_name = vertice['Project Name']
              }
              else{
                short_name = vertice['Study Name']
              }
            }
          }
        )
        if (short_name === "" || short_name === undefined) {
          short_name = e["e"]["_to"]
        }
        if (parent_id.includes("users")) {

          if (cpt === 0) {
            tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
          }
          else {
            tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
          }
        }
        else {
          this.searchTerm(tmp_nodes, e["e"]["_from"]).add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id))
        }
        cpt += 1
      }
    )
    console.log(tmp_nodes)
    return tmp_nodes;
  }
  searchTerm(terms: MiappeNode[], term_id: string): any {
    var term: MiappeNode;
    terms.forEach(
      t => {
        if (t.id == term_id) {
          term = t
        }
        else if (t.get_children() != null) {
          var i;
          for (i = 0; i < t.get_children().length; i++) {
            term = this.searchTerm([t.get_children()[i]], term_id);
          }
        }
      }
    )
    return term
  }
  get_vertices() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(user)
    return this.globalService.get_all_vertices(user._key).toPromise().then(
      data => {
        this.vertices = data;
        console.log(data)
        this.statistics = {
          "investigations": 0,
          "studies": 0,
          "experimental_factors": 0,
          "environments": 0,
          "metadata_files": 0,
          "observation_units": 0,
          "samples": 0,
          "events": 0,
          "data_files": 0,
          "biological_materials": 0,
          "observed_variables": 0
        }

        this.vertices.forEach(
          attr => {
            this.statistics[attr["e"]["_to"].split("/")[0]] += 1

          }
        );
        //console.log(this.statistics)



      }
    )
  }

  changeData() {
    this.data = [... this.data,
    {
      pID: Math.random() * 100,

      pName: "new item",
    }];
  }


  initialData() {
    return [
      {
        pID: 1,
        pName: "Define Chart API",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: "Some Notes text"
      },
      {
        pID: 11,
        pName: "Chart Object",
        pStart: "2017-02-18",
        pEnd: "2017-02-20",
        pClass: "gmilestone",
        pLink: "",
        pMile: 1,
        pRes: "Shlomy",
        pComp: 80,
        pGroup: 0,
        pParent: 1,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 12,
        pName: "Task Objects",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Shlomy",
        pComp: 40,
        pGroup: 1,
        pParent: 1,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 121,
        pName: "Constructor Proc #1234 of February 2017",
        pStart: "2017-02-21",
        pEnd: "2017-03-09",
        pClass: "gtaskblue",
        pLink: "",
        pMile: 0,
        pRes: "Brian T.",
        pComp: 60,
        pGroup: 0,
        pParent: 12,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 122,
        pName: "Task Variables",
        pStart: "2017-03-06",
        pEnd: "2017-03-11",
        pClass: "gtaskred",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 12,
        pOpen: 1,
        pDepend: 121,
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 123,
        pName: "Task by Minute/Hour",
        pStart: "2017-03-09",
        pEnd: "2017-03-14 12: 00",
        pClass: "gtaskyellow",
        pLink: "",
        pMile: 0,
        pRes: "Ilan",
        pComp: 60,
        pGroup: 0,
        pParent: 12,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 124,
        pName: "Task Functions",
        pStart: "2017-03-09",
        pEnd: "2017-03-29",
        pClass: "gtaskred",
        pLink: "",
        pMile: 0,
        pRes: "Anyone",
        pComp: 60,
        pGroup: 0,
        pParent: 12,
        pOpen: 1,
        pDepend: "123SS",
        pCaption: "This is a caption",
        pNotes: null
      },
      {
        pID: 2,
        pName: "Create HTML Shell",
        pStart: "2017-03-24",
        pEnd: "2017-03-24",
        pClass: "gtaskyellow",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 20,
        pGroup: 0,
        pParent: 0,
        pOpen: 1,
        pDepend: 122,
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 3,
        pName: "Code Javascript",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 31,
        pName: "Define Variables",
        pStart: "2017-02-25",
        pEnd: "2017-03-17",
        pClass: "gtaskpurple",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: 3,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 32,
        pName: "Calculate Chart Size",
        pStart: "2017-03-15",
        pEnd: "2017-03-24",
        pClass: "gtaskgreen",
        pLink: "",
        pMile: 0,
        pRes: "Shlomy",
        pComp: 40,
        pGroup: 0,
        pParent: 3,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 33,
        pName: "Draw Task Items",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Someone",
        pComp: 40,
        pGroup: 2,
        pParent: 3,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 332,
        pName: "Task Label Table",
        pStart: "2017-03-06",
        pEnd: "2017-03-09",
        pClass: "gtaskblue",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 33,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 333,
        pName: "Task Scrolling Grid",
        pStart: "2017-03-11",
        pEnd: "2017-03-20",
        pClass: "gtaskblue",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 0,
        pParent: 33,
        pOpen: 1,
        pDepend: "332",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 34,
        pName: "Draw Task Bars",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Anybody",
        pComp: 60,
        pGroup: 1,
        pParent: 3,
        pOpen: 0,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 341,
        pName: "Loop each Task",
        pStart: "2017-03-26",
        pEnd: "2017-04-11",
        pClass: "gtaskred",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 34,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 342,
        pName: "Calculate Start/Stop",
        pStart: "2017-04-12",
        pEnd: "2017-05-18",
        pClass: "gtaskpink",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 34,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 343,
        pName: "Draw Task Div",
        pStart: "2017-05-13",
        pEnd: "2017-05-17",
        pClass: "gtaskred",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 34,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 344,
        pName: "Draw Completion Div",
        pStart: "2017-05-17",
        pEnd: "2017-06-04",
        pClass: "gtaskred",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 60,
        pGroup: 0,
        pParent: 34,
        pOpen: 1,
        pDepend: "342,343",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 35,
        pName: "Make Updates",
        pStart: "2017-07-17",
        pEnd: "2017-09-04",
        pClass: "gtaskpurple",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: 3,
        pOpen: 1,
        pDepend: "333",
        pCaption: "",
        pNotes: ""
      }
    ];
  }

}
