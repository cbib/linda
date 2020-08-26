
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Modern JavaScript
//import { Database, aql } from "arangojs";
//const db = new Database();
//
//(async function() {
//  const now = Date.now();
//  try {
//    const cursor = await db.query(aql`
//      RETURN ${now}
//    `);
//    const result = await cursor.next();
//    // ...
//  } catch (err) {
//    // ...
//  }
//})();
//const db = new Database({
//  url: "http://localhost:8529"
//});
//db.useDatabase("_admin");
//db.useBasicAuth("root", "benjamin");


//const   cors = require('cors');
//const express = require('express')
//var app = express();
//app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({extended: false, limit: '50mb'}));
//app.use(cors());
//const data_folder=config.get("data_folder");
//
//
//let appPort = config.get('api_server.port');
//app.listen(appPort, () => {
// console.log("Server running on port ${appPort}");
//});


'use strict';
var log = require("console").log;
const createRouter = require('@arangodb/foxx/router');
var graph_module = require("@arangodb/general-graph");
const router = createRouter();
module.context.use(router);
const joi = require('joi');
const aql = require('@arangodb').aql;
const db = require('@arangodb').db;
const errors = require('@arangodb').errors;
const queues = require('@arangodb/foxx/queues')
const queue1 = queues.create("my-queue");

queue1.push(
    { mount: "/xeml", name: "send-mail" },
    { to: "bdartigues@gmail.com", body: "Hello world" }
);


//const writeFile = require('write-file')



//var edgeDefinitions = [ {collection: "users_edge", "from": [ "users" ], "to" : [ "investigations" ] }, 
//                        {collection: "investigations_edge", "from": [ "investigations" ], "to" : [ "studies" ] }, 
//                        {collection: "studies_edge", "from": [ "studies" ], "to" : [ "events", "data_files","observed_variables","experimental_factors","observation_units","environments","samples"] }
//    ];
//graph_module._create("global", edgeDefinitions); 
//if (!graph_module._graph("global")){
//    graph_module._create("global", edgeDefinitions);
//}

//var graph =graph_module._create("Graph2", [graph_module._relation("users_edge", "users", "investigations"), 
//                                            graph_module._relation("investigations_edge", "investigations", "studies"),
//                                            graph_module._relation("studies_edge", "studies", "events")
//                                        ]) 

/*Model collections*/
var investigation = db._collection('investigation');
var study = db._collection('study');
var event = db._collection('event');
var observation_unit = db._collection('observation_unit');
var environment = db._collection('environment');

/*Document collections*/
var users = db._collection('users');
var investigations = db._collection('investigations');
var studies = db._collection('studies');
var events = db._collection('events');
var data_files = db._collection('data_files');
var observed_variables = db._collection('observed_variables');
var experimental_factors = db._collection('experimental_factors');

var environments = db._collection('environments');
var publications = db._collection('publications');
var samples = db._collection('samples');
/*Edge collections*/
var users_edge = db._collection('users_edge');
var investigations_edge = db._collection('investigations_edge');
var observation_units = db._collection('observation_units');
var studies_edge = db._collection('studies_edge');
var observation_units_edge = db._collection('observation_units_edge');
var metadata_files = db._collection('metadata_files');




/*Check if collections exist*/

if (!users) {
    db._createDocumentCollection('users');
    users = db._collection('users');
}
if (!investigations) {
    db._createDocumentCollection('investigations');
    investigations = db._collection('investigations');
}
if (!studies) {
    db._createDocumentCollection('studies');
    studies = db._collection('studies');
}
if (!events) {
    db._createDocumentCollection('events');
    events = db._collection('events');
}
if (!data_files) {
    db._createDocumentCollection('data_files');
    data_files = db._collection('data_files');
}
if (!observation_units) {
    db._createDocumentCollection('observation_units');
    observation_units = db._collection('observation_units');
}
if (!publications) {
    db._createDocumentCollection('publications');
    publications = db._collection('publications');
}
if (!samples) {
    db._createDocumentCollection('samples');
    samples = db._collection('samples');
}
if (!observed_variables) {
    db._createDocumentCollection('observed_variables');
    observed_variables = db._collection('observed_variables');
}
if (!environments) {
    db._createDocumentCollection('environments');
    environment = db._collection('environments');
}
if (!experimental_factors) {
    db._createDocumentCollection('experimental_factors');
    experimental_factors = db._collection('experimental_factors');
}
if (!metadata_files) {
    db._createDocumentCollection('metadata_files');
    metadata_files = db._collection('metadata_files');
}



/*check if edge collections exist*/
if (!users_edge) {
    db._createDocumentCollection('users_edge');
}
if (!investigations_edge) {
    db._createDocumentCollection('investigations_edge');
}
if (!studies_edge) {
    db._createEdgeCollection('studies_edge');
}
//if (!observation_units_edge) {
//  db._createEdgeCollection('observation_units_edge');
//}
////const study = db._collection('study');
//const users = db._collection('users');
//const investigation = db._collection('investigation');
////const investigations = db._collection('investigations');
//const study = db._collection('study');
////const studies = db._collection('studies');
//const event = db._collection('event');
////const events = db._collection('events');
////const users_edge = db._collection('users_edge');
////const investigations_edge = db._collection('investigations_edge');


const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

//// store schema in variable to make it re-usable, see .body()
//const docSchema = joi.object().required().keys({
//  name: joi.string().required(),
//  age: joi.number().required()
//}).unknown(); // allow additional attributes


//router.post('/study', function (req, res) {
//  const multiple = Array.isArray(req.body);
//  const body = multiple ? req.body : [req.body];
//
//  let data = [];
//  for (var doc of body) {
//    const meta = study.save(doc);
//    data.push(Object.assign(doc, meta));
//  }
//  res.send(multiple ? data : data[0]);
//
//})
//.body(joi.alternatives().try(
//  docSchema,
//  joi.array().items(docSchema)
//), 'Entry or entries to store in the collection.')
//.response(joi.alternatives().try(
//  joi.object().required(),
//  joi.array().items(joi.object().required())
//), 'Entry or entries stored in the collection.')
//.summary('Store entry or entries')
//.description('Store a single entry or multiple entries in the "myFoxxCollection" collection.');


/*****************************************************************************************
 ******************************************************************************************
 *********************************USERS****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/

router.get('/users', function (req, res) {
    const keys = db._query(aql`
    FOR entry IN ${users}
    RETURN entry
  `);
    res.headers['Access-Control-Allow-Credentials'] = true
    res.headers['Access-Control-Allow-Origin'] = true
    res.send(keys);
})
    .response(joi.array().items(
        joi.string().required()
    ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


// GET users by username
router.get('/users/:username', function (req, res) {
    //log(req);

    try {
        var name = req.pathParams.username;
        //const data = users.byExample({username : name});
        const data = users.firstExample('username', name);
        //const data = users.properties();
        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }
})
    .pathParam('username', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');



/*****************************************************************************************
 ******************************************************************************************
 *********************************LOG and REGISTER*******************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/
// continued
router.post('/authenticate', function (req, res) {
    const values = req.body.values;
    var username = req.body.username;
    var password = req.body.password;
    const keys = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);
    res.send(keys);
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.array().items(
        joi.string().required()
    ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');

// continued
router.post('/register', function (req, res) {
    const data = req.body;
    //var username=req.body.username;
    var searchExpression = { "username": req.body.username, "password": req.body.password };
    var data_to_insert = { "username": req.body.username, "password": req.body.password, "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email };

    //alert(username);
    //var password=req.body.password;
    //var firstName=req.body.firstName;
    //var lastName=req.body.lastName;

    const keys = db._query(aql`UPSERT ${searchExpression} INSERT ${data_to_insert} UPDATE {}  IN ${users} RETURN OLD `);

    if (keys.next() === null) {
        res.send({ success: true, message: 'everything is good' + JSON.stringify(keys) });
    }
    else {
        res.send({ success: false, message: 'a user with username ' + searchExpression.username + ' already exists' });
    };

})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        confirmpassword: joi.string().required(),
        lastName: joi.string().required(),
        firstName: joi.string().required(),
        email: joi.string().required()
    }).required(), 'Values to check.')

    //.response(joi.string().required(), 'response.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');




router.post('/search', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var search_string = req.body.search_string;

    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
      `).toArray();
    if (user[0] === null) {
        res.send([{ success: false, message: 'Username ' + username + ' doesn\'t exists', _id: null }]);
    }
    else {
        /////////////////////////////
        //now search in all descendants node of user the search string
        /////////////////////////////
        //var data=[{"search_string":search_string, 'user_key':user[0]}];
        var data = []
        var user_id = user[0]["_id"];
        var all_descendants_nodes = db._query(aql`FOR v, e, s IN 1..5 OUTBOUND ${user_id} GRAPH 'global'  RETURN {v:v, e:e}`).toArray();
        all_descendants_nodes.forEach(
            descendants_node => {
                var descendants_node_values = descendants_node["v"]
                var descendants_node_id = descendants_node["v"]["_id"]
                Object.keys(descendants_node_values).forEach(
                    descendants_node_key => {
                        if (!descendants_node_key.startsWith("_")) {
                            var descendants_node_value = descendants_node_values[descendants_node_key]
                            if ((typeof descendants_node_value === 'string') && (descendants_node_value.includes(search_string))) {
                                data.push({ 'search_string': search_string, 'id': descendants_node_id, 'found_as': descendants_node_key, 'data': descendants_node_values, parent_id: descendants_node["e"]["_from"] });
                            }
                            //descendants_node_value type metadata file
                            else {

                                if (descendants_node_key === "headers") {
                                    if (descendants_node_value.includes(search_string)) {
                                        data.push({ 'search_string': search_string, 'id': descendants_node_id, 'found_as': descendants_node_key, 'data': descendants_node_values, parent_id: descendants_node["e"]["_from"] });
                                    }
                                }
                                else if (descendants_node_key === "associated_headers") {
                                    Object.keys(descendants_node_value).forEach(
                                        descendants_node_matadata_key => {
                                            if (!descendants_node_matadata_key.startsWith("_")) {
                                                var descendants_node_matadata_value = descendants_node_value[descendants_node_matadata_key]
                                                Object.keys(descendants_node_matadata_value).forEach(
                                                    descendants_node_matadata_subkey => {
                                                        var descendants_node_matadata_subvalue = descendants_node_matadata_value[descendants_node_matadata_subkey]
                                                        if ((typeof descendants_node_matadata_subvalue === 'string') && (descendants_node_matadata_subvalue.includes(search_string))) {
                                                            data.push({ 'search_string': search_string, 'id': descendants_node_id, 'found_as': descendants_node_matadata_key, 'data': descendants_node_values, parent_id: descendants_node["e"]["_from"] });
                                                        }

                                                    }
                                                )
                                            }

                                        }

                                    )
                                }
                                //here search in data key : need to add it if data are not numerical
                                else {
                                    //console.log(descendants_node_key)
                                }

                            }
                        }

                    }
                )

            }
        );

        res.send(data);
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        search_string: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.array().items(joi.object().required()).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');




/*****************************************************************************************
 ******************************************************************************************
 *********************************GLOBAL*******************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/


router.get('/get_max_level/:model_type', function (req, res) {
    var model_type = req.pathParams.model_type;

    const coll = db._collection(model_type);
    if (!coll) {
        db._createDocumentCollection(model_type);
    }
    var data = db._query(aql`FOR entry IN ${coll} RETURN (FOR name IN ATTRIBUTES(entry) FILTER entry[name].Level!=null return entry[name].Level)`).toArray();


    var level = 1;
    for (var l in data[0]) {
        if (parseInt(data[0][l]) > level) {
            level = parseInt(data[0][l])
        }
    }
    res.send(level);


})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .response(joi.number().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_parent_id/:model_name/:model_key', function (req, res) {

    var model_name = req.pathParams.model_name;
    var model_key = req.pathParams.model_key;
    var model_id = model_name + "/" + model_key;
    var data = {}
    data = db._query(aql`FOR v, e IN 1..1 INBOUND ${model_id} GRAPH 'global' RETURN {v_id:v._id}`).toArray();
    res.send(data);
})
    .pathParam('model_name', joi.string().required(), 'username of the entry.')
    .pathParam('model_key', joi.string().required(), 'username of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_parent/:model_type/:model_key', function (req, res) {

    var model_type = req.pathParams.model_type;
    var model_key = req.pathParams.model_key;
    var model_id = model_type + "/" + model_key;
    var data = {}

    data = db._query(aql`FOR v, e IN 1..1 ANY ${model_id} GRAPH 'global' FILTER e._to==${model_id} RETURN {_key:e._key , _from:e._from}`);
    //data=db._query(aql`FOR v, e IN 1..1 ANY 'investigations/770131' investigations_edge, studies_edge, users_edge FILTER e._to=='investigations/770131' RETURN {_key:e._key , _from:e._from}`).toArray();
    res.send(data.next());
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .pathParam('model_key', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_childs/:model_type/:model_key', function (req, res) {

    var model_type = req.pathParams.model_type;
    var model_key = req.pathParams.model_key;
    var model_id = model_type + "/" + model_key;
    var data = {}

    data = db._query(aql`FOR v, e, s IN 1..1 ANY ${model_id} GRAPH 'global' FILTER e._from==${model_id} RETURN {v:v}`);
    //data=db._query(aql`FOR v, e IN 1..1 ANY 'investigations/770131' investigations_edge, studies_edge, users_edge FILTER e._to=='investigations/770131' RETURN {_key:e._key , _from:e._from}`).toArray();
    res.send(data);
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .pathParam('model_key', joi.string().required(), 'username of the entry.')

    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_model_child/:model_type', function (req, res) {

    var model_type = req.pathParams.model_type;
    var data = {}

    data = db._query(aql`FOR v, e, s IN 1..1 ANY ${model_type} GRAPH 'miappe' FILTER e._from==${model_type} RETURN {v:v}`);
    //data=db._query(aql`FOR v, e IN 1..1 ANY 'investigations/770131' investigations_edge, studies_edge, users_edge FILTER e._to=='investigations/770131' RETURN {_key:e._key , _from:e._from}`).toArray();
    res.send(data);
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')

    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_vertices/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..4 ANY ${user_id} GRAPH 'global'  RETURN {e:e,s:s}`);
    res.send(data);
})
    .pathParam('user_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_vertices_by_model/:model_type/:model_key', function (req, res) {
    var model_type = req.pathParams.model_type;
    var model_key = req.pathParams.model_key;
    var model_id = model_type + "/" + model_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..4 OUTBOUND ${model_id} GRAPH 'global' RETURN {e:e,s:s,v:v}`);
    res.send(data);
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .pathParam('model_key', joi.string().required(), 'username of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_childs_by_model/:model_type/:model_key', function (req, res) {
    var model_type = req.pathParams.model_type;
    var model_key = req.pathParams.model_key;
    var model_id = model_type + "/" + model_key;
    //var data=[];

    var final_obj = { "models_data": [] }
    var childs_data = db._query(aql`FOR v, e, s IN 1..4 OUTBOUND ${model_id} GRAPH 'global' RETURN {e:e,s:s,v:v}`).toArray();
    final_obj["models_data"] = childs_data
    //childs_model=[]
    childs_data.forEach(
        child_data => {
            var model = ""
            var id = child_data["v"]["_id"]
            if (id.split("/")[0] == "studies") {
                model = "study/Study"
                model_type = "study"
            }
            else {
                model = id.split("/")[0].slice(0, -1) + "/" + id.split("/")[0][0].toUpperCase() + id.split("/")[0].slice(1).slice(0, -1);
                model_type = id.split("/")[0].slice(0, -1)
            }
            console.log(model_type)
            var child_model = db._query(aql`RETURN DOCUMENT(${model})`).toArray();
            child_data["model"] = child_model[0]

            var isa_model = ""
            if (model_type == 'investigation' || model_type == 'study' || model_type == 'experimental_factor') {
                isa_model = "investigation_isa/investigation_Isa"
            }
            else if (model_type == "observed_variable") {
                isa_model = "trait_definition_file_isa/trait_definition_file_Isa"
            }
            else if (model_type == "biological_material") {
                isa_model = "study_isa/Study_isa"
            }
            else if (model_type == "environment") {
                isa_model = "study_isa/Study_isa"
            }
            else {
                isa_model = "assay_isa/assay_Isa"
            }
            var child_model = db._query(aql`RETURN DOCUMENT(${isa_model})`).toArray();
            child_data["isa_model"] = child_model[0]



            // var isa_model=[]
            // if (model_type== 'investigation' || model_type== 'study' || model_type== 'experimental_factor'){
            //     isa_model.push("investigation_isa/investigation_Isa")
            // }
            // else if(model_type=="observed_variable"){
            //     isa_model.push("trait_definition_file_isa/trait_definition_file_Isa")
            // }
            // else if(model_type=="biological_material"){
            //     isa_model.push("study_isa/Study_isa")
            // }
            // else if(model_type=="environment"){
            //     isa_model.push("study_isa/Study_isa")
            //     isa_model.push("investigation_isa/investigation_Isa")
            // }
            // else{
            //     isa_model.push(isa_model="assay_isa/assay_Isa")
            // }
            // child_data["isa_model"]=[]
            // for (var i = 0; i < isa_model.length; i++) {
            //     let child_model =db._query(aql`RETURN DOCUMENT(${isa_model[i]})`).toArray();
            //     child_data["isa_model"].push(child_model[0])
            // }

            //final_obj["models_data"].push(child_model[0])	
            // childs_model.push(child_model[0]) 
        }
    )

    res.send(final_obj);
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .pathParam('model_key', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'List of entry keys.')

    // .response(joi.object({
    //         model_real_data: joi.array().items().required(), 
    //         model_data:joi.array().items().required()
    //                     }).required(), 'List of entry keys.'
    // )
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

//.response(joi.object({"model_data": joi.array().items(joi.object().required()).required(), "model_real_data":joi.array().items(joi.object().required()).required()}).required(), 'List of entry keys.')
//joi.array().items
//.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')



router.get('/get_model/:model_type', function (req, res) {

    var model_type = req.pathParams.model_type;
    var data = {}
    const coll = db._collection(model_type);
    if (!coll) {
        db._createDocumentCollection(model_type);
    }
    data = db._query(aql`FOR entry IN ${coll} RETURN entry`);
    res.send(data.next());
})
    .pathParam('model_type', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_ontology/:ontology_id', function (req, res) {

    var ontology_id = req.pathParams.ontology_id;
    var data = {}
    const coll = db._collection("ontologies");
    if (!coll) {
        db._createDocumentCollection("ontologies");
    }
    data = db._query(aql`FOR entry IN ${coll} FILTER entry.name == ${ontology_id} RETURN entry`);
    res.send(data.next());
})
    .pathParam('ontology_id', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


// router.get('/get_ontology_term/:term_id', function (req, res) {

//     var term_id=req.pathParams.term_id;
//     var data={} 
//     const coll = db._collection("ontologies");
//     if (!coll) {
//          db._createDocumentCollection("ontologies");
//      }
//     data = db._query(aql`FOR entry IN ${coll} FILTER entry.term.id == ${term_id} RETURN entry`);
//     res.send(data.next());
//  })
//  .pathParam('term_id', joi.string().required(), 'username of the entry.')
//  .response(joi.object().required(), 'List of entry keys.')
//  .summary('List entry keys')
//  .description('Assembles a list of keys of entries in the collection.');


//router.get('/delete/:model_type/:key', function (req, res) {
//  try {
//    var model_type=req.pathParams.model_type;
//    var key=req.pathParams.key;
//    var start_node=req.pathParams.start_node;
//    
//    var data=[];
//    var id='';
//    if (model_type==='investigation'){
//        id='investigations/'+key;
//        
//        data=db._query(aql`FOR v, e IN 1..2 ANY 'users/1' GRAPH 'global_graph' FILTER e._to==${_id} || e._from==${_id} RETURN {_key:e._key , _to:e._to}`).toArray();
//        for (v in data){
//            if (data[v]._to.startsWith('invest')){
//                inv_key=data[v]._to.split("/")[1]
//                db._query(aql`REMOVE ${data[v]._key} IN ${users_edge}`);
//                db._query(aql`REMOVE ${inv_key} IN ${investigations}`);
//            }
//            else{
//                study_key=data[v]._to.split("/")[1]
//                db._query(aql`REMOVE ${data[v]._key} IN ${investigations_edge}`);
//                db._query(aql`REMOVE ${study_key} IN ${studies}`);
//
//            }
//            
//        }
//        //Remove users_edge, investigations edge, studies and all associated data
//        //Remove investigation and clean investigations edge
//        data = investigations.firstExample('_key',key);
//    }
//    else if (model_type==='study'){
//        data = studies.firstExample('_key',key);
//    }
//    else if (model_type==='event'){
//        data = events.firstExample('_key',key);
//    }
//    else {
//        data = observation_units.firstExample('_key',key);
//    }
//    //const data = investigations.firstExample('_key',key);
//
//    res.send(data);
//  } 
//  catch (e) {
//    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
//      throw e;
//    }
//    res.throw(404, 'The entry does not exist', e);
//  }
//    
//})
//.pathParam('model_type', joi.string().required(), 'model requested.')
//.pathParam('key', joi.string().required(), 'unique key.')
//.pathParam('start_node', joi.string().required(), 'node to start removing.')
//
//.response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
//.summary('Retrieve an entry')
//.description('Retrieves an entry from the "myFoxxCollection" collection by key.');
//
//    writeFile('/Users/benjamin/angular_dossier/data.json', data, function (err) {
//  if (err) {result= err}
//  else{result='file is written'}});

//router.get("/some/filename.png", function(req, res) {
//  const filePath = module.context.fileName("/Users/benjamin/LINDA/src/app/images/inra.png");
//  res.sendFile(filePath);
//});


router.post('/upload', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.obj;

    //    var data=req.body.data;
    //    var headers=req.body.headers;
    //    var associated_headers=req.body.associated_headers;
    //    var filename=req.body.filename;
    //var result="";
    const edge = db._collection("studies_edge");


    var coll = db._collection("metadata_files");
    //    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {

        var data = [];
        data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

        if (data[0].new === null) {
            res.send({ success: false, message: model_type + ' collection already have file with this name ', _id: 'none' });

        }
        //Document exists
        else {
            var obj = {
                "_from": parent_id,
                "_to": data[0].id
            };
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
            res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
        }

    }
    res.send(data);

    //    var password=req.body.password;
    //    var _key=req.body._key;
    //    var field=req.body.field;
    //    var value=req.body.value;
    //    var model_type=req.body.model_type;
    //    /////////////////////////////
    //    //first check if user exist
    //    /////////////////////////////
    //    const user = db._query(aql`
    //        FOR entry IN ${users}
    //        FILTER entry.username == ${username}
    //        FILTER entry.password == ${password}
    //        RETURN entry
    //    `);
    //    if (user.next() === null){
    //        res.send({success:false,message:'username '+ username + 'doesn\'t exists'});
    //    }
    //    else{
    //        /////////////////////////////
    //        //now check if investigation exists else modify field
    //        /////////////////////////////
    //        var update=[];
    //        var _id='';
    //        if (model_type==='investigation'){
    //            _id='investigations/'+_key;
    //            update=db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray();
    //        }
    //        else if (model_type==='study'){
    //            _id='studies/'+_key;
    //            update=db._query(aql` FOR entry IN ${studies} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${studies} RETURN NEW.${field}`).toArray();
    //        }
    //        else if (model_type==='event'){
    //            _id='events/'+_key;
    //            update=db._query(aql` FOR entry IN ${events} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${events} RETURN NEW.${field}`).toArray();
    //        }
    //        else {
    //            _id='observation_units/'+_key;
    //            update=db._query(aql` FOR entry IN ${observation_units} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${observation_units} RETURN NEW.${field}`).toArray();
    //
    //        }
    //        
    //        
    //        
    //        
    //        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
    //        //Document has been updated
    //        if (update[0] === value){
    //            res.send({success:true,message:'document has been updated '});
    //        }
    //        //No changes
    //        else{
    //            res.send({success:false,message: 'document cannot be updated'});
    //        }
    //    };

})
    //headers: joi.array().items.required(),
    //associated_headers: joi.object().required()
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        obj: joi.object({
            data: joi.array().items(joi.array().items().required()).required(),
            headers: joi.array().items().required(),
            associated_headers: joi.object().required(),
            filename: joi.string().required()
        }).required()

    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        inv_key: joi.string().required()
    }).required(), 'response.')
    //.response(joi.array().items(joi.array().items().required()).required(),'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');



router.get('/get_elem/:collection/:key', function (req, res) {
    try {
        var collection = req.pathParams.collection;
        var key = req.pathParams.key;
        var data = [];
        const coll = db._collection(collection);
        if (!coll) {
            db._createDocumentCollection(collection);
        }
        data = coll.firstExample('_key', key);

        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('collection', joi.string().required(), 'model requested.')
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');







router.get('/get_by_key/:model_type/:key', function (req, res) {
    try {
        var model_type = req.pathParams.model_type;
        var key = req.pathParams.key;
        var data = [];
        var datatype = "";
        if (model_type === "study") {
            datatype = "studies";
        }
        else {
            datatype = model_type + "s";
        }
        const coll = db._collection(datatype);
        if (!coll) {
            db._createDocumentCollection(datatype);
        }
        data = coll.firstExample('_key', key);

        //    if (model_type==='investigation'){
        //        data = investigations.firstExample('_key',key);
        //    }
        //    else if (model_type==='study'){
        //        data = studies.firstExample('_key',key);
        //    }
        //    else if (model_type==='event'){
        //        data = events.firstExample('_key',key);
        //    }
        //    else {
        //        data = observation_units.firstExample('_key',key);
        //    }
        //const data = investigations.firstExample('_key',key);

        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('model_type', joi.string().required(), 'model requested.')
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.post('/update', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _key = req.body._key;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var datatype = "";
    if (model_type === "study") {
        datatype = "studies";
    }
    else {
        datatype = model_type + "s";
    }
    const coll = db._collection(datatype);
    if (!coll) {
        db._createDocumentCollection(datatype);
    }
    var _id = datatype + '/' + _key;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        var update = [];


        update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${coll} RETURN { before: OLD, after: NEW }`).toArray();




        //        if (model_type==='investigation'){
        //            _id='investigations/'+_key;
        //           // update=db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${investigations} RETURN UNSET(NEW, "_key", "_id", "_rev")`).toArray();
        //            update=db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${investigations} RETURN { before: OLD, after: NEW }`).toArray();
        //        
        //        }
        //        else if (model_type==='study'){
        //            _id='studies/'+_key;
        //            update=db._query(aql` FOR entry IN ${studies} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${studies} RETURN { before: OLD, after: NEW }`).toArray();
        //        }
        //        else if (model_type==='event'){
        //            _id='events/'+_key;
        //            update=db._query(aql` FOR entry IN ${events} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${events} RETURN { before: OLD, after: NEW }`).toArray();
        //        }
        //        else {
        //            _id='observation_units/'+_key;
        //            update=db._query(aql` FOR entry IN ${observation_units} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${observation_units} RETURN { before: OLD, after: NEW }`).toArray();
        //
        //        }




        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0].before !== update[0].after) {
            res.send({ success: true, message: 'document has been updated ' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after) });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after) });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        _key: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


router.post('/update_field', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _key = req.body._key;
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        var update = [];
        var _id = '';
        if (model_type === 'investigation') {
            _id = 'investigations/' + _key;
            update = db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'study') {
            _id = 'studies/' + _key;
            update = db._query(aql` FOR entry IN ${studies} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${studies} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'event') {
            _id = 'events/' + _key;
            update = db._query(aql` FOR entry IN ${events} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${events} RETURN NEW.${field}`).toArray();
        }
        else {
            _id = 'observation_units/' + _key;
            update = db._query(aql` FOR entry IN ${observation_units} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${observation_units} RETURN NEW.${field}`).toArray();

        }
        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0] === value) {
            res.send({ success: true, message: 'document has been updated ' });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated' });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        _key: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');

router.get('/get_data_from_child_model/:parent_name/:parent_key/:child_type/', function (req, res) {
    try {
        var parent_name = req.pathParams.parent_name;
        var parent_key = req.pathParams.parent_key;
        var parent_id = parent_name + '/' + parent_key
        var child_type = req.pathParams.child_type;
        var childs = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global' RETURN {v_id:v._id,v:v}`).toArray();
        var data = []
        for (var i = 0; i < childs.length; i++) {
            if (childs[i]["v_id"].split("/")[0] == child_type) {
                data.push(childs[i]["v"])
            }
        }
        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('parent_name', joi.string().required(), 'parent name requested.')
    .pathParam('parent_key', joi.string().required(), 'parent key requested.')
    .pathParam('child_type', joi.string().required(), 'child type.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');






//Get templates
router.get('/get_templates/:user_key/:model_coll/', function (req, res) {
    try {
        var user_key = req.pathParams.user_key;
        var model_coll = req.pathParams.model_coll;

        var coll_name = model_coll + '_templates'
        var data = [];

        //    const user = db._query(aql`
        //        FOR entry IN ${users}
        //        FILTER entry.username == ${username}
        //        FILTER entry.password == ${password}
        //        RETURN entry
        //    `);
        //    if (user.next() === null){
        //        res.send({success:false,message:'username '+ username + 'doesn\'t exists'});
        //    }
        //    else{

        const edges = db._collection('templates_edge');
        if (!edges) {
            db._createDocumentCollection('templates_edge');
        }
        const coll = db._collection(coll_name);
        if (!coll) {
            db._createDocumentCollection(coll_name);
        }

        var user_id = "users/" + user_key

        var edges_data = edges.byExample({ "_from": user_id }).toArray();
        for (var i = 0; i < edges_data.length; i++) {
            if (edges_data[i]['_to'].includes(coll_name)) {
                //var tmp={'_id':edges_data[i]['_to']};
                //data.push({'_id':edges_data[i]['_to']});
                data.push(coll.byExample({ "_id": edges_data[i]['_to'] }).next());
            }
        }

        //data = coll.byExample().toArray();


        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('user_key', joi.string().required(), 'model requested.')
    .pathParam('model_coll', joi.string().required(), 'unique key.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');





//Post new templates data
router.post('/saveTemplate', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var values = req.body.values;
    var model_type = req.body.model_type;

    if (!db._collection(model_type + "_templates")) {
        db._createDocumentCollection(model_type + "_templates");
    }
    var coll = db._collection(model_type + "_templates");

    var edge_coll = 'templates_edge'
    if (!db._collection(edge_coll)) {
        db._createEdgeCollection(edge_coll);
    }
    const edge = db._collection(edge_coll);



    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `).toArray();
    if (user[0] === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists', _id: null });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else add to database
        /////////////////////////////
        var data = [];
        data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
        if (data[0].new !== null) {
            var obj = {
                "_from": user[0]._id,
                "_to": data[0].id
            };
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
            res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
        }
        //Document exists
        else {
            res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        _id: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');



router.post('/remove', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;

    const user = db._query(aql`
            FOR entry IN ${users}
            FILTER entry.username == ${username}
            FILTER entry.password == ${password}
            RETURN entry
          `).toArray();
    if (user[0] === null) {
        res.send({ success: false, message: ['Username ' + username + ' doesn\'t exists'] });
    }
    else {
        var errors = [];

        //Remove relation for parent of selected node parent in edge collection
        var parent = db._query(aql`FOR v, e IN 1..1 INBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        var parent_edge_coll = parent[0].e_id.split("/")[0];
        var parent_key = parent[0].e_key;
        try {
            db._query(`REMOVE "${parent_key}" IN ${parent_edge_coll}`);
        }
        catch (e) {
            errors.push(e + " " + parent[0].e_id);
        }

        //get all childs and remove in collection document and edges
        var childs = db._query(aql`FOR v, e IN 1..4 OUTBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();


        //Remove all childs for selected node
        for (var i = 0; i < childs.length; i++) {

            //Delete child vertice in collection
            if ((childs[i].v_id !== null) || (childs[i].v_key !== null)) {
                var child_coll = childs[i].v_id.split("/")[0];
                var child_vkey = childs[i].v_key;
                try {
                    db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                }
                catch (e) {
                    errors.push(e + " " + childs[i].v_id);
                }
            }
            if ((childs[i].e_id !== null) || (childs[i].e_key !== null)) {
                var edge_coll = childs[i].e_id.split("/")[0];
                var child_ekey = childs[i].e_key;
                try {
                    db._query(`REMOVE "${child_ekey}" IN ${edge_coll}`);
                }
                catch (e) {
                    errors.push(e + " " + childs[i].e_id);
                }
            }

            //Delete child edge in edge collection

        }
        //Remove selected node
        var key = id.split('/')[1];
        var coll = id.split('/')[0];
        try {
            db._query(`REMOVE "${key}" IN ${coll}`);
        }
        catch (e) {
            errors.push(e + " " + id);
        }
        //Delete selected document and the egde in the parent collection edge

        if (errors.length === 0) {
            res.send({ success: true, message: ["No errors detected"] });
        }
        else {
            res.send({ success: false, message: errors });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        id: joi.string().required(),
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.array().items(joi.string().required()).required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');







// //Post new data
// router.post('/add_and_link', function (req, res) {
//     //posted variables
//     var username = req.body.username;
//     var password = req.body.password;
//     var parent_id = req.body.parent_id;
//     var biological_material_model_id = req.body.biological_material_model_id;
//     var experimental_factor_model_id = req.body.biological_material_model_id;
//     var observed_variable_model_id = req.body.biological_material_model_id;
//     var sample_model_id = req.body.biological_material_model_id;


//     var values = req.body.values;
//     var material_ids = req.body.material_ids;
//     var biological_material_ids = req.body.biological_material_ids;
//     var model_type = req.body.model_type;

//     var datatype = "";
//     if (model_type === "study") {
//         datatype = "studies";
//     }
//     else {
//         datatype = model_type + "s";
//     }


//     var parent_type = parent_id.split("/")[0];

//     var edge_coll = parent_type + '_edge'
//     if (!db._collection(edge_coll)) {
//         db._createEdgeCollection(edge_coll);
//     }
//     const edge = db._collection(edge_coll);

//     var coll = db._collection(datatype);

//     if (!coll) {
//         db._createDocumentCollection(datatype);
//     }
//     /////////////////////////////
//     //first check if user exist
//     /////////////////////////////
//     const user = db._query(aql`
//     FOR entry IN ${users}
//     FILTER entry.username == ${username}
//     FILTER entry.password == ${password}
//     RETURN entry
//   `);
//     if (user.next() === null) {
//         res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists' });
//     }
//     else {
//         /////////////////////////////
//         //now check if investigation exists else add to database
//         /////////////////////////////
//         var data = [];
//         data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

//         //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

//         if (data[0].new === null) {
//             res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });

//         }
//         //Document exists
//         else {
//             if (model_type === "biological_material") {
//                 var obj = {
//                     "_from": parent_id,
//                     "_to": data[0].id,
//                     "material_ids": [],
//                     "biological_material_ids": []
//                 };
//             }
//             else {
//                 var obj = {
//                     "_from": parent_id,
//                     "_to": data[0].id
//                 };
//             }
//             const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
//             res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
//         }
  
//     };
// })
//     .body(joi.object({
//         username: joi.string().required(),
//         password: joi.string().required(),
//         parent_id: joi.string().required(),
//         values: joi.object().required(),
//         model_type: joi.string().required()
//     }).required(), 'Values to check.')
//     .response(joi.object({
//         success: true,
//         message: joi.string().required(),
//         inv_key: joi.string().required()
//     }).required(), 'response.')
//     .summary('List entry keys')
//     .description('add MIAPPE description for given model.');





//Post new data
router.post('/add', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;

    var datatype = "";
    if (model_type === "study") {
        datatype = "studies";
    }
    else {
        datatype = model_type + "s";
    }


    var parent_type = parent_id.split("/")[0];

    var edge_coll = parent_type + '_edge'
    if (!db._collection(edge_coll)) {
        db._createEdgeCollection(edge_coll);
    }
    const edge = db._collection(edge_coll);

    var coll = db._collection(datatype);

    if (!coll) {
        db._createDocumentCollection(datatype);
    }
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);
    if (user.next() === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else add to database
        /////////////////////////////
        var data = [];
        data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

        if (data[0].new === null) {
            res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });

        }
        //Document exists
        else {
            var obj = {
                    "_from": parent_id,
                    "_to": data[0].id
                };
            
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
            res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
        }







        //    if (model_type==='investigation'){
        //        data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${investigations} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
        //        if (data[0].before === null){
        //            var obj={
        //            "_from":parent_id,
        //            "_to":data[0].id
        //            };
        //            const edges=db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${users_edge} RETURN NEW `); 
        //            res.send({success:true, message:'Everything is good ', _id:data[0].id});
        //        }
        //        //Document exists
        //        else{
        //            res.send({success:false,message: 'Already have document with this title ', _id:'none'});
        //        }
        //    }
        //    
        //    else if (model_type==='study'){
        //        data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${studies} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray();
        //        if (data[0].before === null){
        //            var obj={
        //                "_from":parent_id,
        //                "_to":data[0].id
        //            };
        //            const edges=db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${investigations_edge} RETURN NEW `); 
        //            res.send({success:true,message:'everything is good ', _id:data[0].id});
        //        }
        //        else{
        //            res.send({success:false,message: 'Investigation Already have study with this title ', _id:'none'});
        //        }
        //    }
        //    else if (model_type==='event'){
        //        data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${events} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
        //        if (data[0].before === null){
        //            var obj={
        //                "_from":parent_id,
        //                "_to":data[0].id
        //            };
        //            const edges=db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${studies_edge} RETURN NEW `); 
        //            res.send({success:true,message:'everything is good ', _id:data[0].id});
        //        }
        //        else{
        //            res.send({success:false,message: 'Investigation Already have study with this title ', _id:'none'});
        //        }
        //    }
        //    else {
        //        data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${observation_units} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray();
        //        if (data[0].before === null){
        //            var obj={
        //                "_from":parent_id,
        //                "_to":data[0].id
        //            };
        //            const edges=db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${studies_edge} RETURN NEW `); 
        //            res.send({success:true,message:'everything is good ', _id:data[0].id});
        //        }
        //        else{
        //            res.send({success:false,message: 'Investigation Already have study with this title ', _id:'none'});
        //        }
        //    }  
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        inv_key: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');

// GET investigations for a user
router.get('/get_by_parent_key/:model_type/:parent_key', function (req, res) {
    var parent_key = req.pathParams.parent_key;
    var model_type = req.pathParams.model_type;
    var array = [];
    try {
        if (model_type === 'investigation') {
            var parent_id = 'users/' + parent_key;
            var edges = users_edge.byExample({ '_from': parent_id }).toArray();
            for (var i in edges) {
                array.push(edges[i]['_to']);
            }
            var inv = db._query(aql`FOR key IN ${array} FOR i IN ${investigations} FILTER i._id == key RETURN i`).toArray();
            res.send(inv);
        }
        else if (model_type === 'study') {
            var parent_id = 'investigations/' + parent_key;
            var edges = investigations_edge.byExample({ '_from': parent_id }).toArray();
            for (var i in edges) {
                array.push(edges[i]['_to']);
            }
            var inv = db._query(aql`FOR key IN ${array} FOR i IN ${studies} FILTER i._id == key RETURN i`).toArray();
            res.send(inv);
        }
        else if (model_type === 'event') {
            var parent_id = 'studies/' + parent_key;
            var edges = studies_edge.byExample({ '_from': parent_id }).toArray();
            for (var i in edges) {
                array.push(edges[i]['_to']);
            }
            var inv = db._query(aql`FOR key IN ${array} FOR i IN ${events} FILTER i._id == key RETURN i`).toArray();
            res.send(inv);
        }
        else {
            var parent_id = 'studies/' + parent_key;
            var edges = studies_edge.byExample({ '_from': parent_id }).toArray();
            for (var i in edges) {
                array.push(edges[i]['_to']);
            }
            var inv = db._query(aql`FOR key IN ${array} FOR i IN ${observation_units} FILTER i._id == key RETURN i`).toArray();
            res.send(inv);
        }

    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('parent_key', joi.string().required(), 'parent key of the entry.')
    .pathParam('model_type', joi.string().required(), 'model type to use.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.post('/check', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////

    if (value === '') {
        res.send({ success: false, message: 'nothing in value' });
    }

    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        var check = [];

        if (model_type === 'investigation') {
            check = db._query(aql` FOR entry IN ${investigations} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        }
        else if (model_type === 'study') {
            check = db._query(aql` FOR entry IN ${studies} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        }
        else if (model_type === 'event') {
            check = db._query(aql` FOR entry IN ${events} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        }
        else {
            check = db._query(aql` FOR entry IN ${observation_units} FILTER entry.${field} == ${value} RETURN entry`).toArray()

        }
        if (check.length === 0) {
            res.send({
                success: true,
                message: 'data doesn\'t exists'
            });
        }
        else {
            res.send({
                success: false,
                message: 'data already exist, cannot use this \" model unique ID\" '
            });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().allow('').required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');








/*****************************************************************************************
 ******************************************************************************************
 *********************************INVESTIGATIONS*******************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/

router.get('/get_investigation_model', function (req, res) {
    const keys = db._query(aql`
    FOR entry IN ${investigation}
    RETURN entry
  `);

    res.send(keys.next());
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

//
router.get('/get_investigation/:key', function (req, res) {
    try {
        var key = req.pathParams.key;
        //const array=[];
        const data = investigations.firstExample('_key', key);


        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${investigations}, key) RETURN d`).toArray();
        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('key', joi.string().required(), 'username of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


// GET investigations for a user
router.get('/get_investigations/:userkey', function (req, res) {
    try {
        var key = req.pathParams.userkey;
        //const data = users.byExample({username : name});
        //users_edge.byExample({'_from':'users/1'}).toArray();
        var user_id = 'users/' + key;
        const users_edges = users_edge.byExample({ '_from': user_id }).toArray();
        //console.log(JSON.stringify(users_edges));
        var array = [];

        for (var i in users_edges) {
            array.push(users_edges[i]['_to']);
        }
        //const data = users.properties();
        const inv = db._query(aql`FOR key IN ${array} FOR i IN ${investigations} FILTER i._id == key RETURN i`).toArray();

        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${investigations}, key) RETURN d`).toArray();
        res.send(inv);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('userkey', joi.string().required(), 'userkey of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.post('/update_investigation', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var investigation_id = req.body.investigation_id;
    var investigation_key = req.body.investigation_key;
    var field = req.body.field;
    var value = req.body.value;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        const update = db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0] === value) {
            res.send({ success: true, message: 'document has been updated ' });//+JSON.stringify(edges) });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated ' + JSON.stringify(update) });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        investigation_id: joi.string().required(),
        investigation_key: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');



router.post('/check_investigation', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var field = req.body.field;
    var value = req.body.value;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        const update = db._query(aql` FOR entry IN ${investigations} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        //Document has been updated


        if (update.length === 0) {
            res.send({ success: true, message: 'investigation created' });//+JSON.stringify(edges) });
        }
        //No changes
        else {
            res.send({ success: false, message: 'investigation already exist, cannot use this \"investigation unique ID\" ' });//+JSON.stringify(update)});
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');





//Post new investigation
router.post('/add_investigation', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user_id = req.body.user_id;
    var investigation_values = req.body.investigation_values;


    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);
    if (user.next() === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else add to database
        /////////////////////////////
        const invests = db._query(aql`UPSERT ${investigation_values} INSERT ${investigation_values} UPDATE {}  IN ${investigations} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray();
        //console.log(invests);
        //Document doesn't exist
        if (invests[0].before === null) {
            //var inv_id=invests[0].id;
            var obj = {
                "_from": user_id,
                "_to": invests[0].id
            };
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${users_edge} RETURN NEW `);

            res.send({ success: true, message: 'Everything is good ', inv_key: invests[0].id });//+JSON.stringify(edges) });

        }
        //Document exists
        else {
            res.send({ success: false, message: 'Already have document with this title ', inv_key: 'none' });//+JSON.stringify(edges)});

        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        user_id: joi.string().required(),
        investigation_values: joi.object().required(),
    }).required(), 'Values to check.')
    //.response(joi.string().required(), 'response.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        inv_key: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');



/*****************************************************************************************
 ******************************************************************************************
 *********************************STUDY****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/


//Get STUDIES

router.get('/study', function (req, res) {
    const keys = db._query(aql`
    FOR entry IN ${study}
    RETURN entry
  `);

    res.send(keys.next());
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


// GET study by key
router.get('/study/:key', function (req, res) {
    try {
        var key = req.pathParams.key;
        //const array=[];
        const data = studies.firstExample('_key', key);


        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${investigations}, key) RETURN d`).toArray();
        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


// GET studies for a investigation
router.get('/studies/:invkey', function (req, res) {
    try {
        var key = req.pathParams.invkey;
        //const data = users.byExample({username : name});
        //users_edge.byExample({'_from':'users/1'}).toArray();
        var inv_key = 'investigations/' + key;
        const investigations_edges = investigations_edge.byExample({ '_from': inv_key }).toArray();
        //console.log(JSON.stringify(users_edges));
        var array = [];

        for (var i in investigations_edges) {
            array.push(investigations_edges[i]['_to']);
        }
        //const data = users.properties();
        const inv = db._query(aql`FOR key IN ${array} FOR i IN ${studies} FILTER i._id == key RETURN i`);

        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${investigations}, key) RETURN d`).toArray();
        res.send(inv);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('invkey', joi.string().required(), 'investigation key of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');










//Post study
router.post('/study', function (req, res) {
    //const data = req.body;
    var username = req.body.username;
    var password = req.body.password;
    var investigation_id = req.body.investigation_id;
    var study_values = req.body.study_values;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else add to database
        /////////////////////////////
        const studs = db._query(aql`UPSERT ${study_values} INSERT ${study_values} UPDATE {}  IN ${studies} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray();
        //console.log(studs)
        //Document doesn't exist
        if (studs[0].before === null) {
            //var inv_id=invests[0].id;
            var obj = {
                "_from": investigation_id,
                "_to": studs[0].id
            };
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${investigations_edge} RETURN NEW `);

            res.send({ success: true, message: 'everything is good ' });//+JSON.stringify(edges) });

        }
        //Document exists
        else {
            res.send({ success: false, message: 'already have document with this title ' + JSON.stringify(edges) });

        }
    };

})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        investigation_id: joi.string().required(),
        study_values: joi.object().required(),
    }).required(), 'Values to check.')
    //.response(joi.string().required(), 'response.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');

//update study
router.post('/update_study', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var study_id = req.body.study_id;
    var study_key = req.body.study_key;
    var field = req.body.field;
    var value = req.body.value;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        const update = db._query(aql` FOR entry IN ${studies} FILTER entry._id == ${study_id} UPDATE {_key:${study_key}} WITH {${field}: ${value}} IN ${studies} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0] === value) {
            res.send({ success: true, message: 'document has been updated ' });//+JSON.stringify(edges) });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated ' + JSON.stringify(update) });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        study_id: joi.string().required(),
        study_key: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');





/*****************************************************************************************
 ******************************************************************************************
 *********************************EVENT****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/



//Get EVENTS
router.get('/event', function (req, res) {
    const keys = db._query(aql`
    FOR entry IN ${event}
    RETURN entry
  `);

    res.send(keys.next());
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');







/*****************************************************************************************
 ******************************************************************************************
 *********************************OBSERVATION UNIT*****************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/


//Get INVESTIGATIONS
router.get('/observation_unit', function (req, res) {
    const keys = db._query(aql`
    FOR entry IN ${observation_unit}
    RETURN entry
  `);

    res.send(keys.next());
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

//
router.get('/observation_unit/:key', function (req, res) {
    try {
        var key = req.pathParams.key;
        //const array=[];
        const data = observation_units.firstExample('_key', key);


        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${observation_units}, key) RETURN d`).toArray();
        res.send(data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('key', joi.string().required(), 'username of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


// GET observation_units for a study
router.get('/observation_units/:studykey', function (req, res) {
    try {
        var key = req.pathParams.studykey;
        //const data = users.byExample({username : name});
        //users_edge.byExample({'_from':'users/1'}).toArray();
        var studykey = 'studies/' + key;
        const studies_edges = studies_edge.byExample({ '_from': studykey }).toArray();
        //console.log(JSON.stringify(users_edges));
        var array = [];

        for (var i in studies_edges) {
            array.push(studies_edges[i]['_to']);
        }
        //const data = users.properties();
        const inv = db._query(aql`FOR key IN ${array} FOR i IN ${observation_units} FILTER i._id == key RETURN i`).toArray();

        //const inv=db._query(aql`FOR key IN ${array} LET d = DOCUMENT(${observation_units}, key) RETURN d`).toArray();
        res.send(inv);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('studykey', joi.string().required(), 'studykey of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    //.response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.post('/update_observation_unit', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var observation_unit_id = req.body.observation_unit_id;
    var observation_unit_key = req.body.observation_unit_key;
    var field = req.body.field;
    var value = req.body.value;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
    `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if observation_unit exists else modify field
        /////////////////////////////
        const update = db._query(aql` FOR entry IN ${observation_units} FILTER entry._id == ${observation_unit_id} UPDATE {_key:${observation_unit_key}} WITH {${field}: ${value}} IN ${observation_units} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0] === value) {
            res.send({ success: true, message: 'document has been updated ' });//+JSON.stringify(edges) });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated ' + JSON.stringify(update) });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        observation_unit_id: joi.string().required(),
        observation_unit_key: joi.string().required(),
        field: joi.string().required(),
        value: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');


//Post new observation_unit
router.post('/observation_unit', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user_id = req.body.user_id;
    var observation_unit_values = req.body.observation_unit_values;


    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);
    if (user.next() === null) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        /////////////////////////////
        //now check if observation_unit exists else add to database
        /////////////////////////////
        const obs = db._query(aql`UPSERT ${observation_unit_values} INSERT ${observation_unit_values} UPDATE {}  IN ${observation_units} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray();
        console.log(obs);
        //Document doesn't exist
        if (obs[0].before === null) {
            //var inv_id=invests[0].id;
            var obj = {
                "_from": user_id,
                "_to": obs[0].id
            };
            const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${studies_edge} RETURN NEW `);

            res.send({ success: true, message: 'everything is good ' });//+JSON.stringify(edges) });

        }
        //Document exists
        else {
            res.send({ success: false, message: 'already have document with this title ' + JSON.stringify(edges) });

        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        user_id: joi.string().required(),
        observation_unit_values: joi.object().required(),
    }).required(), 'Values to check.')
    //.response(joi.string().required(), 'response.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');
