#!/bin/bash

rm -rf XEMLAPI.zip
zip -r XEMLAPI.zip XEMLAPI
foxx replace /xeml --server http://127.0.0.1:8529 --database MIAPPE_GRAPH -u root -P XEMLAPI.zip

