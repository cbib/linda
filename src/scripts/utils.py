#!/usr/bin/python

from arango import ArangoClient
import sys
# Initialize the ArangoDB client.
def initialize_arango_client():
    client = ArangoClient(protocol='http', host='10.71.10.106', port=8529)
    return client

# Connect to "_system" database as root user.
# This returns an API wrapper for "_system" database.
def connect_db(client, db,username,password):
    db = client.db(db, username=username, password=password)
    return db

# List all databases.
def list_all_databases(system_db):
    # List all databases.
    print(system_db.databases())


# Create a new database named "test" if it does not exist.
# Only root user has access to it at time of its creation.
def create_database(system_db,db_name):
    if not system_db.has_database(db_name):
        system_db.create_database(db_name)


def update(key_col, key_doc,collection, val_doc):
    doc = collection[key_col]
    doc[key_doc] = val_doc
    doc.save()

# Create a new vertex collection named "study" if it does not exist.
# This returns an API wrapper for "study" vertex collection.
def create_vertex_collection(graph,label):
    if graph.has_vertex_collection(label):

        v_col = graph.vertex_collection(label)
    else:
        v_col = graph.create_vertex_collection(label)
        # Vertex collections have similar interface as standard collections.
        #v_col.properties()
    return v_col

#def delete_vertex_collection(graph,label):
#    if graph.has_vertex_collection(label):
#        graph.delete_vertex_collection(label)

def delete_graph(db,label):
    db.delete_graph(label)


def list_vertex_collections(miappe):# List vertex collections in the graph.
    return miappe.vertex_collections()
