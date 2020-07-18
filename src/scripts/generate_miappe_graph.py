#!/usr/bin/python

# coding: utf-8

from arango import ArangoClient
from utils import *
import sys
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('-p', help='password')
args = parser.parse_args()

if args.p:
	password=args.p
else:
	print("error no password is given !!")
	sys.exit()
print(password)
# Initialize the ArangoDB client.
client = initialize_arango_client()

sys_db=connect_db(client,'_system','root',password)

########GRAPH PART##################@
create_database(sys_db,'MIAPPE_GRAPH')
# Connect to "test" database as root user.
graph_db=connect_db(client,'MIAPPE_GRAPH','root',password)

# List existing graphs in the database.
graph_db.graphs()



# Create a new graph named "school" if it does not already exist.
# This returns an API wrapper for "school" graph.
if graph_db.has_graph('miappe'):
    delete_graph(graph_db,'miappe')
    miappe = graph_db.create_graph('miappe')
    #miappe = graph_db.graph('miappe')
else:
    miappe = graph_db.create_graph('miappe')
# Retrieve various graph properties.
print(miappe.name)
print(miappe.db_name)
print(miappe.vertex_collections())
print(miappe.edge_definitions())




# Create an edge definition named "teach". This creates any missing
# collections and returns an API wrapper for "teach" edge collection.
if not miappe.has_edge_definition('miappe_edge'):
    miappe_edge = miappe.create_edge_definition(
        edge_collection='miappe_edge',
        from_vertex_collections=['investigation'],
        to_vertex_collections=['study']
    )

investigation=create_vertex_collection(miappe,'investigation')
study=create_vertex_collection(miappe,'study')
person=create_vertex_collection(miappe,'person')
data_file=create_vertex_collection(miappe,'data_file')
publication=create_vertex_collection(miappe,'publication')
environment=create_vertex_collection(miappe,'environment')
event=create_vertex_collection(miappe,'event')
observation_unit=create_vertex_collection(miappe,'observation_unit')
observed_variable=create_vertex_collection(miappe,'observed_variable')
sample=create_vertex_collection(miappe,'sample')
biological_material=create_vertex_collection(miappe,'biological_material')
factor=create_vertex_collection(miappe,'factor')
factor_value=create_vertex_collection(miappe,'factor_value')
experimental_factor=create_vertex_collection(miappe,'experimental_factor')

#list_vertex_collections(miappe)

# for coll in list_vertex_collections(miappe):
#     print(coll)
#     miappe.delete_vertex_collection(coll,purge=True)




if not investigation.has('Investigation'):
    investigation.insert(
        {
            "Definition": "Investigations are research programmes with defined aims. They can exist at various scales (for example, they could encompass a grant-funded programme of work, the various components comprising a peer-reviewed publication, or a single experiment).",
            "Associated publication": {
                "Definition": "An identifier for a literature publication where the investigation is described. Use of DOIs is recommended.",
                "Level": "1",
                "Example": "doi:10.1371/journal.pone.0071377",
                "Format": "DOI",
                "Position": "7"
            },
            "Short title": {
                "Example": "FRIM01",
                "Level": "1",
                "Format": "Free text (short)",
                "Definition": "Short name for investigation",
                "Position": "2"
            },
            "Investigation unique ID": {
                "Definition": "Identifier comprising the unique name of the institution/database hosting the submission of the investigation data, and the accession number of the investigation in that institution.",
                "Level": "1",
                "Example": "EBI:12345678",
                "Format": "Unique identifier",
                "Position": "1"
            },
            "License": {
                "Definition": "License for the reuse of the data associated with this investigation. The Creative Commons licenses cover most use cases and are recommended.",
                "Level": "1",
                "Example": "CC BY-SA 4.0, Unreported",
                "Format": "Unique identifier",
                "Position": "8"
            },
            "Submission date": {
                "Definition": "Date of submission of the dataset presently being described to a host repository.",
                "Level": "1",
                "Example": "2012-12-17",
                "Format": "Date/Time (ISO 8601, optional time zone)",
                "Position": "5"
            },
            "Investigation description": {
                "Definition": "Human-readable text describing the investigation in more detail.",
                "Level": "1",
                "Example": "The migration of maize from tropical to temperate climates was accompanied by a dramatic evolution in flowering time. To gain insight into the genetic architecture of this adaptive trait, we conducted a 50K SNP-based genome-wide association and diversity investigation on a panel of tropical and temperate American and European representatives.",
                "Format": "Free text",
                "position": "4"
            },
            "Investigation title": {
                "Definition": "Human-readable string summarising the investigation.",
                "Level": "1",
                "Example": "Adaptation of Maize to Temperate Climates: Mid-Density Genome-Wide Association Genetics and Diversity Patterns Reveal Key Genomic Regions, with a Major Contribution of the Vgt2 (ZCN8) Locus.",
                "Format": "Free text (short)",
                "Position": "3"
            },
            "Public release date": {
                "Definition": "Date of first public release of the dataset presently being described.",
                "Level": "1",
                "Example": "2013-02-25",
                "Format": "Date/Time (ISO 8601, optional time zone)",
                "Position": "6"
            }
        }

    )
    #investigation.insert({'_key': 'Investigation_2', 'title': 'blablabla','description':'blabla','sub_date':'10 Aout 1979','release_date':'30 Sept 2019','License':'Ben','miappe_version':'1.0','ass_pub':'pudmed223444'})

if not study.has('Study'):
    study.insert(
        {
            "Definition": "A study (or experiment) comprises a series of assays (or measurements) of one or more types, undertaken to answer a particular biological question.",
            "Description of growth facility": {
                "Definition": "Short description of the facility in which the study was carried out.",
                "Level": "3",
                "Example": "field environment condition NA",
                "Format": "Free text (short)",
                "Position": "18"
            },
            "Study unique ID": {
                "Definition": "Unique identifier comprising the name or identifier for the institution/database hosting the submission of the study data, and the identifier of the study in that institution.",
                "Level": "1",
                "Example": "EBI:12345678 http://phenome-fppn.fr/maugio/2013/t2351",
                "Format": "Unique identifier",
                "Position": "1"
            },
            "Short title": {
                "Example": "Study01",
                "Level": "1",
                "Format": "Free text (short)",
                "Definition": "Short name for study",
                "Position": "2"
            },
            "Type of growth facility": {
                "Definition": "Type of growth facility in which the study was carried out, in the form of an accession number from the Crop Ontology.",
                "Level": "3",
                "Example": "CO_715:0000162",
                "Format": "Crop Ontology term (subclass of \"CO_715:0000005\")",
                "Associated ontologies": [
                    "CO_715"
                ],
                "Position": "17"
            },
            "Cultural practices": {
                "Definition": "General description of the cultural practices of the study.",
                "Level": "3",
                "Example": "Irrigation was applied according needs during summer to prevent water stress.",
                "Format": "Free text",
                "Position": "16"
            },
            "Contact institution": {
                "Definition": "Name and address of the institution responsible for the study.",
                "Level": "1",
                "Example": "UMR de Genetique Vegetale, INRA Universite Paris-Sud CNRS, Gif-sur-Yvette, France",
                "Format": "Free text (short)",
                "Position": "7"
            },
            "Geographic location (longitude)": {
                "Definition": "Longitude of the experimental site in degrees, in decimal format.",
                "Level": "2",
                "Example": "+3.967454",
                "Format": "Degrees in the decimal format (ISO 6709)",
                "Position": "12"
            },
            "Study title": {
                "Definition": "Human-readable text summarising the study",
                "Level": "1",
                "Example": "2002 evaluation of flowering time for a panel of 375 maize lines at the experimental station of Maugio (France). ",
                "Format": "Free text (short)",
                "Position": "3"
            },
            "End date of study": {
                "Definition": "Date and, if relevant, time when the experiment ended",
                "Level": "1",
                "Example": "2002-11-27",
                "Format": "Date/Time (ISO 8601, optional time zone)",
                "Position": "6"
            },
            "Map of experimental design": {
                "Definition": "Representation of the experimental design.",
                "Level": "3",
                "Example": "https://urgi.versailles.inra.fr/files/ephesis/181000503/181000503_plan.xls",
                "Format": "URL or File name (of gis or tabular file like csv or tsv)",
                "Position": "15"
            },
            "Experimental site name": {
                "Definition": "The name of the natural site, experimental field, greenhouse, phenotyping facility, etc. where the experiment took place.",
                "Level": "2",
                "Example": "INRA, UE Diascope - Chemin de Mezouls - Domaine experimental de Melgueil - 34130 Mauguio - France",
                "Format": "Free text (short)",
                "Position": "8"
            },
            "Description of the experimental design": {
                "Definition": "Short description of the experimental design, possibly including statistical design. In specific cases, e.g. legacy datasets or data computed from several studies, the experimental design can be \"unknown\"/\"NA\", \"aggregated/reduced data\", or simply 'none'.",
                "Level": "3",
                "Example": "Lines were repeated twice at each location using a complete block design. In order to limit competition effects, each block was organized into four sub-blocks corresponding to earliness groups based on a priori information. ",
                "Format": "Free text",
                "Position": "14"
            },
            "Start date of study": {
                "Definition": "Date and, if relevant, time when the experiment started",
                "Level": "1",
                "Example": "2002-04-04 2006-09-27T10:23:21+00:00",
                "Format": "Date/Time (ISO 8601, optional time zone)",
                "Position": "5"
            },
            "Study description": {
                "Definition": "Human-readable text describing the study",
                "Level": "1",
                "Example": "2002 evaluation of male and female flowering time for a panel of 375 maize lines representing the worldwide genetic diversity at the experimental station of Maugio, France. ",
                "Format": "Free text",
                "Position": "4"
            },
            "Geographic location (country)": {
                "Definition": "The country where the experiment took place, either as a full name or preferably as a 2-letter code.",
                "Level": "2",
                "Example": "FR",
                "Format": "Country name or 2-letter code (ISO 3166)",
                "Position": "9"
            },
            "Observation unit description": {
                "Definition": "General description of the observation units in the study.",
                "Level": "3",
                "Example": "Observation units consisted in individual plots themselves consisting of a row of 15 plants at a density of approximately six plants per square meter. NA",
                "Format": "Free text",
                "Position": "18"
            },
            "Observation unit level hierarchy": {
                "Definition": "Hierarchy of the different levels of repetitions between each others",
                "Level": "3",
                "Example": "block>rep>plot",
                "Format": "Formatted text (level>level)",
                "Position": "19"
            },
            "Type of experimental design": {
                "Definition": "Type of experimental  design of the study, in the form of an accession number from the Crop Ontology.",
                "Level": "3",
                "Example": "CO_715:0000145",
                "Format": "Crop Ontology term (subclass of \"CO_715:0000003\")",
                "Associated ontologies": [
                    "CO_715"
                ],
                "Position": "13"
            },
            "Geographic location (latitude)": {
                "Definition": "Latitude of the experimental site in degrees, in decimal format.",
                "Level": "2",
                "Example": "+43.619264",
                "Format": "Degrees in the decimal format (ISO 6709)",
                "Position": "10"
            },
            "Geographic location (altitude)": {
                "Definition": "Altitude of the experimental site, provided in metres (m).",
                "Level": "2",
                "Example": "100 m",
                "Format": "Numeric + unit abbreviation",
                "Position": "11"
            }
        }
    )
    # study.insert({'_key': 'Study_2', 'title': 'blablabla','description':'blablabla','start_date':'10 Aout 1979','end_date':'30 Sept 2019','contact':'Ben'})
    # study.insert({'_key': 'Study_3', 'title': 'blablabla','description':'blablabla','start_date':'10 Aout 1979','end_date':'30 Sept 2019','contact':'Ben'})

if not person.has('Person'):
    person.insert({
        '_key':'Person',
        'Definition':'A human involved in the investigation or specifically any of its studies.',
        'Person name':{
            'Definition':'The name of the person (either full name or as used in scientific publications)',
            'Example':'Ines Chaves',
            'Format':'Name',
            'Level' : '1'
        },
        'Person email':{
            'Definition':'The electronic mail address of the person.',
            'Example':'ichaves@itqb.unl.pt',
            'Format':'email address',
            'Level' : '1'
        },
        'Person ID':{
            'Definition':'An identifier for the data submitter. If that submitter is an individual, ORCID identifiers are recommended.',
            'Example':'orcid.org/0000-0001-6494-0008; orcid.org/0000-0002-7054-800X',
            'Format':'Unique identifier',
            'Level' : '1'
        },
        'Person role':{
            'Definition':'Type of contribution of the person to the investigation',
            'Example':'data submitter; author; corresponding author',
            'Format':'Free text (short)',
            'Level' : '1'
        },
        'Person affiliation':{
            'Definition':'The institution the person belongs to',
            'Example':'ITQB, Portugal; grid.10772.33',
            'Format':'Free text (short)',
            'Level' : '1'
        }})

if not data_file.has('Data_file'):
    data_file.insert(
        {
            "Definition": "A file or digital object holding observation data recorded during one or more assays of the study, typically in tabular form. Multiple data files may be provided per study, and each file can include observations for several observation units and several observed variables.",
            "Data file version": {
                "Definition": "The version of the dataset (the actual data).",
                "Level": "1",
                "Example": "1.0",
                "Format": "Software version number",
                "Position": "3"
            },
            "Data file link": {
                "Definition": "Link to the data file (or digital object) in a public database or in a persistent institutional repository; or identifier of the data file when submitted together with the MIAPPE submission.",
                "Level": "1",
                "Example": "http://www.ebi.ac.uk/arrayexpress/experiments/E-GEOD-32551/",
                "Format": "URL or File name",
                "Position": "1"
            },
            "Data file description": {
                "Definition": "Description of the format of the data file. May be a standard file format name, or a description of organization of the data in a tabular file.",
                "Level": "1",
                "Example": "FASTA tab - delimited column headers headers: 1.A 2.B 3.C",
                "Format": "Free text (short)",
                "Position": "2"
            }
        }
    )

# if not publication.has('Publication'):
#     publication.insert({
#         '_key': 'Publication',
#         'name': 'blabla',
#         'email':'blabla',
#         'ID':'10 Aout 1979',
#         'role':'30 Sept 2019',
#         'affiliation':'Ben'
#     })

if not environment.has('Environment'):
    environment.insert(
        {
            "Definition": "Environmental parameters that were kept constant throughout the study and did not change between observation units or assays. Environment characteristics that vary over time, i.e. environmental variables, should be recorded as Observed Variables (see below).",
            "Environment parameter": {
                "Definition": "Name of the environment parameter constant within the experiment. ",
                "Level": "1",
                "Example": "sowing density rooting medium composition; pH",
                "Format": "Free text (see Appendix I)",
                "Position": "1"
            },
            "Environment parameter value": {
                "Definition": "Value of the environment parameter (defined above) constant within the experiment.",
                "Level": "1",
                "Example": "300 seeds per m2 Clay 50% plus sand; 6.5",
                "Format": "Free text",
                "Position": "2"
            }
        }
    )


if not event.has('Event'):
    event.insert({
        "Definition": "An event is discrete occurrence at a particular time in the experiment (which can be natural, such as rain, or unnatural, such as planting, watering, etc). Events may be the realization of Factors or parts of Factors, or may be confounding to Factors. Can be applied at the whole study level or to only a subset of observation units.",
        "Event date": {
            "Definition": "Date and time of the event.",
            "Level": "1",
            "Example": "2006-09-27T10:23:21+00:00 2006-10-27; 2006-11-13; 2016-11-21",
            "Format": "Date/Time (ISO 8601, optional time zone)",
            "Position": "4"
        },
        "Event description": {
            "Definition": "Description of the event, including details such as amount applied and possibly duration of the event. ",
            "Level": "1",
            "Example": "Sowing using seed drill Fertilizer application: Ammonium nitrate at 3 kg/m2",
            "Format": "Free text",
            "Position": "3"
        },
        "Event accession number": {
            "Definition": "Accession number of the event type in a suitable controlled vocabulary (Crop Ontology).",
            "Level": "1",
            "Example": "CO_715:0000007 CO_715:0000011",
            "Format": "Crop Ontology term (subclass of CO_715:0000006)",
            "Associated_ontologies": [
                "CO_715"
            ],
            "Position": "1"
        },
        "Event type": {
            "Definition": "Short name of the event.",
            "Level": "1",
            "Example": "Planting Fertilizing",
            "Format": "Free text (short)",
            "Position": "2"
        }
    })

if not observation_unit.has('Observation_unit'):
    observation_unit.insert({
        "Definition": "Observation units are objects that are subject to particular instances of observation and measurement. An observation unit comprises one or more plants, and their environment. Synonym : Experimental unit.",
        "Observation unit ID": {
            "Definition": "Identifier used to identify the observation unit in data files containing the values observed or measured on that unit. Must be locally unique. ",
            "Level": "1",
            "Example": "plot:894",
            "Format": "Unique identifier",
            "Position": "1"
        },
        "Observation unit type": {
            "Definition": "Type of observation unit in textual form, usually one of the following: block, sub-block, plot, plant, trial, pot, replication or replicate, individual, virtual_trial, unit-parcel",
            "Level": "1",
            "Example": "plot",
            "Format": "Free text",
            "Position": "3"
        },
        "External ID": {
            "Definition": "Identifier for the observation unit in a persistent repository, comprises the name of the repository and the identifier of the observation unit therein. The EBI Biosamples repository can be used. URI are recommended when possible.",
            "Level": "1",
            "Example": "Biosamples:SAMEA4202911",
            "Format": "Unique identifier",
            "Position": "2"
        },
        "Spatial distribution": {
            "Definition": "Type and value of a spatial coordinate (georeference or relative) or level of observation (plot 45, subblock 7, block 2) provided as a key-value pair of the form type:value. Levels of observation must be consistent with those listed in the Study section.",
            "Level": "1",
            "Example": "Latitude:+2.341; row:4 ; X:3; Y:6; Xm:35; Ym:65; Block:1; Plot:894",
            "Format": "Formatted text (Key:value)",
            "Position": "5"
        },
        "Observation Unit factor value": {
            "Definition": "List of values for each factor applied to the observation unit.",
            "Level": "1",
            "Example": "Watered",
            "Format": "Free text",
            "Position": "4"
        }
    })

if not observed_variable.has('Observed_variable'):
    observed_variable.insert({
        "Definition": "An observed variable describes how a measurement has been made. It typically takes the form of a measured characteristic of the observation unit (plant or environmental trait), associated to the method and unit of measurement.",
        "Scale": {
            "Definition": "Name of the scale associated with the variable",
            "Level": "2",
            "Example": "degree Celsius day",
            "Format": "Unique identifier",
            "Position": "10"
        },
        "Variable ID": {
            "Definition": "Code used to identify the variable in the data file. We recommend using a variable definition from the Crop Ontology where possible. Otherwise, the Crop Ontology naming convention is recommended: <trait abbreviation>_<method abbreviation>_<scale abbreviation>). A variable ID must be unique within a given investigation.",
            "Level": "1",
            "Example": "Ant_Cmp_Cday",
            "Format": "Unique identifier",
            "Position": "1"
        },
        "Variable name": {
            "Definition": "Name of the variable.",
            "Level": "1",
            "Example": "Anthesis computed in growing degree days",
            "Format": "Free text",
            "Position": "3"
        },
        "Method": {
            "Definition": "Name of the method of observation",
            "Level": "2",
            "Example": "Growing degree days to anthesis",
            "Format": "Free text",
            "Position": "6"
        },
        "Variable accession number": {
            "Definition": "Accession number of the variable in the Crop Ontology",
            "Level": "1",
            "Example": "CO_322:0000794",
            "Format": "Crop Ontology term",
            "Associated ontologies": [
                "CO_322"
            ],
            "Position": "2"
        },
        "Scale accession number": {
            "Definition": "Accession number of the scale in a suitable controlled vocabulary (Crop Ontology).",
            "Level": "2",
            "Example": "CO_322:0000510",
            "Format": "Crop Ontology term",
            "Associated ontologies": [
                "CO_322"
            ],
            "Position": "11"
        },
        "Trait accession number": {
            "Definition": "Accession number of the trait in a suitable controlled vocabulary (Crop Ontology, Trait Ontology).",
            "Level": "1",
            "Example": "CO_322:0000030 TO:0000366",
            "Format": "Term from Plant Trait Ontology, Crop Ontology, or XML Environment Ontology",
            "Associated ontologies": [
                "CO_322",
                "XEO"
            ],
            "Position": "5"
        },
        "Method accession number": {
            "Definition": "Accession number of the method in a suitable controlled vocabulary (Crop Ontology, Trait Ontology).",
            "Level": "2",
            "Example": "CO_322:0000189",
            "Format": "Term from Plant Trait Ontology, Crop Ontology, or XML Environment Ontology",
            "Associated ontologies": [
                "CO_322",
                "XEO"
            ],
            "Position": "7"
        },
        "Time scale": {
            "Definition": "Name of the scale or unit of time with which observations of this type were recorded in the data file (for time series studies).",
            "Level": "2",
            "Example": "Growing degree day (GDD) Date/Time",
            "Format": "Free text",
            "Position": "12"
        },
        "Method description": {
            "Definition": "Textual description of the method, which may extend a method defined in an external reference with specific parameters, e.g. growth stage, inoculation precise organ (leaf number)",
            "Level": "2",
            "Example": "Days to anthesis for male flowering was measured in thermal time (GDD: growing degree-days) according to Ritchie J, NeSmith D (1991;Temperature and crop development. Modeling plant and soil systems American Society of Agronomy Madison, Wisconsin USA) with TBASE=8 degree Celsius and T0=30 degree Celsius. Plant height was measured at 5 years with a ruler, one year after Botritis inoculation.",
            "Format": "Free text",
            "Position": "8"
        },
        "Reference associated to the method": {
            "Definition": "URI/DOI of reference describing the method.",
            "Level": "2",
            "Example": "http://doi.org/10.2134/agronmonogr31.c2",
            "Format": "URI or DOI",
            "Position": "9"
        },
        "Trait": {
            "Definition": "Name of the (plant or environmental) trait under observation",
            "Level": "1",
            "Example": "Anthesis time Reproductive growth time",
            "Format": "Free text",
            "Position": "4"
        }
    })

if not sample.has('Sample'):
    sample.insert({
        "Sample ID": {
            "Definition": "Unique identifier for the sample.",
            "Level": "1",
            "Example": "CEA:BE00034067",
            "Format": "Unique identifier",
            "Position": "1"
        },
        "Definition": "A sample is a portion of plant tissue extracted from an observation unit for the purpose of sub-plant observations and/or molecular studies. A sample must be used when there is a physical sample that needs to be stored and traced. Otherwise, you can use directly variables on the Observation unit (Berry sugar content, Fruit weight, Grain Protein content)",
        "Plant anatomical entity": {
            "Definition": "A description of  the plant part (e.g. leaf) or the plant product (e.g. resin) from which the sample was taken, in the form of an accession number to a suitable controlled vocabulary (Plant Ontology).",
            "Level": "1",
            "Example": "PO:0000003 PO:0025161",
            "Format": "Plant Ontology term (subclass of PO:0025131)",
            "associated_ontologies": [
                "PO_Structure",
                "PO_Development"
            ],
            "Position": "4"
        },
        "Plant structure development stage": {
            "Definition": "The stage in the life of a plant structure during which the sample was taken, in the form of an accession number to a suitable controlled vocabulary (Plant Ontology, BBCH scale)",
            "Level": "1",
            "Example": "PO:0025094 BBCH-17",
            "Format": "Plant Ontology term (subclass or PO:0009012) or BBCH scale term",
            "associated_ontologies": [
                "PO_Structure",
                "PO_Development"
            ],
            "Position": "5"
        },
        "Sample description": {
            "Definition": "Any information not captured by the other sample fields, including quantification, sample treatments and processing.",
            "Level": "1",
            "Example": "Distal part of the leaf ; 100 mg of roots taken from 10 roots at 20 degree Celsius, conserved in vacuum at 20 mM NaCl salinity, stored at -60 degree Celsius to -85 degree Celsius.",
            "Format": "Free text",
            "Position": "3"
        },
        "External ID": {
            "Definition": "An identifier for the sample in a persistent repository, comprising the name of the repository and the accession number of the observation unit therein. Submission to the EBI Biosamples repository is recommended. URI are recommended when possible.",
            "Level": "1",
            "Example": "Biosamples:SAMEA4202911",
            "Format": "Unique identifier",
            "Position": "2"
        },
        "Collection date": {
            "Definition": "The date and time when the sample was collected / harvested",
            "Level": "1",
            "Example": "2005-08-15T15:52:01+00:00",
            "Format": "Date/Time",
            "Position": "6"
        }
    })

if not biological_material.has('Biological_material'):
    biological_material.insert({
        "Material source altitude": {
            "Definition": "Altitude of the material source, provided in metres (m). [Alternative identifier for in situ material]",
            "Level": "3",
            "Example": "10 m",
            "Format": "Numeric + unit abbreviation",
            "Position": "15"
        },
        "Definition": "The biological material being studied (e.g. plants grown from a certain bag or seed, or plants grown in a particular field). The original source of that material (e.g., the seeds or the original plant cloned) is called the material source, which, when held by a material repository, should have its stock identified.",
        "Material source DOI": {
            "Definition": "Digital Object Identifier (DOI) of the material source",
            "Level": "3",
            "Example": "doi:10.15454/1.4658436467893904E12",
            "Format": "DOI",
            "Position": "17"
        },
        "Biological material preprocessing": {
            "Definition": "Description of any process or treatment applied uniformly to the biological material, prior to the study itself. Can be provided as free text or as an accession number from a suitable controlled vocabulary.",
            "Level": "2",
            "Example": "EO:0007210 - PVY(NTN); transplanted from study http://phenome-fppn.fr/maugio/2013/t2351 observation unit ID: pot:894",
            "Position": "6",
            "Format": "Plant Environment Ontology and/or free text",
            "Associated ontologies": [
                "EO",
                "EnvO"
            ]
        },
        "Biological material coordinates uncertainty": {
            "Definition": "Circular uncertainty of the coordinates, preferably provided in meters (m). [Alternative identifier for in situ material]",
            "Level": "2",
            "Example": "200 m",
            "Format": "Numeric",
            "Position": "7"
        },
        "Biological material longitude": {
            "Definition": "Longitude of the studied biological material. [Alternative identifier for in situ material]",
            "Level": "2",
            "Example": "-8,73",
            "Format": "Degrees in the decimal format (ISO 6709)",
            "Position": "8"
        },
        "Biological material latitude": {
            "Definition": "Latitude of the studied biological material. [Alternative identifier for in situ material]",
            "Level": "2",
            "Example": "+39.067",
            "Format": "Degrees in the decimal format (ISO 6709)",
            "Position": "9"
        },
        "Material source longitude": {
            "Definition": "Longitude of the material source. [Alternative identifier for in situ material]",
            "Level": "3",
            "Example": "-8,73",
            "Format": "Degrees in the decimal format (ISO 6709)",
            "Position": "16"
        },
        "Biological material altitude": {
            "Definition": "Altitude of the studied biological material, provided in meters (m). [Alternative identifier for in situ material]",
            "Level": "2",
            "Example": "10 m",
            "Format": "Numeric + unit abbreviation",
            "Position": "10"
        },
        "Infraspecific name": {
            "Definition": "Name of any subtaxa level, including variety, crossing name, etc. It can be used to store any additional taxonomic identifier. Either free text description or key-value pair list format (the key is the name of the rank and the value is the value of  the rank). Ranks can be among the following terms: subspecies, cultivar, variety, subvariety, convariety, group, subgroup, hybrid, line, form, subform. For MCPD compliance, the following abbreviations are allowed: subsp. (subspecies); convar. (convariety); var. (variety); f. (form); Group (cultivar group).",
            "Level": "1",
            "Example": "vinifera Pinot noir B73 subspecies:vinifera ; cultivar:Pinot noir var:B73 subsp. vinifera var. Pinot Noir var. B73",
            "Format": "Free text, or key-value pair list, or MCPD-compliant format",
            "Position": "5"
        },
        "Material source ID (Holding institute/stock centre, accession)": {
            "Definition": "An identifier for the source of the biological material, in the form of a key-value pair comprising the name/identifier of the repository from which the material was sourced plus the accession number of the repository for that material. Where an accession number has not been assigned, but the material has been derived from the crossing of known accessions, the material can be defined as follows: \"mother_accession X father_accession\", or, if father is unknown, as \"mother_accession X UNKNOWN\". For in situ material, the region of provenance may be used when an accession is not available.",
            "Level": "3",
            "Example": "INRA:W95115_inra ICNF:PNB-RPI",
            "Format": "Unique identifier",
            "Position": "11"
        },
        "Material source description": {
            "Definition": "Description of the material source",
            "Level": "3",
            "Example": "Branches were collected from a 10-year-old tree growing in a progeny trial established in a loamy brown earth soil.",
            "Format": "Free text",
            "Position": "12"
        },
        "Material source latitude": {
            "Definition": "Latitude of the material source. [Alternative identifier for in situ material]",
            "Level": "3",
            "Example": "+39.067",
            "Format": "Degrees in the decimal format (ISO 6709)",
            "Position": "14"
        },
        "Material source coordinates uncertainty": {
            "Definition": "Circular uncertainty of the coordinates, provided in meters (m). [Alternative identifier for in situ material]",
            "Level": "3",
            "Example": "200 m",
            "Format": "Numeric + unit abbreviation",
            "Position": "13"
        },
        "Genus": {
            "Definition": "Genus name for the organism under study, according to standard scientific nomenclature.",
            "Level": "1",
            "Example": "Zea Solanum",
            "Format": "Genus name",
            "Position": "2"
        },
        "Organism": {
            "Definition": "An identifier for the organism at the species level. Use of the NCBI taxon ID is recommended. ",
            "Level": "1",
            "Example": "NCBI:4577 ",
            "Format": "Unique identifier",
            "Position": "4"
        },
        "Species": {
            "Definition": "Species name (formally: specific epithet) for the organism under study, according to standard scientific nomenclature.",
            "Level": "1",
            "Example": "mays lycosperium x pennellii",
            "Format": "Species name",
            "Position": "3"
        },
        "Biological material ID": {
            "Definition": "Code used to identify the biological material in the data file. Should be unique within the Investigation. Can correspond to experimental plant ID, seed lot ID, etc This material identification is different from a BiosampleID which corresponds to Observation Unit or Samples sections below.",
            "Level": "1",
            "Example": "INRA:W95115_inra_2001; INRA:inra_kernel_2351; Rothamsted:rres_GK090847",
            "Format": "Unique identifier",
            "Position": "1"
        }
    })
if not experimental_factor.has('Experimental_factor'):
    experimental_factor.insert({
        "Definition": "The object of a study is to ascertain the impact of one or more factors on the biological material. Thus, a factor is, by definition a condition that varies between observation units, which may be biotic (pest, disease interaction) or abiotic (treatment and cultural practice) in nature. Depending on the level of the data, an experimental factor can be either  \"what is the factor applied to the plant\" (i.e. Unwatered), or the \"environmental characterisation\" (i.e. if no rain on unwatered plant : Drought ;  if rain on unwatered plant: Irrigated) ",
        "Experimental Factor type": {
            "Definition": "Name/Acronym of the experimental factor.",
            "Level": "1",
            "Example": "Watering",
            "Format": "Free text (see Appendix II)",
            "Position": "1"
        },
        "Experimental Factor description": {
            "Definition": "Free text description of the experimental factor. This includes all relevant treatments planification and protocol planned for all the plants targeted by a given experimental factor. ",
            "Level": "1",
            "Example": "Daily watering 1 L per plant. ",
            "Format": "Free text",
            "Position": "2"
        },
        "Experimental Factor values": {
            "Definition": "List of possible values for the factor.",
            "Level": "1",
            "Example": "Watered; Unwatered",
            "Format": "Free text",
            "Position": "3"
        }
    })


# if not factor.has('Factor'):
#     factor.insert({
#         '_key': 'Factor',
#         'name': 'blabla',
#         'email':'blabla',
#         'ID':'10 Aout 1979',
#         'role':'30 Sept 2019',
#         'affiliation':'Ben'
#     })
#
# if not factor_value.has('Factor_value'):
#     factor_value.insert({
#         '_key': 'Factor_value',
#         'name': 'blabla',
#         'email':'blabla',
#         'ID':'10 Aout 1979',
#         'role':'30 Sept 2019',
#         'affiliation':'Ben'
#     })


##########################################CONNECT VERTICES##################@


miappe_edge = miappe.edge_collection('miappe_edge')
if not miappe_edge.has('I-S'):
    # miappe_edge.insert({
    #     '_key': 'I1-S3',
    #     '_from': 'investigation/Investigation_1',
    #     '_to': 'study/Study_3'
    # })
    # miappe_edge.insert({
    #     '_key': 'I2-S2',
    #     '_from': 'investigation/Investigation_2',
    #     '_to': 'study/Study_2'
    # })

    miappe_edge.insert({
        '_key': 'I-S',
        '_from': 'investigation/Investigation',
        '_to': 'study/Study'
    })

    miappe_edge.insert({
        '_key': 'I-P',
        '_from': 'investigation/Investigation',
        '_to': 'person/Person'
    })
    # miappe_edge.insert({
    #     '_key': 'Inv-Pub',
    #     '_from': 'investigation/Investigation',
    #     '_to': 'publication/Publication'
    # })
    miappe_edge.insert({
        '_key': 'S-P',
        '_from': 'study/Study',
        '_to': 'person/Person'
    })
    miappe_edge.insert({
        '_key': 'S-Eve',
        '_from': 'study/Study',
        '_to': 'event/Event'
    })
    miappe_edge.insert({
        '_key': 'S-Env',
        '_from': 'study/Study',
        '_to': 'environment/Environment'
    })
    miappe_edge.insert({
        '_key': 'S-OU',
        '_from': 'study/Study',
        '_to': 'observation_unit/Observation_unit'
    })
    miappe_edge.insert({
        '_key': 'S-DF',
        '_from': 'study/Study',
        '_to': 'data_file/Data_file'
    })
    miappe_edge.insert({
        '_key': 'S-BM',
        '_from': 'study/Study',
        '_to': 'biological_material/Biological_material'
    })
    miappe_edge.insert({
        '_key': 'S-OV',
        '_from': 'study/Study',
        '_to': 'observed_variable/Observed_variable'
    })
    miappe_edge.insert({
        '_key': 'S-EF',
        '_from': 'study/Study',
        '_to': 'experimental_factor/Experimental_factor'
    })
    # miappe_edge.insert({
    #     '_key': 'F-FV',
    #     '_from': 'factor/Factor',
    #     '_to': 'experimental_factor/Experimental_factor'
    # })
    miappe_edge.insert({
        '_key': 'OU-Sam',
        '_from': 'observation_unit/Observation_unit',
        '_to': 'sample/Sample'
    })
    miappe_edge.insert({
        '_key': 'OU-EF',
        '_from': 'observation_unit/Observation_unit',
        '_to': 'experimental_factor/Experimental_factor'
    })
    miappe_edge.insert({
        '_key': 'OU-BM',
        '_from': 'observation_unit/Observation_unit',
        '_to': 'biological_material/Biological_material'
    })
    miappe_edge.insert({
        '_key': 'OU-Eve',
        '_from': 'observation_unit/Observation_unit',
        '_to': 'event/Event'
    })
    miappe_edge.insert({
        '_key': 'DF-OU',
        '_from': 'data_file/Data_file',
        '_to': 'observation_unit/Observation_unit'
    })
    miappe_edge.insert({
        '_key': 'DF-Sam',
        '_from': 'data_file/Data_file',
        '_to': 'sample/Sample'
    })
    miappe_edge.insert({
        '_key': 'DF-OV',
        '_from': 'data_file/Data_file',
        '_to': 'observed_variable/Observed_variable'
    })








