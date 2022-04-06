import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, Inject, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { GlobalService, OntologiesService, AlertService } from '../../../services';
import { OntologyTerm } from '../../../models/ontology/ontology-term';
import { Instance } from '../../../models/ontology/instance';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

//MODELS
import { OntologyFlatNode } from '../../../models/ontology_flat_node'

interface DialogData {
    ontology_id: string;
    selected_term: OntologyTerm;
    selected_set: OntologyTerm[];
    selected_key:string
    uncheckable: boolean;
    multiple: boolean;
    observed:boolean;
    mode_simplified:boolean
}

/**
 * @title Tree with flat nodes
 */
@Component({
    selector: 'app-ontology-tree',
    templateUrl: './ontology-tree.component.html',
    styleUrls: ['./ontology-tree.component.css']
})
export class OntologyTreeComponent {

    private ontology_id: string;
    private selected_set: OntologyTerm[]
    private selected_term: OntologyTerm;
    private selected_key:string=""
    private ontologyTerms: OntologyTerm[];
    private ontologyDatatype: OntologyTerm[];
    private ontologyEnum: OntologyTerm[];
    private ontologyContext: OntologyTerm[];
    private ontologyNode: OntologyTerm[];
    private uncheckable: boolean = false
    private observed: boolean = false
    private mode_simplified: boolean = false
    private multiple: boolean
    panel_disabled:boolean=true
    panel_expanded:boolean=true
    //model ontology    
    private ontology: any = {};
    public spinner_mode = 'indeterminate'

    private displayed = false;
    private ontology_tree: OntologyTerm[];
    public show_spinner: boolean = true;
    private active_node: OntologyTerm;
    private context_term: OntologyTerm[];
    public search_string: string;
    active_list: boolean = false;
    matSpinner: MatProgressSpinner;
    ontology_tree_loading_progress_value = 0;
    selected=-1
    labels=['Use term id: ', 'Use term name: ', 'Use term Definition: ']

    //private result_search=[]
    private selected_nodes = []
    constructor(
        private globalService: GlobalService,
        private ontologiesService: OntologiesService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        public dialogRef: MatDialogRef<OntologyTreeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {

        this.selected_term = this.data.selected_term;
        this.ontology_id = this.data.ontology_id;
        this.selected_set = this.data.selected_set;
        this.uncheckable = this.data.uncheckable;
        this.multiple = this.data.multiple;
        this.selected_key=this.data.selected_key
        
        if (this.data.observed){
            this.observed=this.data.observed;
        }
        if (this.data.mode_simplified){
            this.mode_simplified=this.data.mode_simplified
        }
        //console.log("multiple choice is activated: ", this.multiple)
        this.ontology_tree = [];
        this.ontologyTerms = [];
        this.ontologyContext = [];
        this.ontologyDatatype = [];
        this.ontologyEnum = [];
        this.ontologyNode = [];
        this.search_string = ""



    }
    private ont_transformer = (node: OntologyTerm, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            namespace: node.namespace,
            def: node.def,
            id: node.id,
            term: node,
            level: level,
        };
    }

    private treeControl = new FlatTreeControl<OntologyFlatNode>(node => node.level, node => node.expandable);
    private treeFlattener = new MatTreeFlattener(this.ont_transformer, node => node.level, node => node.expandable, node => node.children);
    private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    private initialSelection = []
    private checklistSelection = new SelectionModel<OntologyFlatNode>(this.data.multiple, this.initialSelection /* multiple */);

    get_ontology() {
        //console.log(this.ontology_id)
        return this.ontologiesService.get_ontology(this.ontology_id).toPromise().then(data => {
            this.ontology = data;
            this.ontologyNode = []
            this.search_string = ""
            var ontologies_list = ["EnvO", "PECO", "BTO", "PO", "CO_20", "EFO", "CO_715", "OBI", "CO_322 (Maize)", "CO_325", "CO_331", "Solanacae"]
            //console.log(this.ontology_id)
            //console.log(this.ontology)
            if (this.ontology_id === "XEO") {
                this.ontologyNode = this.build_xeo_isa_hierarchy(this.ontology);
            }
            else if ((this.ontology_id === "CO_322 (Maize)") || (this.ontology_id === "CO_325")|| (this.ontology_id === "CO_331")) {
                //console.log(this.ontology)
                this.ontologyNode = this.build_C0_hierarchy2(this.ontology);

            }
            else if (ontologies_list.includes(this.ontology_id)) {
                //this.ontology_tree_loading_progress_value = 50
                this.ontologyNode = this.build_eo_isa_hierarchy(this.ontology);
                //this.ontology_tree_loading_progress_value = 100
            }

            else {
                //console.log("no ontology defined")
            }
            //console.log("after build hierarchy function")
            //this.show_spinner = false
            this.dataSource.data = this.ontologyNode;

        })
    }
    // async load(){
    //     await this.get_ontology()
    // }

    async ngOnInit() {
        this.ontology_tree_loading_progress_value = 50
        await this.get_ontology()
        this.ontology_tree_loading_progress_value = 100
        // this.ontologyNode = []
        // this.search_string = ""
        // var ontologies_list = ["EnvO", "EO", "BTO", "PO", "CO_20", "EFO", "CO_715"]

        // if (this.ontology_type === "XEO") {
        //     this.ontologyNode = this.build_xeo_isa_hierarchy(this.ontology);
        // }
        // else if (this.ontology_type === "CO_322") {
        //     this.ontologyNode = this.build_C0_hierarchy(this.ontology);

        // }
        // else if (ontologies_list.includes(this.ontology_type)) {
        //     this.ontology_tree_loading_progress_value = 50
        //     this.ontologyNode = this.build_eo_isa_hierarchy(this.ontology);
        //     this.ontology_tree_loading_progress_value = 100
        // }

        // else {
        //     //console.log("no ontology defined")
        // }
        // //console.log("after build hierarchy function")
        // //this.show_spinner = false
        // this.dataSource.data = this.ontologyNode;
    }

    onSearch() {
        this.selected_nodes = []
        if (Array.isArray(this.get_dataSource['_treeControl']['dataNodes'])) {
            for (var node in this.get_dataSource['_treeControl']['dataNodes']) {
                Object.keys(this.get_dataSource['_treeControl']['dataNodes'][node]).forEach(key => {
                    if (['id', 'def', 'name', 'namespace'].includes(key)) {
                        if ((typeof this.get_dataSource['_treeControl']['dataNodes'][node][key] === 'string') && (this.get_dataSource['_treeControl']['dataNodes'][node][key].includes(this.search_string))) {
                            this.selected_nodes.push(this.get_dataSource['_treeControl']['dataNodes'][node])
                        }
                    }
                });
            }
        }
        if (this.selected_nodes.length > 0) {
            this.active_list = true
        }
    }
    searchStart(event) {
        this.search_string = event.target.value;
        if (this.search_string === "" || this.search_string.length<3) {
            this.active_list = false
            console.log("empty search")
            
        }
        else{
            //console.log(this.search_string)
            this.selected_nodes = []
            if (Array.isArray(this.get_dataSource['_treeControl']['dataNodes'])) {
                for (var node in this.get_dataSource['_treeControl']['dataNodes']) {
                    Object.keys(this.get_dataSource['_treeControl']['dataNodes'][node]).forEach(key => {
                        if (['id', 'def', 'name', 'namespace'].includes(key)) {
                            if ((typeof this.get_dataSource['_treeControl']['dataNodes'][node][key] === 'string') && (this.get_dataSource['_treeControl']['dataNodes'][node][key].includes(this.search_string))) {
                                this.selected_nodes.push(this.get_dataSource['_treeControl']['dataNodes'][node])
                            }
                        }
                    });
                    if (this.selected_nodes.length > 0) {
                        this.active_list = true
                    }
                }
            }
            if (this.selected_nodes.length > 0) {
                //console.log(this.selected_nodes)
                //this.active_list = true
            }
        }
    }
    onResponseRangeSelect(value: string) {
        this.selected_term["term"].set_response_range(value)
    }
    

    onValueAdd(event, node: OntologyTerm) {
        //console.log(event.target.value)
        node["term"].set_value(event.target.value)
    }
    onUnitSelect(value: string, node: OntologyTerm) {
        node["term"].set_unit(value)
    }
    select(term: OntologyTerm, item:string){
        console.log(item)
        console.log(term)
        this.data.selected_set.push(term)
        this.data.selected_key=item
    }
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(term: OntologyTerm): void {
        this.checklistSelection.toggle(term);
        //console.log(this.checklistSelection)
        //console.log(this.checklistSelection.isSelected(term))
        //console.log(this.data.selected_set)
        if (this.checklistSelection.isSelected(term)) {
            if (this.multiple) {
                this.data.selected_set.push(term)
            }
            else {
                this.data.selected_set.pop()
                this.data.selected_set.push(term)
            }
            this.context_term = term["term"].get_context()
            //console.log(this.context_term)
            for (var context in this.context_term) {
                if (this.context_term[context].name === "Quantity") {
                    term["term"].set_unit(this.context_term[context]["instances"][0]._symbol)

                }
            }

            this.displayed = true;

        }
        else {
            for (var i = this.data.selected_set.length - 1; i >= 0; i--) {
                if (this.data.selected_set[i]['id'] === term.id) {
                    this.data.selected_set.splice(i, 1);
                }
            }
            this.displayed = false;
            //this.context_term=term["term"].get_context()
        }
        //console.log(this.data.selected_set)
    }
    show_info(term: OntologyTerm) {

        //this.selected_term=term
        //this.data.selected_term=this.selected_term
        //this.data.selected_set=this.selected_set
        this.active_node = term
        //this.displayed=true;
        //this.context_term=term["term"].get_context()

    }
    get get_checklistSelection(){
        return this.checklistSelection
    }
    get get_mode_simplified(){
        return this.mode_simplified
    }
    get get_uncheckable(){
        return this.uncheckable
    }
    trackContextTerm(index, item:OntologyTerm){
        return item.name; 
    }
    trackInstances(index, item:Instance){
        return item.name; 
    }
    get get_selected_nodes(){
        return this.selected_nodes
    }
    get get_context_term(){
        return this.context_term
    }
    get get_dataSource() {
        return this.dataSource
    }
    get get_treeControl() {
        return this.treeControl
    }
    get get_ontologyEnum(){
        return this.ontologyEnum
    }
    get_displayed() {
        return this.displayed
    }
    get get_observed(){
        return this.observed
    }
    get_progress() {
        //console.log(this.ontology_tree_loading_progress_value)
        return this.ontology_tree_loading_progress_value
    }
    build_eo_isa_hierarchy(ontology: {}): OntologyTerm[] {

        var cpt = 0;
        this.show_spinner = true;
        //console.log(this.show_spinner)
        //this.matSpinner.value= 0
        this.ontology_tree_loading_progress_value = 0
        var ontology_data: Array<{ is_obsolete: boolean; is_a: string; id: string; def: any; comment: any; name: any; relationship: string; }> = ontology["term"]
        //premier passage pour créer tous les termes sans les relations de parenté
        for (var i = 0, len = ontology_data.length; i < len; i++) {
            var term = ontology_data[i]
            // ontology_data.forEach(
            //     term => {
            if (!term.is_obsolete) {
                this.ontologyTerms.push(new OntologyTerm(term.id, term.name, [], ""))
                cpt += 1;
            }
        }
        // )
        //second passage pour définir les relations entre termes 
        var cpt = 0;
        //var ontology_data:Array<{is_obsolete:boolean;is_a: string; id: string; def: any; comment: any;name: any; relationship: string; }>=ontology["term"]

        //ontology_data.forEach(
        //     term=>{
        //this.matSpinner.value= 30
        this.ontology_tree_loading_progress_value = 30
        //console.log(this.ontology_tree_loading_progress_value)
        for (var i = 0, len = ontology_data.length; i < len; i++) {
            var term = ontology_data[i]
            if (!term.is_obsolete) {
                if (term.is_a) {
                    if (Array.isArray(term.is_a)) {
                        for (var j = 0, len2 = term.is_a.length; j < len2; j++) {
                            //for (var isa in term.is_a) {
                            this.get_term(term.id).set_isa(term.is_a[j].split(" ! ")[0])
                        }
                    }
                    else {
                        this.get_term(term.id).set_isa(term.is_a.split(" ! ")[0])
                    }
                }
                if (term.def) {
                    this.get_term(term.id).set_def(term.def)
                }
                if (term.comment) {
                    this.get_term(term.id).set_comment(term.comment)
                }
                if (term.relationship) {
                    this.get_term(term.id).set_relationship(term.relationship)
                    if (term.relationship.includes("part_of")) {
                        this.get_term(term.id).set_isa(term.relationship.split("part_of ")[1].split(" ! ")[0])
                    }
                    this.get_term(term.id).set_has_relationship(true)
                }
                cpt += 1;
            }
        }
        //)
        var cpt = 0
        this.ontology_tree_loading_progress_value = 60
        //console.log(this.ontology_tree_loading_progress_value)
        //troisième passage pour créer les relations entre termes 
        for (var i = 0, len = this.ontologyTerms.length; i < len; i++) {
            var ontology_term = this.ontologyTerms[i]
            if (ontology_term.is_a != "") {
                //var t=this.get_term(term.id)
                var t_parent = this.get_term(ontology_term.is_a)
                if (t_parent != null) {
                    t_parent.add_children(this.get_term(ontology_term.id))
                }
                cpt += 1;
            }
        }
        this.ontology_tree_loading_progress_value = 90
        //console.log(this.ontology_tree_loading_progress_value)
        var cpt = 0
        var head_term: OntologyTerm[] = []
        this.ontologyTerms.forEach(
            term => {
                if (term.is_a === "") {
                    if (!term.get_has_relationship()) {
                        head_term.push(term)
                    }
                    cpt += 1;
                }
            }
        )
        // var t = new OntologyTerm(this.ontology_id, this.ontology_id, [], "")
        // this.ontologyNode.push(t);
        // for (let t in head_term) {
        //     this.ontologyNode[0].add_children(head_term[t])
        // }

        for (let t in head_term) {
            this.ontologyNode.push(head_term[t]);
            //this.ontologyNode[0].add_children(head_term[t])
        }


        this.ontology_tree_loading_progress_value = 100
        this.show_spinner = false;
        return this.ontologyNode;
    }
    build_C0_hierarchy2(ontology: {}): OntologyTerm[] {

        this.show_spinner = true;
        var cpt = 0;
        var ontology_data: Array<{ is_obsolete: boolean; is_a: string; id: string; def: any; comment: any; name: any; relationship: any; namespace: string }> = ontology["term"]
        ontology_data.forEach(
            term => {
                if (!term.is_obsolete) {
                    this.ontologyTerms.push(new OntologyTerm(term.id, term.name, [], "", term.namespace))
                    cpt += 1;
                }
            }
        )
        //console.log("total nodes: ", cpt)
        //console.log(this.ontologyTerms)
        var cpt = 0;
        //console.log("second loop")
        var start = new Date().getTime()
        for (var i = 0, len = ontology_data.length; i < len; i++) {
            var term = ontology_data[i]
            if (!term.is_obsolete) {
                if (term.is_a) {
                    if (Array.isArray(term.is_a)) {
                        for (var isa in term.is_a) {
                            this.get_term(term.id).set_isa(term.is_a[isa].split(" ! ")[0])
                        }
                    }
                    else {
                        this.get_term(term.id).set_isa(term.is_a.split(" ! ")[0])
                    }
                }
                if (term.def) {
                    this.get_term(term.id).set_def(term.def)
                }
                if (term.comment) {
                    this.get_term(term.id).set_comment(term.comment)
                }
                if (term.relationship) {
                    if (typeof term.relationship === 'string') {
                        //this.get_term(term.id).add_relationship(term.relationship)
                        if (term.relationship.includes("part_of")) {
                            // this.get_term(term.id).set_isa(term.relationship.split("part_of ")[1].split(" ! ")[0])
                            this.get_term(term.id).add_relationship(term.relationship.split("part_of ")[1].split(" ! ")[0])
                            this.get_term(term.id).add_relationship_type("part_of")
                        }
                        if (term.relationship.includes("scale_of")) {
                            // //console.log(term.relationship.split("scale_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("scale_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("scale_of ")[1])
                            this.get_term(term.id).add_relationship_type("scale_of")
                        }
                        if (term.relationship.includes("method_of")) {
                            ////console.log(term.relationship.split("method_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("method_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("method_of ")[1])
                            this.get_term(term.id).add_relationship_type("method_of")
                        }
                        if (term.relationship.includes("variable_of")) {
                            // //console.log(term.relationship.split("variable_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("variable_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("variable_of ")[1])
                            this.get_term(term.id).add_relationship_type("variable_of")
                        }

                        this.get_term(term.id).set_has_relationship(true)
                    }
                    else {
                        var arr = Array.from(term.relationship)
                        for (var j = 0; j < arr.length; j++) {
                            var relation = arr[j]
                            ////console.log(typeof arr[i])
                            if (typeof relation === 'string') {
                                if (relation.includes("part_of")) {
                                    // this.get_term(term.id).set_isa(relation.split("part_of ")[1].split(" ! ")[0])
                                    this.get_term(term.id).add_relationship(relation.split("part_of ")[1].split(" ! ")[0])
                                    this.get_term(term.id).add_relationship_type("part_of")
                                }
                                if (relation.includes("scale_of")) {
                                    ////console.log(relation.split("scale_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("scale_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("scale_of ")[1])
                                    this.get_term(term.id).add_relationship_type("scale_of")
                                }
                                if (relation.includes("method_of")) {
                                    ////console.log(relation.split("method_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("method_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("method_of ")[1])
                                    this.get_term(term.id).add_relationship_type("method_of")
                                }
                                if (relation.includes("variable_of")) {
                                    ////console.log(relation.split("variable_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("variable_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("variable_of ")[1])
                                    this.get_term(term.id).add_relationship_type("variable_of")
                                }
                            }
                            this.get_term(term.id).set_has_relationship(true)
                        }
                    }
                }
                cpt += 1;
            }
        }
        //console.log(this.ontologyTerms)
        //console.log("third loop")
        var cpt = 0
        this.ontologyTerms.forEach(
            term => {
                if (term.is_a != "") {
                    var t = this.get_term(term.id)
                    var t_parent = this.get_term(term.is_a)
                    if (t_parent != null) {
                        t_parent.add_children(t)
                    }
                }
            }
        )
        this.ontologyTerms.forEach(
            term => {
                if (term.relationships.length > 0) {
                    var t = this.get_term(term.id)
                    if (term.namespace.includes("Method")) {
                        for (var j = 0; j < term.relationships.length; j++) {
                            var t_parent = this.get_term(term.relationships[j])
                            if (t_parent != null) {
                                if (t_parent.get_children().length > 0) {
                                    var found = false
                                    for (var i = 0; i < t_parent.get_children().length; i++) {
                                        if (t_parent.get_children()[i].id === t.id) {
                                            found = true
                                        }
                                    }
                                    if ((!found)) {
                                        t_parent.add_children(t)
                                    }
                                }
                                else {
                                    t_parent.add_children(t)
                                }
                            }

                        }
                    }
                }
            }
        )
        this.ontologyTerms.forEach(
            term => {
                if (term.relationships.length > 0) {
                    var t = this.get_term(term.id)
                    if (term.namespace.includes("Scale")) {
                        for (var j = 0; j < term.relationships.length; j++) {
                            var t_parent = this.get_term(term.relationships[j])
                            if (t_parent != null) {
                                if (t_parent.get_children().length > 0) {
                                    var found = false
                                    for (var i = 0; i < t_parent.get_children().length; i++) {
                                        if (t_parent.get_children()[i].id === t.id) {
                                            found = true
                                        }
                                    }
                                    if ((!found)) {
                                        t_parent.add_children(t)
                                    }
                                }
                                else {
                                    t_parent.add_children(t)
                                }
                            }

                        }
                    }
                }
            }
        )
        this.ontologyTerms.forEach(
            term => {
                if (term.relationships.length > 0) {
                    var t = this.get_term(term.id)
                    if (term.namespace.includes("Variable")) {
                        var t_parent_trait=""
                        for (var j = 0; j < term.relationships.length; j++) {
                            var t_parent = this.get_term(term.relationships[j])
                            if (t_parent != null && t_parent.namespace.includes("Trait")) {
                                t_parent_trait=t_parent.id
                            }
                            if (t_parent != null && t_parent.namespace.includes("Method") ) {
                                ////console.log(t_parent.relationships)
                                for (var k = 0; k < t_parent.relationships.length; k++) {
                                    if (t_parent.relationships[k]===t_parent_trait){

                                        var t_parent_sub = this.get_term(t_parent.relationships[k])
                                        if (t_parent_sub.get_children().length > 0) {
                                            var found = false
                                            for (var i = 0; i < t_parent_sub.get_children().length; i++) {
                                                if (t_parent_sub.get_children()[i].id === t_parent.id) {
                                                    found = true
                                                }
                                            }
                                            if ((found)) {
                                                t_parent.add_children(t)
                                            }
                                        }
                                        // else {
                                        //     t_parent.add_children(t)
                                        // }
                                    }
                                }
                            }

                        }
                    }

                }

            }
        
        )
        //console.log(this.ontologyTerms)

        //console.log("last loop")
        var head_term: OntologyTerm[] = []
        this.ontologyTerms.forEach(
            term => {
                if (term.is_a === "") {
                    if (!term.get_has_relationship()) {
                        head_term.push(term)
                    }
                }
            }
        )
        // var t = new OntologyTerm(this.ontology_id, this.ontology_id, [], "")
        // this.ontologyNode.push(t);
        // for (let t in head_term) {
        //     this.ontologyNode[0].add_children(head_term[t])
        // }

        for (let t in head_term) {
            this.ontologyNode.push(head_term[t]);
            //this.ontologyNode[0].add_children(head_term[t])
        }

        //console.log(this.ontologyNode)
        this.show_spinner = false;
        return this.ontologyNode;
    }
    build_C0_hierarchy(ontology: {}): OntologyTerm[] {
        this.show_spinner = true;
        var cpt = 0;
        var ontology_data: Array<{ is_obsolete: boolean; is_a: string; id: string; def: any; comment: any; name: any; relationship: any; namespace: string }> = ontology["term"]
        ontology_data.forEach(
            term => {
                if (!term.is_obsolete) {
                    this.ontologyTerms.push(new OntologyTerm(term.id, term.name, [], "", term.namespace))
                    cpt += 1;
                }
            }
        )
        //second passage pour créer tous les termes 
        var cpt = 0;
        //var ontology_data:Array<{is_obsolete:boolean;is_a: string; id: string; def: any; comment: any;name: any; relationship: string; }>=ontology["term"]
        //console.log("second loop")
        var start = new Date().getTime()
        for (var i = 0, len = ontology_data.length; i < len; i++) {
            var term = ontology_data[i]
            if (!term.is_obsolete) {
                if (term.is_a) {
                    if (Array.isArray(term.is_a)) {
                        for (var isa in term.is_a) {
                            this.get_term(term.id).set_isa(term.is_a[isa].split(" ! ")[0])
                        }
                    }
                    else {
                        this.get_term(term.id).set_isa(term.is_a.split(" ! ")[0])
                    }
                }
                if (term.def) {
                    this.get_term(term.id).set_def(term.def)
                }
                if (term.comment) {
                    this.get_term(term.id).set_comment(term.comment)
                }
                if (term.relationship) {
                    if (typeof term.relationship === 'string') {
                        //this.get_term(term.id).add_relationship(term.relationship)
                        if (term.relationship.includes("part_of")) {
                            // this.get_term(term.id).set_isa(term.relationship.split("part_of ")[1].split(" ! ")[0])
                            this.get_term(term.id).add_relationship(term.relationship.split("part_of ")[1].split(" ! ")[0])
                        }
                        if (term.relationship.includes("scale_of")) {
                            // //console.log(term.relationship.split("scale_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("scale_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("scale_of ")[1])
                        }
                        if (term.relationship.includes("method_of")) {
                            ////console.log(term.relationship.split("method_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("method_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("method_of ")[1])
                        }
                        if (term.relationship.includes("variable_of")) {
                            // //console.log(term.relationship.split("variable_of ")[1])
                            // this.get_term(term.id).set_CO_relationship(term.relationship.split("variable_of ")[1])
                            this.get_term(term.id).add_relationship(term.relationship.split("variable_of ")[1])
                        }

                        this.get_term(term.id).set_has_relationship(true)
                    }
                    else {
                        var arr = Array.from(term.relationship)
                        for (var j = 0; j < arr.length; j++) {
                            var relation = arr[j]
                            ////console.log(typeof arr[i])
                            if (typeof relation === 'string') {
                                if (relation.includes("part_of")) {
                                    // this.get_term(term.id).set_isa(relation.split("part_of ")[1].split(" ! ")[0])
                                    this.get_term(term.id).add_relationship(relation.split("part_of ")[1].split(" ! ")[0])
                                }
                                if (relation.includes("scale_of")) {
                                    ////console.log(relation.split("scale_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("scale_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("scale_of ")[1])
                                }
                                if (relation.includes("method_of")) {
                                    ////console.log(relation.split("method_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("method_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("method_of ")[1])
                                }
                                if (relation.includes("variable_of")) {
                                    ////console.log(relation.split("variable_of ")[1])
                                    // this.get_term(term.id).set_CO_relationship(relation.split("variable_of ")[1])
                                    this.get_term(term.id).add_relationship(relation.split("variable_of ")[1])
                                }
                            }
                            this.get_term(term.id).set_has_relationship(true)
                        }
                    }
                }
                cpt += 1;
            }
        }

        //console.log("third loop")
        var cpt = 0
        this.ontologyTerms.forEach(
            term => {
                if (term.is_a != "") {
                    var t = this.get_term(term.id)
                    var t_parent = this.get_term(term.is_a)
                    if (t_parent != null) {
                        t_parent.add_children(t)
                    }
                }
                if (term.relationships.length > 0) {
                    var t = this.get_term(term.id)
                    for (var rs_term in term.relationships) {
                        //console.log(term.relationships[rs_term])
                        var t_parent = this.get_term(term.relationships[rs_term])
                        if (t_parent != null) {
                            if (t_parent.get_children().length > 0) {
                                ////console.log(term.id, t_parent.get_children())
                                var found = false
                                for (var i = 0; i < t_parent.get_children().length; i++) {
                                    if (t_parent.get_children()[i].id === t.id) {
                                        found = true
                                    }
                                }
                                if ((!found)) {
                                    t_parent.add_children(t)
                                }
                            }
                            else {
                                //console.log(t_parent)
                                //t_parent.add_children(t)
                            }
                        }

                    }
                }
            }
        )
        //console.log("last loop")
        var head_term: OntologyTerm[] = []
        this.ontologyTerms.forEach(
            term => {
                if (term.is_a === "") {
                    if (!term.get_has_relationship()) {
                        head_term.push(term)
                    }
                }
            }
        )
        var t = new OntologyTerm(this.ontology_id, this.ontology_id, [], "")
        this.ontologyNode.push(t);
        for (let t in head_term) {
            this.ontologyNode[0].add_children(head_term[t])
        }
        //console.log(this.ontologyNode)
        this.show_spinner = false;
        return this.ontologyNode;
    }
    build_xeo_isa_hierarchy(ontology: {}): OntologyTerm[] {
        this.show_spinner = true;
        //premier passage pour créer tous les termes 
        var cpt = 0;
        this.ontologyTerms.push(new OntologyTerm(this.ontology_id, "", [], ""));
        var ontology_data: Array<{ is_obsolete: boolean; is_a: string; id: string; def: any; comment: any; name: any; relationship: string; }> = ontology["term"]

        ontology_data.forEach(
            term => {
                this.ontologyTerms.push(new OntologyTerm(term.id, term.name, [], ""))
                cpt += 1;
            }
        )
        //second passage pour créer tous les termes 
        var cpt = 0;
        ontology_data.forEach(
            term => {
                if (term.name == "Context" || term.name == "QuantityContext") {
                    this.get_term(term.id).set_is_context(true)
                }
                if (term.name == "DataTypes") {
                    this.get_term(term.id).set_is_datatype(true)
                }
                if (term.name == "EnvironmentVariable") {
                    this.get_term(term.id).set_is_environment(true)
                }
                if (term.is_a) {
                    if (this.get_term(term.is_a).is_datatype && this.get_term(term.id).is_enumeration === false) {

                        this.get_term(term.id).set_is_datatype(true)
                    }
                    if (this.get_term(term.is_a).is_environment) {

                        this.get_term(term.id).set_is_environment(true)
                    }
                }
                if (term.is_a) {
                    this.get_term(term.id).set_isa(term.is_a)
                }
                if (term.def) {
                    this.get_term(term.id).set_def(term.def)
                }
                if (term.comment) {
                    this.get_term(term.id).set_comment(term.comment)
                }
                if (term.relationship) {
                    if (Array.isArray(term.relationship)) {
                        ////console.log(term.relationship)
                        for (var rel in term.relationship) {
                            if (term.relationship[rel].includes("has_context")) {
                                this.get_term(term.relationship[rel].split(" ")[1]).set_is_context(true)
                                this.get_term(term.id).add_context(this.get_term(term.relationship[rel].split(" ")[1]))
                            }
                            if (term.relationship[rel].includes("has_datatype")) {
                                this.get_term(term.relationship[rel].split(" ")[1]).set_is_datatype(true)
                                this.get_term(term.id).set_datatype(term.relationship[rel].split(" ")[1])
                            }
                            if (term.relationship[rel].includes("has_enum")) {
                                this.get_term(term.relationship[rel].split(" ")[1]).set_is_enum(true)
                                this.get_term(term.id).set_enum(term.relationship[rel].split(" ")[1])
                            }
                        }
                    }
                    else {
                        if (term.relationship.includes("has_context")) {
                            this.get_term(term.relationship.split(" ")[1]).set_is_context(true)
                            this.get_term(term.id).add_context(this.get_term(term.relationship.split(" ")[1]))
                        }
                        if (term.relationship.includes("has_datatype")) {
                            this.get_term(term.relationship.split(" ")[1]).set_is_datatype(true)
                            this.get_term(term.id).set_datatype(term.relationship.split(" ")[1])
                        }
                        if (term.relationship.includes("has_enum")) {
                            this.get_term(term.relationship.split(" ")[1]).set_is_enum(true)
                            this.get_term(term.id).set_enum(term.relationship.split(" ")[1])
                        }
                    }
                }
                cpt += 1;
            }
        )
        //second traversal to build hierarchical relationship and node for tree
        //build context hierarchy
        var t = new OntologyTerm(this.ontology_id, this.ontology_id, [], "")
        this.ontologyNode.push(t);
        var cpt = 0
        this.ontologyTerms.forEach(
            term => {
                if (term.is_environment) {
                    if (term.is_a != "") {
                        if (this.searchTree(this.ontologyNode[0], term.is_a) != null) {
                            //need to inherit context to node children 
                            for (var c in this.searchTree(this.ontologyNode[0], term.is_a).context) {
                                term.add_context(this.searchTree(this.ontologyNode[0], term.is_a).context[c])
                            }
                            this.searchTree(this.ontologyNode[0], term.is_a).add_children(term)
                        }
                    }
                    else {
                        this.ontologyNode[0].add_children(term);
                    }
                }
                if (term.is_context) {
                    if (term.is_a != "") {
                        if (this.searchTree(this.ontologyContext[0], term.is_a) != null) {
                            this.searchTree(this.ontologyContext[0], term.is_a).add_children(term)
                        }
                    }
                    else {
                        this.ontologyContext.push(new OntologyTerm(term.id, term.name, [], ""));
                    }
                }
                if (term.is_datatype) {
                    if (term.is_a != "") {
                        if (this.searchTree(this.ontologyDatatype[0], term.is_a) != null) {
                            this.searchTree(this.ontologyDatatype[0], term.is_a).add_children(term)
                        }
                    }
                    else {
                        this.ontologyDatatype.push(new OntologyTerm(term.id, term.name, [], ""));
                    }
                }
                if (term.is_enumeration) {
                    this.ontologyEnum.push(new OntologyTerm(term.id, term.name, [], ""));
                }
            }
        )
        //Add instances for ontologyTerm
        if (this.ontology.instance) {
            //console.log(this.ontology)
            var ontology_instance_data: Array<{ name: string; instance_of: any; id: string; property_value: any; }> = this.ontology.instance

            ontology_instance_data.forEach(
                instance => {
                    if (Array.isArray(instance.instance_of)) {
                        for (var elem in instance.instance_of) {
                            if (this.searchTree(this.ontologyNode[0], instance.instance_of[elem]) != null) {
                                if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                    symbole = instance.property_value.split("\"")[1]
                                }
                                this.searchTree(this.ontologyNode[0], instance.instance_of[elem]).add_instance(new Instance(instance.id, instance.name, symbole))
                            }
                            if (this.searchTree(this.ontologyContext[0], instance.instance_of[elem]) != null) {
                                if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                    symbole = instance.property_value.split("\"")[1]
                                }
                                this.searchTree(this.ontologyContext[0], instance.instance_of[elem]).add_instance(new Instance(instance.id, instance.name, symbole))
                            }
                            if (this.searchTree(this.ontologyEnum[0], instance.instance_of[elem]) != null) {
                                var symbole = ""
                                if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                    symbole = instance.property_value.split("\"")[1]
                                }
                                this.searchTree(this.ontologyEnum[0], instance.instance_of[elem]).add_instance(new Instance(instance.id, instance.name, symbole))
                            }
                        }
                    }
                    else {
                        if (this.searchTree(this.ontologyNode[0], instance.instance_of) != null) {
                            var symbole = ""
                            if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                symbole = instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyNode[0], instance.instance_of).add_instance(new Instance(instance.id, instance.name, symbole))
                        }
                        if (this.searchTree(this.ontologyContext[0], instance.instance_of) != null) {
                            var symbole = ""
                            if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                symbole = instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyContext[0], instance.instance_of).add_instance(new Instance(instance.id, instance.name, symbole))
                        }
                        if (this.searchTree(this.ontologyEnum[0], instance.instance_of) != null) {
                            var symbole = ""
                            if (instance.property_value != null && instance.property_value.includes("has_symbol")) {
                                symbole = instance.property_value.split("\"")[1]
                            }
                            this.searchTree(this.ontologyEnum[0], instance.instance_of).add_instance(new Instance(instance.id, instance.name, symbole))
                        }
                    }
                    cpt += 1;
                }
            )
        }
        delete this.ontologyTerms
        this.show_spinner = false;
        return this.ontologyNode;
    }
    get_term(term_id: string): any {
        var term: OntologyTerm;
        this.ontologyTerms.forEach(
            t => {
                if (t.id === term_id) {
                    term = t
                }
            })
        return term
    }
    searchTerm(terms: OntologyTerm[], term_id: string): OntologyTerm {
        var term: OntologyTerm;
        terms.forEach(
            t => {
                if (t.id == term_id) {
                    term = t
                }
                else if (t.children != null) {
                    var i;
                    var result = null;
                    for (i = 0; result == null && i < t.children.length; i++) {
                        result = this.searchTerm([t.children[i]], term_id);
                        term = this.searchTerm([t.children[i]], term_id);
                    }
                }
            }
        )
        return term
    }
    searchTree(term: OntologyTerm, term_id: string) {
        if (term.id == term_id) {
            return term;
        }
        else if (term.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < term.children.length; i++) {
                result = this.searchTree(term.children[i], term_id);
            }
            return result;
        }
        return null;
    }
    get_term2(term_id: string): any {
        var term: OntologyTerm;
        this.ontologyNode.forEach(
            t => {
                if (t.id === term_id) {
                    term = t
                }
            })
        return term
    }
    get_node(term_id: string): OntologyTerm {
        var term: OntologyTerm;
        this.ontology_tree.forEach(
            t => {
                if (t.id === term_id) {
                    term = t
                }
            })
        return term
    }
    get_termchild(term_id: string): OntologyTerm[] {
        var term: OntologyTerm[];
        this.ontologyTerms.forEach(
            t => {
                if (t.id === term_id) {
                    term = t.children
                }

            })
        return term
    }
    // get_children(node_id:string,loc_tree: FoodNode[]): FoodNode[]{
    //     var chil:FoodNode[];
    //     loc_tree[0].children.forEach(
    //     stu=>{
    //             if (stu.name==node_id){
    //                 chil=stu.children;
    //             };
    //           }
    //     )
    //    return chil;

    // }

    hasChild = (_: number, node: OntologyFlatNode) => node.expandable;
    getStyle(): Object {
        return { backgroundColor: 'LightSteelBlue', width: '100%', 'margin-bottom': '10px', 'border-radius': '4px', 'box-shadow': '2px 2px 2px 2px' }
    }
    getLevel = (node: OntologyFlatNode) => node.level;

    isExpandable = (node: OntologyFlatNode) => node.expandable;

    getChildren = (node: OntologyTerm): OntologyTerm[] => node.children;
    @ViewChild('tree', { static: false }) tree: { treeControl: { expandAll: () => void; }; };

    onNoClick(): void {
        this.dialogRef.close();
    }
    onOkClick() {
        ////console.log(this.selected_term)
        //console.log(this.selected_set)
    }
}
