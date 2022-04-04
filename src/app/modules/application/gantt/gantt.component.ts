import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { GanttEditorComponent, GanttEditorOptions } from "ng-gantt/";
import { GlobalService, UserService } from '../../../services';
import { MiappeNode } from '../../../models';
import { GantElement } from './GantElement';
import { ModelGant } from './GantElement';
import { UserInterface } from 'src/app/models/linda/person';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})

export class GanttComponent implements OnInit {
  @Input('level') level: number;
  @Input('parent_id') parent_id: string;
  @Input('model_id') model_id: string;
  @Input('model_key') model_key: string;
  @Input('model_type') model_type: string;
  @Input('activeTab') activeTab: string;
  @Input('role') role: string;
  @Input('group_key') group_key: string;
  @ViewChild(GanttEditorComponent, { static: false }) editor: GanttEditorComponent;
  public editorOptions: GanttEditorOptions;
  public data: any;
  public vertices: any = []
  public statistics: {};
  private nodes: MiappeNode[]
  private myListmg = [] as Array<ModelGant>
  private mylistobjmg = [] as Array<GantElement>
  currentUser: UserInterface
  constructor(
    private globalService: GlobalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(
      params => {
        this.level = params['level'];
        this.model_id = params['model_id'];
        this.parent_id = params['parent_id']
        this.model_key = params['model_key']
        this.model_type = params['model_type']
        this.role = params['role']
        this.group_key = params['group_key']

      }
    );
  }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    await this.get_project_vertices()
    await this.get_vertices()
    console.log(this.vertices)
    this.nodes = this.build_hierarchy(this.vertices)
    console.log(this.nodes)
    this.data = this.build_gantt(this.nodes)
    //this.data = this.initialData2();
    console.log(this.data)


    //this.data = this.nodes
    this.editorOptions = {
      vFormat: "day",
      vEditable: false,
      // EventsClickCell
      vEventsChange: {
        taskname: () => {
          console.log("taskname");

        }
      },
      // EventsClickCell
      vEvents: {
        /* taskname: () => {
          console.log("taskname");

        }, */
        taskname: function (task) {
          console.log(task.getID());
          console.log(task.getName());
          console.log(task.getOriginalID())
        }
        /* taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log,
        additional_category: console.log, // for additional fields
        beforeDraw: ()=>console.log('before draw listener'),
        afterDraw: ()=>console.log('before after listener') */
      }//,
      /* vEventClickRow: console.log,
      vEventClickCollapse: console.log */
    };
    this.editor.setOptions(this.editorOptions)
  }
  async get_project_vertices() {
    const person_id = await this.userService.get_person_id(this.currentUser._key).toPromise();
    console.log(person_id);
    const data = await this.globalService.get_vertice(person_id[0].split("/")[1], this.model_key).toPromise();
    console.log(data);
  }
  async get_vertices() {
    let user: UserInterface = JSON.parse(localStorage.getItem('currentUser'));
    console.log(user)
    const data = await this.globalService.get_all_vertices(user._key).toPromise();
    this.vertices = data;
    console.log(data);
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
    };
    this.vertices.forEach(
      attr => {
        this.statistics[attr["e"]["_to"].split("/")[0]] += 1;

      }
    );
  }
  build_gantt2(_nodes: MiappeNode[]) {
    this.mylistobjmg
    _nodes.forEach(
      n => {
        let investigations = n.children
        investigations.forEach(
          i => {
            //var mgi= new GantElement(_pID=parseInt(i.model_key),_pName=i.name)
            console.log(i)
          });
      }
    )
  }
  //gtaskpink, gtaskpurple, gtaskyellow, gtaskgreen, gtaskred, gtaskblue
  build_gantt(_nodes: MiappeNode[]) {
    let mymgs = [] as Array<ModelGant>
    _nodes.forEach(
      n => {
        let investigations = n.children
        for (let i = 0; i < investigations.length; i++) {
          //const element = investigations[index];
          /* investigations.forEach(
            i => { */
          var investigation = investigations[i];
          //if (investigation)
          console.log(investigation)
          var mgi = {} as ModelGant
          mgi.pID = parseInt(investigation.model_key)
          mgi.pName = investigation.name
          mgi.pStart = ""
          mgi.pEnd = ""
          mgi.pClass = "ggroupblack"
          mgi.pLink = ""
          mgi.pMile = 0
          mgi.pRes = "Project"
          mgi.pComp = 14
          mgi.pGroup = 1
          mgi.pParent = 0
          mgi.pOpen = 1
          mgi.pDepend = ""
          mgi.pCaption = ""
          mgi.pNotes = "Some Notes text"
          mymgs.push(mgi)
          let studies = investigation.children
          console.log(studies)
          let cpt = 0

          studies.forEach(
            s => {
              if (s.children.length > 0 && !s.get_id().includes("data_files")) {
                var mgs = {} as ModelGant
                mgs.pID = parseInt(s.model_key)
                mgs.pName = s.name
                mgs.pStart = s.current_data_object['Start date of study']
                mgs.pEnd = s.current_data_object['End date of study']
                mgs.pClass = "gtaskblue"
                mgs.pLink = ""
                mgs.pMile = 0
                mgs.pRes = "Study"
                mgs.pComp = s.fill_percentage
                mgs.pGroup = 1
                mgs.pParent = parseInt(investigation.model_key)
                mgs.pOpen = 1
                mgs.pDepend = ""
                mgs.pCaption = ""
                mymgs.push(mgs)

                console.log(s.children)
                s.children.forEach(child => {

                  if (child.get_id().includes("events")) {
                    var mge = {} as ModelGant
                    let pname = "obsvar_" + child.model_key
                    mge.pID = parseInt(child.model_key)
                    //mge.pName = child.current_data_object['Event type']
                    if (child.current_data_object['Event type']===""){
                      mge.pName = child.current_data_object['Event accession number']
                    }
                    else{
                      mge.pName = child.current_data_object['Event type']
                    }
                    mge.pStart = child.current_data_object['Event date']
                    mge.pEnd = child.current_data_object['Event date']
                    mge.pClass = "gmilestone"
                    mge.pLink = ""
                    mge.pMile = 1;
                    mge.pRes = "Event"
                    mge.pComp = 100;
                    mge.pGroup = 0
                    mge.pParent = parseInt(s.model_key)
                    mge.pOpen = 1
                    mge.pDepend = s.model_key
                    mge.pCaption = child.current_data_object['Event type']
                    mge.pNotes = child.current_data_object['Event type'] + " " + child.current_data_object['Event description'] + " " + child.current_data_object['Event accession number']
                    mymgs.push(mge)
                  }
                  else if (child.get_id().includes("environments")) {
                    var mge = {} as ModelGant
                    let pname = "obsvar_" + child.model_key
                    mge.pID = parseInt(child.model_key)
                    //mge.pName = child.current_data_object['Environment parameter']
                    if (child.current_data_object['Environment parameter']===""){
                      mge.pName = child.current_data_object['Environment parameter accession number']
                    }
                    else{
                      mge.pName = child.current_data_object['Environment parameter']
                    }
                    mge.pStart = s.current_data_object['Start date of study']
                    mge.pEnd = s.current_data_object['End date of study']
                    mge.pClass = "gtaskgreen"
                    mge.pLink = ""
                    mge.pMile = 0;
                    mge.pRes = "Environmental parameter"
                    mge.pComp = 100;
                    mge.pGroup = 0
                    mge.pParent = parseInt(s.model_key)
                    mge.pOpen = 1
                    mge.pDepend = s.model_key
                    mge.pCaption = child.current_data_object['Environment parameter']
                    mge.pNotes = child.current_data_object['Environment parameter'] + " " + child.current_data_object['Environment parameter accession number'] + " - value(s): " + child.current_data_object['Environment parameter value']
                    mymgs.push(mge)

                  }
                  else if (child.get_id().includes("experimental_factors")) {
                    console.log(child.current_data_object)
                    var mge = {} as ModelGant
                    let pname = "obsvar_" + child.model_key
                    mge.pID = parseInt(child.model_key)
                    if (child.current_data_object['Experimental Factor type']===""){
                      mge.pName = child.current_data_object['Experimental Factor accession number']
                    }
                    else{
                      mge.pName = child.current_data_object['Experimental Factor type']
                    }
                    //mge.pName = child.current_data_object['Experimental Factor type']
                    mge.pStart = s.current_data_object['Start date of study']
                    mge.pEnd = s.current_data_object['End date of study']
                    mge.pClass = "gtaskpurple"
                    mge.pLink = ""
                    mge.pMile = 0;
                    mge.pRes = "Experimental Factor"
                    mge.pComp = 100;
                    mge.pGroup = 0
                    mge.pParent = parseInt(s.model_key)
                    mge.pOpen = 1
                    mge.pDepend = s.model_key
                    mge.pCaption = child.current_data_object['Experimental Factor type']
                    mge.pNotes = "Description: " + child.current_data_object['Experimental Factor description'] + " " + child.current_data_object['Experimental Factor type'] + " " + child.current_data_object['Experimental Factor accession number'] + " - value(s): " + child.current_data_object['Experimental Factor values']
                    mymgs.push(mge)
                  }

                });
              }
              else {
                if (!s.get_id().includes("data_files")){
                  var mgs = {} as ModelGant
                  mgs.pID = parseInt(s.model_key)
                  mgs.pName = s.name
                  mgs.pStart = s.current_data_object['Start date of study']
                  mgs.pEnd = s.current_data_object['End date of study']
                  mgs.pClass = "gtaskblue"
                  mgs.pLink = ""
                  mgs.pMile = 0
                  mgs.pRes = "Study"
                  mgs.pComp = s.fill_percentage
                  mgs.pGroup = 0
                  mgs.pParent = parseInt(investigation.model_key)
                  mgs.pOpen = 1
                  mgs.pDepend = ""
                  mgs.pCaption = ""
                  mymgs.push(mgs)
                } 
                
              }
            });
          cpt += 1
        }
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

        console.log(e)
        var vertices: [] = e["s"]["vertices"]
        var parent_id: string = e["e"]["_from"]
        var vertice_id: string = e["e"]["_to"]
        var percent = 0.0
        var short_name = ""
        //var vertice_data={}
        //var  vertice_keys=[]
        vertices.forEach(
          vertice => {
            console.log(vertice)
            if (vertice['_id'] === e["e"]["_to"]) {
              //vertice_data=vertice
              var vertice_keys = Object.keys(vertice)
              var total = 0
              for (var i = 0; i < vertice_keys.length; i++) {
                if (vertice[vertice_keys[i]] !== "") {
                  total += 1
                }
              }
              percent = Math.round(100 * ((total - 3) / (vertice_keys.length - 3)))
              console.warn(parent_id)
              if (parent_id.includes('users')) {
                short_name = vertice['Project Name']
              }
              else if (parent_id.includes('investigations')) {
                short_name = vertice['Study Name']
              }
              else {
                short_name = e["e"]["_to"]
              }
              console.warn(short_name)
            }
          }
        )
        if (short_name === "" || short_name === undefined) {
          short_name = e["e"]["_to"]
        }
        var vertice_data: {} = vertices.filter(vertice => vertice['_id'] == vertice_id)[0]
        var vertice_data_keys = Object.keys(vertice_data).filter(key => !key.startsWith("_"))
        if (parent_id.includes("users")) {
          if (cpt === 0) {
            tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id, vertice_data_keys, vertice_data))
          }
          else {
            tmp_nodes[0].add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id, vertice_data_keys, vertice_data))
          }
        }
        else {
          this.searchTerm(tmp_nodes, e["e"]["_from"]).add_children(new MiappeNode(e["e"]["_to"], short_name, "", percent, parent_id, vertice_data_keys, vertice_data))
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


  changeData() {
    this.data = [... this.data,
    {
      pID: Math.random() * 100,

      pName: "new item",
    }];
  }

  initialData2() {
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
        pOpen: 0,
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
      }
    ]
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
