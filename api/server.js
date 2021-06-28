
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
//const queue1 = queues.create("my-queue");

// queue1.push(
//     { mount: "/xeml", name: "send-mail" },
//     { to: "bdartigues@gmail.com", body: "Hello world" }
// );


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

router.post('/authenticate', function (req, res) {
    //const values = req.body.values;
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

router.post('/register', function (req, res) {
    const data = req.body;
    //var username=req.body.username;
    var searchExpression = { "username": req.body.username, "password": req.body.password };
    var data_to_insert = { "username": req.body.username, "password": req.body.password, "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "tutoriel_step": 0 };

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

//this function is redundant with get_childs_by_model, probably not used.. to be remove
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

router.get('/get_vertices/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 ANY ${user_id} GRAPH 'global'  RETURN {e:e,s:s}`);
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

router.get('/get_data_file/:key', function (req, res) {
    try {
        var collection = req.pathParams.collection;
        var key = req.pathParams.key;
        var data = [];
        const coll = db._collection("data_files");
        if (!coll) {
            db._createDocumentCollection("data_files");
        }
        data = coll.firstExample('_key', key);
        var obj_to_send = {
            'page': 1,
            'per_page': 100,
            'total': data['Data'].lenght,
            'total_pages': data['Data'].lenght / 100,
            'data': data['Data']
        }
        res.send(obj_to_send);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');



router.get('/get_study_by_ID/:study_id/:parent_key', function (req, res) {
    try {
        var id = req.pathParams.study_id;
        var parent_key = req.pathParams.parent_key;
        var parent_id = "investigations/" + parent_key
        var data = [];
        var data_ids=[]
        //data_ids.push(parent_id)
        const coll = db._collection("studies");
        if (!coll) {
            db._createDocumentCollection(collection);
        }
        //data = coll.firstExample('Study unique ID', id);
        data = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global' FILTER CONTAINS(v['Study unique ID'], ${id}) RETURN {efrom:e._from,eto:e._to, study_id:v['Study unique ID'], v:v}`).toArray();
        data.forEach(element=>{
            data_ids.push(element.eto)
        })
        res.send({'study_ids':data_ids});
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }

})
    .pathParam('study_id', joi.string().required(), 'unique id.')
    .pathParam('parent_key', joi.string().required(), 'unique parent id.')
    .response(joi.array().items(joi.string().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


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


router.get('/get_data_filename/:parent_key/:model_type', function (req, res) {
    try {
        var investigation_key = req.pathParams.parent_key;
        var investigation_id = 'investigations/' + investigation_key
        var childs = db._query(aql`FOR v, e IN 1..2 OUTBOUND ${investigation_id} GRAPH 'global' FILTER CONTAINS(e._from, "studies") AND CONTAINS(e._to, "data_files") RETURN {efrom:e._from,eto:e._to, filename:v['Data file link'], associated_headers:v['associated_headers']}`).toArray();
        //var results = []
        if (childs[0].efrom != null) {
            //results.push(childs)
            res.send(childs);
        }
        else {
            res.throw(404, 'The entry does not exist', e);
        }
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }


}).pathParam('parent_key', joi.string().required(), 'investigation key required.')
    .pathParam('model_type', joi.string().required(), 'componet to find in data files.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.get('/get_all_data_files/:investigation_key/', function (req, res) {

    var investigation_key = req.pathParams.investigation_key;
    var investigation_id = 'investigations/' + investigation_key
    var childs = db._query(aql`FOR v, e IN 1..2 OUTBOUND ${investigation_id} GRAPH 'global' FILTER CONTAINS(e._from, "studies") AND CONTAINS(e._to, "data_files") RETURN {efrom:e._from,eto:e._to, filename:v['Data file link'], associated_headers:v['associated_headers']}`).toArray();
    var results = []
    if (childs[0] != null) {
        results.push(childs)
        var study_ids = db._query(aql`FOR v, e IN 1..2 OUTBOUND ${investigation_id} GRAPH 'global' FILTER CONTAINS(e._to, "studies") RETURN {study_id:e._to, study_label:v['Study unique ID']}`).toArray();
        if (study_ids[0].study_id != null) {
            results.push(study_ids)
        }
    }

    res.send(results);



}).pathParam('investigation_key', joi.string().required(), 'investigation key requested.')
    .response(joi.array().items(joi.array().items(joi.object().required()).required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


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

// GET data model using parent model key 
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


router.post('/upload_data', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.data;
    const edge = db._collection("studies_edge");
    var coll = db._collection("data_files");
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
        res.send(data);
    }
    
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        data: joi.object().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        inv_key: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and add metadata file in MIAPPE model.');



router.post('/upload', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.obj;
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
})
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
    .summary('List entry keys')
    .description('check if user exist and add metadata file in MIAPPE model.');


router.post('/compare_component', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_key = req.pathParams.parent_key;
    var parent_model_type = 'study';
    var model_type = req.pathParams.model_type;
    // input document 1
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


        var update = db._query(aql`
        LET doc = {
            age: 27,
            active: true
        }
        LET doc2 = {
            name:"jane",
            age: 27,
            active: true
        }
        RETURN MATCHES(doc, doc2) AND LENGTH(doc) == LENGTH(doc2)
        `).toArray();
    }
}).body(joi.object({
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
    .summary('List entry keys')
    .description('check if user exist and add metadata file in MIAPPE model.');




router.post('/update_associated_headers_linda_id', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var datafile_id = req.body.datafile_id;
    var header = req.body.header;
    var value = req.body.value;
    var collection = req.body.collection;

    const coll = db._collection(collection);
    if (!coll) {
        db._createDocumentCollection(collection);
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
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {

        /*
        get all data file and change associated_linda_id in associated headers for datafile_id
        */

        // var update = db._query(aql`
        // FOR document in ${coll}
        //   FILTER document._id == ${_id}
        //   LET alteredList = (
        //     FOR element IN document.associated_headers
        //        LET newItem = (! element.header == ${header} ?
        //                       element :
        //                       MERGE(element, { associated_linda_id: ${value} }))
        //        RETURN newItem)
        //   UPDATE document WITH { associated_headers:  alteredList } IN ${coll}
        //   RETURN { before: OLD, after: NEW }`).toArray();


        var update = db._query(aql`
                FOR document in ${coll}
                    FILTER document._id == ${datafile_id}
                    LET alteredList = (
                        FOR element IN document.associated_headers
                            LET newItem = (
                                element.header == ${header} ? MERGE(element, { associated_linda_id: ${value} }) : element
                            )
                            RETURN newItem
                    )
                UPDATE document WITH { associated_headers:  alteredList } IN ${coll}
                RETURN { before: OLD, after: NEW }`).toArray();




        /*
        get all data file and change whole associated headers for datafile_id
        */
        //var update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE entry WITH {associated_headers: ${values}} IN ${coll} RETURN { before: OLD, after: NEW }`).toArray();            
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
        datafile_id: joi.string().required(),
        header: joi.string().required(),
        value: joi.string().required(),
        collection: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


router.post('/remove_associated_headers_linda_id', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _id = req.body._id;
    var removed_ids = req.body.removed_ids;
    var collection = req.body.collection;

    const coll = db._collection(collection);
    if (!coll) {
        db._createDocumentCollection(collection);
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
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        for (removed_id in removed_ids) {
            var update = db._query(aql`
                        FOR document in ${coll}
                            FILTER document._id == ${_id}
                            LET alteredList = (
                                FOR element IN document.associated_headers
                                    LET newItem = (
                                        element.associated_linda_id == ${removed_id} ? MERGE(element, { associated_linda_id: "" }) : element
                                    )
                                    RETURN newItem
                            )
                        UPDATE document WITH { associated_headers:  alteredList } IN ${coll}
                        RETURN { before: OLD, after: NEW }`).toArray();
        }
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
        _id: joi.string().required(),
        removed_ids: joi.string().required(),
        collection: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');



router.post('/update_associated_headers', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _id = req.body._id;
    var values = req.body.values;
    var collection = req.body.collection;

    const coll = db._collection(collection);
    if (!coll) {
        db._createDocumentCollection(collection);
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
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists' });
    }
    else {
        // var update = [];
        var update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE entry WITH {associated_headers: ${values}} IN ${coll} RETURN { before: OLD, after: NEW }`).toArray();
        //update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE entry WITH ${values} IN ${coll} RETURN { before: OLD, after: NEW }`).toArray();

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
        _id: joi.string().required(),
        values: joi.array().items(joi.object().required()).required(),
        collection: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');

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
        else if (model_type === 'data_file') {
            _id = 'data_files/' + _key;
            update = db._query(aql` FOR entry IN ${data_files} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${data_files} RETURN NEW.${field}`).toArray();
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


router.post('/remove_childs', function (req, res) {
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

        // //Remove relation for parent of selected node parent in edge collection
        // var parent = db._query(aql`FOR v, e IN 1..1 INBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        // var parent_edge_coll = parent[0].e_id.split("/")[0];
        // var parent_key = parent[0].e_key;
        // try {
        //     db._query(`REMOVE "${parent_key}" IN ${parent_edge_coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + parent[0].e_id);
        // }

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
        // var key = id.split('/')[1];
        // var coll = id.split('/')[0];
        // try {
        //     db._query(`REMOVE "${key}" IN ${coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + id);
        // }
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




router.post('/remove_association', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    var datafile_id = req.body.datafile_id;
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
        try {

            const data_file_coll = db._collection('data_files');
            if (!data_file_coll) {
                db._createDocumentCollection(datatype);
            }

            var update = db._query(aql`
                        
                        LET document = DOCUMENT(${datafile_id})
                        LET alteredList = (
                                FOR element IN document.associated_headers
                                    LET newItem = (
                                        element.associated_linda_id == ${id} ? MERGE(element, { associated_linda_id: "" }) : element
                                    )
                                    RETURN newItem
                            )
                        UPDATE document WITH { associated_headers:  alteredList } IN ${data_file_coll}
                        RETURN { before: OLD, after: NEW }`).toArray();
        }
        catch (e) {
            errors.push(e + " " + id);
        }
        if (errors.length === 0) {
            res.send({ success: true, message: ["No errors detected"], datafile_treated: id });
        }
        else {
            res.send({ success: false, message: errors, datafile_treated: id });
        }
    }

}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    id: joi.string().required(),
    datafile_id:joi.string().required()
}).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.array().items(joi.string().required()).required(),
        datafile_treated: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');

router.post('/remove_childs_by_type_and_id', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    var model_type = req.body.model_type;
    var model_id = req.body.model_id;
    var datatype = "";
    if (model_type === "study") {
        datatype = "studies";
    }
    else {
        datatype = model_type + "s";
    }
    // if (!coll) {
    //     db._createDocumentCollection(datatype);
    // }

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

        // //Remove relation for parent of selected node parent in edge collection
        // var parent = db._query(aql`FOR v, e IN 1..1 INBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        // var parent_edge_coll = parent[0].e_id.split("/")[0];
        // var parent_key = parent[0].e_key;
        // try {
        //     db._query(`REMOVE "${parent_key}" IN ${parent_edge_coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + parent[0].e_id);
        // }
        //get all childs and remove in collection document and edges
        var childs = db._query(aql`FOR v, e IN 1..4 OUTBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        //Remove all childs for selected node
        var datafile_ids = []
        var removed_ids = []
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === 'data_files') {
                datafile_ids.push(childs[i].v_id)

            }
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === datatype  && childs[i].v_id===model_id ) {
                // If observed variable, reset all associated_linda_id
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
                removed_ids.push(childs[i].v_id)
            }
            //Delete child edge in edge collection
        }
        //Remove selected node
        // var key = id.split('/')[1];
        // var coll = id.split('/')[0];
        // try {
        //     db._query(`REMOVE "${key}" IN ${coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + id);
        // }
        //Delete selected document and the egde in the parent collection edge  
        if (errors.length === 0) {
            res.send({ success: true, message: ["No errors detected"], datafile_ids: datafile_ids, removed_ids: removed_ids });
        }
        else {
            res.send({ success: false, message: errors, datafile_ids: [], removed_ids: removed_ids });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        id: joi.string().required(),
        model_type: joi.string().required(),
        model_id: joi.string().required(),
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.array().items(joi.string().required()).required(),
        datafile_ids: joi.array().items(joi.string().required()).required(),
        removed_ids: joi.array().items(joi.string().required()).required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');


router.post('/remove_childs_by_type', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    var model_type = req.body.model_type;
    var datatype = "";
    if (model_type === "study") {
        datatype = "studies";
    }
    else {
        datatype = model_type + "s";
    }
    // if (!coll) {
    //     db._createDocumentCollection(datatype);
    // }

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

        // //Remove relation for parent of selected node parent in edge collection
        // var parent = db._query(aql`FOR v, e IN 1..1 INBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        // var parent_edge_coll = parent[0].e_id.split("/")[0];
        // var parent_key = parent[0].e_key;
        // try {
        //     db._query(`REMOVE "${parent_key}" IN ${parent_edge_coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + parent[0].e_id);
        // }
        //get all childs and remove in collection document and edges
        var childs = db._query(aql`FOR v, e IN 1..4 OUTBOUND ${id} GRAPH 'global' RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        //Remove all childs for selected node
        var datafile_ids = []
        var removed_ids = []
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === 'data_files') {
                datafile_ids.push(childs[i].v_id)

            }
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === datatype) {
                // If observed variable, reset all associated_linda_id
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
                removed_ids.push(childs[i].v_id)
                try {

                    const data_file_coll = db._collection('data_files');
                    if (!data_file_coll) {
                        db._createDocumentCollection(datatype);
                    }

                    var update = db._query(aql`
                            FOR document in ${data_file_coll}
                                LET alteredList = (
                                    FOR element IN document.associated_headers
                                        LET newItem = (
                                            element.associated_linda_id == ${childs[i].v_id} ? MERGE(element, { associated_linda_id: "" }) : element
                                        )
                                        RETURN newItem
                                )
                            UPDATE document WITH { associated_headers:  alteredList } IN ${data_file_coll}
                            RETURN { before: OLD, after: NEW }`).toArray();
                }
                catch (e) {
                    errors.push(e + " " + childs[i].v_id);
                }

            }
            //Delete child edge in edge collection
        }
        //Remove selected node
        // var key = id.split('/')[1];
        // var coll = id.split('/')[0];
        // try {
        //     db._query(`REMOVE "${key}" IN ${coll}`);
        // }
        // catch (e) {
        //     errors.push(e + " " + id);
        // }
        //Delete selected document and the egde in the parent collection edge  
        if (errors.length === 0) {
            res.send({ success: true, message: ["No errors detected"], datafile_ids: datafile_ids, removed_ids: removed_ids });
        }
        else {
            res.send({ success: false, message: errors, datafile_ids: [], removed_ids: removed_ids });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        id: joi.string().required(),
        model_type: joi.string().required(),
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.array().items(joi.string().required()).required(),
        datafile_ids: joi.array().items(joi.string().required()).required(),
        removed_ids: joi.array().items(joi.string().required()).required()
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


//Post new data
router.post('/add', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var as_template = req.body.as_template;


    var datatype = "";
    if (model_type === "study") {
        datatype = "studies";
    }
    else {
        datatype = model_type + "s";
    }
    var coll = db._collection(datatype);
    if (!coll) {
        db._createDocumentCollection(datatype);
    }

    var parent_type = parent_id.split("/")[0];
    var edge_coll = parent_type + '_edge'
    if (!db._collection(edge_coll)) {
        db._createEdgeCollection(edge_coll);
    }
    const edge = db._collection(edge_coll);

    var errors = []
    var successes = []
    var final_data = []

    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `).toArray();
    if (user[0] === null) {

        /////////////////////////////
        //first check if user exist
        /////////////////////////////
        //     const user = db._query(aql`
        //     FOR entry IN ${users}
        //     FILTER entry.username == ${username}
        //     FILTER entry.password == ${password}
        //     RETURN entry
        //   `);
        //     if (user.next() === null) {
        errors.push({ success: false, message: 'Username ' + username + ' doesn\'t exists' })

        ///res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists' });
    }
    else {

        /////////////////////////////
        //add template
        /////////////////////////////
        if (as_template) {
            if (!db._collection(model_type + "_templates")) {
                db._createDocumentCollection(model_type + "_templates");
            }
            var template_coll = db._collection(model_type + "_templates");

            var template_edge_coll = 'templates_edge'
            if (!db._collection(template_edge_coll)) {
                db._createEdgeCollection(template_edge_coll);
            }
            const template_edge = db._collection(template_edge_coll);

            var data = [];
            var cleaned_values = { ...values }
            if (cleaned_values['Study unique ID']) {
                cleaned_values['Study unique ID'] = ""
            }
            if (cleaned_values['Investigation unique ID']) {
                cleaned_values['Investigation unique ID'] = ""
            }
            data = db._query(aql`INSERT ${cleaned_values} IN ${template_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

            //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
            if (data[0].new !== null) {
                var edge_obj = {
                    "_from": user[0]._id,
                    "_to": data[0].id
                };
                const edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${template_edge} RETURN NEW `);
                //res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
                successes.push({ success: true, message: 'Everything is good for template saving', _id: data[0].id })
            }
            //Document exists
            else {
                ///res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
                errors.push({ success: false, message: model_type + ' collection already have document with this title ', _id: null })
            }
        }




        /////////////////////////////
        //now check if investigation exists else add to database
        /////////////////////////////
        var data = [];
        data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        if (model_type !== 'observation_unit') {
            // var data = [];
            // data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

            //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

            if (data[0].new === null) {
                //res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
                errors.push({ success: false, message: model_type + ' collection already have document with this title ', _id: null })


            }
            //Document exists add edges in edge collection
            else {
                var obj = {
                    "_from": parent_id,
                    "_to": data[0].id,
                };

                const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
                ///res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
                successes.push({ success: true, message: 'Everything is good for adding ' + as_template, _id: data[0].id })
            }
        }
    };
    if (errors.length === 0) {
        if (as_template) {
            res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_id: successes[0]._id, _id: successes[1]._id });

        }
        else {
            res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_id: null, _id: successes[0]._id });

        }
    }
    else {
        res.send({ success: false, message: model_type + ' collection already have document with this title ', res_obj: errors, template_id: "", _id: "" });
    }

})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required(),
        as_template: joi.boolean().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required(),
        template_id: joi.string().required(),
        _id: joi.string().required()
    }).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');


//Post new data
router.post('/add_parent_and_child', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var child_values = req.body.child_values;
    var model_type = req.body.model_type;
    var child_model_type = req.body.child_model_type;



    var datatype = "";
    var child_datatype = "";
    if (model_type === "study") {
        datatype = "studies";
        child_datatype = child_model_type + "s";
    }
    else {
        datatype = model_type + "s";
        if (model_type === "investigation") {
            child_datatype = "studies";
        }
    }

    var coll = db._collection(datatype);
    if (!coll) {
        db._createDocumentCollection(datatype);
    }
    var child_coll = db._collection(child_datatype);
    if (!child_coll) {
        db._createDocumentCollection(child_datatype);
    }

    var parent_type = parent_id.split("/")[0];

    var edge_coll = parent_type + '_edge'
    if (!db._collection(edge_coll)) {
        db._createEdgeCollection(edge_coll);
    }
    const edge = db._collection(edge_coll);

    var child_edge_coll = datatype + '_edge'
    if (!db._collection(child_edge_coll)) {
        db._createEdgeCollection(child_edge_coll);
    }
    const child_edge = db._collection(child_edge_coll);

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

        if (model_type === 'study') {
            var check = [];
            var ID = values['Study unique ID']
            //Search unique id in studies collection for this parent id ??? 
            //check = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global'  FILTER v['Study unique ID'] == ${ID}  RETURN {v_id:v._id,id:v['Study unique ID'], study:v}`).toArray();
            check = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global'  FILTER CONTAINS(v['Study unique ID'], ${ID})  RETURN {v_id:v._id,id:v['Study unique ID'], study:v}`).toArray();

            
            //check = db._query(aql` FOR entry IN ${coll} FILTER entry['Study unique ID'] == ${ID} RETURN entry`).toArray()
            // ID was not found
            if (check.length === 0) {
                var data = [];
                data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();
                if (data[0].new === null) {
                    res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
                }
                //Document exists add edges in edge collection
                else {
                    //parent has been inserted
                    var obj = {
                        "_from": parent_id,
                        "_to": data[0].id,
                    };

                    const parent_edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);

                    var child_data = [];
                    Object.keys(child_values['associated_headers']).forEach(key => {
                        if (child_values['associated_headers'][key]['associated_component'] === 'study') {
                            child_values['associated_headers'][key]['associated_linda_id'] = data[0].id
                        }
                    }

                    )
                    child_data = db._query(aql`INSERT ${child_values} IN ${child_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

                    if (child_data[0].new === null) {
                        res.send({ success: false, message: child_model_type + ' collection already have document with this title ', _id: 'none' });
                    }
                    else {
                        //parent has been inserted
                        var child_obj = { "_from": data[0].id, "_to": child_data[0].id, };
                        const child_edges = db._query(aql`UPSERT ${child_obj} INSERT ${child_obj} UPDATE {}  IN ${child_edge} RETURN NEW `);
                        res.send({ success: true, message: 'Everything is good ', _id: child_data[0].id });

                    }
                }
            }
            // ID was not found
            else {
                var child_data = [];
                ////insert datafile in data_files_coll
                child_data = db._query(aql`INSERT ${child_values} IN ${child_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

                if (child_data[0].new === null) {
                    res.send({ success: false, message: child_model_type + ' collection already have document with this title ', _id: 'none' });
                }
                else {
                    //parent has been inserted
                    var child_obj = {
                        "_from": check[0]['v_id'],
                        "_to": child_data[0].id,
                    };
                    const child_edges = db._query(aql`UPSERT ${child_obj} INSERT ${child_obj} UPDATE {}  IN ${child_edge} RETURN NEW `);
                    res.send({ success: true, message: 'Everything is good ', _id: child_data[0].id });

                }

            }
            // var data = [];
            // data = db._query(aql`INSERT ${values} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

            //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 


            // if (data[0].new === null) {
            //     res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
            // }
            // //Document exists add edges in edge collection
            // else {
            //     //parent has been inserted
            //     var obj = {
            //         "_from": parent_id,
            //         "_to": data[0].id,
            //     };

            //     const parent_edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);

            //     var child_data = [];
            //     child_data = db._query(aql`INSERT ${child_values} IN ${child_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

            //     if (child_data[0].new === null) {
            //         res.send({ success: false, message: child_model_type + ' collection already have document with this title ', _id: 'none' });
            //     }
            //     else{
            //         //parent has been inserted
            //         var child_obj = {"_from": data[0].id,"_to": child_data[0].id,};
            //         const child_edges = db._query(aql`UPSERT ${child_obj} INSERT ${child_obj} UPDATE {}  IN ${child_edge} RETURN NEW `);
            //         res.send({ success: true, message: 'Everything is good ', _id: child_data[0].id });

            //     }
            // }
        }
    };
}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    parent_id: joi.string().required(),
    values: joi.object().required(),
    child_values: joi.object().required(),
    model_type: joi.string().required(),
    child_model_type: joi.string().required()
}).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        _id: joi.string().required()
    }).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');


router.post('/add_multi', function (req, res) {
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
    var coll = db._collection(datatype);
    if (!coll) {
        db._createDocumentCollection(datatype);
    }

    var parent_type = parent_id.split("/")[0];
    var edge_coll = parent_type + '_edge'
    if (!db._collection(edge_coll)) {
        db._createEdgeCollection(edge_coll);
    }
    const edge = db._collection(edge_coll);


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
        var errors = []
        var success = []
        for (var value in values) {
            var data = [];
            data = db._query(aql`INSERT ${value} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

            if (model_type !== 'observation_unit') {
                // var data = [];
                // data = db._query(aql`INSERT ${value} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();

                //data =db._query(aql`UPSERT ${value} INSERT ${value} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

                if (data[0].new === null) {
                    errors.push({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' })
                }
                //Document exists add edges in edge collection
                else {
                    success.push({ success: true, message: 'Everything is good ', _id: data[0].id })
                    var obj = {
                        "_from": parent_id,
                        "_to": data[0].id,
                    };

                    const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
                    //res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
                }
            }
        }
        if (errors.length === 0) {
            res.send({ success: true, message: 'Everything is good ', res_obj: success });
        }
        else {
            res.send({ success: false, message: model_type + ' collection already have document with this title ', res_obj: errors });
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.array().items(joi.object().required()).required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.array().items(joi.object({
        success: true,
        message: joi.string().required(),
        res_obj: joi.string().required()
    }).required()).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');



router.post('/check_one_exists', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    var coll_name = "";
    if (model_type === "study") {
        coll_name = "studies";
    }
    else {
        coll_name = model_type + "s";
    }
    var coll = db._collection(coll_name);
    if (!coll) {
        db._createDocumentCollection(coll_name);
    }

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
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists', _id: "" });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        var check = [];
        check = db._query(aql` FOR entry IN ${coll} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        if (check.length === 1) {
            res.send({
                success: true,
                message: 'data doesn\'t exists',
                _id: ""
            });
        }
        else {
            res.send({
                success: false,
                message: 'data already exist, cannot use this \" model unique ID\" ',
                _id: check[0]['_id']
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
        message: joi.string().required(),
        _id: ""
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');


router.post('/check', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    var coll_name = "";
    if (model_type === "study") {
        coll_name = "studies";
    }
    else {
        coll_name = model_type + "s";
    }
    var coll = db._collection(coll_name);
    if (!coll) {
        db._createDocumentCollection(coll_name);
    }

    if (value === '') {
        res.send({ success: false, message: 'nothing in value' });
    }

    const user = db._query(aql`FOR entry IN ${users} FILTER entry.username == ${username} FILTER entry.password == ${password} RETURN entry`).toArray();
    
    if (user.length === 0) {
        res.send({ success: false, message: 'username ' + username + 'doesn\'t exists', _id: "" });
    }
    else {
        /////////////////////////////
        //now check if investigation exists else modify field
        /////////////////////////////
        var check = [];
        var user_id=user[0]._id
        check = db._query(aql`FOR v, e IN 1..3 OUTBOUND ${user_id} GRAPH 'global' FILTER v.${field} == ${value} RETURN {eto:e._to, vertice:v}`).toArray();
        //check = db._query(aql`FOR v, e IN 1..2 OUTBOUND ${user_id} GRAPH 'global' FILTER CONTAINS(e._to, ${coll}) AND v.${field} === ${value} RETURN {eto:e._to, vertice:v}`).toArray();
        //check = db._query(aql` FOR entry IN ${coll} FILTER entry.${field} == ${value} RETURN entry`).toArray()
        if (check.length === 0) {
            res.send({
                success: true,
                message: 'data doesn\'t exists',
                _id: ""
            });
        }
        else {
            res.send({
                success: false,
                message: 'data already exist, cannot use this \" model unique ID\" ',
                _id: check[0]['vertice']['_id']
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
        message: joi.string().required(),
        _id: ""
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');


/*****************************************************************************************
 ******************************************************************************************
 *********************************INVESTIGATIONS*******************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/




/*****************************************************************************************
 ******************************************************************************************
 *********************************STUDY****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/




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


//Post new data
router.post('/add_observation_units', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;

    //Studies edge 
    var parent_type = parent_id.split("/")[0];
    var study_edge_coll = parent_type + '_edge'
    if (!db._collection(study_edge_coll)) {
        db._createEdgeCollection(study_edge_coll);
    }
    var studies_edge = db._collection(study_edge_coll);


    var datatype = "observation_units";

    //observation unit edge 
    var observation_unit_edge_coll = datatype + '_edge'
    if (!db._collection(observation_unit_edge_coll)) {
        db._createEdgeCollection(observation_unit_edge_coll);
    }
    var observation_unit_edge = db._collection(observation_unit_edge_coll);

    //observation units collection 
    var observation_unit_coll = db._collection(datatype);
    if (!observation_unit_coll) {
        db._createDocumentCollection(datatype);
    }

    // var datatype = "experimental_factors";
    //  //experimental factor edge 
    //  var experimental_factor_edge_coll = datatype + '_edge'
    //  if (!db._collection(experimental_factor_edge_coll)) {
    //      db._createEdgeCollection(experimental_factor_edge_coll);
    //  }
    //  var experimental_factor_edge = db._collection(experimental_factor_edge_coll);

    var sample_coll_name = 'samples'
    //samples collection 
    var sample_coll = db._collection(sample_coll_name);
    if (!sample_coll) {
        db._createDocumentCollection(sample_coll_name);
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
        var data = [];
        var observation_unit_doc = { "External ID": [], "Observation Unit factor value": [], "Observation unit ID": [], "Observation unit type": [], "Spatial distribution": [], "obsUUID": [] }
        //var return_data = {"observation_units":[],"biological_materials":[],"samples":[], "experimental_factor":[] }
        var observation_units_data = values['observation_units'];
        for (var observation_unit in observation_units_data) {
            observation_unit_doc["External ID"].push(observation_units_data[observation_unit]['External ID']);
            observation_unit_doc["Observation unit ID"].push(observation_units_data[observation_unit]['Observation unit ID']);
            observation_unit_doc["Observation Unit factor value"].push(observation_units_data[observation_unit]['Observation Unit factor value']);
            observation_unit_doc["Observation unit type"].push(observation_units_data[observation_unit]['Observation unit type']);
            observation_unit_doc["Spatial distribution"].push(observation_units_data[observation_unit]['Spatial distribution']);
            observation_unit_doc["obsUUID"].push(observation_units_data[observation_unit]['obsUUID']);
        }
        data = db._query(aql`INSERT ${observation_unit_doc} IN ${observation_unit_coll} RETURN { new: NEW, id: NEW._id } `).toArray();
        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 

        //res.send({ success: true, message: 'Everything is good ', _id: 'none' });
        if (data[0].new === null) {
            res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
        }
        //Document exists add edges in edge collection
        else {

            //add from studdy to observation unit edge
            var obj = {
                "_from": parent_id,
                "_to": data[0].id
                // "material_ids": [],
                // "biological_material_ids": []
            };
            var edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${studies_edge} RETURN NEW `);

            if (edges[0] === null) {
                res.send({ success: false, message: model_type + ' study edge collection already have document with this title ', id: 'none' });
            }
            else {

                for (var i = 0; i < observation_units_data.length; i++) {


                    var biological_material_data = values['biological_materials'][i];
                    var bm_db_id = ''
                    var bm_obj = {}
                    //add biological_material link to observation unit edge 
                    for (var j = 0; j < biological_material_data.length; j++) {
                        if (biological_material_data[j]['lindaID'] !== bm_db_id) {
                            if (bm_db_id !== '') {
                                db._query(aql`UPSERT ${bm_obj} INSERT ${bm_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                            }
                            bm_db_id = biological_material_data[j]['lindaID']
                            bm_obj = {
                                "_from": data[0].id,
                                "_to": bm_db_id,
                                "biological_materials": []
                            }
                            bm_obj["biological_materials"].push(biological_material_data[j])


                        }
                        else {
                            bm_obj["biological_materials"].push(biological_material_data[j])



                        }

                    }
                    if ("_from" in bm_obj) {
                        db._query(aql`UPSERT ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
                    }


                    //create sample document and add to observation unit edge
                    var sample_data = values['samples'][i];
                    for (var j = 0; j < sample_data.length; j++) {
                        var sample_data_bm = sample_data[j]
                        for (var k = 0; k < sample_data_bm.length; k++) {
                            var data_sample = []
                            data_sample = db._query(aql`INSERT ${sample_data_bm[k]} IN ${sample_coll} RETURN { new: NEW, id: NEW._id } `).toArray();
                            if (data_sample[0].new === null) {
                                res.send({ success: false, message: ' sample collection already have document with this title ', _id: 'none' });
                            }
                            //Document exists add edges in edge collection
                            else {
                                var sample_obj = {
                                    "_from": data[0].id,
                                    "_to": data_sample[0].id,
                                }
                                var edges3 = db._query(aql`UPSERT ${sample_obj} INSERT ${sample_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);

                            }
                        }

                    }

                    //Add experimental factor link with each observation unit
                    var experimental_factor_data = values['experimental_factors'][i];
                    var ef_db_id = ''
                    var ef_obj = {}
                    for (var j = 0; j < experimental_factor_data.length; j++) {
                        if (experimental_factor_data[j]['lindaID'] !== ef_db_id) {
                            if (ef_db_id !== '') {
                                db._query(aql`UPSERT ${ef_obj} INSERT ${ef_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                            }
                            ef_db_id = experimental_factor_data[j]['lindaID']
                            ef_obj = {
                                "_from": data[0].id,
                                "_to": ef_db_id,
                                "experimental_factors": []
                            }
                            ef_obj["experimental_factors"].push(experimental_factor_data[j])
                        }
                        else {
                            ef_obj["experimental_factors"].push(experimental_factor_data[j])
                        }
                    }
                    if ("_from" in ef_obj) {
                        db._query(aql`UPSERT ${ef_obj} INSERT ${ef_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
                    }
                }
                res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
            }
        }
    };
})
    .body(joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.object({
            observation_units: joi.array().items(joi.object().required()).required(),
            biological_materials: joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).optional(),
            samples: joi.array().items(joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).allow(null)).optional(),
            experimental_factors: joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).optional()
        }).required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object().keys({
        success: joi.boolean().required(),
        message: joi.string().required(),
        _id: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');



router.post('/remove_observation_unit', function (req, res) {
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

        //Remove relation with study parent of selected node in parent edge collection
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
                if (childs[i].v_id.split("/")[0] !== "biological_materials" && childs[i].v_id.split("/")[0] !== "experimental_factors") {
                    var child_coll = childs[i].v_id.split("/")[0];
                    var child_vkey = childs[i].v_key;
                    try {
                        db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                    }
                    catch (e) {
                        errors.push(e + " " + childs[i].v_id);
                    }
                }
            }
            //Delete child edge in collection edge
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

function update_unused_bm_from_obsUUID(db, observation_unit_edge, observation_unit_id, obsuuid_toremoved) {
    //Removed unused bm edge document in observation unit edge collection after observation was removed
    var regex = "biological_materials%"
    var doc_with_uuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} && ${obsuuid_toremoved} IN doc.biological_materials[*].obsUUID  RETURN doc`).toArray();
    for (var j = 0; j < doc_with_uuids.length; j++) {
        let doc = doc_with_uuids[j]
        let bm_obj = {
            "_from": doc._from,
            "_to": doc._to,
            "biological_materials": []
        }
        for (var k = 0; k < doc.biological_materials.length; k++) {
            if (doc.biological_materials[k].obsUUID !== obsuuid_toremoved) {
                bm_obj.biological_materials.push(doc.biological_materials[k])
            }
        }
        if (bm_obj.biological_materials.length === 0) {
            db._query(`REMOVE "${doc._key}" IN ${observation_unit_edge_coll}`);
        }
        else {
            db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${doc._to}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
        }
    }
}
function update_unused_ef_from_obsUUID(db, observation_unit_edge, observation_unit_id, obsuuid_toremoved) {
    //Removed unused ef edge document in observation unit edge collection after observation was removed
    var regex = "experimental_factors%"
    var doc_with_uuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} && ${obsuuid_toremoved} IN doc.experimental_factors[*].obsUUID  RETURN doc`).toArray();
    for (var j = 0; j < doc_with_uuids.length; j++) {
        let doc = doc_with_uuids[j]
        let ef_obj = {
            "_from": doc._from,
            "_to": doc._to,
            "experimental_factors": []
        }
        for (var k = 0; k < doc.experimental_factors.length; k++) {
            if (doc.experimental_factors[k].obsUUID !== obsuuid_toremoved) {
                ef_obj.experimental_factors.push(doc.experimental_factors[k])
            }
        }
        if (bm_obj.experimental_factors.length === 0) {
            db._query(`REMOVE "${doc._key}" IN ${observation_unit_edge_coll}`);
        }
        else {
            db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${doc._to}  UPDATE entry WITH ${ef_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
        }
    }

}
function update_unused_sample_from_obsUUID(db, observation_unit_edge, observation_unit_id, sample_coll, obsuuid_toremoved) {
    //Removed unused sample doc and sample edge doc in observation unit edge collection after observation was removed
    var sample_with_obsuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsuuid_toremoved} RETURN {id:doc._id}`).toArray();
    for (var j = 0; j < sample_with_obsuuids.length; j++) {
        var doc = sample_with_obsuuids[j]
        db._query(`REMOVE "${doc.id}" IN ${sample_coll}`);
        var key = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to==${doc.id} RETURN doc._key`).toArray();
        db._query(`REMOVE "${key[0]}" IN ${observation_unit_edge_coll}`);
    }
}
function update_unused_ef_from_efUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, efuuid_to_removed, regex) {
    var doc_with_uuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} && ${efuuid_to_removed} IN doc.experimental_factors[*].efUUID  RETURN doc`).toArray();
    let doc = doc_with_uuids[0]
    let ef_obj = {
        "_from": doc._from,
        "_to": doc._to,
        "experimental_factors": []
    }
    for (var k = 0; k < doc.experimental_factors.length; k++) {
        if (doc.experimental_factors[k].efUUID !== efuuid_to_removed) {
            ef_obj.experimental_factors.push(doc.experimental_factors[k])
        }
    }
    if (ef_obj.experimental_factors.length === 0) {
        db._query(`REMOVE "${doc._key}" IN ${observation_unit_edge_coll}`);
    }
    else {
        db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${doc._to}  UPDATE entry WITH ${ef_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
    }
}
function update_unused_bm_from_bmUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, bmuuid_to_removed, regex) {
    var doc_with_uuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} && ${bmuuid_to_removed} IN doc.biological_materials[*].bmUUID  RETURN doc`).toArray();
    let doc = doc_with_uuids[0]
    let bm_obj = {
        "_from": doc._from,
        "_to": doc._to,
        "biological_materials": []
    }
    for (var k = 0; k < doc.biological_materials.length; k++) {
        if (doc.biological_materials[k].bmUUID !== bmuuid_to_removed) {
            bm_obj.biological_materials.push(doc.biological_materials[k])
        }
    }
    if (bm_obj.biological_materials.length === 0) {
        db._query(`REMOVE "${doc._key}" IN ${observation_unit_edge_coll}`);
    }
    else {
        db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${doc._to}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
    }
}
function update_unused_sample_from_bmUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, sample_coll, bmuuid_to_removed) {
    var sample_with_bmuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.bmUUID == ${bmuuid_to_removed} RETURN {id:doc._id}`).toArray();
    for (var j = 0; j < sample_with_bmuuids.length; j++) {
        var doc = sample_with_bmuuids[j]
        db._query(`REMOVE "${doc.id}" IN ${sample_coll}`);
        var key = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to==${doc.id} RETURN doc._key`).toArray();
        db._query(`REMOVE "${key[0]}" IN ${observation_unit_edge_coll}`);
    }
}
function update_unused_sample_from_sampleUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, sample_coll, sample_coll_name, sampleuuid_to_removed, info_message) {
    //Removed unused sample doc and sample edge doc in observation unit edge collection after observation was removed
    var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.sampleUUID == ${sampleuuid_to_removed} RETURN {key:doc._key, id:doc._id}`).toArray();
    var doc = sample_with_sampleuuids[0]
    //info_message.push("4- errors: " + doc.key)
    var samplekey = doc.key
    var sampleid = doc.id
    try {
        db._query(`REMOVE "${samplekey}" IN ${sample_coll_name}`);
        var key = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to==${sampleid} RETURN doc._key`).toArray();
        db._query(`REMOVE "${key[0]}" IN ${observation_unit_edge_coll}`);

    }
    catch (e) {
        info_message.push("4- errors: " + e)

    }
    // for (var j = 0; j < sample_with_sampleuuids.length; j++) {
    //     var doc=sample_with_sampleuuids[j]
    //     info_message.push("4- sample with sampleuuids: " + doc.id + " 4- sample_with_sampleuuids length: " +sample_with_sampleuuids.length)
    //     // var sampleid=doc.id
    //     // try {
    //     //     db._query(`REMOVE "${sampleid}" IN ${sample_coll}`);

    //     // }
    //     // catch(e){
    //     //     info_message.push("4- errors: " + e)

    //     // }
    // //     var key = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to==${doc.id} RETURN doc._key`).toArray();
    // //     db._query(`REMOVE "${key[0]}" IN ${observation_unit_edge_coll}`);
    // }
}
function add_ef_data(db, all_ef, observation_unit_edge, observation_unit_id, info_message) {
    var unique_lindaIDs = [...new Set(all_ef.map(item => item.lindaID))];
    //info_message.push("4- linda ids: " + unique_lindaIDs)

    for (var j = 0; j < unique_lindaIDs.length; j++) {
        let ef_obj = {
            "_from": observation_unit_id,
            "_to": unique_lindaIDs[j],
            "experimental_factors": []
        }
        for (var i = 0; i < all_ef.length; i++) {

            if (all_ef[i]['lindaID'] === unique_lindaIDs[j]) {
                ef_obj.experimental_factors.push(all_ef[i])
            }
        }
        var doc_entry = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]} RETURN entry`).toArray();
        if (doc_entry.length > 0) {
            db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]}  UPDATE entry WITH ${ef_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
        }
        else {
            db._query(aql`UPSERT ${ef_obj} INSERT ${ef_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
        }
    }
}
function add_bm_data(db, all_bm, observation_unit_edge, observation_unit_id) {
    var unique_lindaIDs = [...new Set(all_bm.map(item => item.lindaID))];
    for (var j = 0; j < unique_lindaIDs.length; j++) {
        let bm_obj = {
            "_from": observation_unit_id,
            "_to": unique_lindaIDs[j],
            "biological_materials": []
        }
        for (var i = 0; i < all_bm.length; i++) {

            if (all_bm[i]['lindaID'] === unique_lindaIDs[j]) {
                bm_obj.biological_materials.push(all_bm[i])
            }
        }
        //info_message.push("8- good: " + JSON.stringify(bm_obj))
        var doc_entry = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]} RETURN entry`).toArray();
        if (doc_entry.length > 0) {
            db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
        }
        else {
            db._query(aql`UPSERT ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
        }
        //update = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
        // info_message.push("8- good: " + JSON.stringify(doc_entry))


        // var add = db._query(aql`UPDATE ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
        // //     info_message.push("8- good: " + unique_keys[j])
        // update = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${bm_db_id}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
    }
}
function add_sample_data(db, all_sample, observation_units_data, observation_unit_edge, observation_unit_id, sample_coll, sample_coll_name, info_message) {
    //var unique_UUIDs = [...new Set(all_sample.map(item => item.bmUUID))];
    //var sample_data_bm = sample_data[j]
    var previous_sampleuuids = []
    for (var i = 0; i < observation_units_data.length; i++) {
        var obsuuid = observation_units_data[i]['obsUUID']
        //var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsuuid} RETURN doc.sampleUUID`).toArray();
        var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsuuid} RETURN {sampleuuid:doc.sampleUUID}`).toArray();
        for (var j = 0; j < sample_with_sampleuuids.length; j++) {
            previous_sampleuuids.push(sample_with_sampleuuids[j])
        }
        //info_message.push("3- good: " + JSON.stringify(sample_with_sampleuuids))
        //previous_sampleuuids.concat(sample_with_sampleuuids)
    }
    for (var k = 0; k < all_sample.length; k++) {
        var sample_by_bm = all_sample[k]
        for (var l = 0; l < sample_by_bm.length; l++) {
            var found = false
            for (var i = 0; i < previous_sampleuuids.length; i++) {
                //info_message.push("3- sampleuuids: " + JSON.stringify(previous_sampleuuids[i]))
                var doc = previous_sampleuuids[i]
                if (doc.sampleuuid === sample_by_bm[l]['sampleUUID']) {
                    found = true
                }
            }
            if (!found) {
                try {
                    var sample = sample_by_bm[l]
                    var data_sample = []
                    info_message.push("7- sample to add to obs unit id: " + observation_unit_id)
                    info_message.push("7.2- sample to add : " + JSON.stringify(sample))
                    info_message.push("7.5- sample to add : " + sample_coll)
                    data_sample = db._query(aql`INSERT ${sample} IN ${sample_coll} RETURN { new: NEW, id: NEW._id } `).toArray();
                    info_message.push("7.8- sample to add to obs unit id: " + JSON.stringify(data_sample))

                    if (data_sample[0].new === null) {
                        info_message.push("8- sample exist: " + JSON.stringify(sample))
                        //res.send({ success: false, message: ' sample collection already have document with this title ', _id: 'none' });
                    }
                    //Document exists add edges in edge collection
                    else {
                        info_message.push("8- sample to add : " + observation_unit_id)
                        var sample_obj = {
                            "_from": observation_unit_id,
                            "_to": data_sample[0].id
                        }
                        try {

                            db._query(aql`UPSERT ${sample_obj} INSERT ${sample_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                        }
                        catch (e) {
                            info_message.push("9- ccannot replace sample: " + JSON.stringify(sample_obj) + e)
                        }

                    }
                }
                catch (e) {
                    info_message.push("6- ccannot insert sample: " + e)

                }
            }


        }
    }


}




router.post('/update_observation_units', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var _key = req.body._key;
    var values = req.body.values;
    var model_type = req.body.model_type;
    //Studies edge 
    var parent_type = parent_id.split("/")[0];
    var study_edge_coll = parent_type + '_edge'
    if (!db._collection(study_edge_coll)) {
        db._createEdgeCollection(study_edge_coll);
    }
    var studies_edge = db._collection(study_edge_coll);
    var datatype = "observation_units";
    var observation_unit_id = datatype + '/' + _key;
    //observation unit edge 
    var observation_unit_edge_coll = datatype + '_edge'
    if (!db._collection(observation_unit_edge_coll)) {
        db._createEdgeCollection(observation_unit_edge_coll);
    }
    var observation_unit_edge = db._collection(observation_unit_edge_coll);
    //observation units collection 
    var observation_unit_coll = db._collection(datatype);
    if (!observation_unit_coll) {
        db._createDocumentCollection(datatype);
    }

    // var datatype = "experimental_factors";
    //  //experimental factor edge 
    //  var experimental_factor_edge_coll = datatype + '_edge'
    //  if (!db._collection(experimental_factor_edge_coll)) {
    //      db._createEdgeCollection(experimental_factor_edge_coll);
    //  }
    //  var experimental_factor_edge = db._collection(experimental_factor_edge_coll);

    var sample_coll_name = 'samples'
    //samples collection 
    var sample_coll = db._collection(sample_coll_name);
    if (!sample_coll) {
        db._createDocumentCollection(sample_coll_name);
    }
    var error_message = []
    var info_message = []

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
        error_message.push('Username ' + username + ' doesn\'t exists')
    }
    else {
        info_message.push("1- users exists \n")
        var data = [];
        var update = [];
        var diff = []
        var observation_unit_doc = { "External ID": [], "Observation Unit factor value": [], "Observation unit ID": [], "Observation unit type": [], "Spatial distribution": [], "obsUUID": [] }
        //var return_data = {"observation_units":[],"biological_materials":[],"samples":[], "experimental_factor":[] }
        var observation_units_data = values['observation_units'];
        for (var observation_unit in observation_units_data) {
            observation_unit_doc["External ID"].push(observation_units_data[observation_unit]['External ID']);
            observation_unit_doc["Observation unit ID"].push(observation_units_data[observation_unit]['Observation unit ID']);
            observation_unit_doc["Observation Unit factor value"].push(observation_units_data[observation_unit]['Observation Unit factor value']);
            observation_unit_doc["Observation unit type"].push(observation_units_data[observation_unit]['Observation unit type']);
            observation_unit_doc["Spatial distribution"].push(observation_units_data[observation_unit]['Spatial distribution']);
            observation_unit_doc["obsUUID"].push(observation_units_data[observation_unit]['obsUUID']);
        }
        var response;
        //get previous obsuuid 
        var previous_obsuuids = db._query(aql`FOR doc IN ${observation_unit_coll} FILTER doc._id==${observation_unit_id} RETURN doc.obsUUID `).toArray();
        // info_message.push("1- users exists \n" +  previous_obsuuids[0])
        data = db._query(aql` FOR entry IN ${observation_unit_coll} FILTER entry._id == ${observation_unit_id} UPDATE entry WITH ${observation_unit_doc} IN ${observation_unit_coll} RETURN { before: OLD, after: NEW }`).toArray();
        //check if all previous obsuuid are 
        for (var i = 0; i < previous_obsuuids.length; i++) {
            if (!data[0].after['obsUUID'].includes(previous_obsuuids[i])) {
                var obsuuid_toremoved = previous_obsuuids[i]
                update_unused_bm_from_obsUUID(db, observation_unit_edge, observation_unit_id, obsuuid_toremoved)
                update_unused_ef_from_obsUUID(db, observation_unit_edge, observation_unit_id, obsuuid_toremoved)
                update_unused_sample_from_obsUUID(db, observation_unit_edge, observation_unit_id, sample_coll, obsuuid_toremoved)
            }
        }
        if (data[0].after === null) {
            //res.send({ success: false, message: model_type + ' collection already have document with this title ' });
            error_message.push(model_type + ' collection already have document with this title ')
        }
        //Document exists update edges in edge collection
        else {
            info_message.push("2- observation unit has been updated and child data has been cleaned \n" + data[0].after['obsUUID'])
            // loop for each observation and get all bms, all efs, all samples
            var all_bm = []
            var all_ef = []
            var all_sample = []
            for (var i = 0; i < observation_units_data.length; i++) {

                var biological_material_data = values['biological_materials'][i];
                var experimental_factor_data = values['experimental_factors'][i];
                var sample_data = values['samples'][i];
                //get all biological material
                for (var j = 0; j < biological_material_data.length; j++) {
                    all_bm.push(biological_material_data[j])
                }
                //get all experimental factor
                for (var j = 0; j < experimental_factor_data.length; j++) {
                    all_ef.push(experimental_factor_data[j])
                }
                //get all sample
                for (var j = 0; j < sample_data.length; j++) {
                    all_sample.push(sample_data[j])
                }
            }
            //info_message.push("3- good: " + JSON.stringify(all_ef))
            //first update 
            //Remove bmuuid if they are not present anymore after removal from biological material table
            var regex = "biological_materials%"
            var previous_bmuuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} RETURN {bm_linda_id:doc._to,doc_bm_uuids:doc.biological_materials[*].bmUUID} `).toArray();
            for (var i = 0; i < previous_bmuuids.length; i++) {
                var doc_bm_uuids = previous_bmuuids[i]['doc_bm_uuids']
                for (var j = 0; j < doc_bm_uuids.length; j++) {
                    var found = false
                    for (var k = 0; k < all_bm.length; k++) {
                        if (all_bm[k]['bmUUID'] == doc_bm_uuids[j]) {
                            found = true
                        }
                    }
                    if (!found) {
                        var bmuuid_to_removed = doc_bm_uuids[j]
                        update_unused_sample_from_bmUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, sample_coll, bmuuid_to_removed)
                        update_unused_bm_from_bmUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, bmuuid_to_removed, regex)
                    }
                }
            }
            var regex = "experimental_factors%"
            var previous_efuuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} RETURN {ef_linda_id:doc._to,doc_ef_uuids:doc.experimental_factors[*].efUUID} `).toArray();
            for (var i = 0; i < previous_efuuids.length; i++) {
                var doc_ef_uuids = previous_efuuids[i]['doc_ef_uuids']
                for (var j = 0; j < doc_ef_uuids.length; j++) {
                    var found = false
                    for (var k = 0; k < all_ef.length; k++) {
                        if (all_ef[k]['efUUID'] == doc_ef_uuids[j]) {
                            found = true
                        }
                    }
                    if (!found) {
                        var efuuid_to_removed = doc_ef_uuids[j]
                        update_unused_ef_from_efUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, efuuid_to_removed, regex)
                    }
                }
            }
            var regex = "samples%"
            var previous_sampleuuids = []
            for (var i = 0; i < observation_units_data.length; i++) {
                var obsuuid = observation_units_data[i]['obsUUID']
                //var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsuuid} RETURN doc.sampleUUID`).toArray();
                var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsuuid} RETURN {sampleuuid:doc.sampleUUID}`).toArray();
                for (var j = 0; j < sample_with_sampleuuids.length; j++) {
                    previous_sampleuuids.push(sample_with_sampleuuids[j])
                }
                //info_message.push("3- good: " + JSON.stringify(sample_with_sampleuuids))
                //previous_sampleuuids.concat(sample_with_sampleuuids)
            }
            //var sample_with_sampleuuids = db._query(aql`FOR doc IN ${sample_coll} FILTER doc.obsUUID == ${obsUUID} RETURN {id:doc.sampleUUID}`).toArray();
            //var previous_sampleuuids = db._query(aql`FOR doc IN ${observation_unit_edge} FILTER doc._from == ${observation_unit_id} && doc._to LIKE ${regex} RETURN {sampleuuid:doc.sampleUUID`).toArray();
            //info_message.push("4- all sample data: " + JSON.stringify(all_sample))
            for (var i = 0; i < previous_sampleuuids.length; i++) {
                //info_message.push("3- sampleuuids: " + JSON.stringify(previous_sampleuuids[i]))
                var doc = previous_sampleuuids[i]
                var sampleuuid = doc.sampleuuid
                var found = false
                //info_message.push("4- all sample data: " + JSON.stringify(all_sample))
                for (var k = 0; k < all_sample.length; k++) {
                    var bm_associated_sample = all_sample[k]
                    for (var l = 0; l < bm_associated_sample.length; l++) {
                        //info_message.push("4- all sample data uUID: " + all_sample[k][l]['sampleUUID'] + " sample uUID: " + sampleuuid)
                        if (all_sample[k][l]['sampleUUID'] == sampleuuid) {
                            found = true
                            //info_message.push("5- found: " + sampleuuid)
                        }
                    }
                }
                if (!found) {
                    //info_message.push("6- not found: " + sampleuuid)
                    var sampleuuid_to_removed = sampleuuid
                    //info_message.push("3- not found: " + sampleuuid_to_removed)
                    update_unused_sample_from_sampleUUID(db, observation_unit_edge, observation_unit_edge_coll, observation_unit_id, sample_coll, sample_coll_name, sampleuuid_to_removed, info_message)
                }
            }
            //Add new bm biological material list in edge document or create document if they are not present
            add_bm_data(db, all_bm, observation_unit_edge, observation_unit_id)
            //info_message.push("3- good: " + JSON.stringify(all_ef))
            add_ef_data(db, all_ef, observation_unit_edge, observation_unit_id, info_message)
            add_sample_data(db, all_sample, observation_units_data, observation_unit_edge, observation_unit_id, sample_coll, sample_coll_name, info_message)


            // var unique_lindaIDs = [...new Set(all_bm.map(item => item.lindaID))];
            // for (var j = 0; j < unique_lindaIDs.length; j++) {
            //     let bm_obj = {
            //         "_from": observation_unit_id,
            //         "_to": unique_lindaIDs[j],
            //         "biological_materials": []
            //     }
            //     for (var i = 0; i < all_bm.length; i++) {

            //         if (all_bm[i]['lindaID'] === unique_lindaIDs[j]) {
            //             bm_obj.biological_materials.push(all_bm[i])
            //         }
            //     }
            //     //info_message.push("8- good: " + JSON.stringify(bm_obj))
            //     var doc_entry = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]} RETURN entry`).toArray();
            //     if (doc_entry.length > 0) {
            //         db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
            //     }
            //     else {
            //         db._query(aql`UPSERT ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
            //     }
            //     //update = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${unique_lindaIDs[j]}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
            //     info_message.push("8- good: " + JSON.stringify(doc_entry))


            //     // var add = db._query(aql`UPDATE ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
            //     // //     info_message.push("8- good: " + unique_keys[j])
            //     // update = db._query(aql` FOR entry IN ${observation_unit_edge} FILTER entry._from == ${observation_unit_id}  && entry._to == ${bm_db_id}  UPDATE entry WITH ${bm_obj} IN ${observation_unit_edge} RETURN { before: OLD, after: NEW }`).toArray();
            // }
        }
        if (error_message.length !== 0) {
            res.send({ success: false, message: 'problems:  ' + error_message });
        }
        else {
            res.send({ success: true, message: 'done: ' + info_message });
        }

    };
})
    .body(joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        _key: joi.string().required(),
        values: joi.object({
            observation_units: joi.array().items(joi.object().required()).required(),
            biological_materials: joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).optional(),
            samples: joi.array().items(joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).allow(null)).optional(),
            experimental_factors: joi.array().items(joi.array().items(joi.object().allow(null)).allow(null)).optional()
        }).required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object().keys({
        success: joi.boolean().required(),
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');


router.get('/get_observation_unit_childs/:observation_unit_key', function (req, res) {
    var observation_unit_id = "observation_units/" + req.pathParams.observation_unit_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${observation_unit_id} GRAPH 'global'  RETURN {e:e,s:s}`);
    res.send(data);
})
    .pathParam('observation_unit_key', joi.string().required(), 'observation unit id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.post('/update_observation_unit', function (req, res) {
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



/*****************************************************************************************
 ******************************************************************************************
 *********************************TEMPLATES*****************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/

//Get templates
router.get('/get_templates/:user_key/:model_coll/', function (req, res) {
    try {
        var user_key = req.pathParams.user_key;
        var model_coll = req.pathParams.model_coll;

        var coll_name = model_coll + '_templates'
        var data = [];
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


//Get templates
router.get('/get_all_templates/:user_key/', function (req, res) {
    try {
        var user_key = req.pathParams.user_key;

        var data = [];
        const edges = db._collection('templates_edge');
        if (!edges) {
            db._createDocumentCollection('templates_edge');
        }


        var user_id = "users/" + user_key

        var edges_data = edges.byExample({ "_from": user_id }).toArray();
        for (var i = 0; i < edges_data.length; i++) {
            var coll_name = edges_data[i]['_to'].split('/')[0]
            var coll = db._collection(coll_name);
            if (!coll) {
                db._createDocumentCollection(coll_name);
            }
            data.push(coll.byExample({ "_id": edges_data[i]['_to'] }).next());
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
    var template_coll = db._collection(model_type + "_templates");

    var template_edge_coll = 'templates_edge'
    if (!db._collection(template_edge_coll)) {
        db._createEdgeCollection(template_edge_coll);
    }
    const template_edge = db._collection(template_edge_coll);



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
        data = db._query(aql`INSERT ${values} IN ${template_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
        if (data[0].new !== null) {
            var edge_obj = {
                "_from": user[0]._id,
                "_to": data[0].id
            };
            const edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${template_edge} RETURN NEW `);
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









    // update = db._query(aql` FOR document IN ${observation_unit_edge} FILTER document._from == ${observation_unit_id} && document._to LIKE ${regex} FOR element IN document.biological_materials RETURN { element}`).toArray();

    // update = db._query(aql`FOR document in ${observation_unit_edge} FILTER document._from == ${observation_unit_id} && document._to LIKE ${regex} LET alteredList = (FOR element IN document.biological_materials LET newItem = (element.obsUUID =="6228510a-3019-4c80-b36a-a8c1ef74e1d5"?element :"") RETURN newItem) RETURN {alteredList }`).toArray();