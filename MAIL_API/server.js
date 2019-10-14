
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
//const queues = require('@arangodb/foxx/queues')
//const queue1 = queues.create("my-queue");

//queue1.push(
//  { mount: "/mail", name: "send-mail"},
//  { to: "bdartigues@gmail.com", body: "Hello world"}
//);



//
//
//



//router.get(function (req, res) {
//  //module.context.mount === '/my-foxx-1';
//  //req.context.mount === '/my-foxx-2';
//  res.write('Hello from my-foxx-1');
//});



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


router.get('/test/:pswd', function (req, res) {
    
    var pwd=req.pathParams.pwd;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bdartigues@gmail.com',
            pass: pwd
        }
    });
//
//    var mailOptions = {
//        from: 'youremail@gmail.com',
//        to: 'myfriend@yahoo.com',
//        subject: 'Sending Email using Node.js',
//        text: 'That was easy!'
//    };
//
//    transporter.sendMail(mailOptions, function(error, info){
//      res.headers['Access-Control-Allow-Credentials'] = true;
//        res.headers['Access-Control-Allow-Origin'] = true;
//      if (error) {
//        res.send('Error ');
//      } else {
//          res.send('Email sent: ');
//      }
//    });   
    res.send(req.pathParams.pswd);
})
.pathParam('pswd', joi.string().required(), 'pwd of the entry.')
.response(joi.string().required(), 'List of entry keys.')
.summary('List entry keys')
.description('Assembles a list of keys of entries in the collection.');