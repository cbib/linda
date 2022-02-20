#!/bin/bash

rm -rf ../api.zip
zip -r ../api.zip ../api
foxx replace /xeml --server http://localhost:8529 --database MIAPPE_GRAPH -u root -p ../../../password.txt ../api.zip

