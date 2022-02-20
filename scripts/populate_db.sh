#!/bin/bash


curl --dump - --user "root:benjamin" -X GET http://127.0.0.1:8529/_api/version && echo

curl --header 'accept: application/json' --user "root:benjamin" --dump - http://localhost:8529/_api/database/_system && echo


mydb=$(curl --header 'accept: application/json' --user "root:benjamin" --dump - http://localhost:8529/_api/database/user)
echo "${mydb}"

alldb=$(curl --header 'accept: application/json' --user "root:benjamin" --dump - http://localhost:8529/_api/database)
echo "${alldb}"

# Create the database
#curl -X POST --header 'accept: application/json' --user "root:benjamin" --data-binary @- --dump - http://localhost:8529/_api/database <<EOF
#{
#  "name" : "example",
#  "options" : {
#    "sharding" : "flexible",
#    "replicationFactor" : 3
#  }
#}
#EOF

# Drop database
#curl -X DELETE --header 'accept: application/json' --user "root:benjamin" --dump - http://localhost:8529/_api/database/example


# Adress a collection

http://localhost:8529/_api/collection/users