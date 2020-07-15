#!/bin/bash

rm -rf XEMLAPI.zip
zip -r XEMLAPI.zip XEMLAPI
foxx replace /xeml --server http://10.71.10.106:8529 --database MIAPPE_GRAPH -u root -P XEMLAPI.zip

