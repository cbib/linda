
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


//const cors = require('cors');
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
const getUserName = require("./queries/get-user-name");
const telegram = require("./queries/telegram-chat");
const { exec } = require('child_process');
//const { spawn } = require('child_process');
//const uuidV4 = require('uuid/v4');
//const uuid = require('uuid');
//const { v4: uuidv4 } = require('uuid');
//var uuid = require('uuid');

/* const nodemailer = require("nodemailer");
require("dotenv").config();


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
}); */

//const queue1 = queues.create("my-queue");

// queue1.push(
//     { mount: "/xeml", name: "send-mail" },
//     { to: "bdartigues@gmail.com", body: "Hello world" }
// );




//const writeFile = require('write-file')



//graph = graph_module._create("myGraph");


//Create a graph using an edge collection edges and a single vertex collection vertices:
//var edgeDefinitions = [ { collection: "users_edge", "from": [ "users" ], "to" : [ "investigations" ] } ];
//graph = graph_module._create("myGraph", edgeDefinitions);



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
var groups = db._collection('groups');
var users = db._collection('users');
var persons = db._collection('persons');
var investigations = db._collection('investigations');
var studies = db._collection('studies');
var events = db._collection('events');
var data_files = db._collection('data_files');
var observed_variables = db._collection('observed_variables');
var experimental_factors = db._collection('experimental_factors');
var observation_units = db._collection('observation_units');
var environments = db._collection('environments');
var publications = db._collection('publications');
var samples = db._collection('samples');
var templates = db._collection('templates');
var metadata_files = db._collection('metadata_files');
var germplasms = db._collection('germplasms');
var NCBITaxons = db._collection('NCBITaxons');

/*Edge collections*/


var investigations_edge = db._collection('investigations_edge');
var groups_edge = db._collection('groups_edge');
var users_edge = db._collection('users_edge');
var studies_edge = db._collection('studies_edge');
var observation_units_edge = db._collection('observation_units_edge');
var templates_edge = db._collection('templates_edge');
var data_files_edge = db._collection('data_files_edge');





/*Check if collections exist*/
if (!groups) {
    db._createDocumentCollection('groups');
    groups = db._collection('groups');
}
if (!users) {
    db._createDocumentCollection('users');
    users = db._collection('users');
}
if (!persons) {
    db._createDocumentCollection('persons');
    persons = db._collection('persons');
}
if (!templates) {
    db._createDocumentCollection('templates');
    templates = db._collection('templates');
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
if (!germplasms) {
    db._createDocumentCollection('germplasms');
    germplasms = db._collection('germplasms');
}
if (!NCBITaxons) {
    db._createDocumentCollection('NCBITaxons');
    NCBITaxons = db._collection('NCBITaxons');
}



/*check if edge collections exist*/
if (!users_edge) {
    db._createDocumentCollection('users_edge');
}
if (!groups_edge) {
    db._createDocumentCollection('groups_edge');
}
if (!investigations_edge) {
    db._createDocumentCollection('investigations_edge');
}
if (!templates_edge) {
    db._createDocumentCollection('templates_edge');
}
if (!studies_edge) {
    db._createEdgeCollection('studies_edge');
}
if (!data_files_edge) {
    db._createDocumentCollection('data_files_edge');
}
if (!observation_units_edge) {
    db._createEdgeCollection('observation_units_edge');
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

/*#############*/
// in your router


/*****************************************************************************************
 ******************************************************************************************
 *********************************GROUPS****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/



router.get('/get_groups/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var groups = [];
    var groups_edge_coll = 'groups_edge'
    if (!db._collection(groups_edge_coll)) {
        db._createEdgeCollection(groups_edge_coll);
    }
    const groups_edge = db._collection(groups_edge_coll);

    //data = db._query(aql`FOR v, e, s IN 1..1 INBOUND ${user_id} GRAPH 'global' PRUNE e._from ==${user_id} FILTER CONTAINS(e._to, "investigations") RETURN s.vertices[1]`);
    //groups = db._query(aql`FOR v, e, s IN 1..1 INBOUND "users/32010799" GRAPH 'global' RETURN s.vertices[1]`);
    groups = db._query(aql`FOR edge IN ${groups_edge} FILTER edge._to == ${user_id} RETURN edge._from`).toArray();
    res.send(groups);
})
    .pathParam('user_key', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



/*****************************************************************************************
 ******************************************************************************************
 *********************************USERS****************************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/

// _user_id: User document _id
// _edges: users edge collection 
function get_person_id_from_user_id(_user_id, _edges) {
    var person = db._query(aql`FOR edge IN ${_edges} FILTER edge._from == ${_user_id} AND CONTAINS(edge._to,"persons") RETURN edge._to`).toArray();
    return person
}

function get_person(_person_id, _persons_edge) {
    return db._query(aql`FOR entry IN ${_persons_edge} FILTER entry['Person ID'] == ${_person_id} RETURN entry`).toArray();
}

router.get('/get_person_id/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var person = [];
    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);

    //data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${user_id} GRAPH 'global' PRUNE e._from ==${user_id} FILTER CONTAINS(e._to, "investigations") RETURN s.vertices[1]`);
    person = db._query(aql`FOR edge IN ${users_edge} FILTER edge._from == ${user_id} AND CONTAINS(edge._to,"persons") RETURN edge._to`).toArray();
    res.send(person);
})
    .pathParam('user_key', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_person/:person_id', function (req, res) {
    var person_id = req.pathParams.person_id;
    var person = [];
    var persons_coll = 'persons'
    if (!db._collection(persons_coll)) {
        db._createCollection(persons_coll);
    }
    const persons = db._collection(persons_coll);

    var person = get_person(person_id, persons)
    //data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${user_id} GRAPH 'global' PRUNE e._from ==${user_id} FILTER CONTAINS(e._to, "investigations") RETURN s.vertices[1]`);
    //person = db._query(aql`FOR edge IN ${users_edge} FILTER edge._from == ${user_id} AND CONTAINS(edge._to,"persons") RETURN edge._to`).toArray();
    res.send(person);
})
    .pathParam('person_id', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/persons', function (req, res) {
    var persons_arr = []
    persons_arr = db._query(aql`FOR entry IN ${persons} RETURN entry`);
    res.send(persons_arr);
}).response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
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


// GET users by username
router.get('/get_user/:username/:password', function (req, res) {
    //log(req);

    try {
        var name = req.pathParams.username;
        var pwd = req.pathParams.password;
        //const data = users.byExample({username : name});
        const data = users.byExample({ 'username': name, 'password': pwd });
        //const data = users.properties();
        res.send(data.toArray()[0]);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }
})
    .pathParam('username', joi.string().required(), 'password', joi.string().required(), 'username of the entry.')
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
    const user_array = db._query(aql`
    FOR entry IN ${users}
    FILTER entry.username == ${username}
    FILTER entry.password == ${password}
    RETURN entry
  `);

    if (user_array[0] === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists', user: {} });
    }
    else {
        res.send({ success: true, message: 'Username ' + username + ' found', user: user_array['_documents'][0] });
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required()
    }).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required(),
            message: joi.string().required(),
            user: joi.object().required()
        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');


router.post('/authenticate_group', function (req, res) {
    //const values = req.body.values;
    var username = req.body.username;
    var password = req.body.password;
    var roles = req.body.roles
    var group_key = req.body.group_key;
    var group_password = req.body.group_password;
    console.log(username)
    console.log(password)
    console.log(group_key)
    console.log(group_password)
    const user_array = db._query(aql`
            FOR entry IN ${users}
            FILTER entry.username == ${username}
            FILTER entry.password == ${password}
            RETURN entry
          `);

    if (user_array[0] === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists', group: {} });
    }
    else {
        var user = user_array[0]
        const group_array = db._query(aql`
            FOR entry IN ${groups}
            FILTER entry._key == ${group_key}
            FILTER entry.password == ${group_password}
            RETURN entry
          `);
        if (group_array[0] === null) {
            res.send({ success: false, message: 'group key ' + group_key + ' doesn\'t exists', group: {} });
        }
        else {

            // add edge in group edge
            var groups_edge_coll = 'groups_edge'
            if (!db._collection(groups_edge_coll)) {
                db._createEdgeCollection(groups_edge_coll);
            }
            const groups_edge = db._collection(groups_edge_coll);

            var edge_obj = {
                "_from": group_array['_documents'][0]['_id'],
                "_to": user_array['_documents'][0]['_id'],
                "roles": roles
            };
            var edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${groups_edge} RETURN NEW `);

            res.send({ success: true, message: 'group key ' + group_key + ' found', group: group_array['_documents'][0] });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        group_key: joi.string().required(),
        group_password: joi.string().required()
    }).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required(),
            message: joi.string().required(),
            group: joi.object().required()
        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');


router.post('/authenticate_person', function (req, res) {
    //const values = req.body.values;
    var username = req.body.username;
    var password = req.body.password;
    const person_array = db._query(aql`
        FOR entry IN ${users}
        FILTER entry.username == ${username}
        FILTER entry.password == ${password}
        RETURN entry
      `);

    if (person_array[0] === null) {
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists', person: {} });
    }
    else {
        res.send({ success: true, message: 'Username ' + username + ' found', person: person_array['_documents'][0] });
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required()
    }).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required(),
            message: joi.string().required(),
            person: joi.object().required()
        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');


router.post('/register_person', function (req, res) {
    const person = req.body.person;
    const group_id = req.body.group_id;
    //var username=req.body.username;
    var searchExpression = { "username": person.username, "password": person.password };
    var user_to_insert = {
        "username": person.username,
        "password": person.password,
        "dateCreated": person['dateCreated'],
        "Person ID": person['Person ID'],
        "tutoriel_step": 0,
        "tutoriel_done": false,
        "treeview": false,
        "admin": false
    };
    var person_to_insert = {
        "Person name": person['Person name'],
        "Person ID": person['Person ID'],
        "Person email": person['Person email'],
        "Person role": person['Person role'],
        "Person affiliation": person['Person affiliation'],
    };

    //alert(username);
    //var password=req.body.password;
    //var firstName=req.body.firstName;
    //var lastName=req.body.lastName;

    var user_res = db._query(aql`UPSERT ${searchExpression} INSERT ${user_to_insert} UPDATE {}  IN ${users} RETURN {old:OLD,new:NEW} `).toArray();


    var result = user_res[0]
    if (result['old'] === null) {
        var groups_edge_coll = 'groups_edge'
        if (!db._collection(groups_edge_coll)) {
            db._createEdgeCollection(groups_edge_coll);
        }
        const groups_edge = db._collection(groups_edge_coll);

        var edge_obj = {
            "_from": group_id,
            "_to": result['new']['_id'],
            "roles": {
                "admin": false,
                "owner": false,
                "user": true
            }
        };
        var edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${groups_edge} RETURN NEW `);

        //create person
        var searchExpression2 = { "person ID": person['Person ID'], "Person email": person['Person email'] };
        var person_res = db._query(aql`UPSERT ${searchExpression2} INSERT ${person_to_insert} UPDATE {} IN ${persons} RETURN {old:OLD,new:NEW} `).toArray();
        var result2 = person_res[0]

        if (result2['old'] === null) {
            var users_edge_coll = 'users_edge'
            if (!db._collection(users_edge_coll)) {
                db._createEdgeCollection(users_edge_coll);
            }
            const users_edge = db._collection(users_edge_coll);

            var edge_obj2 = {
                "_from": result['new']['_id'],
                "_to": result2['new']['_id']
            };
            var edges2 = db._query(aql`UPSERT ${edge_obj2} INSERT ${edge_obj2} UPDATE {}  IN ${users_edge} RETURN NEW `);

        }
        else {
            res.send({ success: false, message: 'a person with ORCID ID ' + searchExpression2['Person ID'] + ' already exists' });
        }
        res.send({ success: true, message: 'everything is good' + JSON.stringify(result) });
    }
    else {
        res.send({ success: false, message: 'a user with same username and password ' + searchExpression['username'] + ' already exists' });
    }

})
    .body(joi.object({
        "person": joi.object({
            username: joi.string().required(),
            password: joi.string().required(),
            confirmpassword: joi.string().required(),
            "Person name": joi.string().required(),
            "Person ID": joi.string().required(),
            "Person role": joi.string().required(),
            "Person affiliation": joi.string().required(),
            "Person email": joi.string().required(),
            "dateCreated": joi.string().required()
        }).required(),
        "group_id": joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if person exist.');



router.post('/register', function (req, res) {
    const data = req.body;
    //var username=req.body.username;
    var searchExpression = { "username": req.body.username, "password": req.body.password };
    var data_to_insert = { "username": req.body.username, "password": req.body.password, "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "tutoriel_step": 0, "tutoriel_done": false, "treeview": false };

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
        console.log(user_id)
        var all_descendants_nodes = db._query(aql`FOR v, e, s IN 1..5 OUTBOUND ${user_id} GRAPH 'global'  RETURN {v:v, e:e}`).toArray();
        all_descendants_nodes.forEach(
            descendants_node => {
                var descendants_node_values = descendants_node["v"]
                console.log(descendants_node_values)
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



router.get("/admin-username", (req, res) => {
    res.json(getUserName(true));
});

router.get("/all-username", (req, res) => {
    res.json(getUserName(false));
});

router.post("/send-telegram", (req, res) => {
    const email = req.body.email
    res.json(telegram);
});

router.post('/reset-password', (req, res) => {
    const resettoken = req.body.resettoken
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword
    console.log(resettoken)
    const result = db._query(aql`
            for user in users 
                filter user['token']== ${resettoken}
                    return {user:user}
        `).toArray();
    if (result[0] === null) {
        res.send({ success: false })
    }
    else {
        let personId = result[0]['user']['Person ID']
        var update_passwordd = db._query(aql`UPSERT {'Person ID':${personId}} INSERT {} UPDATE {'password':${newPassword}}  IN ${users} RETURN NEW `);
        var update_token = db._query(aql`UPSERT {'Person ID':${personId}} INSERT {} UPDATE {'token':""}  IN ${users} RETURN NEW `);
        res.send({ success: true })
    }
}).body(joi.object({
    resettoken: joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required()
}).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required()
        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');


router.post('/valid-password-token', (req, res) => {
    const resettoken = req.body.resettoken
    console.log(resettoken)
    const result = db._query(aql`
            for user in users 
                filter user['token']== ${resettoken}
                    return {user:user}
        `).toArray();
    if (result[0] === null) {
        res.send({ success: false })
    }
    else {
        res.send({ success: true })
    }
}).body(joi.object({
    resettoken: joi.string().required()
}).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required()
        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');



//const sendMail = require("./queries/send-mail");
router.post('/request-reset', (req, res) => {
    const email = req.body.email
    const token = req.body.token
    console.log("email in api server.js", email)
    //check that person email exists then add token to corresponding user
    const users = db._collection('users');

    try {
        const result = db._query(aql`
            for person in persons 
                filter person['Person email']==${email} 
                    for user in users 
                        filter user['Person ID']== person['Person ID']
                            return {user:user, person:person}
            `).toArray();
        console.log("user found with this email", result[0]['user'])
        // add token
        result[0]['user']['token'] = token
        console.log("user found with this email", result[0]['user'])
        console.log("person found with this email", result[0]['person'])
        // Update user 
        let personId = result[0]['person']['Person ID']
        var edges = db._query(aql`UPSERT {'Person ID':${personId}} INSERT {} UPDATE {'token':${token}}  IN ${users} RETURN NEW `);
        // send mail with email and token 

        /* const { child_process } = require('child_process');
        child_process.execFile('./scripts/send_mail.sh',[req.body.email,req.body.token], (err, data) => {
            if (err) {
              console.log("error "+err);
              return res.status(500).send('Error');
            }
            else{
                console.log("good")
            }
          }); */
        //var spawn = require('child_process').spawn

        var command = "sh ./scripts/send_mail.sh " + email + " " + token;
        var sendmail = exec(command,
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                    res.send({ success: false });
                }
                else {
                    res.send({ success: true });
                }
            });

        /* const child = require('child_process').spawn("./scripts/send_mail.sh'",[email,token], { detached: true } );
        child.stdout.on('data', data => {
          console.log(`stdout:\n${data}`);
          res.send({ success: true });
        });
        
        child.stderr.on('data', data => {
          console.error(`stderr: ${data}`);
          res.send({ success: false });
        }); */
        ////res.send('end spawn launch');

        /* const exec = require('child_process').exec; 
        var child;
        const myShellScript = exec('sh send_mail.sh ');
        myShellScript.stdout.on('data', (data)=>{
            console.log(data); 
            // do whatever you want here with data
        });
        myShellScript.stderr.on('data', (data)=>{
            console.error(data);
        }); */



    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }






    // Here must call .sh script that run mail tool to send to email
    // Script exists on VM in /var/www/html


    //sendMail({'email':email})
    //res.json(sendMail({'email':email}));
    res.send({ success: true })
})
    .body(joi.object({
        email: joi.string().required(),
        token: joi.string().required()
    }).required(), 'Values to check.')
    .response(
        joi.object({
            success: joi.boolean().required()

        }
        ).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('check if user exist.');

/*****************************************************************************************
 ******************************************************************************************
 *********************************GLOBAL*******************************************
 ******************************************************************************************
 ******************************************************************************************
 ******************************************************************************************/

router.get('/get_germplasmsdatamodal/', function (req, res) {

    var data = {}
    const coll = db._collection('germplasms');
    if (!coll) {
        db._createDocumentCollection('germplasms');
    }
    //data = db._query(aql`FOR entry IN ${coll} RETURN entry`);
    data = db._query(aql`
    FOR entry IN ${coll}
        RETURN entry.germplasm_urgi_inrae
    `).toArray();
    //var germplasms= coll.firstExample('_key', key);
    var obj_to_send = {
        'page': 1,
        'per_page': 5,
        'total': data[0].length,
        'total_pages': data[0].length / 5,
        'data': data[0]
    }
    res.send(obj_to_send);
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_germplasms/', function (req, res) {

    var data = {}
    const coll = db._collection('germplasms');
    if (!coll) {
        db._createDocumentCollection('germplasms');
    }
    //data = db._query(aql`FOR entry IN ${coll} RETURN entry`);
    data = db._query(aql`
        FOR entry IN ${coll}
            RETURN entry.germplasm_gnpis_inrae
        `).toArray();
    //var germplasms= coll.firstExample('_key', key);

    res.send(data[0]);
})
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_germplasm_unique_taxon_groups/', function (req, res) {

    var data = {}
    const coll = db._collection('germplasms');
    if (!coll) {
        db._createDocumentCollection('germplasms');
    }
    //data = db._query(aql`FOR entry IN ${coll} RETURN entry`);
    data = db._query(aql`
    FOR entry IN ${coll}
        RETURN { TaxonGroup: UNIQUE(entry.germplasm_urgi_inrae[*].TaxonGroup) }
    `).toArray();
    res.send(data[0]);
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_germplasm_taxon_group_accession_numbers/:taxon_group', function (req, res) {
    var taxon_group = req.pathParams.taxon_group;
    const coll = db._collection('germplasms');
    if (!coll) {
        db._createDocumentCollection('germplasms');
    }
    var data = db._query(aql`
    LET document = DOCUMENT("germplasms/33546532") 
    LET alteredList = (
        FOR element IN document.germplasm_urgi_inrae 
                    FILTER element.TaxonGroup == ${taxon_group} 
                    LET newItem = (element)  
                    RETURN newItem) 
            RETURN alteredList`).toArray();
    var obj_to_send = {
        'page': 1,
        'per_page': 5,
        'total': data[0].length,
        'total_pages': data[0].length / 5,
        'data': data[0]
    }
    res.send(obj_to_send);
})
    .pathParam('taxon_group', joi.string().required(), 'taxon_group of the entry.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_species/', function (req, res) {
    const coll = db._collection('NCBITaxons');
    if (!coll) {
        db._createDocumentCollection('NCBITaxons');
    }
    var get_data = db._query(aql`
        FOR entry IN ${coll}
        RETURN { species: UNIQUE(entry.data[*].species) }
        `).toArray();
    //var result=get_data[0]
    console.log(get_data[0]['species'].length)
    res.send(get_data);
})
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_ncbi_taxon_data/', function (req, res) {
    const coll = db._collection('NCBITaxons');
    if (!coll) {
        db._createDocumentCollection('NCBITaxons');
    }
    var get_data = db._query(aql`
            FOR entry IN ${coll}
                RETURN entry.data
            `).toArray();
    //var result=get_data[0]
    //console.log(get_data[0]['species'].length)
    res.send(get_data[0]);
})
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


/* var get_data = db._query(aql`
LET document = DOCUMENT("NCBITaxons/33550834") 
LET alteredList = (
    FOR element IN document.data 
                FILTER element.species == ${taxon_group} 
                LET newItem = ({accession_num:element.AccessionNumber, accession_name:element.AccessionName,holding_institution: element.HoldingInstitution}) 
                RETURN newItem) 
        RETURN alteredList`); */


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


router.get('/get_lindaID_by_studyID/:study_unique_id/:parent_key', function (req, res) {
    var study_unique_id = req.pathParams.study_unique_id;
    var parent_key = req.pathParams.parent_key;
    var parent_id = "investigations/" + parent_key;
    var data = {}
    data = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global' FILTER v['Study unique ID']==${study_unique_id} RETURN {_id:v._id}`).toArray();
    if (data.length > 0) {
        data[0]["success"] = true
        res.send(data[0]);
    }
    else {
        res.send({ "success": false, '_id': null });

    }

})
    .pathParam('study_unique_id', joi.string().required(), 'username of the entry.')
    .pathParam('parent_key', joi.string().required(), 'username of the entry.')
    .response(joi.object().required(), 'Entry stored in the collection.')
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

router.get('/get_all_vertices/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${user_id} GRAPH 'global' FILTER NOT CONTAINS(e._to,"persons") AND NOT CONTAINS(e._to,"templates") RETURN {e:e,s:s}`);
    res.send(data);
})
    .pathParam('user_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_vertice/:person_key/:investigation_key', function (req, res) {
    var person_id = "persons/" + req.pathParams.person_key;
    var investigation_id = "investigations/" + req.pathParams.investigation_key;
    var data = [];
    data = db._query(aql`FOR edge IN investigations_edge FILTER edge._from==${investigation_id}
        FOR v, e, s IN 1..3 INBOUND ${person_id} GRAPH 'global' PRUNE e._to ==${person_id} FILTER e._from==edge._to 
            RETURN {study:s.vertices[1],role:e.role, roles:{study_id:v._id, role:e.role}}`);
    res.send(data);
    /*  data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${user_id} GRAPH 'global' FILTER NOT CONTAINS(e._to,"persons") AND NOT CONTAINS(e._to,"templates") RETURN {e:e,s:s}`);
     res.send(data); */
})
    .pathParam('person_key', joi.string().required(), 'user id of the entry.')
    .pathParam('investigation_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_inv_stud_vertices/:user_key', function (req, res) {
    var user_id = "users/" + req.pathParams.user_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..2 OUTBOUND ${user_id} GRAPH 'global' FILTER NOT CONTAINS(e._to,"persons") AND NOT CONTAINS(e._to,"templates") RETURN {e:e,s:s}`);
    res.send(data);
})
    .pathParam('user_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_project_persons/:investigation_key', function (req, res) {
    var investigation_id = "investigations/" + req.pathParams.investigation_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${investigation_id} GRAPH 'global' PRUNE e._from ==${investigation_id} FILTER CONTAINS(e._to, "persons") RETURN s.vertices[1]`);
    res.send(data);
})
    .pathParam('investigation_key', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_studies_and_persons/:investigation_key', function (req, res) {
    var investigation_id = "investigations/" + req.pathParams.investigation_key;
    var data = [];
    data = db._query(aql`
        FOR v, e, s IN 1..2 OUTBOUND ${investigation_id} GRAPH 'global'
            FOR edge IN investigations_edge FILTER edge._to==v._id AND edge._from==${investigation_id}
            RETURN {e:e, v:v}
        `);
    res.send(data);
})
    .pathParam('investigation_key', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');




router.get('/get_study_persons/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 OUTBOUND ${study_id} GRAPH 'global' PRUNE e._from ==${study_id} FILTER CONTAINS(e._to, "persons") RETURN s.vertices[1]`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'user id of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');




router.get('/get_projects/:person_key', function (req, res) {
    var person_id = "persons/" + req.pathParams.person_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 INBOUND ${person_id} GRAPH 'global' PRUNE e._to ==${person_id} FILTER CONTAINS(e._from, "investigations") RETURN {project:s.vertices[1],role:e.role, groups:{project_id:v._id, group_keys:e.group_keys}, roles:{project_id:v._id, role:e.role}}`);
    res.send(data);
})
    .pathParam('person_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_studies/:investigation_key/:person_key', function (req, res) {
    var investigation_id = "investigations/" + req.pathParams.investigation_key;
    var person_id = "persons/" + req.pathParams.person_key;
    var data = [];
    //data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${investigation_id} GRAPH 'global' PRUNE e._from==${investigation_id} FILTER NOT CONTAINS(e._to, "persons") RETURN v`);

    data = db._query(aql`FOR edge IN investigations_edge FILTER edge._from==${investigation_id} AND CONTAINS(edge._to, "studies")
                            FOR v, e, s IN 1..3 INBOUND ${person_id} GRAPH 'global' PRUNE e._to ==${person_id} FILTER e._from==edge._to 
                                RETURN {study:s.vertices[1],role:e.role, roles:{study_id:v._id, role:e.role}}`);
    res.send(data);
})
    .pathParam('investigation_key', joi.string().required(), 'investigation key of the entry.')
    //.response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    .response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_data_files/:model_key/:collection', function (req, res) {

    var collection = req.pathParams.collection;
    var model_key = req.pathParams.model_key;
    var model_id = collection + "/" + model_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${model_id} GRAPH 'global' FILTER e._from==${model_id} AND CONTAINS(e._to, "data_files") RETURN v`);
    res.send(data);
})
    .pathParam('model_key', joi.string().required(), 'study key of the entry.')
    .pathParam('collection', joi.string().required(), 'collection of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_all_experimental_designs/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "experimental_designs") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_all_biological_materials/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "biological_materials") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_all_observed_variables/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "observed_variables") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_all_events/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "events") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');

router.get('/get_all_environments/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "environments") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



router.get('/get_all_experimental_factors/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "experimental_factors") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');


router.get('/get_all_observation_units/:study_key', function (req, res) {
    var study_id = "studies/" + req.pathParams.study_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${study_id} GRAPH 'global' FILTER e._from==${study_id} AND CONTAINS(e._to, "observation_units") RETURN v`);
    res.send(data);
})
    .pathParam('study_key', joi.string().required(), 'study key of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
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
    var childs_data = db._query(aql`FOR v,e IN 1..4 OUTBOUND ${model_id} GRAPH 'global' FILTER NOT CONTAINS(e._to ,"persons") RETURN {v:v,e:e}`).toArray();
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
            //console.log(model_type)
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

router.get('/get_data_file_table/:key', function (req, res) {
    try {
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
            'total': data['Data'].length,
            'total_pages': data['Data'].length / 100,
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

}).pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.get('/get_data_file/:key', function (req, res) {
    try {
        var key = req.pathParams.key;
        var data = [];
        const coll = db._collection("data_files");
        if (!coll) {
            db._createDocumentCollection("data_files");
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

}).pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.object().required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.get('/get_study_by_ID/:study_id/:parent_key', function (req, res) {
    try {
        var id = req.pathParams.study_id;
        var parent_key = req.pathParams.parent_key;
        var parent_id = "investigations/" + parent_key
        var data = [];
        var data_ids = []
        //data_ids.push(parent_id)
        const coll = db._collection("studies");
        if (!coll) {
            db._createDocumentCollection(collection);
        }
        //data = coll.firstExample('Study unique ID', id);
        data = db._query(aql`FOR v, e IN 1..1 OUTBOUND ${parent_id} GRAPH 'global' FILTER CONTAINS(v['Study unique ID'], ${id}) RETURN {efrom:e._from,eto:e._to, study_id:v['Study unique ID'], v:v}`).toArray();
        data.forEach(element => {
            data_ids.push(element.eto)
        })
        res.send({ 'study_ids': data_ids });
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


router.get('/get_observation_units_by_key/:key', function (req, res) {
    var errors = []
    var data = {};
    try {
        var key = req.pathParams.key;
        const coll = db._collection("observation_units");
        if (!coll) {
            db._createDocumentCollection(datatype);
        }
        data = coll.firstExample('_key', key);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            errors.push(e)
            throw e;
        }
    }
    if (errors.length === 0) {
        res.send({ success: true, data: data });
    }
    else {
        res.send({ success: false, data: {} });
    }

})
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(
        joi.object(
            {
                success: joi.boolean().required(),
                data: joi.object().required()
            }
        ).required(), 'Entry stored in the collection.'
    )
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "observation units" collection by key.');



router.get('/get_biological_material_by_key/:key', function (req, res) {
    var errors = []
    var data = {};
    try {
        var key = req.pathParams.key;
        const coll = db._collection("biological_materials");
        if (!coll) {
            db._createDocumentCollection(datatype);
        }
        data = coll.firstExample('_key', key);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            errors.push(e)
            throw e;
        }
    }
    if (errors.length === 0) {
        res.send({ success: true, data: data });
    }
    else {
        res.send({ success: false, data: {} });
    }

})
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(
        joi.object(
            {
                success: joi.boolean().required(),
                data: joi.object().required()
            }
        ).required(), 'Entry stored in the collection.'
    )
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');

router.get('/get_experimental_design_by_key/:key', function (req, res) {
    var errors = []
    var data = {};
    try {
        var key = req.pathParams.key;
        const coll = db._collection("experimental_designs");
        if (!coll) {
            db._createDocumentCollection(datatype);
        }
        data = coll.firstExample('_key', key);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            errors.push(e)
            throw e;
        }
    }
    if (errors.length === 0) {
        res.send({ success: true, data: data });
    }
    else {
        res.send({ success: false, data: {} });
    }

})
    .pathParam('key', joi.string().required(), 'unique key.')
    .response(
        joi.object(
            {
                success: joi.boolean().required(),
                data: joi.object().required()
            }
        ).required(), 'Entry stored in the collection.'
    )
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
    var childs = db._query(aql`FOR v, e IN 1..2 OUTBOUND ${investigation_id} GRAPH 'global' FILTER CONTAINS(e._to, "data_files") RETURN {efrom:e._from,eto:e._to, filename:v['Data file link'], associated_headers:v['associated_headers']}`).toArray();
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

/* router.get('/get_project_data_files/:investigation_key/', function (req, res) {

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
     */

router.get('/get_multidata_from_datafiles/:datafile_key/:headers_linked/', function (req, res) {
    try {
        var datafile_id = 'data_files/' + req.pathParams.datafile_key;
        var headers_linked = req.pathParams.headers_linked;
        let headers = headers_linked.split("linda_separator")
        var get_data = []
        headers.forEach(header => {
            let data = db._query(aql`LET document = DOCUMENT(${datafile_id}) LET alteredList = (FOR element IN document.Data LET newItem = (element.${header}) RETURN newItem) RETURN alteredList`).toArray();
            get_data.push(data);
        });
        res.send(get_data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }
}).pathParam('datafile_key', joi.string().required(), 'datafile id requested.')
    .pathParam('headers_linked', joi.string().required(), 'header label to separate .')
    .response(joi.array().items(joi.array().items(joi.string().required()).required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');

router.get('/get_type_child_from_parent/:parent_name/:parent_key/:child_type/', function (req, res) {
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


router.get('/get_data_from_datafiles/:datafile_key/:header/', function (req, res) {

    try {
        var datafile_id = 'data_files/' + req.pathParams.datafile_key;

        var header = req.pathParams.header;
        var get_data = db._query(aql`LET document = DOCUMENT(${datafile_id}) LET alteredList = (FOR element IN document.Data LET newItem = (element.${header}) RETURN newItem) RETURN alteredList`).toArray();
        res.send(get_data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }
}).pathParam('datafile_key', joi.string().required(), 'datafile id requested.')
    .pathParam('header', joi.string().required(), 'header label requested.')
    .response(joi.array().items(joi.string().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


router.get('/get_associated_component_by_type_from_datafiles/:datafile_key/:type/', function (req, res) {

    try {
        var datafile_id = 'data_files/' + req.pathParams.datafile_key;

        var type = req.pathParams.type;
        var get_data = db._query(aql`LET document = DOCUMENT(${datafile_id}) 
            LET alteredList = (
                FOR element IN document.associated_headers 
                    FILTER element.associated_component == ${type} 
                    LET newItem = ({id:element.associated_linda_id, header:element.header}) 
                    RETURN newItem) 
            RETURN alteredList`);
        res.send(get_data);
    }
    catch (e) {
        if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
            throw e;
        }
        res.throw(404, 'The entry does not exist', e);
    }
}).pathParam('datafile_key', joi.string().required(), 'datafile id requested.')
    .pathParam('type', joi.string().required(), 'model type label requested.')
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
    var values = req.body.values;
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
            res.send({ success: false, message: model_type + ' collection already have file with this name ', _id: '' });
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
        values: joi.object().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required(),
        _id: joi.string().allow('').required()
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

/* **************************************************
// UPDATE  ROUTINES
************************************************** */
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
            res.send({ success: true, message: 'document has been updated ' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after), doc: update[0].after });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after), doc: update[0].before });
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
        message: joi.string().required(),
        doc: joi.array().items(joi.object().required()).required()
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
            res.send({ success: true, message: 'document has been updated ' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after), doc: update[0].after });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated' + JSON.stringify(update[0].before) + JSON.stringify(update[0].after), doc: update[0].before });
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
        message: joi.string().required(),
        doc: joi.array().items(joi.object().required()).required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');

router.post('/update_template', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _key = req.body._key;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var datatype = 'templates';
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



router.post('/update_document', function (req, res) {
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
            res.send({ success: true, message: 'document has been updated ', doc: update[0].after });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated', doc: {} });
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
        message: joi.string().required(),
        doc: joi.object().required()
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
        update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${coll} RETURN NEW.${field}`).toArray();



        /* var _id = '';
        if (model_type === 'investigation') {
            _id = 'investigations/' + _key;
            update = db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray();
        }

        else if (model_type === 'study') {
            _id = 'studies/' + _key;
            update = db._query(aql` FOR entry IN ${studies} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${studies} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'environment') {
            _id = 'environments/' + _key;
            update = db._query(aql` FOR entry IN ${environments} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${environments} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'event') {
            _id = 'events/' + _key;
            update = db._query(aql` FOR entry IN ${events} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${events} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'data_file') {
            _id = 'data_files/' + _key;
            update = db._query(aql` FOR entry IN ${data_files} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${data_files} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'experimental_factor') {
            _id = 'experimental_factors/' + _key;
            update = db._query(aql` FOR entry IN ${experimental_factors} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${experimental_factors} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'observed_variable') {
            _id = 'observed_variables/' + _key;
            update = db._query(aql` FOR entry IN ${observed_variables} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${observed_variables} RETURN NEW.${field}`).toArray();
        }
        else if (model_type === 'biological_material') {
            _id = 'biological_materials/' + _key;
            update = db._query(aql` FOR entry IN ${biological_materials} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${biological_materials} RETURN NEW.${field}`).toArray();
        }
        else {
            _id = 'observation_units/' + _key;
            update = db._query(aql` FOR entry IN ${observation_units} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${observation_units} RETURN NEW.${field}`).toArray();

        } */
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
        value: joi.string().allow('').required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


router.post('/update_multiple_field', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var _keys = req.body._keys;
    var field = req.body.field;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var datafile_key = req.body.datafile_key;
    var datafile_header = req.body.datafile_header;
    var model_field = req.body.model_field;
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    var df = []
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

        for (let index = 0; index < _keys.length; index++) {
            const _key = _keys[index];
            const value = values[index]
            var _id = datatype + '/' + _key;
            update = db._query(aql` FOR entry IN ${coll} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${coll} RETURN NEW`).toArray();
            var model_data = update[0]
            //Document has been updated
            if (model_data[field] === value) {
                if (datafile_key !== '') {
                    let df_id = "data_files/" + datafile_key
                    if (model_field === 'Study unique ID') {
                        const edges3 = db._query(aql`
                        LET document = DOCUMENT(${df_id})
                        LET alteredData = (
                            FOR element IN document.Data
                                    LET newItem = (element[${datafile_header}] == ${value} ? MERGE(element, { "Study linda ID": ${_id} }) : element)
                                       RETURN newItem
                        )
                        LET alteredAssociateHeaders = (
                            FOR element IN document.associated_headers
                                    LET newItem = (element.header == ${datafile_header} ? MERGE(element, { associated_component_field: ${model_field}, associated_component: ${model_type}, selected:true, associated_linda_id: PUSH(element.associated_linda_id, ${_id}), associated_values: PUSH(element.associated_values, ${value} ),associated_parent_id: PUSH(element.associated_parent_id, ${parent_id} ) }) : element)
                                       RETURN newItem
                        )
                        UPDATE document WITH {Data:  alteredData, associated_headers: alteredAssociateHeaders } IN data_files
                        RETURN {after: NEW }
                        `);
                    }
                    else {
                        const edges3 = db._query(aql`
                        LET document = DOCUMENT(${df_id})
                        
                        LET alteredAssociateHeaders = (
                            FOR element IN document.associated_headers
                                    LET newItem = (element.header == ${datafile_header} ? MERGE(element, { associated_component_field: ${model_field}, associated_component: ${model_type}, selected:true, associated_linda_id: PUSH(element.associated_linda_id, ${_id}), associated_values: PUSH(element.associated_values, ${value} ),associated_parent_id: PUSH(element.associated_parent_id, ${parent_id} ) }) : element)
                                       RETURN newItem
                        )
                        UPDATE document WITH {associated_headers: alteredAssociateHeaders } IN data_files
                        RETURN {after: NEW }
                        `);
                    }

                    df = db._query(aql`
                        FOR entry IN data_files
                        FILTER entry._key == ${datafile_key}
                        RETURN entry
                    `).toArray();
                    //console.log(edges3)
                }
                res.send({ success: true, message: 'document has been updated ', datafile: df[0] });
            }
            //No changes
            else {
                res.send({ success: false, message: 'document cannot be updated', datafile: {} });
            }
        }
    };
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        parent_id: joi.string().required(),
        _keys: joi.array().items(joi.string().required()).required(),
        field: joi.string().required(),
        values: joi.array().items(joi.string().required()).required(),
        model_type: joi.string().required(),
        datafile_key: joi.string().allow('').required(),
        datafile_header: joi.string().allow('').required(),
        model_field: joi.string().allow('').required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required(),
        datafile: joi.object().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


router.post('/update_step', function (req, res) {
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
        if (model_type === 'user') {
            _id = 'users/' + _key;
            update = db._query(aql` FOR entry IN ${users} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${users} RETURN NEW`).toArray();
        }
        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0][field] === value) {
            res.send({ success: true, message: 'document has been updated ', user: update[0] });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated', user: user });
        }
    };
}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    _key: joi.string().required(),
    field: joi.string().required(),
    value: joi.string().required(),
    model_type: joi.string().required()
}).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        user: joi.object().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');

router.post('/update_person', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var person_id = req.body.person_id;
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
        //var update = [];
        //var _id = 'persons/' + _key;
        var update = db._query(aql` FOR entry IN ${persons} FILTER entry["Person ID"] == ${person_id} UPDATE entry WITH {${field}: ${value}} IN ${persons} RETURN NEW`).toArray();
        console.log(update)
        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0][field] === value) {
            res.send({ success: true, message: 'document has been updated ', person: update[0] });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated', person: user });
        }
    };
}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    person_id: joi.string().required(),
    field: joi.string().required(),
    value: joi.string().required(),
}).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required(),
        person: joi.object().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


router.post('/update_user', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var _key = req.body._key;
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
        var update = [];
        var _id = '';
        _id = 'users/' + _key;
        update = db._query(aql` FOR entry IN ${users} FILTER entry._id == ${_id} UPDATE {_key:${_key}} WITH {${field}: ${value}} IN ${users} RETURN NEW`).toArray();

        //var update =db._query(aql` FOR entry IN ${investigations} FILTER entry._id == ${investigation_id} UPDATE {_key:${investigation_key}} WITH {${field}: ${value}} IN ${investigations} RETURN NEW.${field}`).toArray()
        //Document has been updated
        if (update[0][field] === value) {
            res.send({ success: true, message: 'document has been updated ', user: update[0] });
        }
        //No changes
        else {
            res.send({ success: false, message: 'document cannot be updated', user: user });
        }
    };
}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    _key: joi.string().required(),
    field: joi.string().required(),
    value: joi.alternatives().try(joi.boolean(), joi.string(), joi.number()).required()
}).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        user: joi.object().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');


/* **************************************************
// REMOVE  ROUTINES
************************************************** */
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
            if (!childs[i].v_id.includes('persons')) {
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
                                        element.associated_linda_id == ${id['id']} ? MERGE(element, { associated_linda_id: "" }) : element
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
    id: joi.object().required(),
    datafile_id: joi.string().required()
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
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === datatype && childs[i].v_id === model_id.id) {
                // If observed variable, reset all associated_linda_id
                if (!childs[i].v_id.includes('persons')) {
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
                    removed_ids.push(childs[i].v_id)
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
            res.send({ success: false, message: errors, datafile_ids: ["No datafiles detected"], removed_ids: removed_ids });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        id: joi.string().required(),
        model_type: joi.string().required(),
        model_id: joi.object().required(),
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
        var childs = db._query(aql`FOR v, e IN 1..4 OUTBOUND ${id} GRAPH 'global'  RETURN {v_id:v._id,v_key:v._key,e_id:e._id,e_key:e._key}`).toArray();
        //Remove all childs for selected node
        var datafile_ids = []
        var removed_ids = []
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === 'data_files') {
                datafile_ids.push(childs[i].v_id)

            }
            if (childs[i].v_id !== null && childs[i].v_id.split("/")[0] === datatype) {
                // If observed variable, reset all associated_linda_id
                if (!childs[i].v_id.includes('persons')) {
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
                    removed_ids.push(childs[i].v_id)
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

router.post('/remove_template', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;

    if (!db._collection('users_edge')) {
        db._createEdgeCollection('users_edge');
    }
    var users_edge_coll = db._collection('users_edge')
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
        //var template_edge_coll = 'templates_ege'
        if (!db._collection('templates_edge')) {
            db._createEdgeCollection('templates_edge');
        }
        var template_edge_coll = db._collection('templates_edge')
        //Remove relation to parent of selected node in edge collection

        try {
            var template_edge = db._query(aql`FOR u IN ${template_edge_coll} FILTER u._from==${id} REMOVE u IN ${template_edge_coll}`).toArray();

        }
        catch (e) {
            errors.push(e + "refdvdrx " + id);
        }
        try {
            var user_edge = db._query(aql`FOR u IN ${users_edge_coll} FILTER u._to==${id} REMOVE u IN ${users_edge_coll}`).toArray();

        }
        catch (e) {
            errors.push(e + "refdvdrx " + id);
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


router.post('/remove_multiple', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var ids = req.body.ids;

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
        var successes = [];

        for (let index = 0; index < ids.length; index++) {
            const id = array[index];


            //Remove relation to parent of selected node in edge collection
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
                // remove sample and observations unit edge from OU to sample
                if (childs[i].e_id.includes("observation_units_edge")) {
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
                    if (childs[i].v_id.includes("samples")) {
                        if ((childs[i].v_id !== null) || (childs[i].v_key !== null)) {
                            var child_coll = childs[i].v_id.split("/")[0];
                            var child_vkey = childs[i].v_key;
                            try {
                                db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                                successes.push({ success: true, message: 'Everything is good for removing ', _id: childs[i].v_id })

                            }
                            catch (e) {
                                errors.push(e + " " + childs[i].v_id);
                            }
                        }

                    }
                }
                else {
                    //Delete child vertice in collection except if child is a person
                    if (!childs[i].v_id.includes('persons')) {
                        if ((childs[i].v_id !== null) || (childs[i].v_key !== null)) {
                            var child_coll = childs[i].v_id.split("/")[0];
                            var child_vkey = childs[i].v_key;
                            try {
                                db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                                successes.push({ success: true, message: 'Everything is good for removing ', _id: childs[i].v_id })
                            }
                            catch (e) {
                                errors.push(e + " " + childs[i].v_id);
                            }
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

            }
            //Remove selected node
            var key = id.split('/')[1];
            var coll = id.split('/')[0];
            try {
                db._query(`REMOVE "${key}" IN ${coll}`);
                successes.push({ success: true, message: 'Everything is good for removing ', _id: id })

            }
            catch (e) {
                errors.push({ success: false, message: e + " " + id, _key: key });
            }
        }



        if (errors.length === 0) {
            res.send({ success: true, message: "No errors detected", res_obj: successes });
        }
        else {
            res.send({ success: false, message: "error detected", res_obj: errors });
        }
    }
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        ids: joi.array().items(joi.string().required()).required(),
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required()
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
        var successes = [];

        //Remove relation to parent of selected node in edge collection
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
            // remove sample and observations unit edge from OU to sample
            if (childs[i].e_id.includes("observation_units_edge")) {
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
                if (childs[i].v_id.includes("samples")) {
                    if ((childs[i].v_id !== null) || (childs[i].v_key !== null)) {
                        var child_coll = childs[i].v_id.split("/")[0];
                        var child_vkey = childs[i].v_key;
                        try {
                            db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                            successes.push({ success: true, message: 'Everything is good for removing ', _id: childs[i].v_id })

                        }
                        catch (e) {
                            errors.push(e + " " + childs[i].v_id);
                        }
                    }

                }
            }
            else {
                //Delete child vertice in collection except if child is a person
                if (!childs[i].v_id.includes('persons')) {
                    if ((childs[i].v_id !== null) || (childs[i].v_key !== null)) {
                        var child_coll = childs[i].v_id.split("/")[0];
                        var child_vkey = childs[i].v_key;
                        try {
                            db._query(`REMOVE "${child_vkey}" IN ${child_coll}`);
                            successes.push({ success: true, message: 'Everything is good for removing ', _id: childs[i].v_id })
                        }
                        catch (e) {
                            errors.push(e + " " + childs[i].v_id);
                        }
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

        }
        //Remove selected node
        var key = id.split('/')[1];
        var coll = id.split('/')[0];
        try {
            db._query(`REMOVE "${key}" IN ${coll}`);
            successes.push({ success: true, message: 'Everything is good for removing ', _id: id })

        }
        catch (e) {
            errors.push({ success: false, message: e + " " + id, _key: key });
        }



        if (errors.length === 0) {
            res.send({ success: true, message: "No errors detected", res_obj: successes });
        }
        else {
            res.send({ success: false, message: "error detected", res_obj: errors });
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
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');


// ADD ROUTINES
//Post new data
router.post('/add_edge', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role
    var parent_id = req.body.parent_id;
    var person_id = req.body.person_id;
    var group_key = req.body.group_key;
    var parent_edge_coll = parent_id.split("/")[0] + '_edge'
    if (!db._collection(parent_edge_coll)) {
        db._createEdgeCollection(parent_edge_coll);
    }
    const parent_edge = db._collection(parent_edge_coll);
    var edge_obj = {}
    if (parent_id.split('/')[0].includes("investigation")) {
        var edge_obj = {
            "_from": parent_id,
            "_to": person_id,
            "role": role,
            "group_keys": [group_key]
        };
    }
    else {
        var edge_obj = {
            "_from": parent_id,
            "_to": person_id,
            "role": role
        };
    }
    const edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${parent_edge} RETURN NEW `);
    res.send({ success: true, message: 'Everything is good for shared project saving', _id: parent_id })
})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        role: joi.string().required(),
        parent_id: joi.string().required(),
        person_id: joi.string().required(),
        group_key: joi.string().allow('').required()

    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        _id: joi.string().required(),
    }).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');

//Post new data
router.post('/add_template', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var role = req.body.role;


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
    // get users edge
    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);

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
        // add template
        /////////////////////////////

        if (!db._collection("templates")) {
            db._createDocumentCollection("templates");
        }
        var template_coll = db._collection("templates");

        var templates_edge_coll = 'templates_edge'
        if (!db._collection(templates_edge_coll)) {
            db._createEdgeCollection(templates_edge_coll);
        }
        const templates_edge = db._collection(templates_edge_coll);

        var data = [];
        //var cleaned_values = { ...values }
        values["_model_type"] = model_type
        data = db._query(aql`INSERT ${values} IN ${template_coll} RETURN { new: NEW, id: NEW._id } `).toArray();

        //data =db._query(aql`UPSERT ${values} INSERT ${values} UPDATE {}  IN ${coll} RETURN { before: OLD, after: NEW, id: NEW._id } `).toArray(); 
        if (data[0].new !== null) {
            var edge_obj = {
                "_from": user[0]._id,
                "_to": data[0].id
            };

            const edges = db._query(aql`UPSERT ${edge_obj} INSERT ${edge_obj} UPDATE {}  IN ${users_edge} RETURN NEW `);
            //res.send({ success: true, message: 'Everything is good ', _id: data[0].id });
            var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
            var obj2 = {
                "_from": data[0].id,
                "_to": person[0],
                "role": role
            };
            const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${templates_edge} RETURN NEW `);

            successes.push({ success: true, message: 'Everything is good for template saving', _id: data[0].id })
        }
        //Document exists
        else {
            ///res.send({ success: false, message: model_type + ' collection already have document with this title ', _id: 'none' });
            errors.push({ success: false, message: model_type + ' collection already have document with this title ', _id: null })
        }

    };
    if (errors.length === 0) {
        res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_id: successes[0]['_id'] });
    }
    else {
        res.send({ success: false, message: model_type + ' collection already have document with this title ', res_obj: errors, template_id: "", _id: "" });
    }

})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required(),
        role: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required(),
        template_id: joi.string().required()
    }).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');



/*  router.post('/add_study_from_file', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var parent_id = req.body.parent_id;
    var datafile_id = 'data_files/'+req.body.datafile_key;
    var study_model = req.body.study_model;
    
    var study_coll = db._collection('studies');
    if (!study_coll) {
        db._createDocumentCollection('studies');
    }
    var errors = []
    var successes = []
    /////////////////////////////
    //first check if user exist
    /////////////////////////////
    const user = db._query(aql`
        FOR entry IN ${users}
            FILTER entry.username == ${username}
            FILTER entry.password == ${password}
            RETURN entry`).toArray();

    if (user[0] === null) {
        errors.push({ success: false, message: 'Username ' + username + ' doesn\'t exists' })
    }
    else {
        var data = [];
            data = db._query(aql`INSERT ${study_model} IN ${study_coll} RETURN { new: NEW, id: NEW._id } `).toArray();
            if (data[0].new === null) {
                errors.push({ success: false, message: + ' Study collection already have document with this title ', _id: null })
            }
            //Document exists add edges in edge collection
            else {
                var obj = {
                    "_from": parent_id,
                    "_to": data[0].id,
                };
                const edges = db._query(aql`UPSERT ${obj} INSERT ${obj} UPDATE {}  IN ${edge} RETURN NEW `);
                    
                    
                var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                console.log(person)
                var obj2 = {
                    "_from": data[0].id,
                    "_to": person[0],
                    "role": role
                };

                const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${studies_edge} RETURN NEW `);
            }
            successes.push({ success: true, message: 'Everything is good for adding ' + as_template, _id: data[0].id })
            const datafile = db._query(aql`
                FOR entry IN ${data_files}
                    FILTER entry._id == ${datafile_id}
                     RETURN entry`).toArray();
            }
    }
    }).body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        role: joi.string().required(),
        parent_id: joi.string().required(),
        datafile_key: joi.string().required(),
        study_model: joi.object().required(),
    }).required(), 'Values to check.')
    .response(joi.object({
        success: true,
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required(),
        template_id: joi.string().required(),
        _id: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist and update specific field in MIAPPE model.');
     */



router.post('/change_datafile_header', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var datafile_key = req.body.datafile_key;
    var datafile_header = req.body.datafile_header;
    var value = req.body.value;
    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);
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
        res.send({ success: false, message: 'Username ' + username + ' doesn\'t exists' })
    }
    else {
        let df_id = "data_files/" + datafile_key

        const edges3 = db._query(aql`
            LET document = DOCUMENT(${df_id})
            LET alteredData = (
                FOR element IN document.Data

                    LET newItem = (element[${datafile_header}] == ${model_data[model_field]} ? MERGE(element, { "Study linda ID": ${data[0].id} }) : element)
                    RETURN newItem
            )
            LET alteredAssociateHeaders = (
                FOR element IN document.associated_headers
                    LET newItem = (element.header == ${datafile_header} ? MERGE(element, { associated_component_field: ${model_field}, associated_component: ${model_type}, selected:true, associated_linda_id: PUSH(element.associated_linda_id, ${data[0].id}), associated_values: PUSH(element.associated_values, ${model_data[model_field]} ), associated_parent_id: PUSH(element.associated_parent_id, ${parent_id} )  }) : element)
                    RETURN newItem
            )
                            
            UPDATE document WITH { Data:  alteredData, associated_headers: alteredAssociateHeaders } IN data_files
            RETURN {after: NEW }
        `);


    }


}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    value: joi.string().required(),
    datafile_key: joi.string().required(),
    datafile_header: joi.string().required()
}).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required()
    }).required(), 'response to send.')
    .summary('Modify header in datafile')
    .description('Modify header in datafile using datafile key');
//Post new data
router.post('/add_multiple', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var as_template = req.body.as_template;
    var group_key = req.body.group_key;
    var datafile_key = req.body.datafile_key;
    var datafile_header = req.body.datafile_header;
    var model_field = req.body.model_field;
    var parent_ids = req.body.parent_ids;

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
    console.log(edge_coll)
    const edge = db._collection(edge_coll);

    var investigations_edge_coll = 'investigations_edge'
    if (!db._collection(investigations_edge_coll)) {
        db._createEdgeCollection(investigations_edge_coll);
    }
    const investigations_edge = db._collection(investigations_edge_coll);

    var studies_edge_coll = 'studies_edge'
    if (!db._collection(studies_edge_coll)) {
        db._createEdgeCollection(studies_edge_coll);
    }
    const studies_edge = db._collection(studies_edge_coll);

    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);


    var errors = []
    var successes = []
    var final_data = []
    var df = []

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
        errors.push({ success: false, message: 'Username ' + username + ' doesn\'t exists' })
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
            //var cleaned_values = { ...values }
            var cleaned_values = Object.assign({}, values);
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
        //else check if investigation exists and add to database
        /////////////////////////////
        else {
            var data = [];
            var ids = []
            for (let index = 0; index < values.length; index++) {
                parent_id = parent_ids[index]

                const model_data = values[index];
                data = db._query(aql`INSERT ${model_data} IN ${coll} RETURN { new: NEW, id: NEW._id } `).toArray();
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
                        if (model_type === 'investigation') {
                            var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                            console.log(person)
                            var obj2 = {
                                "_from": data[0].id,
                                "_to": person[0],
                                "role": role,
                                "group_keys": [group_key]
                            };

                            const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${investigations_edge} RETURN NEW `);
                        }
                        if (model_type === 'study') {
                            var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                            console.log(person)
                            var obj2 = {
                                "_from": data[0].id,
                                "_to": person[0],
                                "role": role
                            };

                            const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${studies_edge} RETURN NEW `);
                        }

                        ids.push(data[0].id)


                        if (datafile_key !== '') {
                            let df_id = "data_files/" + datafile_key
                            if (model_type === 'study') {

                                const edges3 = db._query(aql`
                                LET document = DOCUMENT(${df_id})
                                LET alteredData = (
                                    FOR element IN document.Data
                                            LET newItem = (element[${datafile_header}] == ${model_data[model_field]} ? MERGE(element, { "Study linda ID": ${data[0].id} }) : element)
                                            RETURN newItem
                                )
                                LET alteredAssociateHeaders = (
                                    FOR element IN document.associated_headers
                                            LET newItem = (element.header == ${datafile_header} ? MERGE(element, { associated_component_field: ${model_field}, associated_component: ${model_type}, selected:true, associated_linda_id: PUSH(element.associated_linda_id, ${data[0].id}), associated_values: PUSH(element.associated_values, ${model_data[model_field]} ), associated_parent_id: PUSH(element.associated_parent_id, ${parent_id} )  }) : element)
                                            RETURN newItem
                                )
                            
                                UPDATE document WITH { Data:  alteredData, associated_headers: alteredAssociateHeaders } IN data_files
                                RETURN {after: NEW }
                                `);
                            }
                            else {

                                //let value = model_data[model_field]
                                const edges3 = db._query(aql`
                                LET document = DOCUMENT(${df_id})
                                LET alteredAssociateHeaders = (
                                    FOR element IN document.associated_headers
                                            LET newItem = (element.header == ${datafile_header} ? MERGE(element, { associated_component_field: ${model_field}, associated_component: ${model_type}, selected:true, associated_linda_id: PUSH(element.associated_linda_id, ${data[0].id}), associated_values: PUSH(element.associated_values, ${model_data[model_field]} ), associated_parent_id: PUSH(element.associated_parent_id, ${parent_id} ) }) : element)
                                            RETURN newItem
                                )
                                UPDATE document WITH { associated_headers: alteredAssociateHeaders } IN data_files
                                RETURN {after: NEW }
                                `);
                            }
                            //console.log(edges3)
                        }


                        successes.push({ success: true, message: 'Everything is good for adding ' + as_template, _id: data[0].id })
                    }
                }
            }
            if (datafile_key !== '') {
                df = db._query(aql`
                FOR entry IN data_files
                FILTER entry._key == ${datafile_key}
                RETURN entry
              `).toArray();
            }


        }
    };
    if (errors.length === 0) {
        if (as_template) {
            res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_ids: ids, _ids: [], datafile: {} });

        }
        else {
            if (datafile_key !== '') {
                res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_id: [], _ids: ids, datafile: df[0] });

            }
            else {
                res.send({ success: true, message: 'Everything is good ', res_obj: successes, template_id: [], _ids: ids, datafile: {} });

            }

        }
    }
    else {
        res.send({ success: false, message: model_type + ' collection already have document with this title ', res_obj: errors, template_id: [], _ids: [], datafile: {} });
    }

})
    .body(joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        role: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.array().items(joi.object().required()).required(),
        model_type: joi.string().required(),
        as_template: joi.boolean().required(),
        group_key: joi.string().allow('').required(),
        datafile_key: joi.string().allow('').required(),
        datafile_header: joi.string().allow('').required(),
        model_field: joi.string().allow('').required(),
        parent_ids: joi.array().items(joi.string().required()).allow([]).required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required(),
        res_obj: joi.array().items(joi.object().required()).required(),
        template_ids: joi.array().items(joi.string().required()).required(),
        _ids: joi.array().items(joi.string().required()).required(),
        datafile: joi.object().required(),
    }).required(), 'response to send.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');



//Post new data
router.post('/add', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var as_template = req.body.as_template;
    var group_key = req.body.group_key;
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
    console.log(edge_coll)
    const edge = db._collection(edge_coll);

    var investigations_edge_coll = 'investigations_edge'
    if (!db._collection(investigations_edge_coll)) {
        db._createEdgeCollection(investigations_edge_coll);
    }
    const investigations_edge = db._collection(investigations_edge_coll);

    var studies_edge_coll = 'studies_edge'
    if (!db._collection(studies_edge_coll)) {
        db._createEdgeCollection(studies_edge_coll);
    }
    const studies_edge = db._collection(studies_edge_coll);

    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);


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
        errors.push({ success: false, message: 'Username ' + username + ' doesn\'t exists' })
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
            //var cleaned_values = { ...values }
            var cleaned_values = Object.assign({}, values);
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
        //else check if investigation exists and add to database
        /////////////////////////////
        else {
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
                    if (model_type === 'investigation') {
                        var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                        console.log(person)
                        var obj2 = {
                            "_from": data[0].id,
                            "_to": person[0],
                            "role": role,
                            "group_keys": [group_key]
                        };

                        const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${investigations_edge} RETURN NEW `);
                    }
                    if (model_type === 'study') {
                        var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                        console.log(person)
                        var obj2 = {
                            "_from": data[0].id,
                            "_to": person[0],
                            "role": role
                        };

                        const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${studies_edge} RETURN NEW `);
                    }
                    successes.push({ success: true, message: 'Everything is good for adding ' + as_template, _id: data[0].id })
                }
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
        role: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required(),
        as_template: joi.boolean().required(),
        group_key: joi.string().allow('').required()
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
router.post('/extract', function (req, res) {
    //posted variables
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var parent_id = req.body.parent_id;
    var values = req.body.values;
    var model_type = req.body.model_type;
    var as_template = req.body.as_template;
    var datafile_id = req.body.datafile_id;
    var column_original_label = req.body.column_original_label;
    var associated_headers = req.body.associated_headers;
    var group_key = req.body.group_key;



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

    var investigations_edge_coll = 'investigations_edge'
    if (!db._collection(investigations_edge_coll)) {
        db._createEdgeCollection(investigations_edge_coll);
    }
    const investigations_edge = db._collection(investigations_edge_coll);

    var studies_edge_coll = 'studies_edge'
    if (!db._collection(studies_edge_coll)) {
        db._createEdgeCollection(studies_edge_coll);
    }
    const studies_edge = db._collection(studies_edge_coll);

    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);


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
        errors.push({ success: false, message: 'Username ' + username + ' doesn\'t exists' })
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
            //var cleaned_values = { ...values }
            var cleaned_values = Object.assign({}, values);
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
        //else check if investigation exists and add to database
        /////////////////////////////
        else {
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
                    if (model_type === 'investigation') {
                        var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                        console.log(person)
                        var obj2 = {
                            "_from": data[0].id,
                            "_to": person[0],
                            "role": role,
                            "group_keys": [group_key]
                        };

                        const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${investigations_edge} RETURN NEW `);
                    }
                    if (model_type === 'study') {
                        // update associated headers
                        var df_coll = db._collection("data_files");
                        if (!df_coll) {
                            db._createDocumentCollection("data_files");
                        }
                        associated_headers.filter(prop => prop['header'] == column_original_label).forEach(prop => { prop['associated_linda_id'].push(data[0].id); prop['associated_values'].push(values['Study unique ID']); });
                        console.log(associated_headers)
                        var update = db._query(aql` FOR entry IN ${df_coll} FILTER entry._id == ${datafile_id} UPDATE entry WITH {associated_headers: ${associated_headers}} IN ${df_coll} RETURN { before: OLD, after: NEW }`).toArray();
                        var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                        console.log(person)
                        var obj2 = {
                            "_from": data[0].id,
                            "_to": person[0],
                            "role": role
                        };

                        const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${studies_edge} RETURN NEW `);
                    }
                    successes.push({ success: true, message: 'Everything is good for adding ' + as_template, _id: data[0].id })
                }
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
        role: joi.string().required(),
        parent_id: joi.string().required(),
        values: joi.object().required(),
        model_type: joi.string().required(),
        as_template: joi.boolean().required(),
        datafile_id: joi.string().required(),
        associated_headers: joi.array().items(joi.object().required()).required(),
        column_original_label: joi.string().required(),
        group_key: joi.string().allow('').required()
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

    var studies_edge_coll = 'studies_edge'
    if (!db._collection(studies_edge_coll)) {
        db._createEdgeCollection(studies_edge_coll);
    }
    const studies_edge = db._collection(studies_edge_coll);

    var users_edge_coll = 'users_edge'
    if (!db._collection(users_edge_coll)) {
        db._createEdgeCollection(users_edge_coll);
    }
    const users_edge = db._collection(users_edge_coll);


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
    `).toArray();
    if (user[0] === null) {
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
                    var person = get_person_id_from_user_id(user[0]['_id'], users_edge)
                    console.log(person)
                    var obj2 = {
                        "_from": data[0].id,
                        "_to": person[0],
                    };

                    const edges2 = db._query(aql`UPSERT ${obj2} INSERT ${obj2} UPDATE {} IN ${studies_edge} RETURN NEW `);

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
        _id: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');



///checkID

router.post('/checkID', function (req, res) {
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
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
        res.send({
            success: false,
            message: 'nothing in value',
            _id: ""
        });
    }
    const user = db._query(aql`FOR entry IN ${coll} FILTER entry[${field}] == ${value} RETURN entry`).toArray();
    if (user.length === 0) {
        res.send({
            success: true,
            message: 'Person ORCID ' + 'doesn\'t exists',
            _id: ""
        });
    }
    else {
        res.send({
            success: false,
            message: 'user ORCID already exist, cannot use this \" Person ORCID\" ',
            _id: user[0]['Person ID']
        });
    }
})
    .body(joi.object({
        field: joi.string().required(),
        value: joi.string().allow('').required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object({
        success: joi.boolean().required(),
        message: joi.string().required(),
        _id: joi.string().allow('').required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('check if user exist.');



router.post('/check', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var parent_id = req.body.parent_id;
    var field = req.body.field;
    var value = req.body.value;
    var model_type = req.body.model_type;
    var as_template = req.body.as_template;
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
        if (parent_id === "") {
            parent_id = user[0]._id
        }
        console.log(parent_id)
        console.log(field)
        console.log(value)
        console.log(model_type)
        //var user_id = user[0]._id
        if (as_template) {
            check = db._query(aql`FOR v, e IN 1..3 OUTBOUND ${parent_id} GRAPH 'global' FILTER v.${field} == ${value} AND CONTAINS('e._to','templates') RETURN {eto:e._to, vertice:v}`).toArray();
            f
        }
        else {
            check = db._query(aql`FOR v, e IN 1..3 OUTBOUND ${parent_id} GRAPH 'global' FILTER v.${field} == ${value} RETURN {eto:e._to, vertice:v}`).toArray();
        }
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
        parent_id: joi.string().allow('').required(),
        field: joi.string().required(),
        value: joi.string().allow('').required(),
        model_type: joi.string().required(),
        as_template: joi.boolean().required()
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
            // add from study parent to observation unit edge child
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
                var bm_obj = {}
                var bm_db_id = ''
                for (var i = 0; i < observation_units_data.length; i++) {
                    var biological_material_data = values['biological_materials'][i];

                    //var bm_obj = {}
                    // add biological_material link to observation unit edge 
                    if (biological_material_data !== undefined) {
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
                        

                    }
                    //console.log(bm_obj)

                    //create sample document and add to observation unit edge
                    var sample_data = values['samples'][i];
                    if (sample_data !== undefined) {
                        for (var j = 0; j < sample_data.length; j++) {
                            var sample_data_bm = sample_data[j]
                            for (var k = 0; k < sample_data_bm.length; k++) {
                                var data_sample = []
                                sample_data_bm[k]
                                data_sample = db._query(aql`INSERT ${sample_data_bm[k]} IN ${sample_coll} RETURN { new: NEW, id: NEW._id } `).toArray();
                                if (data_sample[0].new === null) {
                                    res.send({ success: false, message: ' sample collection already have document with this title ', _id: 'none' });
                                }
                                //Document exists add edges in edge collection
                                else {
                                    const edges3 = db._query(aql`
                                        LET document = DOCUMENT(${data_sample[0].id})
                                        UPDATE document WITH { 'External ID': ${data_sample[0].id} } IN ${sample_coll}
                                        RETURN {before:OLD,after: NEW }
                                    `).toArray();
                                    if (edges3[0].after['External ID'] !== data_sample[0].id) {
                                        db._query(`REMOVE ${data_sample[0].id.split('/')[1]} IN ${sample_coll}`);
                                        res.send({ success: false, message: ' cannot link sample external ID with Linda ID - sample has been removed', _id: 'none' });
                                    }
                                    else {

                                        var sample_obj = {
                                            "_from": data[0].id,
                                            "_to": data_sample[0].id,
                                        }
                                        var edges4 = db._query(aql`UPSERT ${sample_obj} INSERT ${sample_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                                    }
                                }
                            }
                        }
                    }
                    //Add experimental factor link with each observation unit
                    var experimental_factor_data = values['experimental_factors'][i];
                    if (experimental_factor_data !== undefined) {
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
                }
                if ("_from" in bm_obj) {
                    db._query(aql`UPSERT ${bm_obj} INSERT ${bm_obj} UPDATE {} IN ${observation_unit_edge} RETURN NEW `);
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
                        const edges3 = db._query(aql`
                            LET document = DOCUMENT(${data_sample[0].id})
                                        UPDATE document WITH { 'External ID': ${data_sample[0].id} } IN ${sample_coll}
                                        RETURN {before:OLD,after: NEW }
                                    `).toArray();
                        if (edges3[0].after['External ID'] !== data_sample[0].id) {
                            db._query(`REMOVE ${data_sample[0].id.split('/')[1]} IN ${sample_coll}`);
                            res.send({ success: false, message: ' cannot link sample external ID with Linda ID - sample has been removed', _id: 'none' });
                        }
                        else {
                            //info_message.push("8- sample to add : " + observation_unit_id)
                            var sample_obj = {
                                "_from": observation_unit_id,
                                "_to": data_sample[0].id,
                            }
                            try {

                                db._query(aql`UPSERT ${sample_obj} INSERT ${sample_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                            }
                            catch (e) {
                                info_message.push("9- cannot replace sample: " + JSON.stringify(sample_obj) + e)
                            }
                        }



                        /* info_message.push("8- sample to add : " + observation_unit_id)
                        var sample_obj = {
                            "_from": observation_unit_id,
                            "_to": data_sample[0].id
                        }
                        try {

                            db._query(aql`UPSERT ${sample_obj} INSERT ${sample_obj} UPDATE {}  IN ${observation_unit_edge} RETURN NEW `);
                        }
                        catch (e) {
                            info_message.push("9- cannot replace sample: " + JSON.stringify(sample_obj) + e)
                        } */

                    }
                }
                catch (e) {
                    info_message.push("6- ccannot insert sample: " + e)

                }
            }


        }
    }


}
router.post('/update_observation_units_with_bm', function (req, res) {
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
            // this obsUUID is not present in the new updated document (observation_unit_doc)
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
        // Document exists 
        // update edges in edge collection
        else {
            info_message.push("2- observation unit has been updated and child data has been cleaned \n" + data[0].after['obsUUID'])
            // loop for each observation and get all bms, all efs, all samples
            var all_bm = []
            for (var i = 0; i < observation_units_data.length; i++) {
                var biological_material_data = values['biological_materials'][i];
                //get all biological material
                for (var j = 0; j < biological_material_data.length; j++) {
                    all_bm.push(biological_material_data[j])
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
            //Add new bm biological material list in edge document or create document if they are not present
            add_bm_data(db, all_bm, observation_unit_edge, observation_unit_id)
            //info_message.push("3- good: " + JSON.stringify(all_ef))
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
        }).required(),
        model_type: joi.string().required()
    }).required(), 'Values to check.')
    .response(joi.object().keys({
        success: joi.boolean().required(),
        message: joi.string().required()
    }).required(), 'response.')
    .summary('List entry keys')
    .description('add MIAPPE description for given model.');

router.post('/update_observation_units_and_childs', function (req, res) {
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
            // this obsUUID is not present in the new updated document (observation_unit_doc)
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
        // Document exists 
        // update edges in edge collection
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

router.get('/get_observation_unit_childs_by_type/:observation_unit_key/:model_type', function (req, res) {
    var observation_unit_id = "observation_units/" + req.pathParams.observation_unit_key;
    var model_type = req.pathParams.model_type;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..1 OUTBOUND ${observation_unit_id} GRAPH 'global' FILTER CONTAINS(e._to,${model_type})  RETURN {e:e}`);
    res.send(data);
})
    .pathParam('observation_unit_key', joi.string().required(), 'observation unit id of the entry.')
    .pathParam('model_type', joi.string().required(), 'model type of the entry.')
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


router.get('/get_templates/:person_key', function (req, res) {
    var person_id = "persons/" + req.pathParams.person_key;
    var data = [];
    data = db._query(aql`FOR v, e, s IN 1..3 INBOUND ${person_id} GRAPH 'global' PRUNE e._to ==${person_id} FILTER CONTAINS(e._from, "templates") RETURN {template:s.vertices[1],role:e.role, groups:{template_id:v._id, group_keys:e.group_keys}, roles:{template_id:v._id, role:e.role}}`);
    res.send(data);
})
    .pathParam('person_key', joi.string().required(), 'user id of the entry.')
    .response(joi.array().items(joi.object().required()).required(), 'List of entry keys.')
    //.response(joi.object().required(), 'List of entry keys.')
    .summary('List entry keys')
    .description('Assembles a list of keys of entries in the collection.');



//Get templates - used in template selection dialog component
router.get('/get_templates_by_user/:user_key/:model_coll/', function (req, res) {
    try {
        var user_key = req.pathParams.user_key;
        var model_coll = req.pathParams.model_coll;

        var coll_name = 'templates'
        var data = [];
        const users_edge = db._collection('users_edge');
        if (!users_edge) {
            db._createDocumentCollection('users_edge');
        }
        const coll = db._collection(coll_name);
        if (!coll) {
            db._createDocumentCollection(coll_name);
        }

        var user_id = "users/" + user_key

        var edges_data = users_edge.byExample({ "_from": user_id }).toArray();
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

router.get('/get_template_by_key/:key', function (req, res) {
    try {
        var key = req.pathParams.key;
        var data = [];
        var datatype = 'templates';
        const coll = db._collection(datatype);
        if (!coll) {
            db._createDocumentCollection(datatype);
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

}).pathParam('key', joi.string().required(), 'unique key.')
    .response(joi.array().items(joi.object().required()).required(), 'Entry stored in the collection.')
    .summary('Retrieve an entry')
    .description('Retrieves an entry from the "myFoxxCollection" collection by key.');


//Get templates
/* router.get('/get_all_templates/:user_key/', function (req, res) {
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

 */


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