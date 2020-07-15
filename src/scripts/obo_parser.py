#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
A constant-space parser for the GeneOntology OBO v1.2 & v1.4 format
https://owlcollab.github.io/oboformat/doc/GO.format.obo-1_4.html
Version 1.1: Python3 ready & --verbose CLI option
"""
from __future__ import with_statement

from collections import defaultdict
# coding: utf-8

from arango import ArangoClient
from utils import *
import json


def processGOTerm(goTerm):
    """
    In an object representing a GO term, replace single-element lists with
    their only member.
    Returns the modified object as a dictionary.
    """
    ret = dict(goTerm)  # Input is a defaultdict, might express unexpected behaviour
    #print(ret)
    for key, value in ret.items():
        if len(value) == 1:
            ret[key] = value[0]
    return ret


def parseGOOBOTD(filename):
    """
    Parses a Gene Ontology dump in OBO v1.2 format.
    Yields each
    Keyword arguments:
        filename: The filename to read
    """
    with open(filename, "r") as infile:
        currentGOTerm = None
        currentGoTypeDef =None
        cpt=0
        for line in infile:

            line = line.strip()
            #print(line + "---")
            if not line: continue  # Skip empty
            if line == "[Term]":
                #print(line + "@@@")
                #print(currentGOTerm)
                currentGOTerm = None
            elif line == "[Typedef]":
                if currentGOTerm: yield processGOTerm(currentGOTerm)
                currentGOTerm = defaultdict(list)
                # Skip [Typedef sections]

            elif line == "[Instance]":
                # Skip [Typedef sections]
                if currentGOTerm: yield processGOTerm(currentGOTerm)
                currentGOTerm = defaultdict(list)
                currentGOTerm = None

            else:  # Not [Term]
                # Only process if we're inside a [Term] environment
                if currentGOTerm is None: continue

                key, sep, val = line.partition(":")
                #print(key,val)
                currentGOTerm[key].append(val.strip())
            cpt+=1
            # if cpt==4:
            #     sys.exit()
        # Add last term
        if currentGOTerm is not None:
            yield processGOTerm(currentGOTerm)





def parseGOOBO(filename):
    """
    Parses a Gene Ontology dump in OBO v1.2 format.
    Yields each
    Keyword arguments:
        filename: The filename to read
    """
    with open(filename, "r") as infile:
        currentGOTerm = None
        currentGoTypeDef =None
        cpt=0
        for line in infile:

            line = line.strip()
            #print(line + "---")
            if not line: continue  # Skip empty
            if line == "[Term]":
                #print(line + "@@@")
                #print(currentGOTerm)
                if currentGOTerm: yield processGOTerm(currentGOTerm)
                currentGOTerm = defaultdict(list)
            elif line == "[Typedef]":
                if currentGOTerm: yield processGOTerm(currentGOTerm)
                currentGOTerm = defaultdict(list)
                # Skip [Typedef sections]
                currentGOTerm = None
            elif line == "[Instance]":
                # Skip [Typedef sections]
                currentGOTerm = None

            else:  # Not [Term]
                # Only process if we're inside a [Term] environment
                if currentGOTerm is None: continue

                key, sep, val = line.partition(":")
                #print(key,val)
                currentGOTerm[key].append(val.strip())
            cpt+=1
            # if cpt==4:
            #     sys.exit()
        # Add last term
        if currentGOTerm is not None:
            yield processGOTerm(currentGOTerm)


def parseGOOBOI(filename):
    """
    Parses a Gene Ontology dump in OBO v1.2 format.
    Yields each
    Keyword arguments:
        filename: The filename to read
    """
    with open(filename, "r") as infile:
        currentGOTerm = None
        currentGoTypeDef =None
        cpt=0
        for line in infile:

            line = line.strip()
            #print(line + "---")
            if not line: continue  # Skip empty
            if line == "[Term]":
                currentGOTerm = None
            elif line == "[Typedef]":

                # Skip [Typedef sections]
                currentGOTerm = None
            elif line == "[Instance]":
                if currentGOTerm: yield processGOTerm(currentGOTerm)
                currentGOTerm = defaultdict(list)
                # Skip [Typedef sections]


            else:  # Not [Term]
                # Only process if we're inside a [Term] environment
                if currentGOTerm is None: continue

                key, sep, val = line.partition(":")
                #print(key,val)
                currentGOTerm[key].append(val.strip())
            cpt+=1
            # if cpt==4:
            #     sys.exit()
        # Add last term
        if currentGOTerm is not None:
            yield processGOTerm(currentGOTerm)


# def get_childs(node):
#     graph = obonet.read_obo("http://data.bioontology.org/ontologies/XEO/submissions/4/download?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb")
#     id_to_name = {id_: data.get('name') for id_, data in graph.nodes(data=True)}
#     name_to_id = {data['name']: id_ for id_, data in graph.nodes(data=True) if 'name' in data}
#     for parent, child, key in graph.in_edges(node, keys=True):
#         print(f'• {id_to_name[parent]} ⟵ {key} ⟵ {id_to_name[child]}')
#         get_childs(name_to_id[id_to_name[parent]])



if __name__ == "__main__":
    """Print out the number of GO objects in the given GO OBO file"""
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-i', help='The input file in GO OBO v1.2 format.')
    parser.add_argument('-o', help='The output name document in arangodb.')
    parser.add_argument('-v', '--verbose', action="store_true",
                        help='Print all GO items instead of just printing their count')
    parser.add_argument('-p', help='password')
    args = parser.parse_args()
    # Iterate over GO terms

    import sys
    if args.p:
        password=args.p
    else:
        print("error no password is given !!")
        sys.exit()
    print(password)
    client = initialize_arango_client()
    linda_db=connect_db(client,'MIAPPE_GRAPH','root',password)    
    # List existing graphs in the database.
    ontologies=None
    if linda_db.has_collection('ontologies'):
        #delete_collection(linda_db,'ontologies')
        print("ontologies collection exists")
        ontologies = linda_db.collection('ontologies')
        #miappe = graph_db.graph('miappe')
    else:
        ontologies = linda_db.create_collection('ontologies')

    #sys.exit()


    if args.verbose:
        # graph = obonet.read_obo("http://data.bioontology.org/ontologies/XEO/submissions/4/download?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb")
        # id_to_name = {id_: data.get('name') for id_, data in graph.nodes(data=True)}
        # name_to_id = {data['name']: id_ for id_, data in graph.nodes(data=True) if 'name' in data}
        # print(len(graph))
        # print(graph.number_of_edges())
        # print(networkx.is_directed_acyclic_graph(graph))
        # node = name_to_id['EnvironmentVariable']
        # get_childs(node)
        # for parent, child, key in graph.in_edges(node, keys=True):
        #     print(f'• {id_to_name[child]} ⟵ {key} ⟵ {id_to_name[parent]}')


        #sys.exit()




        termCounter = 0
        d={}
        test=[]
        for goTerm in parseGOOBO(args.i):
            print(goTerm)
            test.append(goTerm)
            termCounter += 1
        print ("Found %d GO terms" % termCounter)
        d['term']=test
        #ontologies.insert(d)

        #d = {}
        termCounter = 0
        test = []
        for goTerm in parseGOOBOTD(args.i):
            print(goTerm)
            test.append(goTerm)
            termCounter += 1
        print ("Found %d GO typedef" % termCounter)
        d['typedef'] = test
        #ontologies.insert(d)

        #d = {}
        termCounter = 0
        test = []
        for goTerm in parseGOOBOI(args.i):
            print(goTerm)
            test.append(goTerm)
            termCounter += 1
        print ("Found %d GO Instances" % termCounter)
        d['instance'] = test
        d['name'] = args.o
        print(d)
        ontologies.insert(d)
    else:
        termCounter = 0
        for goTerm in parseGOOBO(args.i):
            termCounter += 1
        print ("Found %d GO terms" % termCounter)
